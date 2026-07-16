import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../utils/LanguageContext';

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 md:py-24 bg-industrial-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative rounded-2xl border border-slate-200/80 p-12 md:p-16 bg-gradient-to-br from-slate-50 to-white overflow-hidden group shadow-xl text-center">
          
          {/* Subtle Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-industrial-cyan/5 rounded-full filter blur-[80px] pointer-events-none transition-all duration-700 group-hover:scale-110"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="font-heading font-semibold text-xs tracking-widest text-industrial-cyan uppercase mb-4 block">
              {t('partnerTagline')}
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4.5xl text-slate-900 leading-tight tracking-tight mb-6">
              {t('partnerTitle')}
            </h2>
            <p className="font-body text-sm md:text-base text-industrial-muted mb-10 max-w-xl mx-auto leading-relaxed">
              {t('partnerDesc')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/quote" 
                className="w-full sm:w-auto px-8 py-4 bg-industrial-cyan text-white hover:bg-slate-900 font-semibold rounded-md text-sm transition-all duration-300 tracking-wider uppercase font-heading shadow-md shadow-industrial-cyan/10"
              >
                {t('requestGatedQuote')}
              </Link>
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-300 hover:border-industrial-cyan text-slate-800 hover:text-industrial-cyan font-semibold rounded-md text-sm transition-all duration-300 tracking-wider uppercase font-heading"
              >
                {t('scheduleConsultation')}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
