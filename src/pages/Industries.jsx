import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { FaIndustry, FaHospital, FaHotel, FaBuilding, FaWarehouse, FaCheckCircle } from 'react-icons/fa';

export default function Industries() {
  const industries = [
    {
      name: "Manufacturing & Industrial Plants",
      icon: <FaIndustry className="text-industrial-cyan text-4xl mb-6" />,
      desc: "High-capacity switchgear panels, motor control centers (MCC), and automated PLC synchronization systems for heavy machinery.",
      solution: "Recommended: MCC Panels, PCC Panels, Bus Ducts"
    },
    {
      name: "Healthcare & Hospitals",
      icon: <FaHospital className="text-industrial-cyan text-4xl mb-6" />,
      desc: "Uninterrupted power systems using automatic mains failure changeover panels (AMF) and isolated medical grounding systems.",
      solution: "Recommended: AMF Panels, Chemical Earthing"
    },
    {
      name: "Hospitality & Hotels",
      icon: <FaHotel className="text-industrial-cyan text-4xl mb-6" />,
      desc: "Power factor correction panels to prevent line losses and utility penalties, ensuring optimized energy billing.",
      solution: "Recommended: APFC Panels, PCC Panels"
    },
    {
      name: "Commercial Malls & Hubs",
      icon: <FaBuilding className="text-industrial-cyan text-4xl mb-6" />,
      desc: "High-density power routing using space-saving busbar trunking systems and centralized sub-metering grids.",
      solution: "Recommended: Bus Ducts, AMF Panels"
    },
    {
      name: "Warehouses & Logistics",
      icon: <FaWarehouse className="text-industrial-cyan text-4xl mb-6" />,
      desc: "Dust-proof and weatherproof distribution enclosures, automated conveyor control panels, and surge protection grounding.",
      solution: "Recommended: Earthing Systems, MCC Panels"
    }
  ];

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Industries We Serve" 
        subtitle="Engineered switchgear and customized electrical panels tailored for diverse sectors."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, index) => (
              <div 
                key={index} 
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-10 shadow-lg hover:border-industrial-cyan/25 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {ind.icon}
                  <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">
                    {ind.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {ind.desc}
                  </p>
                </div>
                
                <div className="border-t border-slate-200 pt-4 mt-6">
                  <span className="text-xs text-industrial-cyan font-heading font-semibold flex items-center gap-1.5">
                    <FaCheckCircle /> {ind.solution}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <CTASection />
    </div>
  );
}
