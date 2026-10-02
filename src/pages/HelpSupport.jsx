import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../lib/pb";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

export default function HelpSupport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Auto-fill user details if they are already logged in
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setForm((prev) => ({
        ...prev,
        name: pb.authStore.model.name || "",
        email: pb.authStore.model.email || "",
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Saves the query to the 'support_tickets' collection in PocketBase
      await pb.collection("support_tickets").create({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      setSuccess(true);
      setForm({ ...form, subject: "", message: "" }); // Clear message fields
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try emailing us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-brand font-bold mb-8 transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* PAGE HEADER */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
            <HelpCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-extrabold text-brand mb-4">Help & Support</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you are a user, an agent, or an admin, we are here to help. Send us your queries or report an issue.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* DIRECT CONTACT INFO (Left Side) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              
              <h3 className="text-xl font-bold mb-2">Direct Email</h3>
              <p className="text-gray-300 text-sm mb-8">
                Prefer to use your own email client? Reach out to our dedicated support address.
              </p>
              
              <a 
                href="mailto:nrchikka176@gmail.com" 
                className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition group"
              >
                <div className="bg-accent p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email Us</p>
                  <p className="font-medium text-white">nrchikka176@gmail.com</p>
                </div>
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-brand mb-2">Response Time</h3>
              <p className="text-gray-500 text-sm">
                Our support team typically responds to all administrative and service queries within 24-48 hours.
              </p>
            </div>
          </div>

          {/* CONTACT FORM (Right Side) */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
              <MessageSquare className="text-accent" /> Send us a Message
            </h2>

            {error && (
              <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100">
                <CheckCircle2 size={18} />
                <p>Your message has been sent successfully! We will get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-gray-700"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="Issue with an Application">Issue with an Application</option>
                  <option value="Agent Verification Help">Agent Verification Help</option>
                  <option value="Technical Bug / Error">Technical Bug / Error</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? "Sending..." : "Submit Message"} <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}