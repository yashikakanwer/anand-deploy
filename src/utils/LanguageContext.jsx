import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navbar & Header
    home: "Home",
    about: "About",
    leadership: "Leadership",
    products: "Products",
    services: "Services",
    projects: "Projects",
    industries: "Industries",
    getQuote: "Get Quote",
    adminLogin: "Admin Login",
    followUs: "Follow Us:",
    getFreeConsultation: "Get Free Consultation",
    allProducts: "All Products",
    allServices: "All Services",
    exploreServices: "Explore Services",
    viewAllProducts: "View All Products",
    contactUs: "Contact Us",
    downloads: "Downloads",
    gallery: "Gallery",

    // Footer
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    adminPortal: "Admin Portal",
    rightsReserved: "Anand Electricals & Engineers Pvt Ltd. All rights reserved.",

    // Floating Widgets
    floatingCall: "Call Us",
    floatingWhatsapp: "WhatsApp Us",
    floatingEmail: "Email Us",

    // Home Page Hero
    heroTagline: "Safe & Reliable Electrical Solutions",
    heroTitle: "High-Quality Switchgear & Custom Control Panels.",
    heroDescription: "Durable, safe, and efficient electrical panels engineered to minimize line losses and prevent power interruptions.",
    requestQuote: "Request a Quote",

    // About Section
    aboutUsTitle: "Trusted Electrical Solutions for Industrial Factories & Buildings",
    aboutUsDescription1: "Anand Electricals & Engineers is a highly reliable electrical contracting firm. We specialize in designing and manufacturing high-durability distribution panels and safety enclosures that protect against short circuits.",
    aboutUsDescription2: "Our products are built with high-quality sheet metal, using automated manufacturing machines for precision and safety. All installations are completely shock-proof and built to last.",
    learnMoreAboutUs: "Learn More About Us",

    // Features
    shockproofTitle: "Shockproof & Safe Design",
    shockproofDesc: "All products undergo strict insulation testing to eliminate short-circuit and leakage hazards.",
    durableTitle: "Durable Metal Enclosures",
    durableDesc: "Heavy-duty CRCA steel cabinets designed to protect switches from dust, rust, and water ingress.",
    govApprovedTitle: "Government Approved (Grade-A)",
    govApprovedDesc: "Licensed A-Grade electrical contractor trusted by regional utilities and private developers.",

    // Capabilities Section
    capabilitiesTagline: "Our Capabilities",
    capabilitiesTitle: "Industrial Switchgear & Panel Systems",

    // Stats
    yearsOfService: "Years of Service",
    completedProjects: "Completed Projects",
    happyClients: "Happy Clients",
    staffMembers: "Staff Members",

    // CTA Section
    partnerTagline: "Partner with Us",
    partnerTitle: "Ready to Power Your Next Industrial Project?",
    partnerDesc: "Get in touch with our electrical contracting team to receive customized switchgear layouts and itemized estimations.",
    requestGatedQuote: "Request Gated Quote",
    scheduleConsultation: "Schedule a Consultation",

    // Contact Page & Form
    contactTitle: "Get in Touch",
    contactSub: "Write to us and our representative will respond within 24 hours.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phone: "Phone Number",
    subject: "Subject",
    message: "Message",
    sendButton: "Send Message",
    sendingButton: "Sending...",
  },
  hinglish: {
    // Navbar & Header
    home: "Home",
    about: "About Us",
    leadership: "Leadership",
    products: "Products",
    services: "Services",
    projects: "Projects",
    industries: "Industries",
    getQuote: "Estimate Lein",
    adminLogin: "Admin Login",
    followUs: "Follow Karein:",
    getFreeConsultation: "Free Consultation",
    allProducts: "Sare Products",
    allServices: "Sari Services",
    exploreServices: "Services Dekhein",
    viewAllProducts: "Sare Products Dekhein",
    contactUs: "Contact Karein",
    downloads: "Downloads",
    gallery: "Gallery",

    // Footer
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    adminPortal: "Admin Portal",
    rightsReserved: "Anand Electricals & Engineers Pvt Ltd. Sabhi adhikar surakshit hain.",

    // Floating Widgets
    floatingCall: "Call Karein",
    floatingWhatsapp: "WhatsApp Karein",
    floatingEmail: "Email Karein",

    // Home Page Hero
    heroTagline: "Safe aur Reliable Electrical Solutions",
    heroTitle: "High-Quality Switchgear aur Custom Control Panels.",
    heroDescription: "Mazboot, safe aur efficient electrical panels jo line losses aur power cuts ko rokte hain.",
    requestQuote: "Estimate Pucho",

    // About Section
    aboutUsTitle: "Industrial Factories aur Buildings ke liye Bharosemand Electrical Solutions",
    aboutUsDescription1: "Anand Electricals & Engineers ek bohot hi trusted electrical contracting firm hai. Hum high-durability distribution panels aur safety enclosures banane mein specialize karte hain jo short circuits se bachate hain.",
    aboutUsDescription2: "Hamare products high-quality sheet metal se bane hote hain, aur absolute precision ke liye automated machines ka use kiya jata hai. Sabhi installations shock-proof hote hain aur saalon-saal chalte hain.",
    learnMoreAboutUs: "Hamare Baare Mein Aur Jaanein",

    // Features
    shockproofTitle: "Shockproof aur Safe Design",
    shockproofDesc: "Sabhi products strict insulation testing se guzarte hain taaki short-circuit ka koi darr na rahe.",
    durableTitle: "Mazboot Metal Enclosures",
    durableDesc: "Heavy-duty CRCA steel cabinets jo switches ko mitti, zang aur paani se surakshit rakhte hain.",
    govApprovedTitle: "Government Approved (Grade-A)",
    govApprovedDesc: "Licensed A-Grade electrical contractor jise regional utilities aur private developers trust karte hain.",

    // Capabilities Section
    capabilitiesTagline: "Hamari Capabilities",
    capabilitiesTitle: "Industrial Switchgear aur Panel Systems",

    // Stats
    yearsOfService: "Saal ka Anubhav",
    completedProjects: "Poore Kiye Projects",
    happyClients: "Happy Clients",
    staffMembers: "Staff Members",

    // CTA Section
    partnerTagline: "Hamare Sath Judein",
    partnerTitle: "Kya aap apne agle Industrial Project ke liye taiyar hain?",
    partnerDesc: "Hamari electrical contracting team se contact karein taaki aapko custom panel layouts aur estimates mil sakein.",
    requestGatedQuote: "Quote Request Karein",
    scheduleConsultation: "Salah Ke Liye Time Lein",

    // Contact Page & Form
    contactTitle: "Contact Karein",
    contactSub: "Humein likhein aur hum 24 ghante ke andar reply karenge.",
    fullName: "Pura Naam",
    emailAddress: "Email Address",
    phone: "Phone Number",
    subject: "Subject",
    message: "Message",
    sendButton: "Message Bhejein",
    sendingButton: "Bhej rahe hain...",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved === 'hinglish' ? 'hinglish' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
