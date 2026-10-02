import PocketBase from "pocketbase";

// Local: http://127.0.0.1:8090
// Online: set VITE_PB_URL in .env (or in Vercel/Netlify settings)
const PB_URL = import.meta.env.VITE_PB_URL || "http://127.0.0.1:8090";

const pb = new PocketBase(PB_URL);

// Stops "request was autocancelled" errors when many calls run together
pb.autoCancellation(false);

export { pb };
