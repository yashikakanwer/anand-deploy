import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import ContactForm from '../components/sections/ContactForm';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '../utils/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title={t('contactUs')} 
        subtitle="Consult with our engineering team for industrial switchgear bids and custom panel fabrication requests."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-heading font-bold text-2.5xl text-slate-900 mb-6">
              Our Head Office
            </h2>
            
            <div className="space-y-6 text-sm">
              <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-4 shadow-md">
                <FaMapMarkerAlt className="text-industrial-cyan text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Office Address</h4>
                  <p className="text-slate-600 leading-relaxed">
                    S.No. 5, Near Ranisati Dharmkanta, Sarna Industrial Area, Jaipur, Rajasthan - 302012
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-4 shadow-md">
                <FaEnvelope className="text-industrial-cyan text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Email Inquiries</h4>
                  <p className="text-slate-600">
                    <a href="mailto:anandelectricalsoffice@gmail.com" className="hover:text-industrial-cyan transition-colors">
                      anandelectricalsoffice@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-4 shadow-md">
                <FaPhoneAlt className="text-industrial-cyan text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Phone Support</h4>
                  <div className="text-slate-600 flex flex-col gap-1">
                    <a href="tel:+917689057259" className="hover:text-industrial-cyan transition-colors">
                      +91 76890 57259
                    </a>
                    <a href="tel:+919001347691" className="hover:text-industrial-cyan transition-colors">
                      +91 90013 47691
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Schematic Map Visualizer */}
            <div className="relative h-44 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-center items-center p-4">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#0F172A_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-pulse z-10"></span>
              <span className="w-12 h-12 border border-red-500/20 rounded-full absolute animate-[ping_2.5s_infinite] pointer-events-none"></span>
              <div className="text-xs text-slate-500 mt-3 font-mono tracking-widest z-10 uppercase">
                Jaipur Office Location
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <h2 className="font-heading font-bold text-2.5xl text-slate-900 mb-6">
              {t('contactTitle')}
            </h2>
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  );
}
