import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { db } from '../../utils/db';
import { useLanguage } from '../../utils/LanguageContext';

export default function ContactForm({ presetService = "" }) {
  const { t } = useLanguage();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryProduct = searchParams.get('product') || searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: presetService || queryProduct,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const qProd = searchParams.get('product') || searchParams.get('service') || '';
    if (qProd) {
      setFormData(prev => ({ ...prev, service: qProd }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Save to database backend
      await db.addInquiry({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service || presetService,
        message: formData.message
      });
      
      setSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Failed to submit inquiry. Please check your internet connection.");
      setSubmitting(false);
    }
  };

  const productsList = db.getProducts();
  const servicesList = db.getServices();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-industrial-cyan to-industrial-accent"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('fullName')}
            </label>
            <input 
              type="text" 
              id="name" 
              required 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar" 
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Company Name
            </label>
            <input 
              type="text" 
              id="company" 
              required 
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Siemens Projects Ltd" 
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('emailAddress')}
            </label>
            <input 
              type="email" 
              id="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rajesh@company.com" 
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('phone')}
            </label>
            <input 
              type="tel" 
              id="phone" 
              required 
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210" 
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Required System / Panel Type
          </label>
          <select 
            id="service" 
            required 
            value={formData.service}
            onChange={handleChange}
            className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all cursor-pointer"
          >
            <option value="" className="bg-white text-slate-900" disabled>Select System or Service</option>
            
            <optgroup label="Products" className="bg-white font-semibold text-slate-500">
              {productsList.map(p => (
                <option key={p.id} value={p.id} className="bg-white text-slate-900">
                  {p.name}
                </option>
              ))}
            </optgroup>

            <optgroup label="Services" className="bg-white font-semibold text-slate-500">
              {servicesList.map(s => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">
                  {s.title}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Describe Requirements
          </label>
          <textarea 
            id="message" 
            rows="4" 
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Please specify capacity, enclosure type, and any single line diagram details..." 
            className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan focus:ring-1 focus:ring-industrial-cyan/20 outline-none rounded-md px-4 py-3 text-sm text-slate-900 transition-all resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full py-4 bg-industrial-cyan text-white hover:bg-slate-900 font-bold rounded-md text-sm transition-all duration-300 tracking-wider uppercase font-heading disabled:opacity-50 shadow-md shadow-industrial-cyan/10"
        >
          {submitting ? t('sendingButton') : t('getQuote')}
        </button>

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md text-center text-xs font-semibold">
            Inquiry submitted successfully! Our engineering team will contact you shortly.
          </div>
        )}
      </form>
    </div>
  );
}
