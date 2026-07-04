import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { db } from '../utils/db';
import { FaChevronRight } from 'react-icons/fa';

import substationImg from '../assets/project_substation.png';
import panelboardImg from '../assets/project_panelboard.png';

export default function Projects() {
  const projectsData = db.getProjects();
  const getImage = (imgName) => {
    if (!imgName) return panelboardImg;
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;
    if (imgName === 'project_substation.png') return substationImg;
    if (imgName === 'project_panelboard.png') return panelboardImg;
    // Fallback/Default image
    return panelboardImg;
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Case Studies & Deliveries" 
        subtitle="Review our records of heavy power installations across Indian regions."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projectsData.map((proj) => (
              <div 
                key={proj.id} 
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col group shadow-md"
              >
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 to-transparent z-10"></div>
                  <img 
                    src={getImage(proj.image)} 
                    alt={proj.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-6 right-6 bg-slate-900/85 backdrop-blur-sm border border-slate-800 px-4 py-1.5 rounded-full text-xs text-white z-20 font-medium">
                    {proj.location}
                  </div>
                </div>

                <div className="p-10 space-y-6 relative z-10 -mt-12 bg-white rounded-t-2xl flex-grow flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-semibold text-industrial-cyan text-xs tracking-widest uppercase block mb-2">
                      Year of Completion: {proj.completionYear}
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">
                      {proj.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {proj.scope}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-heading font-medium">
                      Client: {proj.clientName}
                    </span>
                    <Link 
                      to={`/projects/${proj.slug}`} 
                      className="text-industrial-cyan text-sm font-semibold hover:text-slate-900 font-heading inline-flex items-center gap-1.5"
                    >
                      Technical Review <FaChevronRight size={10} />
                    </Link>
                  </div>
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
