import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { User, Mail, Lock, AlertCircle, Building2, Phone, FileText, CheckCircle2, MapPin } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [step, setStep] = useState(1); 
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [location, setLocation] = useState(""); 
  const [documentFile, setDocumentFile] = useState(null);
  const [otp, setOtp] = useState("");
  
  // UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. USER OTP FLOW (Simulation) ---
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); 
    }, 1000);
  };

  // --- 2. MAIN REGISTRATION LOGIC ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Aadhaar check for agents (12 digits)
    const aadhaarDigits = aadhar.replace(/\D/g, "");
    if (role === "agent" && aadhaarDigits.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      setLoading(false);
      return;
    }

    // OTP check for regular users
    if (role === "user" && otp !== "1234") {
      setError("Invalid OTP. For testing, please use 1234");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("passwordConfirm", password);
      formData.append("name", name);
      formData.append("role", role); 
      formData.append("emailVisibility", true);

      // Append specific data based on role matching your schema
      if (role === "agent") {
        formData.append("phone", phone);
        // Only the last 4 digits are saved, for safety
        formData.append("aadhaar", `XXXX-XXXX-${aadhaarDigits.slice(-4)}`);
        formData.append("location", location);
        formData.append("status", "pending"); // Matches your 'status' select field

        if (documentFile) {
          formData.append("documents", documentFile);
        } else {
          throw new Error("Please upload your supporting documents.");
        }
      } else {
        formData.append("status", "approved"); // Users are approved automatically
      }

      // 1. Create the user in PocketBase
      await pb.collection("users").create(formData);

      // 2. Handle the success routing
      if (role === "agent") {
        setStep(3); // Show "Pending Approval" success screen
      } else {
        // Auto-login the new user
        await pb.collection("users").authWithPassword(email, password);
        navigate("/dashboard/user");
      }
      
    } catch (err) {
      console.error(err);
      const first = err.response?.data && Object.values(err.response.data)[0]?.message;
      setError(first || err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500">Join EstateSync and get started</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* SUCCESS SCREEN FOR AGENTS */}
        {step === 3 && role === "agent" ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted</h2>
            <p className="text-slate-600">
              Your agent application has been sent to our admin team. We will review your documents. 
              You will be notified once approved.
            </p>
            <Link to="/login" className="block w-full bg-[#0f172a] hover:bg-slate-800 text-white py-4 rounded-xl font-bold mt-6 transition-all">
              Return to Login
            </Link>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <>
            {step === 1 && (
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                {["user", "agent"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setError(""); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${
                      role === r 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={role === "user" && step === 1 ? handleSendOTP : handleRegister} className="space-y-4">
              
              {/* STEP 1: BASIC DETAILS */}
              {step === 1 && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text" required placeholder="Full Name"
                      autoComplete="off"
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email" required placeholder="Email Address"
                      autoComplete="off"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="password" required placeholder="Password (min. 8 chars)"
                      autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  {/* AGENT SPECIFIC FIELDS */}
                  {role === "agent" && (
                    <>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="tel" required placeholder="Phone Number"
                          autoComplete="off"
                          value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text" required placeholder="Aadhaar Number (12 digits)"
                          autoComplete="off"
                          value={aadhar} onChange={(e) => setAadhar(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text" required placeholder="City / Location (e.g., Mysuru)"
                          autoComplete="off"
                          value={location} onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Upload Identity/Certificates</label>
                        <input
                          type="file" required
                          onChange={(e) => setDocumentFile(e.target.files[0])}
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </>
                  )}
                  
                  <button type="submit" disabled={loading} className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-4 rounded-xl font-bold mt-2 transition-all">
                    {loading ? "Processing..." : (role === "user" ? "Send OTP" : "Submit Application")}
                  </button>
                </>
              )}

              {/* STEP 2: USER OTP VERIFICATION */}
              {step === 2 && role === "user" && (
                <div className="space-y-4">
                  <p className="text-center text-slate-600 text-sm mb-4">
                    An OTP has been sent to <b>{email}</b>.<br/>(For testing, type: <b>1234</b>)
                  </p>
                  <input
                    type="text" required placeholder="Enter OTP"
                    autoComplete="off"
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl tracking-widest font-black focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg mt-2 shadow-lg shadow-blue-500/30 transition-all">
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 font-bold mt-2 hover:text-slate-800">
                    Go Back
                  </button>
                </div>
              )}
            </form>

            {step === 1 && (
              <p className="text-center mt-8 text-slate-500 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Login
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}