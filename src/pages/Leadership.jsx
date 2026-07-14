import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { FaLinkedin, FaAward, FaBuilding, FaRoad } from 'react-icons/fa';
import directorImg from '../assets/director.png';
import deepeshImg from '../assets/deepesh.jpg';

export default function Leadership() {
  const timeline = [
    { year: "2008", event: "Founded Anand Electricals in Jaipur, Rajasthan, fabricating custom motor starters and panels." },
    { year: "2013", event: "Expanded into HT Substation deployments and received Grade-A contracting credentials." },
    { year: "2018", event: "Commissioned the advanced Sarna Industrial Area manufacturing unit with modern CNC metalworking setups." },
    { year: "2022", event: "Successfully delivered automated PLC synchronization boards for top industrial clients." },
    { year: "2025", event: "Charged major turnkey infrastructure projects, reaching a milestone of 515+ completed projects." }
  ];

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Executive Profile" 
        subtitle="Meet our leadership and explore the strategic vision driving Anand Electricals."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Executive Left Column: Photo & Details Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-lg space-y-6">
              <div className="aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent opacity-50 z-10"></div>
                <img 
                  src={directorImg} 
                  alt="Director Amit Kumar" 
                  className="w-full h-full object-cover transition-all duration-500 scale-102"
                />
              </div>

              <div>
                <h2 className="font-heading font-bold text-2xl text-slate-900">Amit Kumar</h2>
                <p className="text-industrial-cyan text-xs uppercase tracking-wider font-heading mt-0.5">Founder & Managing Director</p>
                <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                  18+ years of hands-on experience in high-voltage industrial engineering, switchgear designs, and grid commissioning.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Connect Profile:</span>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-cyan text-white font-semibold rounded text-xs transition-colors hover:bg-slate-900 shadow-md shadow-industrial-cyan/10"
                >
                  <FaLinkedin size={14} /> LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Executive Right Column: Detailed Journey, Timeline, Vision */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Director Message */}
            <div className="space-y-6">
              <span className="font-heading font-semibold text-xs tracking-widest text-industrial-cyan uppercase">
                Director's Message
              </span>
              <h3 className="font-heading font-bold text-3xl text-slate-900 tracking-tight">
                Our Mandate: Safe, Continuous Power for Indian Manufacturing
              </h3>
              <blockquote className="border-l-3 border-industrial-cyan pl-6 italic text-slate-600 text-base md:text-lg">
                "An industrial website should convey competence, not flash. At Anand Electricals, we build critical systems that factories rely on for continuous operations. Our goal is to offer B2B developers engineering stability, transparency, and top-tier safety certifications."
              </blockquote>
            </div>

            {/* Professional Journey & Experience */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-2xl text-slate-900 flex items-center gap-3">
                <FaBuilding className="text-industrial-cyan" /> Professional Journey
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Amit Kumar started his career as a systems validation engineer, certifying HT switchgears for regional utilities. Realizing the gap in local manufacturing capacity for custom, highly reliable PLC and distribution panels, he founded Anand Electricals in 2008. Under his leadership, the firm scaled from a local supplier to an enterprise contractor worth multi-crore grid projects, delivering installations in major industrial estates including RIICO Sarna Industrial Area.
              </p>
            </div>

            {/* Vision & Mission Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div>
                <h4 className="font-heading font-semibold text-slate-900 mb-2">Operational Vision</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Establish Anand as the standard of choice for industrial control grids, maintaining high-conductivity thresholds and 100% FAT test transparency.
                </p>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-slate-900 mb-2">Contracting Mission</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Provide developers with pre-fabricated, modular Changeover AMF and MCC panels that reduce commissioning lags by up to 25%.
                </p>
              </div>
            </div>

            {/* Awards & Achievements */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h3 className="font-heading font-bold text-2xl text-slate-900 flex items-center gap-3">
                <FaAward className="text-industrial-cyan" /> Achievements & Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded bg-industrial-cyan/5 border border-industrial-cyan/20 flex items-center justify-center text-industrial-cyan font-bold flex-shrink-0 text-sm">
                    01
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-slate-900 text-sm">515+ Projects Completed</h4>
                    <p className="text-slate-600 text-xs mt-1">Successfully deployed industrial panel infrastructure projects across Rajasthan and beyond.</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded bg-industrial-cyan/5 border border-industrial-cyan/20 flex items-center justify-center text-industrial-cyan font-bold flex-shrink-0 text-sm">
                    02
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-slate-900 text-sm">Grade-A Contracting License</h4>
                    <p className="text-slate-600 text-xs mt-1">Authorized by the State Electrical Inspectorate to execute massive utility line jobs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h3 className="font-heading font-bold text-2xl text-slate-900 flex items-center gap-3">
                <FaRoad className="text-industrial-cyan" /> Timeline of Growth
              </h3>
              <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative group">
                    <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border border-industrial-cyan shadow-[0_0_8px_#EA580C] transition-all group-hover:scale-125"></span>
                    <span className="font-heading font-bold text-industrial-cyan text-sm block mb-1">
                      {item.year}
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Team / Management Section */}
      <section className="py-20 md:py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-heading font-semibold text-xs tracking-widest text-industrial-cyan uppercase mb-3 block">
              Our Professional Team
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4.5xl text-slate-900 tracking-tight">
              Management & Team Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {/* Team Member 1: Deepesh Singh Rajput */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-md space-y-6 max-w-sm mx-auto w-full">
              <div className="aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent opacity-50 z-10"></div>
                <img 
                  src={deepeshImg} 
                  alt="Online Team Manager Deepesh Singh Rajput" 
                  className="w-full h-full object-cover transition-all duration-500 scale-102"
                />
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">Deepesh Singh Rajput</h3>
                <p className="text-industrial-cyan text-xs uppercase tracking-wider font-heading mt-0.5">Online Team Manager</p>
                <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                  Coordinates digital workflows, online client queries, site proposals, and online sales operations.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Connect:</span>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-cyan text-white font-semibold rounded text-xs transition-colors hover:bg-slate-900 shadow-md shadow-industrial-cyan/10"
                >
                  <FaLinkedin size={14} /> Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
