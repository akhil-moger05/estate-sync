import { useEffect, useState } from "react";
import { pb } from "../lib/pb";
import { notify } from "../lib/notify";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  Clock3,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  RefreshCw,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  AlertCircle,
  LifeBuoy,
} from "lucide-react";

export default function AdminDashboard() {
  const [pendingAgents, setPendingAgents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const agents = await pb.collection("users").getFullList({
  filter: 'role="agent" && status="pending"',
  sort: "-created",
  requestKey: null,
});

      const requests = await pb.collection("requests").getFullList({
        filter: 'status="admin_review"',
        sort: "-created",
        expand: "user",
      });

      const users = await pb.collection("users").getFullList({
        sort: "-created",
      });

      const allReqs = await pb.collection("requests").getFullList({
        sort: "-created",
        expand: "user",
      });

      const supportTickets = await pb.collection("support_tickets").getFullList({
        sort: "-created",
      });

      setTickets(supportTickets);
      setPendingAgents(agents);
      setPendingRequests(requests);
      setAllUsers(users);
      setAllRequests(allReqs);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveAgent = async (agentId) => {
    try {
      await pb.collection("users").update(agentId, {
        status: "approved",
      });
      await notify(
        agentId,
        "Account approved",
        "Your agent account is approved. You can now accept jobs.",
        "success"
      );

      alert("Agent approved successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Unable to approve agent.");
    }
  };

  const rejectAgent = async (agentId) => {
    try {
      await pb.collection("users").update(agentId, {
        status: "rejected",
      });

      alert("Agent rejected.");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Unable to reject agent.");
    }
  };

  const sendToAgents = async (request) => {
    try {
      await pb.collection("requests").update(request.id, {
        status: "pending_agent",
        progress: "Sent to Agents - Waiting for an Agent",
      });
      await notify(
        request.user,
        "Application approved by Admin",
        `Your "${request.serviceName}" application is now open to agents.`,
        "info"
      );

      alert("Request is now available to Agents.");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Unable to send request to Agents.");
    }
  };

  const logout = () => {
    pb.authStore.clear();
    window.location.href = "/login";
  };

  const totalAgents = allUsers.filter(
    (user) => user.role === "agent"
  ).length;

  const approvedAgents = allUsers.filter(
    (user) => user.role === "agent" && user.status === "approved"
  ).length;

  const activeRequests = allRequests.filter(
    (request) => request.status === "in_progress"
  ).length;

  const completedRequests = allRequests.filter(
    (request) => request.status === "completed"
  ).length;

  const filteredUsers = allUsers.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredRequests = allRequests.filter((request) =>
    `${request.serviceName} ${request.applicantName} ${request.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950 text-white flex flex-col transition-transform duration-300 ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* LOGO */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="font-black text-lg">
                EstateSync
              </h1>

              <p className="text-xs text-slate-400">
                Admin Portal
              </p>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* ADMIN PROFILE */}
        <div className="p-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="font-bold">
                  EstateSync Admin
                </p>

                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-emerald-400">
                    Administrator
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="px-4 space-y-2 flex-1">

          <NavButton
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenu(false);
            }}
          />

          <NavButton
            icon={<UserCheck size={19} />}
            label="Agent Approvals"
            badge={pendingAgents.length}
            active={activeTab === "agents"}
            onClick={() => {
              setActiveTab("agents");
              setMobileMenu(false);
            }}
          />

          <NavButton
            icon={<ClipboardList size={19} />}
            label="Service Requests"
            badge={pendingRequests.length}
            active={activeTab === "requests"}
            onClick={() => {
              setActiveTab("requests");
              setMobileMenu(false);
            }}
          />

          <NavButton
            icon={<LifeBuoy size={19} />}
            label="Support Tickets"
            badge={tickets.length}
            active={activeTab === "tickets"}
            onClick={() => {
              setActiveTab("tickets");
              setMobileMenu(false);
            }}
          />

          <NavButton
            icon={<Users size={19} />}
            label="Users"
            active={activeTab === "users"}
            onClick={() => {
              setActiveTab("users");
              setMobileMenu(false);
            }}
          />

        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={19} />
            <span className="font-semibold">
              Logout
            </span>
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">

        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-5 md:px-8">

          <div className="flex items-center gap-4">

            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-xs text-slate-400 font-semibold">
                EstateSync Administration
              </p>

              <h2 className="font-black text-slate-900">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "agents"
                  ? "Agent Approvals"
                  : activeTab === "requests"
                  ? "Service Requests"
                  : activeTab === "tickets"
                  ? "Support Tickets"
                  : "Users"}
              </h2>
            </div>

          </div>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-7 md:p-9 mb-7 relative overflow-hidden">

                <div className="relative z-10">

                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-bold mb-5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    System Online
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black mb-3">
                    Welcome, Admin 👋
                  </h1>

                  <p className="text-slate-300 max-w-xl">
                    Manage EstateSync users, agents and
                    property-service applications from one place.
                  </p>

                </div>

                <div className="absolute -right-20 -bottom-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />

              </div>

              {/* STATISTICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                <StatCard
                  title="Total Users"
                  value={allUsers.length}
                  icon={<Users size={22} />}
                  color="blue"
                />

                <StatCard
                  title="Total Agents"
                  value={totalAgents}
                  icon={<UserCheck size={22} />}
                  color="purple"
                />

                <StatCard
                  title="Pending Approvals"
                  value={pendingAgents.length}
                  icon={<Clock3 size={22} />}
                  color="orange"
                />

                <StatCard
                  title="Active Requests"
                  value={activeRequests}
                  icon={<ClipboardList size={22} />}
                  color="green"
                />

              </div>

              {/* QUICK ACTIONS */}
              <div className="grid lg:grid-cols-2 gap-7">

                <DashboardPanel
                  title="Agent Approvals"
                  icon={<UserCheck size={20} />}
                  count={pendingAgents.length}
                  onClick={() => setActiveTab("agents")}
                >

                  {pendingAgents.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle2 size={28} />}
                      title="All agents reviewed"
                      text="There are no pending agent applications."
                    />
                  ) : (
                    pendingAgents.slice(0, 3).map((agent) => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        approve={approveAgent}
                        reject={rejectAgent}
                      />
                    ))
                  )}

                </DashboardPanel>

                <DashboardPanel
                  title="New Service Requests"
                  icon={<ClipboardList size={20} />}
                  count={pendingRequests.length}
                  onClick={() => setActiveTab("requests")}
                >

                  {pendingRequests.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle2 size={28} />}
                      title="No pending requests"
                      text="There are no requests waiting for review."
                    />
                  ) : (
                    pendingRequests.slice(0, 3).map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        send={sendToAgents}
                      />
                    ))
                  )}

                </DashboardPanel>

              </div>
            </>
          )}

          {/* AGENTS */}
          {activeTab === "agents" && (
            <>
              <PageHeading
                title="Agent Approvals"
                subtitle="Review and manage EstateSync field agents."
              />

              {pendingAgents.length === 0 ? (
                <EmptyState
                  large
                  icon={<CheckCircle2 size={36} />}
                  title="No pending agents"
                  text="All agent applications have been reviewed."
                />
              ) : (
                <div className="grid lg:grid-cols-2 gap-5">

                  {pendingAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      approve={approveAgent}
                      reject={rejectAgent}
                      large
                    />
                  ))}

                </div>
              )}
            </>
          )}

          {/* REQUESTS */}
          {activeTab === "requests" && (
            <>
              <PageHeading
                title="Service Requests"
                subtitle="Review incoming applications and send them to agents."
              />

              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search requests..."
              />

              <div className="space-y-4 mt-6">

                {filteredRequests.length === 0 ? (
                  <EmptyState
                    large
                    icon={<ClipboardList size={36} />}
                    title="No requests found"
                    text="No service requests match your search."
                  />
                ) : (
                  filteredRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      send={sendToAgents}
                      large
                    />
                  ))
                )}

              </div>
            </>
          )}

          {/* SUPPORT TICKETS */}
          {activeTab === "tickets" && (
            <>
              <PageHeading
                title="Support Tickets"
                subtitle="Messages sent from the Help & Support page."
              />

              {tickets.length === 0 ? (
                <EmptyState
                  large
                  icon={<LifeBuoy size={36} />}
                  title="No tickets"
                  text="Nobody has sent a support message yet."
                />
              ) : (
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex justify-between gap-3 flex-wrap">
                        <h3 className="font-black text-slate-900">{t.subject}</h3>
                        <span className="text-xs text-slate-400">
                          {new Date(t.created).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {t.name} - {t.email}
                      </p>
                      <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">
                        {t.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <>
              <PageHeading
                title="Users"
                subtitle="View EstateSync user and agent accounts."
              />

              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email or role..."
              />

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden mt-6">

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-5 text-xs font-black uppercase text-slate-400">
                          User
                        </th>

                        <th className="p-5 text-xs font-black uppercase text-slate-400">
                          Role
                        </th>

                        <th className="p-5 text-xs font-black uppercase text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >

                          <td className="p-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {user.name || "Unnamed User"}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {user.email}
                                </p>
                              </div>

                            </div>

                          </td>

                          <td className="p-5">
                            <RoleBadge role={user.role} />
                          </td>

                          <td className="p-5">
                            <StatusBadge status={user.status} />
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavButton({
  icon,
  label,
  badge,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}

      <span className="font-semibold flex-1 text-left">
        {label}
      </span>

      {badge > 0 && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            active
              ? "bg-white/20"
              : "bg-slate-800"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-black text-slate-900 mt-2">
            {value}
          </p>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

function DashboardPanel({
  title,
  icon,
  count,
  children,
  onClick,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

      <div className="p-6 border-b border-slate-100 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="text-blue-600">
            {icon}
          </div>

          <div>
            <h2 className="font-black text-slate-900">
              {title}
            </h2>

            <p className="text-xs text-slate-500">
              {count} pending
            </p>
          </div>

        </div>

        <button
          onClick={onClick}
          className="text-blue-600 font-bold text-sm flex items-center gap-1"
        >
          View all
          <ChevronRight size={16} />
        </button>

      </div>

      <div className="p-5 space-y-4">
        {children}
      </div>

    </div>
  );
}

function AgentCard({
  agent,
  approve,
  reject,
  large,
}) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 ${large ? "shadow-sm" : ""}`}>

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
          <UserCheck size={22} />
        </div>

        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between gap-3">

            <div>
              <h3 className="font-black text-slate-900">
                {agent.name || "Unnamed Agent"}
              </h3>

              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Mail size={14} />
                {agent.email}
              </p>
            </div>

            <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">
              Pending
            </span>

          </div>

          <div className="grid sm:grid-cols-2 gap-2 mt-4">

            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Phone size={14} />
              {agent.phone || "No phone"}
            </p>

            <p className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin size={14} />
              {agent.location || "No location"}
            </p>

          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={() => approve(agent.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>

            <button
              onClick={() => reject(agent.id)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Reject
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function RequestCard({
  request,
  send,
  large,
}) {
  const canSend = request.status === "admin_review";

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 ${large ? "shadow-sm" : ""}`}>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        <div className="flex gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={22} />
          </div>

          <div>

            <h3 className="font-black text-slate-900">
              {request.serviceName}
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Applicant:{" "}
              <strong>{request.applicantName}</strong>
            </p>

            <div className="flex flex-wrap gap-4 mt-3">

              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin size={14} />
                {request.location || "No location"}
              </span>

              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Phone size={14} />
                {request.phone || "No phone"}
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-3">
              {request.details || "No additional details."}
            </p>

            {request.documents && (
              <a
                href={pb.files.getURL(request, request.documents)}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-sm font-bold text-blue-600 hover:underline"
              >
                View uploaded document
              </a>
            )}

          </div>

        </div>

        <StatusBadge status={request.status} />

      </div>

      {canSend && (
        <button
          onClick={() => send(request)}
          className="w-full mt-5 bg-slate-950 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
        >
          <Send size={17} />
          Send to Agent Pool
        </button>
      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-orange-100 text-orange-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    admin_review: "bg-blue-100 text-blue-700",
    pending_agent: "bg-purple-100 text-purple-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status === "approved" || status === "completed" ? (
        <CheckCircle2 size={13} />
      ) : status === "pending" || status === "admin_review" ? (
        <Clock3 size={13} />
      ) : (
        <AlertCircle size={13} />
      )}

      {status?.replaceAll("_", " ") || "Unknown"}
    </span>
  );
}

function RoleBadge({ role }) {
  const style =
    role === "admin"
      ? "bg-purple-100 text-purple-700"
      : role === "agent"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${style}`}>
      {role || "user"}
    </span>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative max-w-xl">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
      />

    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  large,
}) {
  return (
    <div
      className={`text-center py-12 ${
        large
          ? "bg-white rounded-3xl border border-slate-200"
          : ""
      }`}
    >

      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-black text-slate-800">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
        {text}
      </p>

    </div>
  );
}

function PageHeading({
  title,
  subtitle,
}) {
  return (
    <div className="mb-7">
      <h1 className="text-3xl font-black text-slate-900">
        {title}
      </h1>

      <p className="text-slate-500 mt-2">
        {subtitle}
      </p>
    </div>
  );
}
