import { useState, useEffect } from "react";
import { pb } from "../lib/pb";
import {
  LayoutDashboard,
  ClipboardList,
  Clock3,
  CheckCircle2,
  MapPin,
  CalendarDays,
  RefreshCw,
  LogOut,
  ArrowRight,
  Search,
  UserCheck,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function UserDashboard() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = pb.authStore.model;

  useEffect(() => {
    if (currentUser?.id) {
      fetchMyRequests();
    }
  }, [currentUser?.id]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);

      const records = await pb.collection("requests").getFullList({
        filter: `user="${currentUser.id}"`,
        sort: "-created",
      });

      setMyRequests(records);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.href = "/login";
  };

  const totalRequests = myRequests.length;

  const activeRequests = myRequests.filter(
    (req) =>
      req.status === "admin_review" ||
      req.status === "pending_agent" ||
      req.status === "in_progress"
  ).length;

  const completedRequests = myRequests.filter(
    (req) => req.status === "completed"
  ).length;

  const getStatusInfo = (status) => {
    switch (status) {
      case "admin_review":
        return {
          label: "Admin Review",
          color: "bg-amber-100 text-amber-700",
          icon: <Clock3 size={15} />,
          step: 1,
        };

      case "pending_agent":
        return {
          label: "Finding Agent",
          color: "bg-purple-100 text-purple-700",
          icon: <Search size={15} />,
          step: 2,
        };

      case "in_progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-700",
          icon: <UserCheck size={15} />,
          step: 3,
        };

      case "completed":
        return {
          label: "Completed",
          color: "bg-emerald-100 text-emerald-700",
          icon: <CheckCircle2 size={15} />,
          step: 4,
        };

      default:
        return {
          label: "Processing",
          color: "bg-slate-100 text-slate-600",
          icon: <Clock3 size={15} />,
          step: 1,
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <ShieldCheck
            size={48}
            className="mx-auto text-blue-600 mb-4"
          />

          <h2 className="text-xl font-black text-slate-900">
            Please login first
          </h2>

          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck
                size={23}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="font-black text-xl text-slate-900">
                EstateSync
              </h1>

              <p className="text-xs text-slate-400">
                Client Dashboard
              </p>
            </div>

          </div>

          {/* Header Actions */}

          <div className="flex items-center gap-3">

            <button
              onClick={fetchMyRequests}
              disabled={loading}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {/* ================= WELCOME ================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-7 md:p-10 text-white mb-8">

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Account Active
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Welcome back, {currentUser.name || "User"} 👋
            </h2>

            <p className="text-blue-100 max-w-2xl leading-relaxed">
              Track your property service applications,
              monitor agent progress, and stay updated from
              one simple dashboard.
            </p>

            <button
              onClick={() => (window.location.href = "/services")}
              className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-black hover:bg-blue-50 transition"
            >
              Browse Services
              <ArrowRight size={18} />
            </button>

          </div>

          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -right-10 -bottom-32 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />

        </section>

        {/* ================= STATISTICS ================= */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <StatCard
            title="Total Applications"
            value={totalRequests}
            icon={<ClipboardList size={22} />}
            bg="bg-blue-100"
            text="text-blue-600"
          />

          <StatCard
            title="Active Applications"
            value={activeRequests}
            icon={<Clock3 size={22} />}
            bg="bg-amber-100"
            text="text-amber-600"
          />

          <StatCard
            title="Completed"
            value={completedRequests}
            icon={<CheckCircle2 size={22} />}
            bg="bg-emerald-100"
            text="text-emerald-600"
          />

        </section>

        {/* ================= APPLICATION HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

          <div>

            <h2 className="text-2xl font-black text-slate-900">
              My Applications
            </h2>

            <p className="text-slate-500 mt-1">
              Track every service request you have submitted.
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <ClipboardList size={17} />
            {totalRequests}{" "}
            {totalRequests === 1
              ? "Application"
              : "Applications"}
          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">

            <RefreshCw
              size={35}
              className="mx-auto text-blue-600 animate-spin mb-4"
            />

            <p className="font-bold text-slate-700">
              Loading your applications...
            </p>

          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && myRequests.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 md:p-16 text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <FileText size={36} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              No applications yet
            </h3>

            <p className="text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              You haven't submitted any property service
              applications. Choose a service to get started.
            </p>

            <button
              onClick={() => (window.location.href = "/services")}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black transition"
            >
              Explore Services
              <ArrowRight size={18} />
            </button>

          </div>
        )}

        {/* ================= APPLICATION LIST ================= */}

        {!loading && myRequests.length > 0 && (
          <div className="space-y-6">

            {myRequests.map((req) => {

              const status = getStatusInfo(req.status);

              return (
                <ApplicationCard
                  key={req.id}
                  request={req}
                  status={status}
                  formatDate={formatDate}
                />
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
}


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  title,
  value,
  icon,
  bg,
  text,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-black text-slate-900 mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-xl ${bg} ${text} flex items-center justify-center`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* APPLICATION CARD */
/* ========================================================= */

function ApplicationCard({
  request,
  status,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">

      {/* TOP */}

      <div className="p-6 md:p-7">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

          <div className="flex gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText size={25} />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h3 className="text-xl font-black text-slate-900">
                  {request.serviceName}
                </h3>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </span>

              </div>

              <div className="flex flex-wrap gap-4 mt-3">

                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={16} />
                  {request.location || "Location unavailable"}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <CalendarDays size={16} />
                  {formatDate(request.created)}
                </span>

              </div>

            </div>

          </div>

          <span className="text-xs font-bold text-slate-400">
            ID: {request.id}
          </span>

        </div>

        {/* PROGRESS */}

        <div className="mt-8">

          <div className="flex items-center justify-between mb-3">

            <p className="text-xs uppercase tracking-widest font-black text-slate-400">
              Application Progress
            </p>

            <p className="text-sm font-black text-blue-600">
              {status.step}/4
            </p>

          </div>

          <ProgressTracker step={status.step} />

        </div>

      </div>

      {/* LIVE UPDATE */}

      <div className="border-t border-slate-100 bg-slate-50 p-6 md:p-7">

        <div className="flex flex-col md:flex-row gap-5">

          {/* STATUS */}

          <div className="flex-1">

            <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2">
              Live Status
            </p>

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                {request.status === "completed" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Clock3 size={20} />
                )}
              </div>

              <div>

                <p className="font-black text-slate-900">
                  {request.progress ||
                    "Awaiting initial review..."}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Your application status will update here.
                </p>

              </div>

            </div>

          </div>

          {/* AGENT */}

          <div className="md:w-64">

            <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2">
              Assigned Agent
            </p>

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <UserCheck size={19} />
              </div>

              <div>

                <p className="font-bold text-slate-800">
                  {request.assignedAgent
                    ? "Agent Assigned"
                    : "Not assigned yet"}
                </p>

                <p className="text-xs text-slate-500">
                  {request.assignedAgent
                    ? "Your application is being handled."
                    : "Waiting for an available agent."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* PROGRESS TRACKER */
/* ========================================================= */

function ProgressTracker({ step }) {

  const steps = [
    "Admin Review",
    "Finding Agent",
    "Agent Working",
    "Completed",
  ];

  return (
    <div className="relative">

      {/* Background line */}

      <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 rounded-full" />

      {/* Active line */}

      <div
        className="absolute top-4 left-4 h-1 bg-blue-600 rounded-full transition-all duration-500"
        style={{
          width:
            step === 1
              ? "0%"
              : step === 2
              ? "33%"
              : step === 3
              ? "66%"
              : "100%",
        }}
      />

      <div className="relative flex justify-between">

        {steps.map((label, index) => {

          const currentStep = index + 1;
          const completed = currentStep <= step;

          return (
            <div
              key={label}
              className="flex flex-col items-center"
            >

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                  completed
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <span className="text-xs font-black">
                    {currentStep}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold mt-2 text-center ${
                  completed
                    ? "text-blue-700"
                    : "text-slate-400"
                }`}
              >
                {label}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}