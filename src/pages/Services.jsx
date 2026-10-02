import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { servicesData } from "../utils/servicesData";
import { pb } from "../lib/pb";
import { ArrowRight, FileSignature, FolderOpen } from "lucide-react";

export default function Services() {
  const navigate = useNavigate();

  // SECURITY CHECK: Agents cannot access the services catalog
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model?.role === 'agent') {
      alert("Access Denied: Agents cannot apply for services.");
      navigate("/dashboard/agent");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand mb-4">
            Available <span className="text-accent">Services</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Select the property service you need. We ensure a transparent, fast, and secure process from application to approval.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden"
            >
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-accent opacity-0 hover:opacity-100 transition-opacity"></div>

              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-accent">
                  <FileSignature size={24} />
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <FolderOpen size={12} /> {service.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-brand mb-3">
                {service.name}
              </h3>
              
              <p className="text-gray-500 text-sm mb-8 flex-grow">
                {service.description || "Click 'See More' to view the procedure, required documents, and apply for this service."}
              </p>

              <button
                onClick={() => navigate(`/service/${service.id}`)}
                className="w-full bg-gray-50 text-brand py-3 rounded-xl font-bold hover:bg-brand hover:text-white transition-all flex justify-center items-center gap-2 group"
              >
                See More 
                <ArrowRight size={18} className="text-accent group-hover:text-white transition-colors" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}