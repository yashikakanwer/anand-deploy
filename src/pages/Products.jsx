import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { db } from '../utils/db';
import { FaChevronRight } from 'react-icons/fa';

export default function Products() {
  const productsData = db.getProducts();
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Switchgear & Custom Control Panels" 
        subtitle="Browse our comprehensive range of certified power distribution and automation panels."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsData.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden hover:border-industrial-cyan/25 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Product Image */}
                  <div className="h-52 overflow-hidden relative bg-white border-b border-slate-200/60 flex items-center justify-center">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="max-h-full max-w-full object-contain p-4 hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">
                      {prod.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {prod.shortDescription}
                    </p>

                    {/* Specifications Snapshot */}
                    <div className="border-t border-slate-200 pt-4 mb-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Key Specification:
                      </h4>
                      <span className="text-xs text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded inline-block">
                        {(prod.specs && prod.specs[0]) ? (prod.specs[0].value || prod.specs[0]) : 'Standard Specification'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-8 pt-4 border-t border-slate-200 bg-slate-50/50">
                  <Link 
                    to={`/products/${prod.slug}`} 
                    className="text-industrial-cyan text-sm font-semibold hover:text-slate-900 font-heading inline-flex items-center gap-1.5"
                  >
                    Learn More <FaChevronRight size={10} />
                  </Link>
                  <Link 
                    to="/quote" 
                    className="px-4 py-2 bg-industrial-cyan text-white hover:bg-slate-900 font-semibold rounded text-xs transition-colors font-heading uppercase tracking-wider shadow-md shadow-industrial-cyan/10"
                  >
                    Get Quote
                  </Link>
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
