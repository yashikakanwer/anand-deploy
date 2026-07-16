import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { db } from './utils/db';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWidgets from './components/layout/FloatingWidgets';

// Pages components
import Home from './pages/Home';
import About from './pages/About';
import Leadership from './pages/Leadership';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Industries from './pages/Industries';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Downloads from './pages/Downloads';
import Quote from './pages/Quote';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/cpanel');

  // Track page visits
  useEffect(() => {
    if (!isAdmin) {
      let device = 'Desktop';
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        device = 'Mobile';
      } else if (/Tablet|iPad/i.test(navigator.userAgent)) {
        device = 'Tablet';
      }
      db.logPageVisit(location.pathname, device);
    }
  }, [location.pathname, isAdmin]);

  if (isAdmin) {
    return (
      <main className="h-screen w-full overflow-hidden bg-slate-50">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/cpanel" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="bg-industrial-bg text-industrial-white font-body min-h-screen flex flex-col justify-between">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mega Footer */}
      <Footer />

      {/* Floating Communication Widgets */}
      <FloatingWidgets />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
