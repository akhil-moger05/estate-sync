import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

// Neumorphic "soft UI" palette — tweak these two values to re-theme everything
const BASE = "#e7ebf3";
const SHADOW_DARK = "#b9c2d4";
const SHADOW_LIGHT = "#ffffff";
const ACCENT = "#d1476f";

const raised = { boxShadow: `6px 6px 12px ${SHADOW_DARK}, -6px -6px 12px ${SHADOW_LIGHT}` };
const raisedBig = { boxShadow: `14px 14px 28px ${SHADOW_DARK}, -14px -14px 28px ${SHADOW_LIGHT}` };
const halo = { boxShadow: `22px 22px 48px ${SHADOW_DARK}, -22px -22px 48px ${SHADOW_LIGHT}` };
const inset = { boxShadow: `inset 6px 6px 10px ${SHADOW_DARK}, inset -6px -6px 10px ${SHADOW_LIGHT}` };
const insetSmall = { boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };
const pressed = { boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` };

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const authData = await pb.collection("users").authWithPassword(email, password);
      const user = authData.record;

      if (user.role === "agent" && user.status !== "approved") {
        pb.authStore.clear();
        setError(
          user.status === "rejected"
            ? "Your agent application was rejected. Please contact support."
            : "Your agent account is still pending Admin approval."
        );
        setLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem("estateSyncRemember", "true");
      } else {
        localStorage.removeItem("estateSyncRemember");
      }

      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "agent") {
        navigate("/dashboard/agent");
      } else {
        navigate("/dashboard/user");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err?.status === 400) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: BASE }}>
      {/* Outer halo */}
      <div className="relative w-[480px] h-[480px] max-w-full flex items-center justify-center">
        <div
          className="absolute rounded-full"
          style={{ width: 500, height: 500, background: BASE, ...halo }}
        />

        {/* Card */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{ width: 420, height: 420, maxWidth: "90vw", maxHeight: "90vw", background: BASE, ...raisedBig }}
        >
          <div className="w-[260px] max-w-[70%] text-center">
            <h1 className="text-2xl font-bold" style={{ color: "#3a4359" }}>
              Login
            </h1>
            <p className="text-xs mb-5" style={{ color: "#9098a9" }}>
              Sign in to your EstateSync account
            </p>

            {error && (
              <div
                className="mb-4 flex gap-2 items-start text-left px-3 py-2 rounded-2xl"
                style={{ ...inset, color: "#b1365e" }}
              >
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-medium leading-snug">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="relative mb-3">
                <User
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#9098a9" }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full text-xs outline-none border-none"
                  style={{ background: BASE, color: "#3a4359", ...inset }}
                />
              </div>

              {/* Password */}
              <div className="relative mb-2">
                <Lock
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#9098a9" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 rounded-full text-xs outline-none border-none"
                  style={{ background: BASE, color: "#3a4359", ...inset }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#9098a9" }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between my-4 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: "#6b7280" }}>
                  <span
                    onClick={() => setRemember(!remember)}
                    className="inline-block relative rounded-full"
                    style={{ width: 30, height: 16, ...insetSmall }}
                  >
                    <span
                      className="absolute rounded-full transition-all"
                      style={{
                        top: 2,
                        left: remember ? 16 : 2,
                        width: 12,
                        height: 12,
                        background: remember ? ACCENT : "#cfd4de",
                      }}
                    />
                  </span>
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-semibold"
                  style={{ color: ACCENT }}
                  onClick={() =>
                    setError("Please contact the administrator to reset your password.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-bold tracking-widest border-none"
                style={{
                  background: BASE,
                  color: loading ? "#9098a9" : "#3a4359",
                  ...raised,
                  cursor: loading ? "default" : "pointer",
                }}
                onMouseDown={(e) => Object.assign(e.currentTarget.style, pressed)}
                onMouseUp={(e) => Object.assign(e.currentTarget.style, raised)}
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>

            <p className="mt-4 text-[11px]" style={{ color: "#9098a9" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold"
                style={{ color: ACCENT }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}