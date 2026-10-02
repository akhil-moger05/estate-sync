import { useState, useEffect } from "react";
import { pb } from "../lib/pb";
import { notify } from "../lib/notify";
import {
  LayoutDashboard,
  Briefcase,
  Zap,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  User,
  LogOut,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function AgentDashboard() {
  const [openRequests, setOpenRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const currentUser = pb.authStore.model;

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    fetchWork();
  }, []);

  const fetchWork = async () => {
    try {
      setLoading(true);

      const available = await pb.collection("requests").getFullList({
        filter: 'status="pending_agent"',
        sort: "-created",
        expand: "user",
      });

      const mine = await pb.collection("requests").getFullList({
        filter: `assignedAgent="${currentUser.id}"`,
        sort: "-created",
        expand: "user",
      });

      setOpenRequests(available);
      setMyJobs(mine);
    } catch (err) {
      console.error("Failed to fetch agent work:", err);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (request) => {
    const requestId = request.id;
    try {
      await pb.collection("requests").update(requestId, {
        status: "in_progress",
        progress: "Agent Assigned - Reviewing Documents",
        assignedAgent: currentUser.id,
      });

      await notify(
        request.user,
        "Agent assigned",
        `An agent has accepted your "${request.serviceName}" application.`,
        "success"
      );
      alert("Job accepted successfully!");
      fetchWork();
    } catch (err) {
      console.error(err);
      alert("This job may have already been claimed by another agent.");
      fetchWork();
    }
  };

  const updateProgress = async (job, newProgressStatus) => {
    const requestId = job.id;
    try {
      let newStatus = "in_progress";

      if (newProgressStatus === "Completed - Documents Ready") {
        newStatus = "completed";
      }

      await pb.collection("requests").update(requestId, {
        progress: newProgressStatus,
        status: newStatus,
      });

      await notify(
        job.user,
        newStatus === "completed" ? "Application completed" : "Progress update",
        `${job.serviceName}: ${newProgressStatus}`,
        newStatus === "completed" ? "success" : "info"
      );
      fetchWork();
    } catch (err) {
      console.error("Failed to update progress:", err);
      alert("Unable to update progress.");
    }
  };

  const logout = () => {
    pb.authStore.clear();
    window.location.href = "/login";
  };

  const completedJobs = myJobs.filter(
    (job) => job.status === "completed"
  ).length;

  const activeJobs = myJobs.filter(
    (job) => job.status !== "completed"
  ).length;

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AG";

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
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950 text-white flex flex-col transform transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="font-black text-lg">EstateSync</h1>
              <p className="text-xs text-slate-400">Agent Portal</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenu(false)}
            className="lg:hidden text-slate-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* PROFILE */}
        <div className="p-5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="font-bold truncate">
                  {currentUser?.name || "Agent"}
                </p>

                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400">
                    Verified Agent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="px-4 space-y-2 flex-1">
          <SidebarButton
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            icon={<Zap size={19} />}
            label="Available Jobs"
            active={activeTab === "jobs"}
            badge={openRequests.length}
            onClick={() => {
              setActiveTab("jobs");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            icon={<Briefcase size={19} />}
            label="My Applications"
            active={activeTab === "applications"}
            badge={myJobs.length}
            onClick={() => {
              setActiveTab("applications");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            icon={<User size={19} />}
            label="My Profile"
            active={activeTab === "profile"}
            onClick={() => {
              setActiveTab("profile");
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
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">

        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm text-slate-500">
                Agent Workspace
              </p>
              <h2 className="font-black text-slate-900">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "jobs"
                  ? "Available Jobs"
                  : activeTab === "applications"
                  ? "My Applications"
                  : "My Profile"}
              </h2>
            </div>
          </div>

          <button
            onClick={fetchWork}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* WELCOME */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-7 md:p-9 mb-7">

                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Agent account active
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black mb-3">
                    Welcome back,{" "}
                    {currentUser?.name?.split(" ")[0] || "Agent"} 👋
                  </h1>

                  <p className="text-slate-300 max-w-xl">
                    Manage your assigned property-service applications,
                    accept new jobs and keep clients updated.
                  </p>
                </div>

                <div className="absolute -right-20 -bottom-32 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute right-20 top-0 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl" />
              </section>

              {/* STATISTICS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                <StatCard
                  title="Available Jobs"
                  value={openRequests.length}
                  icon={<Zap size={22} />}
                  description="Jobs waiting for agents"
                  iconClass="bg-amber-100 text-amber-600"
                />

                <StatCard
                  title="My Active Jobs"
                  value={activeJobs}
                  icon={<Briefcase size={22} />}
                  description="Currently working"
                  iconClass="bg-blue-100 text-blue-600"
                />

                <StatCard
                  title="Completed"
                  value={completedJobs}
                  icon={<CheckCircle2 size={22} />}
                  description="Successfully completed"
                  iconClass="bg-emerald-100 text-emerald-600"
                />

                <StatCard
                  title="Total Jobs"
                  value={myJobs.length}
                  icon={<TrendingUp size={22} />}
                  description="Your total assignments"
                  iconClass="bg-purple-100 text-purple-600"
                />

              </section>

              {/* TWO COLUMN */}
              <div className="grid xl:grid-cols-2 gap-7">

                {/* AVAILABLE JOBS */}
                <JobSection
                  title="New Jobs Available"
                  subtitle="Pick up a new application"
                  icon={<Zap size={20} />}
                  iconClass="text-amber-500"
                  action={() => setActiveTab("jobs")}
                >
                  {openRequests.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle2 size={28} />}
                      title="No new jobs"
                      text="There are currently no applications waiting for an agent."
                    />
                  ) : (
                    openRequests.slice(0, 3).map((request) => (
                      <AvailableJob
                        key={request.id}
                        request={request}
                        onAccept={acceptRequest}
                      />
                    ))
                  )}
                </JobSection>

                {/* ACTIVE JOBS */}
                <JobSection
                  title="My Active Applications"
                  subtitle="Applications you're handling"
                  icon={<Briefcase size={20} />}
                  iconClass="text-blue-500"
                  action={() => setActiveTab("applications")}
                >
                  {myJobs.length === 0 ? (
                    <EmptyState
                      icon={<Briefcase size={28} />}
                      title="No assigned applications"
                      text="Accept an available job to start working."
                    />
                  ) : (
                    myJobs.slice(0, 3).map((job) => (
                      <ActiveJob
                        key={job.id}
                        job={job}
                        onUpdate={updateProgress}
                      />
                    ))
                  )}
                </JobSection>

              </div>
            </>
          )}

          {/* AVAILABLE JOBS PAGE */}
          {activeTab === "jobs" && (
            <div>
              <PageHeading
                title="Available Jobs"
                subtitle="Applications currently waiting for an agent."
              />

              {openRequests.length === 0 ? (
                <EmptyState
                  large
                  icon={<CheckCircle2 size={36} />}
                  title="No jobs available"
                  text="Check again later for new service applications."
                />
              ) : (
                <div className="grid lg:grid-cols-2 gap-5">
                  {openRequests.map((request) => (
                    <AvailableJob
                      key={request.id}
                      request={request}
                      onAccept={acceptRequest}
                      large
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* APPLICATIONS PAGE */}
          {activeTab === "applications" && (
            <div>
              <PageHeading
                title="My Applications"
                subtitle="Track and update all applications assigned to you."
              />

              {myJobs.length === 0 ? (
                <EmptyState
                  large
                  icon={<Briefcase size={36} />}
                  title="No applications yet"
                  text="Accept an available job to see it here."
                />
              ) : (
                <div className="space-y-5">
                  {myJobs.map((job) => (
                    <ActiveJob
                      key={job.id}
                      job={job}
                      onUpdate={updateProgress}
                      large
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE PAGE */}
          {activeTab === "profile" && (
            <div>
              <PageHeading
                title="My Profile"
                subtitle="Your EstateSync agent information."
              />

              <div className="max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="bg-gradient-to-r from-slate-950 to-blue-950 p-8 text-white">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black">
                      {initials}
                    </div>

                    <div>
                      <h2 className="text-2xl font-black">
                        {currentUser?.name || "Agent"}
                      </h2>

                      <p className="text-slate-300">
                        EstateSync Field Agent
                      </p>

                      <div className="inline-flex items-center gap-1.5 mt-3 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={13} />
                        Approved Agent
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-7 grid md:grid-cols-2 gap-5">

                  <ProfileItem
                    label="Full Name"
                    value={currentUser?.name}
                  />

                  <ProfileItem
                    label="Email"
                    value={currentUser?.email}
                  />

                  <ProfileItem
                    label="Phone"
                    value={currentUser?.phone || "Not provided"}
                  />

                  <ProfileItem
                    label="Operating Location"
                    value={currentUser?.location || "Not provided"}
                  />

                  <ProfileItem
                    label="Role"
                    value="Field Agent"
                  />

                  <ProfileItem
                    label="Account Status"
                    value={currentUser?.status || "approved"}
                  />

                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SidebarButton({
  icon,
  label,
  active,
  badge,
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

      {badge !== undefined && badge > 0 && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            active
              ? "bg-white/20 text-white"
              : "bg-slate-800 text-slate-300"
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
  description,
  iconClass,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-black text-slate-900 mt-2">
            {value}
          </p>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}>
          {icon}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        {description}
      </p>
    </div>
  );
}

function JobSection({
  title,
  subtitle,
  icon,
  iconClass,
  children,
  action,
}) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={iconClass}>
            {icon}
          </div>

          <div>
            <h2 className="font-black text-slate-900">
              {title}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={action}
          className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
        >
          View all
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {children}
      </div>
    </section>
  );
}

function AvailableJob({
  request,
  onAccept,
  large = false,
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-blue-200 hover:bg-blue-50/30 transition ${large ? "shadow-sm" : ""}`}>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Zap size={17} />
            </span>

            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              New Job
            </span>
          </div>

          <h3 className="font-black text-lg text-slate-900">
            {request.serviceName}
          </h3>
        </div>

        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
          Available
        </span>
      </div>

      <div className="mt-4 space-y-2">

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          {request.location || "Location not provided"}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={16} className="text-slate-400" />
          {request.applicantName || "Applicant"}
        </div>

        {request.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone size={16} className="text-slate-400" />
            {request.phone}
          </div>
        )}

      </div>

      <button
        onClick={() => onAccept(request)}
        className="w-full mt-5 bg-slate-950 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition"
      >
        Accept & Claim Job
      </button>
    </div>
  );
}

function ActiveJob({
  job,
  onUpdate,
  large = false,
}) {
  return (
    <div className={`rounded-2xl border border-blue-100 bg-blue-50/50 p-5 ${large ? "shadow-sm" : ""}`}>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Briefcase size={17} />
            </span>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Active Application
            </span>
          </div>

          <h3 className="font-black text-lg text-slate-900">
            {job.serviceName}
          </h3>

          <div className="mt-3 space-y-2">

            <p className="text-sm text-slate-700 flex items-center gap-2">
              <User size={15} />
              {job.applicantName}
            </p>

            <p className="text-sm text-slate-700 flex items-center gap-2">
              <MapPin size={15} />
              {job.location}
            </p>

            {job.phone && (
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <Phone size={15} />
                {job.phone}
              </p>
            )}

            {job.documents && (
              <a
                href={pb.files.getURL(job, job.documents)}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-blue-600 hover:underline inline-block"
              >
                View uploaded document
              </a>
            )}

          </div>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <div className="mt-5 bg-white rounded-xl border border-blue-100 p-4">

        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500">
            Application Progress
          </label>

          <Clock3 size={16} className="text-blue-500" />
        </div>

        <select
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
          value={job.progress || "Agent Assigned - Reviewing Documents"}
          onChange={(e) => onUpdate(job, e.target.value)}
        >
          <option value="Agent Assigned - Reviewing Documents">
            Reviewing Documents
          </option>

          <option value="Documents Verified - Preparing File">
            Documents Verified
          </option>

          <option value="Visiting Sub-Registrar Office">
            Visiting Sub-Registrar Office
          </option>

          <option value="Waiting for Government Signature">
            Waiting for Government Signature
          </option>

          <option value="Completed - Documents Ready">
            Completed - Documents Ready
          </option>
        </select>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          Current:{" "}
          <strong className="text-slate-700">
            {job.progress || "Pending"}
          </strong>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold">
      <Clock3 size={14} />
      In Progress
    </span>
  );
}

function EmptyState({
  icon,
  title,
  text,
  large = false,
}) {
  return (
    <div
      className={`text-center py-12 ${
        large ? "bg-white rounded-3xl border border-slate-200" : ""
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

function PageHeading({ title, subtitle }) {
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

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="font-bold text-slate-800 mt-2 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
}