import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { db } from '../utils/db';
import { FaCheckCircle, FaTools, FaWrench, FaBolt, FaHistory } from 'react-icons/fa';

export default function Services() {
  const servicesData = db.getServices();
  const getIcon = (id) => {
    switch (id) {
      case 'turnkey-electrification': return <FaBolt className="text-industrial-cyan text-4.5xl mb-6" />;
      case 'custom-panel-design': return <FaWrench className="text-industrial-cyan text-4.5xl mb-6" />;
      case 'safety-audits': return <FaTools className="text-industrial-cyan text-4.5xl mb-6" />;
      case 'preventive-maintenance': return <FaHistory className="text-industrial-cyan text-4.5xl mb-6" />;
      default: return <FaBolt className="text-industrial-cyan text-4.5xl mb-6" />;
    }
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Our Services" 
        subtitle="From switchgear installation and testing to preventive maintenance audits."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {servicesData.map((serv) => (
              <div 
                key={serv.id} 
                id={serv.slug}
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-10 shadow-lg relative group hover:border-industrial-cyan/25 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {getIcon(serv.id)}
                  <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">
                    {serv.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8">
                    {serv.description}
                  </p>

                  <ul className="space-y-3">
                    {serv.features.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2.5">
                        <FaCheckCircle className="text-industrial-cyan flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-slate-200 pt-8 mt-8">
                  <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                    Execution compliance: CPRI / IEEE / Local Inspectorate
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
