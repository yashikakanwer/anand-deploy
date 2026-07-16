import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaEnvelope, FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { db } from '../../utils/db';
import logoImg from '../../assets/logo.png';
import { useLanguage } from '../../utils/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const productsData = db.getProducts();
  const servicesData = db.getServices();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'products' or 'services' or null
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(null);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = (menu) => {
    if (dropdownOpen === menu) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(menu);
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'text-industrial-cyan' : 'text-slate-700';
    }
    return location.pathname.startsWith(path) ? 'text-industrial-cyan' : 'text-slate-700';
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-md' 
        : 'bg-white border-b border-slate-100'
    }`}>
      {/* Top Header Bar */}
      <div className={`w-full bg-[#0a0f18] text-white text-[11px] md:text-xs flex justify-between items-center relative overflow-hidden transition-all duration-300 ${
        scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
      }`}>
        {/* Left Orange slanted segment */}
        <div className="topbar-left-slant bg-industrial-cyan h-full flex items-center pl-6 md:pl-12 pr-16 gap-6 font-semibold font-heading select-all w-fit min-w-[55%]">
          <a href="mailto:anandelectricalsoffice@gmail.com" className="flex items-center gap-2 hover:text-[#0a0f18] transition-colors">
            <FaEnvelope /> <span>anandelectricalsoffice@gmail.com</span>
          </a>
          <a href="tel:+917689057259" className="flex items-center gap-2 hover:text-[#0a0f18] transition-colors">
            <FaPhoneAlt /> <span>+91 76890 57259</span>
          </a>
          <span className="text-[#0a0f18]/30">|</span>
          <a href="tel:+919001347691" className="flex items-center gap-2 hover:text-[#0a0f18] transition-colors">
            <span>+91 90013 47691</span>
          </a>
        </div>

        {/* Right segment with social media links */}
        <div className="flex items-center gap-4 pr-6 md:pr-12 h-full z-10">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#0a0f18] border border-slate-800 text-slate-350 text-[11px] px-2 py-0.5 rounded cursor-pointer hover:border-industrial-cyan transition-colors focus:outline-none font-semibold mr-2"
          >
            <option value="en">English</option>
            <option value="hinglish">Hinglish</option>
          </select>
          <span className="text-slate-400 font-medium">{t('followUs')}</span>
          <div className="flex items-center gap-3.5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-industrial-cyan transition-colors" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-industrial-cyan transition-colors" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-industrial-cyan transition-colors" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-industrial-cyan transition-colors" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={logoImg} alt="Anand Electricals" className="h-9 md:h-11 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden xl:flex items-center gap-5">
          <ul className="flex items-center gap-5 font-body text-xs font-semibold uppercase tracking-wider">
            <li>
              <Link to="/" className={`hover:text-industrial-cyan transition-colors ${isActive('/')}`}>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className={`hover:text-industrial-cyan transition-colors ${isActive('/about')}`}>
                {t('about')}
              </Link>
            </li>
            <li>
              <Link to="/leadership" className={`hover:text-industrial-cyan transition-colors ${isActive('/leadership')}`}>
                {t('leadership')}
              </Link>
            </li>
            
            {/* Products Dropdown */}
            <li className="relative group">
              <button 
                className={`flex items-center gap-1 hover:text-industrial-cyan transition-colors outline-none ${isActive('/products')}`}
                onClick={() => toggleDropdown('products')}
              >
                {t('products')} <FaChevronDown className="text-[10px] group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-slate-100 rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl backdrop-blur-lg">
                <div className="grid grid-cols-1 gap-1">
                  {productsData.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/products/${prod.slug}`}
                      className="px-4 py-2 text-xs text-slate-600 hover:text-industrial-cyan hover:bg-slate-50 rounded-md transition-colors"
                    >
                      {prod.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/products" className="px-4 py-2 text-xs text-industrial-cyan hover:text-industrial-cyan/80 transition-colors font-semibold">
                    {t('viewAllProducts')}
                  </Link>
                </div>
              </div>
            </li>

            {/* Services Dropdown */}
            <li className="relative group">
              <button 
                className={`flex items-center gap-1 hover:text-industrial-cyan transition-colors outline-none ${isActive('/services')}`}
                onClick={() => toggleDropdown('services')}
              >
                {t('services')} <FaChevronDown className="text-[10px] group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-slate-100 rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl backdrop-blur-lg">
                <div className="grid grid-cols-1 gap-1">
                  {servicesData.map((serv) => (
                    <span
                      key={serv.id}
                      className="px-4 py-2 text-xs text-slate-600 hover:text-industrial-cyan hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/services#${serv.slug}`}
                    >
                      {serv.title}
                    </span>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/services" className="px-4 py-2 text-xs text-industrial-cyan hover:text-industrial-cyan/80 transition-colors font-semibold">
                    {t('exploreServices')}
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <Link to="/projects" className={`hover:text-industrial-cyan transition-colors ${isActive('/projects')}`}>
                {t('projects')}
              </Link>
            </li>
            <li>
              <Link to="/industries" className={`hover:text-industrial-cyan transition-colors ${isActive('/industries')}`}>
                {t('industries')}
              </Link>
            </li>

          </ul>
        </nav>

        {/* Action Button & Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/quote" className="hidden sm:inline-flex px-5 py-2.5 bg-industrial-cyan text-white hover:bg-slate-900 transition-all font-semibold rounded-md text-xs tracking-wider uppercase font-heading shadow-md shadow-industrial-cyan/10">
            {t('getQuote')}
          </Link>
          
          <button 
            onClick={toggleMenu}
            className="xl:hidden p-2 text-slate-800 hover:text-industrial-cyan transition-colors outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`xl:hidden absolute top-full left-0 w-full h-[calc(100vh-100%)] bg-white border-t border-slate-100 transition-all duration-300 z-40 ${
        isOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'
      }`}>
        <nav className="p-8 h-full overflow-y-auto">
          <ul className="flex flex-col gap-6 font-body text-base font-semibold">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'text-industrial-cyan' : 'text-slate-700'}>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname.startsWith('/about') ? 'text-industrial-cyan' : 'text-industrial-muted'}>
                {t('about')}
              </Link>
            </li>
            <li>
              <Link to="/leadership" className={location.pathname.startsWith('/leadership') ? 'text-industrial-cyan' : 'text-industrial-muted'}>
                {t('leadership')}
              </Link>
            </li>
            
            {/* Products Mobile Collapsible */}
            <li>
              <button 
                onClick={() => toggleDropdown('products')}
                className="flex items-center justify-between w-full text-industrial-muted"
              >
                {t('products')} <FaChevronDown className={`text-xs transition-transform ${dropdownOpen === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen === 'products' && (
                <ul className="pl-4 mt-3 flex flex-col gap-3 border-l border-slate-100">
                  {productsData.map(prod => (
                    <li key={prod.id}>
                      <Link to={`/products/${prod.slug}`} className="text-sm font-medium text-industrial-muted hover:text-industrial-cyan">
                        {prod.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/products" className="text-sm text-industrial-cyan">
                      {t('allProducts')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Services Mobile Collapsible */}
            <li>
              <button 
                onClick={() => toggleDropdown('services')}
                className="flex items-center justify-between w-full text-industrial-muted"
              >
                {t('services')} <FaChevronDown className={`text-xs transition-transform ${dropdownOpen === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen === 'services' && (
                <ul className="pl-4 mt-3 flex flex-col gap-3 border-l border-slate-100">
                  {servicesData.map(serv => (
                    <li key={serv.id}>
                      <span 
                        onClick={() => window.location.href = `/services#${serv.slug}`}
                        className="text-sm font-medium text-industrial-muted hover:text-industrial-cyan cursor-pointer"
                      >
                        {serv.title}
                      </span>
                    </li>
                  ))}
                  <li>
                    <Link to="/services" className="text-sm text-industrial-cyan">
                      {t('allServices')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/projects" className={location.pathname.startsWith('/projects') ? 'text-industrial-cyan' : 'text-industrial-muted'}>
                {t('projects')}
              </Link>
            </li>
            <li>
              <Link to="/industries" className={location.pathname.startsWith('/industries') ? 'text-industrial-cyan' : 'text-industrial-muted'}>
                {t('industries')}
              </Link>
            </li>

            {/* Language Selection for Mobile */}
            <li className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase">Language</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded font-medium focus:outline-none focus:border-industrial-cyan"
              >
                <option value="en">English</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </li>

            <li className="pt-4 border-t border-slate-100">
              <Link to="/quote" className="flex justify-center py-3 bg-industrial-cyan text-white font-semibold rounded-md uppercase text-center text-sm font-heading shadow-md shadow-industrial-cyan/10">
                {t('getFreeConsultation')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
