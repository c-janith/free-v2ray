import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Zap, Users, Server, TrendingUp, ArrowRight, ChevronDown, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { servers, notifications } = useApp();
  const [counters, setCounters] = useState({ years: 0, traffic: 0, servers: 0, users: 0 });

  useEffect(() => {
    const targets = { years: 4, traffic: 30, servers: servers.filter(s => s.status === 'online').length, users: 15000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounters({
        years: Math.round(targets.years * eased * 10) / 10,
        traffic: Math.round(targets.traffic * eased),
        servers: Math.round(targets.servers * eased),
        users: Math.round(targets.users * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [servers]);

  const pinnedNotifs = notifications.filter(n => n.pinned).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-500/5 rounded-full animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-500/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up text-sm font-medium">
            <span className="status-dot status-online" />
            <span className="text-brand-400">{servers.filter(s => s.status === 'online').length} Servers Online</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">Serving Sri Lanka</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 animate-fade-in-up leading-tight" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">Ghost</span><br />
            <span className="dark:text-white text-gray-900">VPN Hub</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl dark:text-gray-400 text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Free V2Ray configs optimized for Sri Lankan ISP packages. Fast, secure, and reliable — trusted for <span className="text-brand-400 font-semibold">4+ years</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => navigate('/vpn')} className="group px-8 py-4 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              Get Free Config <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/tutorials')} className="px-8 py-4 glass dark:text-white text-gray-700 font-bold rounded-2xl text-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300">
              Setup Tutorial
            </button>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Pinned Notifications Banner */}
      {pinnedNotifs.length > 0 && (
        <section className="py-4 dark:bg-brand-500/5 bg-brand-50 border-y dark:border-brand-500/10 border-brand-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Bell className="w-5 h-5 text-brand-500 shrink-0" />
              {pinnedNotifs.map((n, i) => (
                <span key={n.id} className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-600 whitespace-nowrap">
                  {i > 0 && <span className="text-gray-500">•</span>}
                  <span className="font-medium dark:text-brand-400 text-brand-600">{n.title}</span>
                  <span className="dark:text-gray-500 text-gray-400 hidden sm:inline">— {n.message}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 mesh-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Years Active', value: `${counters.years}+`, icon: TrendingUp, color: 'brand' },
              { label: 'Traffic This Year', value: `${counters.traffic}TB`, icon: Globe, color: 'cyan' },
              { label: 'Active Servers', value: counters.servers.toString(), icon: Server, color: 'violet' },
              { label: 'Happy Users', value: `${(counters.users / 1000).toFixed(1)}K+`, icon: Users, color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color === 'brand' ? 'text-brand-400' : stat.color === 'cyan' ? 'text-cyan-400' : stat.color === 'violet' ? 'text-violet-400' : 'text-amber-400'}`} />
                <div className="text-3xl md:text-4xl font-black dark:text-white text-gray-900">{stat.value}</div>
                <div className="text-sm dark:text-gray-400 text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported ISPs Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black dark:text-white text-gray-900 mb-4">Supported <span className="gradient-text">ISPs</span></h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto">We provide optimized V2Ray configs specifically for these Sri Lankan ISP packages</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dialog', emoji: '💬', color: 'blue', packages: ['Zoom Unlimited', 'Social'], tag: 'Wifi' },
              { name: 'Hutch', emoji: '📱', color: 'orange', packages: ['Social', 'TikTok'], tag: 'Mobile' },
              { name: 'Airtel', emoji: '🔴', color: 'red', packages: ['Social', 'TikTok', 'YouTube', 'All Social'], tag: 'Mobile' },
              { name: 'SLT/Fiber', emoji: '🌐', color: 'green', packages: ['Zoom', 'Entertainment'], tag: 'Fiber' },
            ].map((isp, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{isp.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white text-gray-900">{isp.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isp.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      isp.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                      isp.color === 'red' ? 'bg-red-500/20 text-red-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{isp.tag}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {isp.packages.map((pkg, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-600">
                      <Zap className="w-3.5 h-3.5 text-brand-400" />{pkg}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 dark:bg-surface-card/50 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black dark:text-white text-gray-900 mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto">Get your free V2Ray config in just 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Choose Server', desc: 'Select from our global server locations', icon: Globe },
              { step: 2, title: 'Select ISP', desc: 'Pick your Sri Lankan ISP provider', icon: Shield },
              { step: 3, title: 'Pick Package', desc: 'Choose your active ISP package', icon: Zap },
              { step: 4, title: 'Get Config', desc: 'Watch 3 ads and copy your config', icon: ArrowRight },
            ].map((item, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 flex items-center justify-center relative">
                  <item.icon className="w-7 h-7 text-brand-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{item.step}</div>
                </div>
                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/vpn')} className="group px-8 py-4 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
              Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black dark:text-white text-gray-900 mb-4">Why <span className="gradient-text">Ghost VPN Hub</span>?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '100% Free Forever', desc: 'No hidden fees, no subscriptions. Watch a few ads and get your config instantly.', icon: '🆓' },
              { title: 'ISP Optimized', desc: 'Configs specifically tuned for Sri Lankan ISP packages for maximum performance.', icon: '⚡' },
              { title: '4+ Years Trusted', desc: 'Serving the community since 2020 with reliable uptime and support.', icon: '🛡️' },
              { title: 'Multiple Protocols', desc: 'Support for VMess, VLESS, and more protocols for different needs.', icon: '🔗' },
              { title: 'Global Servers', desc: 'Servers across Singapore, Japan, Europe, USA, and India.', icon: '🌍' },
              { title: 'Easy Setup', desc: 'Step-by-step tutorials for Windows, Android, and iOS devices.', icon: '📱' },
            ].map((feat, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="text-3xl mb-4 block">{feat.icon}</span>
                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 dark:bg-surface-card/50 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black dark:text-white text-gray-900 mb-6">Ready to <span className="gradient-text">Get Connected</span>?</h2>
          <p className="dark:text-gray-400 text-gray-600 text-lg mb-8 max-w-xl mx-auto">Join thousands of Sri Lankan users who trust Ghost VPN Hub for their daily internet needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/vpn')} className="group px-8 py-4 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2">
              Get Your Config <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/tutorials')} className="px-8 py-4 glass dark:text-white text-gray-700 font-bold rounded-2xl text-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300">
              View Tutorials
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
