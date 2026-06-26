import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Zap, Copy, Check, ChevronRight, ChevronLeft, Eye, Clock, Shield, Bell, X, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

function AdBanner({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <div className={`ad-placeholder ${className}`} data-adsterra-slot={slot}>
      <div className="text-center relative z-10 p-4">
        <div className="text-xs dark:text-gray-500 text-gray-400 uppercase tracking-wider mb-1">Advertisement</div>
        <div className="dark:text-gray-400 text-gray-500 text-sm">Ad Space — {slot}</div>
        {/* Replace this div with actual Adsterra ad code */}
      </div>
    </div>
  );
}

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications } = useApp();
  const typeIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={onClose} />}
      <div className={`fixed top-16 right-4 w-80 max-h-[70vh] z-50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'} dark:bg-gray-900 bg-white border dark:border-gray-700 border-gray-200`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 border-gray-200">
          <h3 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-400" /> Notifications
          </h3>
          <button onClick={onClose} className="dark:text-gray-400 text-gray-500 hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center dark:text-gray-500 text-gray-400 text-sm">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 border-b dark:border-gray-800 border-gray-100 ${n.pinned ? 'dark:bg-brand-500/5 bg-brand-50' : ''}`}>
                <div className="flex items-start gap-2">
                  {typeIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm dark:text-white text-gray-900 truncate">{n.title}</span>
                      {n.pinned && <span className="text-[10px] px-1.5 py-0.5 bg-brand-500/20 text-brand-400 rounded-full">PINNED</span>}
                    </div>
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] dark:text-gray-500 text-gray-400 mt-1 block">{n.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default function VPNPage() {
  const { servers, isps, packages, configs, recordCopy, notifications, showToast, setCurrentPage } = useApp();
  const [step, setStep] = useState(1);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedISP, setSelectedISP] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [adsWatched, setAdsWatched] = useState(0);
  const [adTimer, setAdTimer] = useState(0);
  const [watchingAd, setWatchingAd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  // Config modal state removed - inline display used

  const totalAdsRequired = 3;
  const onlineServers = servers.filter(s => s.status === 'online');
  const filteredPackages = packages.filter(p => p.ispId === selectedISP);
  const matchedConfig = configs.find(c => c.serverId === selectedServer && c.packageId === selectedPackage);

  useEffect(() => {
    if (watchingAd && adTimer > 0) {
      const timer = setTimeout(() => setAdTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (watchingAd && adTimer === 0) {
      setWatchingAd(false);
      setAdsWatched(prev => prev + 1);
    }
  }, [watchingAd, adTimer]);

  const startAd = (adNumber: number) => {
    if (adNumber === adsWatched + 1 && !watchingAd) {
      setWatchingAd(true);
      setAdTimer(5); // 5 second ad simulation
    }
  };

  const handleCopy = async () => {
    if (!matchedConfig) return;
    try {
      await navigator.clipboard.writeText(matchedConfig.config);
      recordCopy(matchedConfig.id);
      setCopied(true);
      showToast('Config copied to clipboard! 🎉');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = matchedConfig.config;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      recordCopy(matchedConfig.id);
      setCopied(true);
      showToast('Config copied to clipboard! 🎉');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedServer(null);
    setSelectedISP(null);
    setSelectedPackage(null);
    setAdsWatched(0);
    setCopied(false);
  };

  const steps = [
    { num: 1, label: 'Server', icon: Globe },
    { num: 2, label: 'ISP', icon: Shield },
    { num: 3, label: 'Package', icon: Zap },
    { num: 4, label: 'Config', icon: Copy },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Notification Bell */}
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors">
            <Bell className="w-5 h-5" />
            {notifications.filter(n => n.pinned).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications.filter(n => n.pinned).length}
              </span>
            )}
          </button>
        </div>
        <NotificationPanel open={showNotifs} onClose={() => setShowNotifs(false)} />

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                step === s.num ? 'bg-brand-500/20 border border-brand-500/40' :
                step > s.num ? 'bg-brand-500/10 border border-brand-500/20' :
                'dark:bg-gray-800/50 bg-gray-100 border border-transparent'
              }`}>
                <s.icon className={`w-4 h-4 ${step >= s.num ? 'text-brand-400' : 'dark:text-gray-500 text-gray-400'}`} />
                <span className={`text-sm font-medium hidden sm:inline ${step >= s.num ? 'dark:text-white text-gray-900' : 'dark:text-gray-500 text-gray-400'}`}>{s.label}</span>
                {step > s.num && <Check className="w-4 h-4 text-brand-400" />}
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className={`w-4 h-4 ${step > s.num ? 'text-brand-400' : 'dark:text-gray-600 text-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Ad Banner - Top */}
        <AdBanner slot="top-banner" className="mb-8" />

        {/* Step 1: Server Selection */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2 text-center">Choose Your Server</h2>
            <p className="dark:text-gray-400 text-gray-500 text-center mb-6">Select a server location for optimal performance</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineServers.map(server => (
                <button
                  key={server.id}
                  onClick={() => { setSelectedServer(server.id); setStep(2); }}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 card-hover ${
                    selectedServer === server.id
                      ? 'bg-brand-500/15 border-2 border-brand-500'
                      : 'glass border-2 border-transparent hover:border-brand-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{server.flag}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold dark:text-white text-gray-900 truncate">{server.name}</h3>
                      <p className="text-xs dark:text-gray-400 text-gray-500">{server.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot status-${server.status}`} />
                      <span className="text-xs dark:text-gray-400 text-gray-500 capitalize">{server.status}</span>
                    </div>
                    <div className="text-xs dark:text-gray-400 text-gray-500">
                      Load: <span className={server.load > 70 ? 'text-red-400' : server.load > 40 ? 'text-amber-400' : 'text-green-400'}>{server.load}%</span>
                    </div>
                  </div>
                  {/* Load bar */}
                  <div className="mt-2 h-1.5 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        server.load > 70 ? 'bg-red-500' : server.load > 40 ? 'bg-amber-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${server.load}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ad Banner - Between steps */}
        {step === 2 && <AdBanner slot="mid-banner-1" className="mb-6" />}

        {/* Step 2: ISP Selection */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setStep(1); setSelectedISP(null); setSelectedPackage(null); }} className="p-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">Select Your ISP</h2>
                <p className="dark:text-gray-400 text-gray-500 text-sm">Choose your internet service provider</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isps.map(isp => {
                const ispPackages = packages.filter(p => p.ispId === isp.id);
                const hasConfigs = configs.some(c => c.serverId === selectedServer && ispPackages.some(p => p.id === c.packageId));
                return (
                  <button
                    key={isp.id}
                    onClick={() => { setSelectedISP(isp.id); setStep(3); }}
                    disabled={!hasConfigs}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                      !hasConfigs ? 'opacity-40 cursor-not-allowed glass' :
                      selectedISP === isp.id
                        ? 'bg-brand-500/15 border-2 border-brand-500 card-hover'
                        : 'glass border-2 border-transparent hover:border-brand-500/30 card-hover'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{isp.logo}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold dark:text-white text-gray-900">{isp.name}</h3>
                        <p className="text-sm dark:text-gray-400 text-gray-500">{ispPackages.length} packages available</p>
                        {!hasConfigs && <p className="text-xs text-red-400 mt-1">No configs for selected server</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {ispPackages.map(pkg => (
                        <span key={pkg.id} className="text-xs px-2 py-1 rounded-lg dark:bg-gray-700/50 bg-gray-100 dark:text-gray-300 text-gray-600">
                          {pkg.name}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && <AdBanner slot="mid-banner-2" className="mb-6" />}

        {/* Step 3: Package Selection */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setStep(2); setSelectedPackage(null); }} className="p-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">Choose Your Package</h2>
                <p className="dark:text-gray-400 text-gray-500 text-sm">Select your active ISP package</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPackages.map(pkg => {
                const hasConfig = configs.some(c => c.serverId === selectedServer && c.packageId === pkg.id);
                return (
                  <button
                    key={pkg.id}
                    onClick={() => { if (hasConfig) { setSelectedPackage(pkg.id); setStep(4); } }}
                    disabled={!hasConfig}
                    className={`p-5 rounded-2xl text-left transition-all duration-300 ${
                      !hasConfig ? 'opacity-40 cursor-not-allowed glass' :
                      selectedPackage === pkg.id
                        ? 'bg-brand-500/15 border-2 border-brand-500 card-hover'
                        : 'glass border-2 border-transparent hover:border-brand-500/30 card-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold dark:text-white text-gray-900">{pkg.name}</h3>
                        <p className="text-xs dark:text-gray-400 text-gray-500">{pkg.description}</p>
                      </div>
                      {pkg.speed && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-brand-500/15 text-brand-400 font-medium">{pkg.speed}</span>
                      )}
                    </div>
                    {!hasConfig && <p className="text-xs text-red-400 mt-2 ml-13">No config available for this server+package combo</p>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && <AdBanner slot="mid-banner-3" className="mb-6" />}

        {/* Step 4: Watch Ads & Get Config */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setStep(3); setAdsWatched(0); }} className="p-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">Get Your Config</h2>
                <p className="dark:text-gray-400 text-gray-500 text-sm">Watch {totalAdsRequired} ads to unlock your V2Ray config</p>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="glass rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider mb-3">Your Selection</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-brand-500/15 text-brand-400 text-sm font-medium">
                  {servers.find(s => s.id === selectedServer)?.flag} {servers.find(s => s.id === selectedServer)?.name}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 text-sm font-medium">
                  {isps.find(i => i.id === selectedISP)?.logo} {isps.find(i => i.id === selectedISP)?.name}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-violet-500/15 text-violet-400 text-sm font-medium">
                  {packages.find(p => p.id === selectedPackage)?.name}
                </span>
              </div>
            </div>

            {/* Ad Watching Section */}
            {adsWatched < totalAdsRequired ? (
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-brand-400" />
                  <h3 className="font-bold dark:text-white text-gray-900">Watch Ads to Continue</h3>
                </div>
                <p className="dark:text-gray-400 text-gray-500 text-sm mb-6">
                  Please watch {totalAdsRequired - adsWatched} more ad{totalAdsRequired - adsWatched !== 1 ? 's' : ''} to unlock your config. This helps us keep the service free!
                </p>

                {/* Progress bar */}
                <div className="h-3 rounded-full dark:bg-gray-700 bg-gray-200 mb-6 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(adsWatched / totalAdsRequired) * 100}%` }}
                  />
                </div>

                {/* Ad slots */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map(adNum => (
                    <div
                      key={adNum}
                      className={`rounded-2xl p-4 text-center transition-all duration-300 ${
                        adsWatched >= adNum
                          ? 'bg-brand-500/15 border border-brand-500/30'
                          : adNum === adsWatched + 1
                            ? 'dark:bg-gray-800 bg-gray-100 border border-amber-500/30'
                            : 'dark:bg-gray-800/50 bg-gray-50 border dark:border-gray-700 border-gray-200 opacity-50'
                      }`}
                    >
                      {adsWatched >= adNum ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-8 h-8 text-brand-400" />
                          <span className="text-sm font-medium text-brand-400">Watched!</span>
                        </div>
                      ) : adNum === adsWatched + 1 ? (
                        <div className="flex flex-col items-center gap-2">
                          {watchingAd ? (
                            <>
                              <div className="relative w-12 h-12">
                                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="dark:text-gray-700 text-gray-200" />
                                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-400 ad-progress-ring" strokeDasharray={`${(adTimer / 5) * 125.6} 125.6`} strokeLinecap="round" />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold dark:text-white text-gray-900">{adTimer}</span>
                              </div>
                              <span className="text-sm font-medium dark:text-amber-400 text-amber-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Watching...
                              </span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-8 h-8 dark:text-amber-400 text-amber-500" />
                              <button
                                onClick={() => startAd(adNum)}
                                className="mt-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                              >
                                Watch Ad {adNum}
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="w-8 h-8 dark:text-gray-600 text-gray-300" />
                          <span className="text-xs dark:text-gray-500 text-gray-400">Locked</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Config Reveal */
              <div className="animate-fade-in-up">
                <div className="glass rounded-2xl p-6 mb-6 border border-brand-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-brand-400" />
                      <h3 className="font-bold dark:text-white text-gray-900">Your V2Ray Config</h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg bg-brand-500/15 text-brand-400 font-medium uppercase">
                      {matchedConfig?.protocol}
                    </span>
                  </div>

                  <div className="dark:bg-gray-900/50 bg-gray-50 rounded-xl p-4 mb-4 border dark:border-gray-700 border-gray-200 max-h-40 overflow-y-auto">
                    <code className="config-block dark:text-brand-300 text-brand-700">{matchedConfig?.config}</code>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-brand-500/25 hover:scale-[1.02]'
                      }`}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied!' : 'Copy Config'}
                    </button>
                    <button
                      onClick={resetFlow}
                      className="px-6 py-3 glass rounded-xl font-semibold dark:text-gray-300 text-gray-600 hover:text-brand-400 transition-colors"
                    >
                      Get Another
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs dark:text-gray-500 text-gray-400">
                    <span>Protocol: {matchedConfig?.protocol?.toUpperCase()}</span>
                    <span>•</span>
                    <span>Last Updated: {matchedConfig?.lastUpdated}</span>
                    <span>•</span>
                    <span>Copies: {matchedConfig?.copyCount}</span>
                  </div>
                </div>

                {/* Setup help */}
                <div className="glass rounded-2xl p-5">
                  <h4 className="font-semibold dark:text-white text-gray-900 mb-2">📱 Need help setting up?</h4>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mb-3">Follow our step-by-step tutorials for your device.</p>
                  <button
                    onClick={() => setCurrentPage('tutorials')}
                    className="text-sm text-brand-400 font-medium hover:text-brand-300 transition-colors"
                  >
                    View Tutorials →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ad Banner - Bottom */}
        <AdBanner slot="bottom-banner" className="mt-8" />
      </div>
    </div>
  );
}
