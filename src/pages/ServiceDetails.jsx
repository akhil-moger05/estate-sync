import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesData } from "../utils/servicesData";
import { pb } from "../lib/pb";
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Info, 
  ShieldAlert,
  Receipt,
  Banknote,
  Percent
} from "lucide-react";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const foundService = servicesData.find((s) => s.id === parseInt(id) || s.id === id);
    setService(foundService);

    // SECURITY CHECK: If an Agent tries to view this, redirect them.
    if (pb.authStore.isValid && pb.authStore.model?.role === 'agent') {
      alert("Access Denied: Agents cannot apply for user services.");
      navigate("/dashboard/agent");
    }
  }, [id, navigate]);

  const handleApply = () => {
    if (!pb.authStore.isValid) {
      navigate("/register");
      return;
    }
    navigate(`/service-form/${service.name}`);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShieldAlert className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">Service not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-accent hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* PREMIUM BACK BUTTON */}
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-brand font-bold mb-8 transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Back to Services
        </button>

        {/* MAIN DETAILS CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-brand p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-sm border border-white/20">
                  {service.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{service.name}</h1>
                <p className="text-gray-300 text-lg max-w-2xl">{service.description}</p>
              </div>
            </div>
          </div>

          <div className="p-10 grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Procedure & Documents */}
            <div className="lg:col-span-2 space-y-10">
              {/* Procedure Section */}
              <div>
                <h3 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                  <Info className="text-accent" /> Standard Procedure
                </h3>
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <ul className="space-y-6">
                    {service.procedure.map((step, i) => (
                      <li key={i} className="flex items-start gap-4 relative">
                        {i !== service.procedure.length - 1 && (
                          <div className="absolute top-8 left-4 w-0.5 h-full bg-blue-100 -z-0"></div>
                        )}
                        <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-accent text-accent flex items-center justify-center text-sm font-bold shadow-sm">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 font-medium pt-1">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-2xl font-bold text-brand mb-6 flex items-center gap-2">
                  <FileText className="text-accent" /> Documents Required
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {service.documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Pricing & Call to Action */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                
                {/* Eye-Catchy Pricing Breakdown Card */}
                <div className="bg-gradient-to-br from-gray-900 to-brand text-white rounded-3xl p-8 shadow-xl mb-6 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Receipt className="text-accent w-6 h-6" /> Transparent Pricing
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Banknote className="w-5 h-5 text-gray-400" /> Platform Fee
                      </div>
                      <span className="text-xl font-bold text-white">₹499</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Percent className="w-5 h-5 text-gray-400" /> Agent Commission
                      </div>
                      <span className="text-xl font-bold text-white">3%</span>
                    </div>
                    <p className="text-xs text-gray-400 text-right leading-tight">
                      *Commission is calculated based on <br/> property/service value post-approval.
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 mt-2">
                    <p className="text-sm text-center font-medium text-blue-100">
                      Pay ₹499 strictly upon final service completion. Zero hidden charges.
                    </p>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex justify-center items-center gap-2"
                  onClick={handleApply}
                >
                  Apply Now
                </button>
                <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                  {!pb.authStore.isValid ? "You will be asked to log in or register first." : "Proceed to secure application form."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}