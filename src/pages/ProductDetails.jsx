import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../utils/db';
import PageBanner from '../components/sections/PageBanner';
import ContactForm from '../components/sections/ContactForm';
import { FaFilePdf, FaCheck, FaIndustry, FaChevronRight } from 'react-icons/fa';
import NotFound from './NotFound';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsData = db.getProducts();
    const foundProduct = productsData.find(prod => prod.slug === slug);
    setProduct(foundProduct);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white text-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg font-heading text-industrial-cyan">Loading Specifications...</div>
      </div>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title={product.name} 
        subtitle={product.shortDescription}
      />

      {/* breadcrumb navigation */}
      <div className="bg-slate-50 border-b border-slate-200/60 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-2 font-body font-medium">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <FaChevronRight size={8} />
          <Link to="/products" className="hover:text-slate-900">Products</Link>
          <FaChevronRight size={8} />
          <span className="text-industrial-cyan">{product.name}</span>
        </div>
      </div>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Product Specifications Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Product Image Card */}
            <div className="w-full h-80 md:h-[400px] border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-md flex items-center justify-center p-6">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain hover:scale-102 transition-transform duration-500"
              />
            </div>

            <div>
              <h2 className="font-heading font-bold text-2.5xl md:text-3.5xl text-slate-900 mb-6">
                System Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* Specifications Array */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900">Technical Specifications</h3>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden shadow-md">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    {(product.specs || []).map((spec, index) => {
                      const name = typeof spec === 'object' ? spec.name : (spec.split ? spec.split(':')[0] : '') || '';
                      const value = typeof spec === 'object' ? spec.value : (spec.split ? spec.split(':')[1] : '') || '';
                      return (
                        <tr key={index} className="border-b border-slate-200/60 last:border-0 hover:bg-slate-100/50 transition-colors">
                          <td className="px-6 py-4 font-heading font-semibold text-slate-500 w-1/3">{name}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Engineering Features */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900">Engineering Features</h3>
              <ul className="space-y-3.5">
                {(product.features || []).map((feat, index) => (
                  <li key={index} className="flex items-start gap-3.5 text-sm text-slate-600 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-industrial-cyan/10 border border-industrial-cyan/20 flex items-center justify-center text-industrial-cyan flex-shrink-0 mt-0.5">
                      <FaCheck size={10} />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications list */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900">Target Applications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(product.applications || []).map((app, index) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-200/60 rounded-lg flex items-center gap-3 shadow-sm">
                    <FaIndustry className="text-industrial-cyan flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">{app}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Dynamic Quick Quote Contact Form & Catalog PDF */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            
            {/* Catalog Download Widget */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-6 shadow-md space-y-4">
              <h4 className="font-heading font-semibold text-slate-900 uppercase tracking-wider text-xs">
                Downloads
              </h4>
              <Link 
                to="/downloads" 
                className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-industrial-cyan rounded-lg hover:bg-industrial-cyan/5 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="font-heading font-semibold text-slate-900 text-sm">Download Datasheet</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">CPRI short circuit specifications</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Pre-filled Inquiries Form */}
            <div>
              <h4 className="font-heading font-semibold text-slate-900 uppercase tracking-wider text-xs mb-4">
                Quick System Inquiry
              </h4>
              <ContactForm presetService={product.id} />
            </div>
          </div>

         </div>
      </section>
    </div>
  );
}
