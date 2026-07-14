import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import ContactForm from '../components/sections/ContactForm';
import { FaEnvelope, FaRegClock } from 'react-icons/fa';

export default function Quote() {
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Get a Quote" 
        subtitle="Submit your load specifications and single line diagrams (SLD) to receive a precise project estimation."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Information Column */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-heading font-bold text-2.5xl text-slate-900">
              Project Estimation Process
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              For large manufacturing facilities and commercial developments, we provide complete engineering consultations. Send us your drawings and load schedules to receive itemized pricing.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <FaRegClock className="text-industrial-cyan text-base flex-shrink-0" />
                <span>Turnaround: Estimation within 24 to 48 hours.</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <FaEnvelope className="text-industrial-cyan text-base flex-shrink-0" />
                <span>Direct email for drawings: anandelectricalsoffice@gmail.com</span>
              </div>
            </div>
            
            {/* Custom specification box */}
            <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-xl border-l-2 border-l-industrial-cyan shadow-sm">
              <h4 className="font-heading font-semibold text-slate-900 text-xs mb-1">Certified & Standard Enclosures</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                All our panel enclosures are manufactured with IP54/IP55 rated CRCA steel, protecting internal breakers from dust and water.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  );
}
