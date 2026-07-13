import React, { useState } from 'react';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { FaFilePdf, FaDownload, FaLock, FaTimes } from 'react-icons/fa';

export default function Downloads() {
  const documents = [
    { id: "corp-profile", name: "Corporate Profile PDF", file: "corporate-profile.pdf", size: "4.8 MB", desc: "Company profile, licensing details, and machinery layouts." },
    { id: "plc-layout", name: "PLC Technical Specification Sheets", file: "plc-panels-catalog.pdf", size: "3.2 MB", desc: "Technical drawings and switchgear specs for PLC control panels." },
    { id: "apfc-model", name: "APFC Savings Model Calculators", file: "apfc-catalog.pdf", size: "1.5 MB", desc: "Reactive load parameter tables and capacitor bank calculations." },
    { id: "earth-guide", name: "Surge Earthing Design Guidelines", file: "earthing-specs.pdf", size: "2.1 MB", desc: "Chemical earthing installation guidelines and site safety codes." }
  ];

  const [activeDoc, setActiveDoc] = useState(null); // Document object or null
  const [form, setForm] = useState({ name: '', company: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpenGate = (doc) => {
    setActiveDoc(doc);
  };

  const handleCloseGate = () => {
    setActiveDoc(null);
    setForm({ name: '', company: '', email: '' });
  };

  const handleDownload = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        // Trigger simulated file download
        const mockLink = document.createElement('a');
        mockLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Simulated Gated Document Content');
        mockLink.download = activeDoc.file;
        document.body.appendChild(mockLink);
        mockLink.click();
        document.body.removeChild(mockLink);

        handleCloseGate();
        setSuccess(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Resource Downloads" 
        subtitle="Access product catalogs, technical manuals, and specification sheets."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-8 shadow-md flex flex-col justify-between hover:border-industrial-cyan/25 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FaFilePdf className="text-red-500 text-3.5xl" />
                    <span className="text-[10px] text-slate-550 uppercase font-heading font-medium tracking-wide bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {doc.size}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      {doc.name}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-2">
                      {doc.desc}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 mt-6 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase font-heading font-semibold">
                    <FaLock /> Gated Download
                  </span>
                  <button 
                    onClick={() => handleOpenGate(doc)}
                    className="px-4 py-2 bg-industrial-cyan text-white hover:bg-slate-900 font-bold rounded text-xs transition-colors flex items-center gap-2 uppercase tracking-wider font-heading shadow-md shadow-industrial-cyan/10"
                  >
                    <FaDownload size={10} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Gated Access Modal Overlay */}
      {activeDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-[scaleIn_0.3s_ease]">
            <button 
              onClick={handleCloseGate}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">Unlock Document</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Enter your contact information to access the file: <br /><strong>{activeDoc.name}</strong>
            </p>

            <form onSubmit={handleDownload} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar" 
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan outline-none rounded p-3 text-slate-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-500 uppercase tracking-wider">Company / Firm Name</label>
                <input 
                  type="text" 
                  required 
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Siemens Projects Ltd" 
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan outline-none rounded p-3 text-slate-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. rajesh@company.com" 
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-industrial-cyan outline-none rounded p-3 text-slate-900 transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 bg-industrial-cyan text-white hover:bg-slate-900 font-bold rounded uppercase tracking-wider font-heading mt-2 disabled:opacity-50 shadow-md shadow-industrial-cyan/10"
              >
                {submitting ? 'Checking details...' : 'Submit & Download PDF'}
              </button>

              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded text-center font-semibold">
                  Verification successful. Initiating download...
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <CTASection />
    </div>
  );
}
