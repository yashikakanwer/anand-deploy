import React, { useState, useEffect } from 'react';
import { db } from '../utils/db';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBoxOpen, FaBuilding, FaCogs, FaNewspaper, 
  FaInbox, FaFileAlt, FaBriefcase, FaSignOutAlt, FaPlus, 
  FaEdit, FaTrash, FaExternalLinkAlt, FaCheck, FaTimes, 
  FaSearch, FaFilter, FaInfoCircle, FaCalendarAlt, FaUser, 
  FaPhoneAlt, FaEnvelope, FaExclamationTriangle, FaEye, FaWhatsapp
} from 'react-icons/fa';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Check login status on load
  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      db.loadAdminData()
        .catch((err) => {
          console.warn('Failed to load admin data on init, but keeping session active:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Reset scroll to top when tab changes to prevent layout shifts/jumps
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-industrial-cyan"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={(u) => setUser(u)} />;
  }

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  return (
    <div className="bg-slate-50 text-slate-800 h-screen w-full overflow-hidden flex flex-col md:flex-row antialiased font-body">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-grow min-w-0 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Topbar */}
        <Topbar activeTab={activeTab} user={user} onLogout={handleLogout} />

        {/* Tab View */}
        <main className="p-6 md:p-10 flex-grow">
          {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'inquiries' && <InquiriesTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'jobs' && <JobsTab />}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   LOGIN SCREEN COMPONENT
   ========================================================================== */
function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await db.login(username, password);
      if (user) {
        db.loadAdminData().catch((loadErr) => {
          console.warn('Failed to load admin data during login:', loadErr);
        });
        onLoginSuccess(user);
      } else {
        setError('Invalid username or password.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden font-body">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#EA580C_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-industrial-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10">
        {/* Color stripe */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>

        <div className="text-center mb-8">
          <div className="text-3xl font-heading font-extrabold text-white tracking-wider flex items-center justify-center gap-2">
            ANAND <span className="text-orange-500 font-normal">ELECTRICALS</span>
          </div>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-mono">Control Panel Center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full bg-slate-950/65 border border-slate-800 focus:border-orange-500 outline-none rounded-lg px-4 py-3 text-sm text-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/65 border border-slate-800 focus:border-orange-500 outline-none rounded-lg px-4 py-3 text-sm text-white transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <FaExclamationTriangle className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm transition-all tracking-wider uppercase font-heading disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-600/10"
          >
            {loading ? 'Authorizing Connection...' : 'Enter Control Room'}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-slate-800/80 pt-6">
          <Link to="/" className="text-slate-500 hover:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-600 font-mono mt-8 uppercase tracking-widest">
        SECURE GATEWAY NODE LOCK V2.6
      </p>
    </div>
  );
}

/* ==========================================================================
   SIDEBAR COMPONENT
   ========================================================================== */
function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
    { id: 'projects', label: 'Project', icon: <FaBuilding /> },
    { id: 'services', label: 'Services', icon: <FaCogs /> },
    { id: 'inquiries', label: 'Inquiries', icon: <FaInbox />, countKey: 'inquiries' },
    { id: 'applications', label: 'Applications', icon: <FaFileAlt />, countKey: 'applications' },
    { id: 'jobs', label: 'Careers/Jobs', icon: <FaBriefcase /> }
  ];

  const getUnreadCount = (key) => {
    if (key === 'inquiries') {
      return db.getInquiries().filter(i => i.status === 'Pending').length;
    }
    if (key === 'applications') {
      return db.getApplications().filter(a => a.status === 'Pending').length;
    }
    return 0;
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center text-white w-full sticky top-0 z-50">
        <div className="text-lg font-heading font-extrabold tracking-wider">
          ANAND <span className="text-orange-500">ADMIN</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
        >
          {isOpen ? <FaTimes size={18} /> : <FaFilter size={18} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 z-50 transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo Branding */}
          <div className="p-6 border-b border-slate-800 flex flex-col items-start gap-1 bg-slate-950/40">
            <span className="text-[10px] font-semibold text-orange-500 font-mono tracking-widest uppercase">HQ Control Panel</span>
            <h1 className="text-xl font-heading font-extrabold text-white tracking-wider">
              ANAND <span className="text-orange-500 font-normal">ELECTRICALS</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map((item) => {
              const active = activeTab === item.id;
              const count = item.countKey ? getUnreadCount(item.countKey) : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                    ${active 
                      ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/10' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {count > 0 && (
                    <span className={`
                      text-[10px] px-2 py-0.5 rounded-full font-bold
                      ${active ? 'bg-white text-orange-600' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}
                    `}>
                      {count} new
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-heading font-bold text-sm text-white">
              {user.name[0]}
            </div>
            <div>
              <span className="text-xs font-semibold text-white block leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block">{user.role}</span>
            </div>
          </div>

          <button 
            onClick={onLogout}
            title="Log Out"
            className="p-2 border border-slate-800 hover:border-red-500/35 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-all cursor-pointer"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>
      </aside>
    </>
  );
}

/* ==========================================================================
   TOPBAR COMPONENT
   ========================================================================== */
function Topbar({ activeTab, user, onLogout }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Hardware & Products Catalog';
      case 'projects': return 'Project Management';
      case 'services': return 'Contracting Services';
      case 'blogs': return 'Blogs & Technical Guides';
      case 'inquiries': return 'Inquiries Box';
      default: return 'Control Center';
    }
  };

  const getSystemTime = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center sticky top-0 z-30">
      <div>
        <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-900 tracking-tight">
          {getTabTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-500 font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded">
          Date: {getSystemTime()}
        </span>
        <span className="text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Database Online
        </span>
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1 rounded transition-colors font-medium flex items-center gap-1"
        >
          View Site <FaExternalLinkAlt size={10} />
        </a>
      </div>
    </header>
  );
}

/* ==========================================================================
   TAB: DASHBOARD OVERVIEW
   ========================================================================== */
function VisitorStatsCard() {
  const [visitorFilter, setVisitorFilter] = useState('Today'); // 'Today', '7Days', 'Month'
  const visitors = db.getVisitors();

  const getFilteredLogs = () => {
    const now = new Date();
    const todayStr = now.toDateString();
    
    if (visitorFilter === 'Today') {
      return visitors.filter(log => new Date(log.date).toDateString() === todayStr);
    }
    if (visitorFilter === '7Days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return visitors.filter(log => new Date(log.date) >= sevenDaysAgo);
    }
    return visitors;
  };

  const filteredLogs = getFilteredLogs();

  // Calculate real counts
  const now = new Date();
  const todayStr = now.toDateString();
  const todayCount = visitors.filter(v => new Date(v.date).toDateString() === todayStr).length;
  
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysCount = visitors.filter(v => new Date(v.date) >= sevenDaysAgo).length;

  const totalCount = visitors.length;

  const formatLogTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="font-heading font-bold text-base text-slate-900">
          Visitor Statistics (Log Column)
        </h3>
        
        <select
          value={visitorFilter}
          onChange={(e) => setVisitorFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-705 cursor-pointer outline-none focus:border-orange-500 font-semibold"
        >
          <option value="Today">Today (Aaj)</option>
          <option value="7Days">Last 7 Days (7 Din)</option>
          <option value="Month">Monthly (Mahina)</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center font-mono">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Today</span>
          <span className="text-sm font-bold text-slate-800">{todayCount}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">7 Days</span>
          <span className="text-sm font-bold text-slate-800">{sevenDaysCount}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Total</span>
          <span className="text-sm font-bold text-slate-800">{totalCount}</span>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Visitor Log
        </span>
        <div className="space-y-2 h-[220px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-sans">
              No page visits recorded.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log._id || log.id} className="p-2.5 bg-slate-50 border border-slate-200/50 rounded-lg flex justify-between items-center text-[10px] font-mono text-slate-500">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">{log.ip}</span>
                    <span className="px-1 py-0.2 bg-slate-200 text-slate-600 rounded-sm text-[8px] font-sans font-semibold">{log.device}</span>
                  </div>
                  <span className="block text-slate-400 font-sans">Visited: <strong className="text-orange-600">{log.page}</strong></span>
                </div>
                <span className="text-slate-400 whitespace-nowrap text-right block text-[9px]">{formatLogTime(log.date)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ setActiveTab }) {
  const products = db.getProducts();
  const projects = db.getProjects();
  const services = db.getServices();
  const inquiries = db.getInquiries();
  const visitors = db.getVisitors();

  const todayStr = new Date().toDateString();
  const visitorsToday = visitors.filter(v => new Date(v.date).toDateString() === todayStr).length;

  const metrics = [
    { label: 'Total Products', value: products.length, icon: <FaBoxOpen />, tab: 'products' },
    { label: 'Project', value: projects.length, icon: <FaBuilding />, tab: 'projects' },
    { label: 'Active Services', value: services.length, icon: <FaCogs />, tab: 'services' },
    { label: 'Inquiries Box', value: inquiries.length, icon: <FaInbox />, tab: 'inquiries', highlight: inquiries.filter(i => i.status === 'Pending').length },
    { label: 'Visitors (Today)', value: visitorsToday, icon: <FaEye />, tab: 'dashboard' },
    { label: 'Visitors (Total)', value: visitors.length, icon: <FaEye />, tab: 'dashboard' }
  ];

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#EA580C_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] text-orange-500 font-mono tracking-widest uppercase">Administrative Console</span>
          <h2 className="text-2xl md:text-3.5xl font-heading font-extrabold tracking-tight">Welcome, Administrator</h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Configure system products, edit ongoing engineering projects, publish technical newsletters, and manage client RFQ requests from a single secure gateway.
          </p>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((m, idx) => (
          <button 
            key={idx}
            onClick={() => m.tab !== 'dashboard' && setActiveTab(m.tab)}
            className="bg-white border border-slate-200/80 hover:border-slate-350 rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between h-36 group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-3 rounded-lg text-slate-555 bg-slate-50 border border-slate-100 group-hover:text-orange-600 transition-colors">
                {m.icon}
              </span>
              {m.highlight > 0 && (
                <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  {m.highlight} NEW
                </span>
              )}
            </div>
            
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
                {m.label}
              </span>
              <span className="text-2xl font-heading font-extrabold text-slate-900 block leading-none">
                {m.value}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Section split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-heading font-bold text-base text-slate-900">Recent Transmission Inquiries</h3>
            <button 
              onClick={() => setActiveTab('inquiries')}
              className="text-xs text-orange-600 font-semibold hover:underline cursor-pointer"
            >
              Manage All Inquiries →
            </button>
          </div>

          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No recent inquiries received.
              </div>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="p-4 bg-slate-50 border border-slate-200/60 hover:bg-slate-100/50 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{inq.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">• {inq.company}</span>
                    </div>
                    <p className="text-slate-605 text-xs leading-relaxed line-clamp-1">{inq.message}</p>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Date: {new Date(inq.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span className={`
                      text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border
                      ${inq.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200/40' : ''}
                      ${inq.status === 'Contacted' ? 'bg-blue-50 text-blue-600 border-blue-200/40' : ''}
                      ${inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/40' : ''}
                    `}>
                      {inq.status}
                    </span>
                    <button 
                      onClick={() => setActiveTab('inquiries')}
                      className="p-1.5 border border-slate-200 hover:border-slate-350 hover:bg-white text-slate-555 hover:text-slate-800 rounded transition-all cursor-pointer"
                      title="Inspect Inquiry"
                    >
                      <FaEye size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visitor Stats Card */}
        <div className="lg:col-span-1">
          <VisitorStatsCard />
        </div>
      </div>
    </div>
  );
}
/* ==========================================================================
   TAB: PRODUCTS MANAGEMENT
   ========================================================================== */
function ProductsTab() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list', 'form'
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [specs, setSpecs] = useState([{ name: '', value: '' }]);
  const [features, setFeatures] = useState(['']);
  const [apps, setApps] = useState(['']);
  const [image, setImage] = useState('');
  const [catalog, setCatalog] = useState('');

  const loadProducts = () => {
    setProducts(db.getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddForm = () => {
    setEditProduct(null);
    setName('');
    setShortDesc('');
    setDesc('');
    setSpecs([{ name: '', value: '' }]);
    setFeatures(['']);
    setApps(['']);
    setImage('');
    setCatalog('');
    setView('form');
  };

  const openEditForm = (p) => {
    setEditProduct(p);
    setName(p.name);
    setShortDesc(p.shortDescription || '');
    setDesc(p.description || '');
    setSpecs(p.specs || [{ name: '', value: '' }]);
    setFeatures(p.features || ['']);
    setApps(p.applications || ['']);
    setImage(p.image || '');
    setCatalog(p.catalogName || '');
    setView('form');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      db.deleteProduct(id);
      loadProducts();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const productPayload = {
      name,
      shortDescription: shortDesc,
      description: desc,
      specs: specs.filter(s => s.name && s.value),
      features: features.filter(f => f.trim() !== ''),
      applications: apps.filter(a => a.trim() !== ''),
      image,
      catalogName: catalog
    };

    if (editProduct) {
      productPayload.id = editProduct.id;
      productPayload.slug = editProduct.slug;
    }

    try {
      await db.saveProduct(productPayload);
      alert('Product saved successfully.');
      setView('list');
      loadProducts();
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()))
  );

  if (view === 'form') {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-heading font-bold text-lg text-slate-905">
            {editProduct ? 'Edit Product Details' : 'Add New Product'}
          </h3>
          <button 
            type="button"
            onClick={() => setView('list')} 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-semibold cursor-pointer text-xs uppercase"
          >
            ← Cancel (Wapas)
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 uppercase tracking-wider block">Product Name (Samaan ka Naam)</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AMF Control Panel"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 uppercase tracking-wider block">Catalog PDF File Name</label>
              <input 
                type="text" 
                value={catalog}
                onChange={(e) => setCatalog(e.target.value)}
                placeholder="e.g. catalog.pdf"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Dual Image Input */}
          <div className="space-y-1.5 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
            <label className="font-semibold text-slate-600 uppercase tracking-wider block mb-2">Product Image (Photo Link ya Upload)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Option 1: Net se Photo ka URL link daalein</span>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://website.com/photo.jpg"
                  className="w-full bg-white border border-slate-200 outline-none focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Option 2: Apni computer se Photo file upload karein</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result); // Base64 data URL
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-white border border-slate-200 outline-none rounded px-3 py-1.5 text-slate-800"
                />
              </div>
            </div>
            {image && (
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">Image Preview:</span>
                <img src={image} alt="Preview" className="h-20 w-auto object-contain border border-slate-200 rounded p-1 bg-white" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-500 uppercase tracking-wider block">Short Summary (Ek line me Jankari)</label>
            <input 
              type="text" 
              required 
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Custom-fabricated power distribution box."
              className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-500 uppercase tracking-wider block">Full Details (Poori Jankari)</label>
            <textarea 
              rows="4" 
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe hardware details, busbar materials..."
              className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800 resize-none font-body text-xs"
            ></textarea>
          </div>

          {/* Specs Editor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <label className="font-semibold text-slate-900 uppercase tracking-wider">Technical Specifications (Samaan ki Naap/Details)</label>
              <button 
                type="button" 
                onClick={() => setSpecs([...specs, { name: '', value: '' }])}
                className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                + Add row (Nayi line jodein)
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input 
                    type="text" 
                    placeholder="Spec Name (e.g. Busbar)" 
                    value={spec.name}
                    onChange={(e) => {
                      const newSpecs = [...specs];
                      newSpecs[index].name = e.target.value;
                      setSpecs(newSpecs);
                    }}
                    className="w-1/2 bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
                  />
                  <input 
                    type="text" 
                    placeholder="Value (e.g. Copper)" 
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...specs];
                      newSpecs[index].value = e.target.value;
                      setSpecs(newSpecs);
                    }}
                    className="w-1/2 bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features and Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-105 pb-2">
                <label className="font-semibold text-slate-900 uppercase tracking-wider">Features</label>
                <button 
                  type="button" 
                  onClick={() => setFeatures([...features, ''])}
                  className="text-orange-600 font-semibold cursor-pointer"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feat, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="e.g. Powder coated finish" 
                      value={feat}
                      onChange={(e) => {
                        const newFeats = [...features];
                        newFeats[index] = e.target.value;
                        setFeatures(newFeats);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                    />
                    <button 
                      type="button" 
                      onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                      className="text-red-500 p-2 cursor-pointer"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-105 pb-2">
                <label className="font-semibold text-slate-900 uppercase tracking-wider">Applications</label>
                <button 
                  type="button" 
                  onClick={() => setApps([...apps, ''])}
                  className="text-orange-600 font-semibold cursor-pointer"
                >
                  + Add Sector
                </button>
              </div>
              <div className="space-y-2">
                {apps.map((app, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="e.g. Factories" 
                      value={app}
                      onChange={(e) => {
                        const newApps = [...apps];
                        newApps[index] = e.target.value;
                        setApps(newApps);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                    />
                    <button 
                      type="button" 
                      onClick={() => setApps(apps.filter((_, i) => i !== index))}
                      className="text-red-500 p-2 cursor-pointer"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setView('list')}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-550 rounded font-semibold transition-all cursor-pointer text-xs uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-all cursor-pointer shadow-md shadow-orange-600/10 text-xs uppercase"
            >
              {editProduct ? 'Save Changes' : 'Register Product'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <FaSearch size={12} />
          </span>
          <input 
            type="text" 
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-orange-500 outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 transition-all"
          />
        </div>

        <button 
          onClick={openAddForm}
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          <FaPlus size={10} /> Add New Product (Samaan)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold font-heading uppercase tracking-wider">
              <th className="px-6 py-4 w-20">Preview</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Brief Specs Snapshot</th>
              <th className="px-6 py-4 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">
                  No products found. Add a new one to get started.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 border border-slate-200 rounded overflow-hidden bg-white flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain p-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>
                      <span className="block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium block mt-0.5">/products/{p.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 line-clamp-1 mb-1">{p.shortDescription}</p>
                    <div className="flex gap-1.5 overflow-hidden flex-wrap max-h-5">
                      {p.specs?.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-500 border border-slate-200/60 px-2 py-0.5 rounded text-[10px] font-medium block whitespace-nowrap">
                          {s.name || s.split(':')[0]}: {s.value || s.split(':')[1]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/products/${p.slug}`} 
                        target="_blank"
                        className="p-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded text-slate-555 hover:text-slate-800 transition-all"
                        title="View details page"
                      >
                        <FaExternalLinkAlt size={10} />
                      </Link>
                      <button 
                        onClick={() => openEditForm(p)}
                        className="p-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded text-slate-555 hover:text-blue-650 transition-all cursor-pointer"
                        title="Edit specifications"
                      >
                        <FaEdit size={10} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 rounded text-slate-555 hover:text-red-650 transition-all cursor-pointer"
                        title="Delete product"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB: PROJECTS (CASE STUDIES) MANAGEMENT
   ========================================================================== */
function ProjectsTab() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list', 'form'
  const [editProject, setEditProject] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [scope, setScope] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  const [results, setResults] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Drag & Drop states
  const [isDragOverImage, setIsDragOverImage] = useState(false);
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);

  const loadProjects = () => {
    setProjects(db.getProjects());
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddForm = () => {
    setEditProject(null);
    setTitle('');
    setClient('');
    setLocation('');
    setYear('');
    setScope('');
    setChallenges('');
    setSolutions('');
    setResults('');
    setImages([]);
    setVideos([]);
    setImageUrlInput('');
    setVideoUrlInput('');
    setView('form');
  };

  const openEditForm = (p) => {
    setEditProject(p);
    setTitle(p.title || '');
    setClient(p.clientName || '');
    setLocation(p.location || '');
    setYear(p.completionYear || '');
    setScope(p.scope || '');
    setChallenges(p.challenges || '');
    setSolutions(p.solutions || '');
    setResults(p.results || '');
    
    // Backward compatibility for existing data
    const imgs = p.images ? [...p.images] : (p.image ? [p.image] : []);
    const vids = p.videos ? [...p.videos] : (p.videoUrl ? [p.videoUrl] : []);
    
    setImages(imgs);
    setVideos(vids);
    setImageUrlInput('');
    setVideoUrlInput('');
    setView('form');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      db.deleteProject(id);
      loadProjects();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      clientName: client,
      location,
      completionYear: year,
      scope,
      challenges,
      solutions,
      results,
      images,
      videos,
      // Store first image and video as single values for legacy pages support
      image: images[0] || '',
      videoUrl: videos[0] || ''
    };

    if (editProject) {
      payload.id = editProject.id;
      payload.slug = editProject.slug;
    }

    try {
      await db.saveProject(payload);
      alert('Project saved successfully.');
      setView('list');
      loadProjects();
    } catch (err) {
      alert('Failed to save project: ' + err.message);
    }
  };

  // Drag & Drop handlers for multiple images
  const handleImagesDrop = (e) => {
    e.preventDefault();
    setIsDragOverImage(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Drag & Drop handlers for multiple videos
  const handleVideosDrop = (e) => {
    e.preventDefault();
    setIsDragOverVideo(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setVideos(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // File Select handlers for multiple images
  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // File Select handlers for multiple videos
  const handleVideosSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setVideos(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const addVideoUrl = () => {
    if (videoUrlInput.trim()) {
      setVideos(prev => [...prev, videoUrlInput.trim()]);
      setVideoUrlInput('');
    }
  };

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  if (view === 'form') {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-heading font-bold text-lg text-slate-905">
            {editProject ? 'Edit Project Details' : 'Project Add (Naya Project)'}
          </h3>
          <button 
            type="button"
            onClick={() => setView('list')} 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-semibold cursor-pointer text-xs uppercase"
          >
            ← Cancel (Wapas)
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-550 uppercase tracking-wider block">Project Title</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Turnkey 132kV Substation Setup"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-550 uppercase tracking-wider block">Client Name</label>
              <input 
                type="text" 
                required 
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Tata Projects Ltd"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-550 uppercase tracking-wider block">Location (State/City)</label>
              <input 
                type="text" 
                required 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-550 uppercase tracking-wider block">Completion Year</label>
              <input 
                type="text" 
                required 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-550 uppercase tracking-wider block">Project Scope</label>
            <textarea 
              rows="3" 
              required
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Outline the scope of contracting execution..."
              className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
            {/* Image Upload Zone */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-550 uppercase tracking-wider block">Project Images ({images.length})</label>
                {images.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setImages([])} 
                    className="text-red-500 hover:text-red-700 font-semibold text-[10px] uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOverImage(true); }}
                onDragLeave={() => setIsDragOverImage(false)}
                onDrop={handleImagesDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragOverImage ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-slate-400 font-medium">Drag & drop project images here, or</div>
                  <label className="inline-block px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold uppercase cursor-pointer transition-all shadow-sm">
                    Browse Files
                    <input 
                      type="file" 
                      multiple
                      accept="image/*" 
                      onChange={handleImagesSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste Image URL here (e.g. https://example.com/img.jpg)"
                  className="flex-grow bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-2.5 py-1 text-slate-805 text-[11px]"
                />
                <button 
                  type="button" 
                  onClick={addImageUrl} 
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[10px] uppercase cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                          className="p-1 bg-red-600 text-white hover:bg-red-700 rounded-full shadow cursor-pointer flex items-center justify-center"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-mono">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload Zone */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-550 uppercase tracking-wider block">Project Videos ({videos.length})</label>
                {videos.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setVideos([])} 
                    className="text-red-500 hover:text-red-700 font-semibold text-[10px] uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOverVideo(true); }}
                onDragLeave={() => setIsDragOverVideo(false)}
                onDrop={handleVideosDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragOverVideo ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-slate-400 font-medium">Drag & drop project videos here (MP4/WebM), or</div>
                  <label className="inline-block px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold uppercase cursor-pointer transition-all shadow-sm">
                    Browse Files
                    <input 
                      type="file" 
                      multiple
                      accept="video/*" 
                      onChange={handleVideosSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="Paste Video URL / YouTube URL here"
                  className="flex-grow bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-2.5 py-1 text-slate-805 text-[11px]"
                />
                <button 
                  type="button" 
                  onClick={addVideoUrl} 
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[10px] uppercase cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              {videos.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                  {videos.map((vid, index) => {
                    const isYoutube = vid.includes('youtube.com') || vid.includes('youtu.be');
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 relative group">
                        <div className="w-16 h-12 bg-slate-950 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {isYoutube ? (
                            <span className="text-red-600 text-[10px] font-bold font-mono">YouTube</span>
                          ) : (
                            <video src={vid} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-grow text-[10px] font-mono truncate text-slate-650 max-w-[150px] sm:max-w-xs">
                          {vid}
                        </div>
                        <div className="flex-shrink-0">
                          <button 
                            type="button" 
                            onClick={() => setVideos(prev => prev.filter((_, i) => i !== index))}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded transition-all cursor-pointer"
                            title="Remove Video"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded font-mono">
                          #{index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h5 className="font-heading font-semibold text-slate-900 uppercase tracking-wider text-xs">Technical Case File Details</h5>
            
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">The Challenge</label>
                <textarea 
                  rows="2.5" 
                  required
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Specify environmental, physical or synchronization hurdles faced at site..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850 resize-none"
                ></textarea>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">The Solution</label>
                <textarea 
                  rows="2.5" 
                  required
                  value={solutions}
                  onChange={(e) => setSolutions(e.target.value)}
                  placeholder="Detail switchgear sizing, busbar configurations or custom engineering applied..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850 resize-none"
                ></textarea>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">The Result</label>
                <textarea 
                  rows="2" 
                  required
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="e.g. Grid commissioned 15 days ahead. Slashed current feedback loop limits..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850 resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setView('list')}
              className="px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-550 rounded font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-all cursor-pointer shadow-md shadow-orange-600/10"
            >
              {editProject ? 'Save Changes' : 'Project Add'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <FaSearch size={12} />
          </span>
          <input 
            type="text" 
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-orange-500 outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-slate-805 transition-all"
          />
        </div>

        <button 
          onClick={openAddForm}
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          <FaPlus size={10} /> Project Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold font-heading uppercase tracking-wider">
              <th className="px-6 py-4">Project / Client</th>
              <th className="px-6 py-4">Scope Summary</th>
              <th className="px-6 py-4">Location & Year</th>
              <th className="px-6 py-4 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-650">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">
                  No projects registered yet.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-905">
                    <div>
                      <span className="block">{p.title}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Client: {p.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 line-clamp-2 max-w-md">{p.scope}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span>{p.location} ({p.completionYear})</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/projects/${p.slug}`} 
                        target="_blank"
                        className="p-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded text-slate-550 hover:text-slate-805 transition-all"
                        title="View details page"
                      >
                        <FaExternalLinkAlt size={10} />
                      </Link>
                      <button 
                        onClick={() => openEditForm(p)}
                        className="p-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded text-slate-550 hover:text-blue-600 transition-all cursor-pointer"
                        title="Edit Details"
                      >
                        <FaEdit size={10} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 rounded text-slate-550 hover:text-red-650 transition-all cursor-pointer"
                        title="Delete Project"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
/* ==========================================================================
   TAB: SERVICES MANAGEMENT
   ========================================================================== */
function ServicesTab() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'form'
  const [editService, setEditService] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [feats, setFeats] = useState(['']);
  const [image, setImage] = useState('');

  const load = () => setServices(db.getServices());

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditService(null);
    setTitle('');
    setDesc('');
    setFeats(['']);
    setImage('');
    setView('form');
  };

  const openEdit = (s) => {
    setEditService(s);
    setTitle(s.title);
    setDesc(s.description || '');
    setFeats(s.features || ['']);
    setImage(s.image || '');
    setView('form');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this service?')) {
      db.deleteService(id);
      load();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description: desc,
      features: feats.filter(f => f.trim() !== ''),
      image
    };

    if (editService) {
      payload.id = editService.id;
      payload.slug = editService.slug;
    }

    try {
      await db.saveService(payload);
      alert('Service saved successfully.');
      setView('list');
      load();
    } catch (err) {
      alert('Failed to save service: ' + err.message);
    }
  };

  if (view === 'form') {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-heading font-bold text-lg text-slate-900">
            {editService ? 'Edit Service Kaam' : 'Add New Service Kaam'}
          </h3>
          <button 
            type="button"
            onClick={() => setView('list')} 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-semibold cursor-pointer text-xs uppercase"
          >
            ← Cancel (Wapas)
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-700">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-500 uppercase tracking-wider block">Service Title (Kaam ka Naam)</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chemical Earthing"
              className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
            />
          </div>

          {/* Dual Image Input */}
          <div className="space-y-1.5 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
            <label className="font-semibold text-slate-600 uppercase tracking-wider block mb-2">Service Image (Photo Link ya Upload)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Option 1: Net se Photo ka URL link daalein</span>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://website.com/photo.jpg"
                  className="w-full bg-white border border-slate-200 outline-none focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Option 2: Apni computer se Photo file upload karein</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result); // Base64 data URL
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-white border border-slate-200 outline-none rounded px-3 py-1.5 text-slate-800"
                />
              </div>
            </div>
            {image && (
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">Image Preview:</span>
                <img src={image} alt="Preview" className="h-20 w-auto object-contain border border-slate-200 rounded p-1 bg-white" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-500 uppercase tracking-wider block">Short Description (Details)</label>
            <textarea 
              rows="3" 
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Outline the focus and limits of this service..."
              className="w-full bg-slate-55 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800 resize-none"
            ></textarea>
          </div>

          {/* Features / Scope items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <label className="font-semibold text-slate-900 uppercase tracking-wider">Features / Scope items (Kaam ke details)</label>
              <button 
                type="button" 
                onClick={() => setFeats([...feats, ''])}
                className="text-orange-600 font-semibold cursor-pointer"
              >
                + Add row
              </button>
            </div>
            <div className="space-y-2">
              {feats.map((feat, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="e.g. 3D CAD modeling provided" 
                    value={feat}
                    onChange={(e) => {
                      const newFeats = [...feats];
                      newFeats[index] = e.target.value;
                      setFeats(newFeats);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                  />
                  <button 
                    type="button" 
                    onClick={() => setFeats(feats.filter((_, i) => i !== index))}
                    className="text-red-500 p-2 cursor-pointer"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setView('list')}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-semibold transition-all cursor-pointer text-xs uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-all cursor-pointer shadow-md shadow-orange-600/10 text-xs uppercase"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <h3 className="font-heading font-bold text-base text-slate-900">Sevaayein (Contracting Services) Offered</h3>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          <FaPlus size={10} /> Nayi Service Jodein (Add Service)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="p-6 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col justify-between shadow-sm relative group hover:border-slate-350 transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-heading font-bold text-lg text-slate-900 leading-tight">{s.title}</h4>
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEdit(s)}
                    className="p-1 border border-slate-200 hover:border-blue-300 hover:bg-white text-slate-500 hover:text-blue-600 rounded transition-all cursor-pointer"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-1 border border-slate-200 hover:border-red-300 hover:bg-white text-slate-500 hover:text-red-655 rounded transition-all cursor-pointer"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>

              {s.image && (
                <div className="w-full h-32 rounded-lg border border-slate-200 overflow-hidden bg-white mb-2 flex items-center justify-center">
                  <img src={s.image} alt={s.title} className="max-h-full max-w-full object-contain p-2" />
                </div>
              )}

              <p className="text-slate-600 text-xs leading-relaxed">{s.description}</p>
              
              <ul className="space-y-2 text-[11px] text-slate-550">
                {s.features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-slate-200/60 pt-4 mt-6 text-[10px] text-slate-400 font-mono">
              Identifier Key: {s.slug}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB: BLOGS MANAGEMENT
   ========================================================================== */
function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  // Form
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('');

  const load = () => setBlogs(db.getBlogs());

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditBlog(null);
    setTitle('');
    setSummary('');
    setContent('');
    setAuthor('Amit Kumar');
    setReadTime('5 min read');
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditBlog(b);
    setTitle(b.title);
    setSummary(b.summary || '');
    setContent(b.content || '');
    setAuthor(b.author || '');
    setReadTime(b.readTime || '');
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this publication?')) {
      db.deleteBlog(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      title,
      summary,
      content,
      author,
      readTime
    };

    if (editBlog) {
      payload.id = editBlog.id;
      payload.slug = editBlog.slug;
      payload.date = editBlog.date;
    }

    db.saveBlog(payload);
    setModalOpen(false);
    load();
  };

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    (b.summary && b.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <FaSearch size={12} />
          </span>
          <input 
            type="text" 
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-205/80 focus:bg-white focus:border-orange-500 outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 transition-all"
          />
        </div>

        <button 
          onClick={openAdd}
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          <FaPlus size={10} /> Publish Article
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold font-heading uppercase tracking-wider">
              <th className="px-6 py-4">Article Title</th>
              <th className="px-6 py-4">Summary</th>
              <th className="px-6 py-4">Publish Details</th>
              <th className="px-6 py-4 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">
                  No articles published.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>
                      <span className="block">{b.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">/blogs/{b.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <p className="line-clamp-2 max-w-sm">{b.summary}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="block font-medium">By {b.author}</span>
                      <span className="block text-[10px]">{b.date} • {b.readTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/blogs/${b.slug}`} 
                        target="_blank"
                        className="p-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-800 transition-all"
                        title="View details page"
                      >
                        <FaExternalLinkAlt size={10} />
                      </Link>
                      <button 
                        onClick={() => openEdit(b)}
                        className="p-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                        title="Edit Article"
                      >
                        <FaEdit size={10} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 rounded text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete Article"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-600"></div>
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-105">
              <h4 className="font-heading font-bold text-base text-slate-900">
                {editBlog ? 'Edit Technical Publication' : 'Draft New Insights Post'}
              </h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 text-xs text-slate-700">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">Article Title</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Understanding Power Factor Correction in Heavy Industries"
                  className="w-full bg-slate-55 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-505 uppercase tracking-wider block">Author Name</label>
                  <input 
                    type="text" 
                    required 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Amit Kumar"
                    className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-550 uppercase tracking-wider block">Estimated Read Time</label>
                  <input 
                    type="text" 
                    required 
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-850"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">Short Abstract (Summary)</label>
                <input 
                  type="text" 
                  required 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Briefly state what compliance guides or calculations are discussed..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-505 rounded px-3 py-2 text-slate-850"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-505 uppercase tracking-wider block">Body Content (Use double line breaks for paragraph splits)</label>
                <textarea 
                  rows="12" 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write article details here..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-805 resize-none font-body text-xs"
                ></textarea>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-550 rounded font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-all cursor-pointer shadow-md shadow-orange-600/10"
                >
                  {editBlog ? 'Publish Edits' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   TAB: INQUIRIES BOX
   ========================================================================== */
function InquiriesTab() {
  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const load = () => setInquiries(db.getInquiries());

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    db.updateInquiryStatus(id, newStatus);
    load();
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this inquiry permanently?')) {
      db.deleteInquiry(id);
      setSelectedInquiry(null);
      load();
    }
  };

  const filtered = statusFilter === 'All' 
    ? inquiries 
    : inquiries.filter(i => i.status === statusFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left List Pane */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <h3 className="font-heading font-bold text-base text-slate-900">Transmission & RFP Inquiries</h3>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1"><FaFilter size={10} /> Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-55 border border-slate-200 rounded px-2.5 py-1 text-slate-700 cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="All">All Inquiries</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No inquiries found matching filter.
            </div>
          ) : (
            filtered.map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className={`
                  w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center gap-4 cursor-pointer
                  ${selectedInquiry && selectedInquiry.id === inq.id 
                    ? 'bg-orange-50/20 border-orange-500/40' 
                    : 'bg-slate-50/60 hover:bg-slate-55 border-slate-200/60'}
                `}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{inq.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">• {inq.company}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-1 max-w-md">{inq.message}</p>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    {new Date(inq.date).toLocaleString()}
                  </span>
                </div>

                <span className={`
                  text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border whitespace-nowrap
                  ${inq.status === 'Pending' ? 'bg-orange-50 text-orange-605 border-orange-200/40' : ''}
                  ${inq.status === 'Contacted' ? 'bg-blue-50 text-blue-600 border-blue-200/40' : ''}
                  ${inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/40' : ''}
                `}>
                  {inq.status}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
        {selectedInquiry ? (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm">{selectedInquiry.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">{selectedInquiry.company}</p>
              </div>
              <button 
                onClick={() => handleDelete(selectedInquiry.id)}
                className="p-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                title="Delete Inquiry permanently"
              >
                <FaTrash size={10} />
              </button>
            </div>

            {/* Profile fields */}
            <div className="space-y-3.5 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <div className="flex flex-wrap gap-y-3 gap-x-2 items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
                  <span className="text-[12px] font-bold text-slate-800">{selectedInquiry.phone}</span>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={`tel:${selectedInquiry.phone}`} 
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm shadow-blue-500/10 cursor-pointer text-center"
                    title="Call Client"
                  >
                    <FaPhoneAlt size={8} /> Call
                  </a>
                  <a 
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + selectedInquiry.phone.replace(/[^0-9]/g, '') : selectedInquiry.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm shadow-green-500/10 cursor-pointer text-center"
                    title="WhatsApp Chat"
                  >
                    <FaWhatsapp size={9} /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-t border-slate-200/50 pt-2.5">
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <a href={`mailto:${selectedInquiry.email}`} className="text-[11px] font-medium text-orange-600 hover:underline">{selectedInquiry.email}</a>
              </div>
              <div className="flex items-center gap-2.5 border-t border-slate-200/50 pt-2.5 mt-2.5">
                <span className="font-semibold text-slate-500 text-[10px] uppercase block leading-none">System Requested:</span>
                <span className="text-[11px] font-bold text-slate-800 capitalize bg-white px-2 py-0.5 border border-slate-200 rounded">{selectedInquiry.service}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider block">Load specifications / message:</span>
              <p className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl leading-relaxed text-slate-600 select-text text-[11px]">
                {selectedInquiry.message}
              </p>
            </div>

            {/* Status controller */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <label className="font-semibold text-slate-500 uppercase tracking-wider block">Set Processing Status</label>
              <div className="flex gap-2">
                {['Pending', 'Contacted', 'Resolved'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleStatusChange(selectedInquiry.id, stat)}
                    className={`
                      flex-grow py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer
                      ${selectedInquiry.status === stat 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'}
                    `}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 text-xs flex flex-col justify-center items-center gap-3">
            <FaInbox size={28} className="text-slate-300" />
            <span>Select an inquiry from the left pane to view details and update its processing status.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB: RECRUITMENT APPLICATIONS
   ========================================================================== */
function ApplicationsTab() {
  const [apps, setApps] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const load = () => setApps(db.getApplications());

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    db.updateApplicationStatus(id, newStatus);
    load();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this application report?')) {
      db.deleteApplication(id);
      setSelectedApp(null);
      load();
    }
  };

  const filtered = statusFilter === 'All' 
    ? apps 
    : apps.filter(a => a.status === statusFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left List pane */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <h3 className="font-heading font-bold text-base text-slate-900">Career Submissions</h3>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-555 font-medium flex items-center gap-1"><FaFilter size={10} /> Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="All">All Applicants</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No applications matching selection.
            </div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedApp(a)}
                className={`
                  w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center gap-4 cursor-pointer
                  ${selectedApp && selectedApp.id === a.id 
                    ? 'bg-orange-50/20 border-orange-500/40' 
                    : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/60'}
                `}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{a.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">• {a.jobTitle}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    Submitted: {new Date(a.date).toLocaleString()}
                  </span>
                </div>

                <span className={`
                  text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border whitespace-nowrap
                  ${a.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200/40' : ''}
                  ${a.status === 'Shortlisted' ? 'bg-purple-50 text-purple-650 border-purple-200/40' : ''}
                  ${a.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200/40' : ''}
                  ${a.status === 'Hired' ? 'bg-emerald-50 text-emerald-605 border-emerald-200/40' : ''}
                `}>
                  {a.status}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
        {selectedApp ? (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm">{selectedApp.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">{selectedApp.jobTitle}</p>
              </div>
              <button 
                onClick={() => handleDelete(selectedApp.id)}
                className="p-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                title="Remove Application"
              >
                <FaTrash size={10} />
              </button>
            </div>

            <div className="space-y-3.5 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
                <span className="text-[11px] font-medium text-slate-800">{selectedApp.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <a href={`mailto:${selectedApp.email}`} className="text-[11px] font-medium text-orange-600 hover:underline">{selectedApp.email}</a>
              </div>
            </div>

            {/* Resume details */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider block">Applicant Resume Attachment:</span>
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <FaFileAlt className="text-red-500 text-lg" />
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">{selectedApp.cvName || 'resume.pdf'}</span>
                    <span className="text-[9px] text-slate-400 block font-mono">Format: PDF</span>
                  </div>
                </div>
                
                <button
                  onClick={() => window.open(db.downloadApplicationCV(selectedApp.cvName), '_blank')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-500 text-[10px] text-slate-600 hover:text-orange-600 rounded font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  Open CV
                </button>
              </div>
            </div>

            {/* Status controls */}
            <div className="border-t border-slate-105 pt-5 space-y-3">
              <label className="font-semibold text-slate-500 uppercase tracking-wider block">Set Applicant Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pending', 'Shortlisted', 'Rejected', 'Hired'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleStatusChange(selectedApp.id, stat)}
                    className={`
                      py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer
                      ${selectedApp.status === stat 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-202 text-slate-550 hover:bg-slate-50'}
                    `}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 text-xs flex flex-col justify-center items-center gap-3">
            <FaFileAlt size={28} className="text-slate-300" />
            <span>Select a job application from the left list to review detailed profiles and candidate CVs.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB: CAREERS (VACANCIES) MANAGEMENT
   ========================================================================== */
function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-Time');
  const [reqs, setReqs] = useState('');

  const load = () => setJobs(db.getJobs());

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditJob(null);
    setTitle('');
    setLocation('Jaipur HQ');
    setType('Full-Time');
    setReqs('');
    setModalOpen(true);
  };

  const openEdit = (j) => {
    setEditJob(j);
    setTitle(j.title);
    setLocation(j.location || '');
    setType(j.type || 'Full-Time');
    setReqs(j.reqs || '');
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this vacancy posting?')) {
      db.deleteJob(id);
      load();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      title,
      location,
      type,
      reqs
    };

    if (editJob) {
      payload.id = editJob.id;
    }

    db.saveJob(payload);
    setModalOpen(false);
    load();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <h3 className="font-heading font-bold text-base text-slate-900">Active Job Postings</h3>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          <FaPlus size={10} /> Add New Opening
        </button>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No vacancies posted. Active candidates will see a general application option only.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="p-6 bg-slate-50 border border-slate-205/60 rounded-xl hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-heading font-bold text-base text-slate-900 leading-none">{job.title}</h4>
                  <span className="text-[9px] px-2 py-0.5 bg-orange-50 border border-orange-200/40 text-orange-600 rounded font-bold uppercase tracking-wider">
                    {job.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Location: {job.location}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                  <strong>Requirements:</strong> {job.reqs}
                </p>
              </div>

              <div className="flex items-center gap-2.5 justify-end">
                <button 
                  onClick={() => openEdit(job)}
                  className="p-2 border border-slate-200 hover:border-blue-300 hover:bg-white text-slate-500 hover:text-blue-600 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                >
                  <FaEdit size={10} /> Edit Opening
                </button>
                <button 
                  onClick={() => handleDelete(job.id)}
                  className="p-2 border border-slate-200 hover:border-red-300 hover:bg-white text-slate-500 hover:text-red-650 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-600"></div>
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-900">
                {editJob ? 'Modify Job Details' : 'Configure Recruitment Opening'}
              </h4>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-slate-700">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 uppercase tracking-wider block">Job Title</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Electrical Commissioning Engineer"
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider block">Location</label>
                  <input 
                    type="text" 
                    required 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Jaipur HQ"
                    className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500 uppercase tracking-wider block">Job Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800 cursor-pointer"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract/Tender based</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 uppercase tracking-wider block">Candidate Requirements & Responsibilities</label>
                <textarea 
                  rows="4" 
                  required
                  value={reqs}
                  onChange={(e) => setReqs(e.target.value)}
                  placeholder="Summarize engineering background, degree constraints, standard code validations, etc..."
                  className="w-full bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-orange-500 rounded px-3 py-2 text-slate-800 resize-none font-body text-xs"
                ></textarea>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-55 text-slate-550 rounded font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-all cursor-pointer shadow-md shadow-orange-600/10"
                >
                  Save Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
