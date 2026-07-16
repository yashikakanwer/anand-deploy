import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { db } from '../../utils/db';
import logoImg from '../../assets/logo.png';
import { useLanguage } from '../../utils/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const productsData = db.getProducts();
  return (
    <footer id="footer" className="bg-[#0a0f18] border-t border-slate-900 pt-20 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Information & Socials */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center bg-white rounded px-2.5 py-1.5 w-fit shadow-md">
            <img src={logoImg} alt="Anand Electricals" className="h-8 w-auto object-contain" />
          </Link>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Manufacturing safe, certified control panels and industrial earthing systems for factories and commercial buildings since 2008.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-slate-800 hover:border-industrial-cyan bg-white/2 hover:bg-industrial-cyan/10 text-slate-400 hover:text-industrial-cyan flex items-center justify-center transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-slate-800 hover:border-industrial-cyan bg-white/2 hover:bg-industrial-cyan/10 text-slate-400 hover:text-industrial-cyan flex items-center justify-center transition-all"
              aria-label="Twitter"
            >
              <FaTwitter size={18} />
            </a>
          </div>
        </div>

        {/* Solutions Links */}
        <div>
          <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-6">Solutions</h4>
          <ul className="flex flex-col gap-3">
            {productsData.slice(0, 6).map((prod) => (
              <li key={prod.id}>
                <Link to={`/products/${prod.slug}`} className="text-slate-400 hover:text-industrial-cyan transition-colors">
                  {prod.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Download portal links */}
        <div>
          <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-6">Download Center</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/downloads" className="text-slate-400 hover:text-industrial-cyan transition-colors">
                Corporate Profile PDF
              </Link>
            </li>
            <li>
              <Link to="/downloads" className="text-slate-400 hover:text-industrial-cyan transition-colors">
                PLC Technical Layouts
              </Link>
            </li>
            <li>
              <Link to="/downloads" className="text-slate-400 hover:text-industrial-cyan transition-colors">
                APFC Savings Sheets
              </Link>
            </li>
            <li>
              <Link to="/downloads" className="text-slate-400 hover:text-industrial-cyan transition-colors">
                Surge Earthing Design
              </Link>
            </li>
          </ul>
        </div>

        {/* Office Contact Info & Map Vector */}
        <div>
          <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-6">Head Office</h4>
          <div className="flex flex-col gap-3 text-slate-400 mb-6">
            <div className="flex gap-3">
              <FaMapMarkerAlt className="text-industrial-cyan mt-1 flex-shrink-0" />
              <span>S.No. 5, Near Ranisati Dharmkanta, Sarna Industrial Area, Jaipur, Rajasthan - 302012</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-industrial-cyan flex-shrink-0" />
              <a href="mailto:anandelectricalsoffice@gmail.com" className="hover:text-industrial-cyan transition-colors">
                anandelectricalsoffice@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-industrial-cyan mt-1 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <a href="tel:+917689057259" className="hover:text-industrial-cyan transition-colors">
                  +91 76890 57259
                </a>
                <a href="tel:+919001347691" className="hover:text-industrial-cyan transition-colors">
                  +91 90013 47691
                </a>
              </div>
            </div>
          </div>

          {/* Map Vector Widget */}
          <div className="relative h-28 rounded-lg border border-slate-800 overflow-hidden bg-slate-900/50 flex flex-col justify-center items-center p-4">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-pulse z-10"></span>
            <span className="w-8 h-8 border border-red-500/30 rounded-full absolute animate-[ping_2s_infinite] pointer-events-none"></span>
            <div className="text-[10px] text-slate-500 mt-2 font-mono tracking-wide z-10 uppercase">
              Jaipur HQ Grid Node
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} {t('rightsReserved')}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-industrial-cyan transition-colors">{t('privacyPolicy')}</a>
          <a href="#" className="hover:text-industrial-cyan transition-colors">{t('termsOfService')}</a>
        </div>
      </div>
    </footer>
  );
}
