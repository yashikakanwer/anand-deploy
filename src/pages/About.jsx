import React from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import StatsCounter from '../components/sections/StatsCounter';
import { FaEye, FaBullseye, FaCheckCircle } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="About Anand Electricals & Engineers" 
        subtitle="Delivering reliable, safe, and efficient electrical power infrastructure since 2008."
      />

      {/* Corporate Profile Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="font-heading font-semibold text-xs tracking-widest text-industrial-cyan uppercase">
              Corporate Profile
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4.5xl text-slate-900 tracking-tight">
              18 Years of Engineering Excellence
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Founded in Jaipur, Rajasthan, Anand Electricals & Engineers has grown into a trusted industrial electrical contracting firm. We design and build custom control panels and substations for factories, hospitals, hotels, and builders.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              We design and construct high-tension (HT) substations, low-tension (LT) main distribution panels, and motor control centers (MCC). Every panel is engineered using advanced CAD layouts and automated machinery to guarantee safety and compliance.
            </p>
          </div>

          <div className="p-8 md:p-12 bg-white border border-slate-200/60 rounded-2xl relative shadow-md">
            <div className="absolute top-0 left-0 w-2.5 h-full bg-industrial-cyan"></div>
            <h3 className="font-heading font-bold text-xl text-slate-900 mb-6">Our Operations</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-industrial-cyan mt-1 flex-shrink-0" />
                <span>CPRI-tested control panel fabrication up to 6300A capacity.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-industrial-cyan mt-1 flex-shrink-0" />
                <span>Licensed Grade-A state electrical contractor.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-industrial-cyan mt-1 flex-shrink-0" />
                <span>Dedicated team of on-site installation and maintenance engineers.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-industrial-cyan mt-1 flex-shrink-0" />
                <span>Computerized 3D design and safety calculation models.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white border border-slate-200/60 rounded-2xl p-10 relative overflow-hidden group hover:border-industrial-cyan/20 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-industrial-cyan/5 border border-industrial-cyan/15 flex items-center justify-center text-industrial-cyan text-xl mb-6">
              <FaEye />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              To be recognized as India's premier B2B industrial electrical engineering partner. We aim to support manufacturing expansions by delivering highly safe, thermally stable, and energy-efficient control systems.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-10 relative overflow-hidden group hover:border-industrial-cyan/20 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xl mb-6">
              <FaBullseye />
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              To translate complex electrical configurations into safe, reliable physical cabinets. We commit to strict quality testing and premium components to prevent electrical faults and energy losses.
            </p>
          </div>

        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-heading font-semibold text-xs tracking-widest text-industrial-cyan uppercase mb-3 block">
              Core Principles
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4.5xl text-slate-900 tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 border border-slate-200/60 rounded-xl text-center shadow-sm">
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">Safety First</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Zero tolerance for electrical leakage. All designs comply with standard safety regulations to prevent worksite hazards.
              </p>
            </div>
            <div className="p-8 bg-slate-50 border border-slate-200/60 rounded-xl text-center shadow-sm">
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">Engineering Integrity</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                No compromise on copper ratings or breaker selections. We partner exclusively with Siemens, Schneider, and ABB.
              </p>
            </div>
            <div className="p-8 bg-slate-50 border border-slate-200/60 rounded-xl text-center shadow-sm">
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">On-time Commissioning</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                We understand that project delays are highly expensive. Pre-fabricated modular systems ensure fast onsite installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <StatsCounter />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
