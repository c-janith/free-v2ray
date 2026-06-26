import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AdBlockOverlay from './components/AdBlockOverlay';
import AdsterraPopunder from './components/AdsterraPopunder';
import HomePage from './pages/HomePage';
import VPNPage from './pages/VPNPage';
import TutorialPage from './pages/TutorialPage';
import AdminPage from './pages/AdminPage';
import { Ghost, Sun, Moon, Menu, X, Home, Shield, BookOpen, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

function Navbar() {
  const { theme, toggleTheme } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/vpn', label: 'Get VPN', icon: Shield },
    { path: '/tutorials', label: 'Tutorials', icon: BookOpen },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  const currentPath = location.pathname;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'dark:bg-gray-950/80 bg-white/80 backdrop-blur-xl shadow-lg dark:shadow-black/20 shadow-gray-200/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all">
              <Ghost className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black dark:text-white text-gray-900">Ghost<span className="text-brand-400">VPN</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPath === item.path ? 'bg-brand-500/15 text-brand-400' : 'dark:text-gray-400 text-gray-500 hover:text-brand-400 hover:bg-brand-500/5'
                }`}>
                <item.icon className="w-4 h-4" />{item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl dark:bg-gray-800/50 bg-gray-100 dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-all duration-200" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl dark:bg-gray-800/50 bg-gray-100 dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-4 pb-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentPath === item.path ? 'bg-brand-500/15 text-brand-400' : 'dark:text-gray-400 text-gray-500 hover:text-brand-400 hover:bg-brand-500/5'
              }`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] toast-enter">
      <div className="px-5 py-3 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-medium rounded-2xl shadow-2xl shadow-brand-500/30 flex items-center gap-2 text-sm">
        <span>✓</span> {toast}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-surface-dark bg-white">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
          <Ghost className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Ghost VPN Hub</h2>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="dark:bg-gray-950 bg-gray-50 border-t dark:border-gray-800 border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center"><Ghost className="w-4 h-4 text-white" /></div>
              <span className="font-black dark:text-white text-gray-900">Ghost<span className="text-brand-400">VPN</span></span>
            </div>
            <p className="text-sm dark:text-gray-500 text-gray-400">Free V2Ray VPN configs optimized for Sri Lankan ISP packages. Trusted since 2020.</p>
          </div>
          <div>
            <h4 className="font-bold dark:text-white text-gray-900 mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm dark:text-gray-400 text-gray-500 hover:text-brand-400 transition-colors">Home</Link>
              <Link to="/vpn" className="block text-sm dark:text-gray-400 text-gray-500 hover:text-brand-400 transition-colors">Get VPN Config</Link>
              <Link to="/tutorials" className="block text-sm dark:text-gray-400 text-gray-500 hover:text-brand-400 transition-colors">Tutorials</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold dark:text-white text-gray-900 mb-3 text-sm">Supported ISPs</h4>
            <div className="space-y-2 text-sm dark:text-gray-400 text-gray-500">
              <p>💬 Dialog Wifi</p><p>📱 Hutch</p><p>🔴 Airtel</p><p>🌐 SLT/Fiber</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold dark:text-white text-gray-900 mb-3 text-sm">Supported Apps</h4>
            <div className="space-y-2 text-sm dark:text-gray-400 text-gray-500">
              <p>🖥️ Netmod / Netch / Happ</p><p>📱 v2rayNG / Netmod</p><p>🍎 V2Box</p>
            </div>
          </div>
        </div>
        <div className="border-t dark:border-gray-800 border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs dark:text-gray-600 text-gray-400">© {new Date().getFullYear()} Ghost VPN Hub. All rights reserved.</p>
          <p className="text-xs dark:text-gray-600 text-gray-400">30TB+ traffic served • 4+ years of service</p>
        </div>
      </div>
    </footer>
  );
}

function AppLayout() {
  const { loading } = useApp();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  if (loading) return <LoadingScreen />;

  return (
    <div className={`min-h-screen ${location.pathname === '/' ? '' : 'dark:bg-surface-dark bg-white'}`}>
      <AdBlockOverlay />
      <AdsterraPopunder />
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vpn" element={<VPNPage />} />
          <Route path="/tutorials" element={<TutorialPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
