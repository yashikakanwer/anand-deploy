import React, { useState } from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { FaBriefcase, FaUpload } from 'react-icons/fa';
import { db } from '../utils/db';

export default function Careers() {
  const jobs = db.getJobs();

  const [form, setForm] = useState({ name: '', email: '', phone: '', position: jobs[0]?.title || 'General Application', cvName: '', cvFile: null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Save application to DB
      await db.addApplication({
        name: form.name,
        email: form.email,
        phone: form.phone || 'N/A',
        jobTitle: form.position,
        cvName: form.cvName || 'resume_uploaded.pdf',
        cvFile: form.cvFile
      });
      
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', position: jobs[0]?.title || 'General Application', cvName: '', cvFile: null });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Application submission failed. Please check network connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Careers at Anand Electricals" 
        subtitle="Join our engineering team and build high-voltage power networks."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Jobs List Column */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-heading font-bold text-2.5xl text-slate-900 mb-6">
              Active Vacancies
            </h2>
            
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200/60 rounded-xl p-8 space-y-4 shadow-md">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">
                        {job.title}
                      </h3>
                      <span className="text-xs text-industrial-cyan font-heading font-semibold uppercase tracking-wider block mt-1">
                        {job.location} • {job.type}
                      </span>
                    </div>
                    <FaBriefcase className="text-industrial-cyan text-xl flex-shrink-0" />
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    <strong>Requirements:</strong> {job.reqs}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Form Sidebar Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-6 shadow-md space-y-6">
              <div>
                <h4 className="font-heading font-semibold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-3">
                  Quick Application
                </h4>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Submit details. Our HR coordinator will review and contact you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider">Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-3 py-2.5 outline-none focus:border-industrial-cyan text-slate-900 cursor-pointer"
                  >
                    {jobs.map((job) => (
                      <option key={job.id || job.title} value={job.title}>{job.title}</option>
                    ))}
                    <option value="General Application">General / Other Positions</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-3 py-2.5 outline-none focus:border-industrial-cyan text-slate-900" 
                    placeholder="Rajesh Kumar"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-3 py-2.5 outline-none focus:border-industrial-cyan text-slate-900" 
                    placeholder="rajesh@gmail.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                  <input 
                    type="tel" 
                    required 
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-3 py-2.5 outline-none focus:border-industrial-cyan text-slate-900" 
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider">Resume Upload</label>
                  <div className="border border-dashed border-slate-300 hover:border-industrial-cyan rounded p-4 text-center cursor-pointer relative group flex flex-col justify-center items-center bg-white">
                    <FaUpload className="text-industrial-cyan mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-slate-500">
                      {form.cvName ? `Selected: ${form.cvName}` : "Drag or click to choose PDF"}
                    </span>
                    <input 
                      type="file" 
                      required={!form.cvName}
                      onChange={(e) => setForm({ ...form, cvName: e.target.files[0]?.name || '', cvFile: e.target.files[0] })}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-industrial-cyan text-white hover:bg-slate-900 font-bold rounded uppercase tracking-wider font-heading shadow-md shadow-industrial-cyan/10"
                >
                  {submitting ? 'Submitting...' : 'Apply Now'}
                </button>

                {success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold rounded text-center text-[10px]">
                    Application submitted successfully.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </section>

      <CTASection />
    </div>
  );
}
