// Creates all collections, safe rules, and demo accounts in PocketBase.
// Run:  npm run setup-db
// Needs: PocketBase running + a superuser account (see README).
import PocketBase from "pocketbase";

const URL = process.env.PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL;
const PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD first. See README.");
  process.exit(1);
}

const pb = new PocketBase(URL);
pb.autoCancellation(false);
await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
console.log("Logged in to PocketBase.");

const dates = [
  { type: "autodate", name: "created", onCreate: true, onUpdate: false },
  { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
];

async function exists(name) {
  try { await pb.collections.getOne(name); return true; } catch { return false; }
}

// ---------- 1. USERS (add our extra fields + rules) ----------
const users = await pb.collections.getOne("users");
const have = new Set(users.fields.map((f) => f.name));
const extra = [
  { type: "select", name: "role", required: true, maxSelect: 1, values: ["user", "agent", "admin"] },
  { type: "select", name: "status", maxSelect: 1, values: ["pending", "approved", "rejected"] },
  { type: "text", name: "phone" },
  { type: "text", name: "location" },
  { type: "text", name: "aadhaar" },
  { type: "file", name: "documents", maxSelect: 1, maxSize: 5242880 },
].filter((f) => !have.has(f.name));

await pb.collections.update("users", {
  fields: [...users.fields, ...extra],
  listRule: 'id = @request.auth.id || @request.auth.role = "admin"',
  viewRule: 'id = @request.auth.id || @request.auth.role = "admin"',
  createRule:
    '@request.body.role != "admin" && ((@request.body.role = "user" && @request.body.status = "approved") || (@request.body.role = "agent" && @request.body.status = "pending"))',
  updateRule:
    '(id = @request.auth.id && @request.body.role:isset = false && @request.body.status:isset = false) || @request.auth.role = "admin"',
  deleteRule: '@request.auth.role = "admin"',
});
console.log("users collection ready.");
const usersId = users.id;

// ---------- 2. REQUESTS ----------
if (!(await exists("requests"))) {
  await pb.collections.create({
    name: "requests",
    type: "base",
    fields: [
      { type: "relation", name: "user", required: true, collectionId: usersId, maxSelect: 1 },
      { type: "text", name: "serviceName", required: true },
      { type: "text", name: "applicantName" },
      { type: "text", name: "location" },
      { type: "text", name: "phone" },
      { type: "text", name: "details" },
      { type: "file", name: "documents", maxSelect: 1, maxSize: 5242880 },
      { type: "select", name: "status", required: true, maxSelect: 1,
        values: ["admin_review", "pending_agent", "in_progress", "completed"] },
      { type: "text", name: "progress" },
      { type: "relation", name: "assignedAgent", collectionId: usersId, maxSelect: 1 },
      ...dates,
    ],
    listRule:
      'user = @request.auth.id || assignedAgent = @request.auth.id || (@request.auth.role = "agent" && @request.auth.status = "approved" && status = "pending_agent") || @request.auth.role = "admin"',
    viewRule:
      'user = @request.auth.id || assignedAgent = @request.auth.id || (@request.auth.role = "agent" && @request.auth.status = "approved" && status = "pending_agent") || @request.auth.role = "admin"',
    createRule:
      '@request.auth.role = "user" && @request.body.user = @request.auth.id && @request.body.status = "admin_review"',
    updateRule:
      '@request.auth.role = "admin" || (@request.auth.role = "agent" && @request.auth.status = "approved" && (assignedAgent = @request.auth.id || (status = "pending_agent" && @request.body.assignedAgent = @request.auth.id)))',
    deleteRule: '@request.auth.role = "admin"',
  });
  console.log("requests collection created.");
}

// ---------- 3. NOTIFICATIONS ----------
if (!(await exists("notifications"))) {
  await pb.collections.create({
    name: "notifications",
    type: "base",
    fields: [
      { type: "relation", name: "user", required: true, collectionId: usersId, maxSelect: 1, cascadeDelete: true },
      { type: "text", name: "title", required: true },
      { type: "text", name: "message" },
      { type: "select", name: "type", maxSelect: 1, values: ["info", "success", "warning"] },
      { type: "bool", name: "is_read" },
      ...dates,
    ],
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: '@request.auth.id != ""',
    updateRule: "user = @request.auth.id",
    deleteRule: "user = @request.auth.id",
  });
  console.log("notifications collection created.");
}

// ---------- 4. SUPPORT TICKETS ----------
if (!(await exists("support_tickets"))) {
  await pb.collections.create({
    name: "support_tickets",
    type: "base",
    fields: [
      { type: "text", name: "name", required: true },
      { type: "email", name: "email", required: true },
      { type: "text", name: "subject", required: true },
      { type: "text", name: "message", required: true },
      ...dates,
    ],
    listRule: '@request.auth.role = "admin"',
    viewRule: '@request.auth.role = "admin"',
    createRule: "",
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
  });
  console.log("support_tickets collection created.");
}

// ---------- 5. DEMO ACCOUNTS ----------
const demo = [
  { name: "EstateSync Admin", email: "admin@estatesync.com", password: "Admin@12345", role: "admin", status: "approved" },
  { name: "Demo Agent", email: "agent@estatesync.com", password: "Agent@12345", role: "agent", status: "approved", phone: "9876543210", location: "Hubballi" },
  { name: "Demo User", email: "user@estatesync.com", password: "User@12345", role: "user", status: "approved" },
];
for (const d of demo) {
  try {
    await pb.collection("users").getFirstListItem(`email="${d.email}"`);
    console.log("demo exists:", d.email);
  } catch {
    await pb.collection("users").create({ ...d, passwordConfirm: d.password, emailVisibility: true });
    console.log("demo created:", d.email);
  }
}

console.log("\nDone! Open the app and log in with the demo accounts.");
