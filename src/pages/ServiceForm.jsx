import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { pb } from "../lib/pb";
import { ArrowLeft, User, Phone, MapPin, UploadCloud, AlertCircle, FileText } from "lucide-react";

export default function ServiceForm() {
  const { name } = useParams();
  const navigate = useNavigate();
  const serviceName = decodeURIComponent(name || "");

  const [form, setForm] = useState({
    name: "",
    location: "",
    phone: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔒 Security Check
    if (!pb.authStore.isValid) {
      alert("Please login first to submit an application.");
      navigate("/login");
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("File is too big. Please upload a file under 5MB.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Save to PocketBase Database
      // Note: If you want to handle real file uploads later, PocketBase uses FormData.
      // For now, we are saving the text fields and pushing it to the Admin.
      const data = new FormData();
      data.append("user", pb.authStore.model.id);
      data.append("serviceName", serviceName);
      data.append("applicantName", form.name);
      data.append("location", form.location);
      data.append("phone", form.phone);
      data.append("details", file ? `Attached Document: ${file.name}` : "No documents attached.");
      // Starts in the Admin queue
      data.append("status", "admin_review");
      data.append("progress", "Pending Admin Review");
      if (file) data.append("documents", file);

      await pb.collection("requests").create(data);

      alert("Application submitted successfully! Redirecting to your dashboard.");
      navigate("/dashboard/user");

    } catch (err) {
      console.error(err);
      setError("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-brand font-bold mb-8 transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>

          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-3xl font-extrabold text-brand mb-2">Apply for Service</h2>
            <p className="text-accent font-bold flex items-center gap-2 text-lg">
              <FileText size={20}/> {serviceName}
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Location / Area</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., Downtown, Sector 4..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Document Upload (Mock) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                </div>
              </div>
              {file && (
                <div className="mt-3 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium flex justify-between items-center border border-blue-100">
                  <span>Attached: {file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-blue-500 hover:text-blue-800">Remove</button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}