import { useEffect, useState } from 'react';
import { useAdBlockDetector, AdBlockType } from '../hooks/useAdBlockDetector';
import { ShieldOff, RefreshCw, Heart, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const BLOCKER_INFO: Record<AdBlockType, { label: string; icon: string; color: string }> = {
  'brave-shields': { label: 'Brave Shields', icon: '🛡️', color: 'from-orange-600 to-amber-500' },
  'ublock-origin': { label: 'uBlock Origin', icon: '🧱', color: 'from-red-600 to-red-500' },
  'adblock-plus': { label: 'AdBlock Plus', icon: '🚫', color: 'from-red-600 to-pink-500' },
  'adguard-extension': { label: 'AdGuard', icon: '🛡️', color: 'from-green-600 to-emerald-500' },
  'ghostery': { label: 'Ghostery', icon: '👻', color: 'from-purple-600 to-violet-500' },
  'opera-built-in': { label: 'Opera Ad Blocker', icon: '🔴', color: 'from-red-600 to-red-400' },
  'edge-tracking': { label: 'Edge Tracking Prevention', icon: '🔵', color: 'from-blue-600 to-cyan-500' },
  'firefox-enhanced': { label: 'Firefox Enhanced Protection', icon: '🦊', color: 'from-orange-600 to-yellow-500' },
  'vivaldi-tracker': { label: 'Vivaldi Tracker Blocker', icon: '🔷', color: 'from-red-600 to-gray-500' },
  'samsung-adblock': { label: 'Samsung Ad Blocker', icon: '📱', color: 'from-blue-600 to-indigo-500' },
  'safari-content-blocker': { label: 'Safari Content Blocker', icon: '🧭', color: 'from-blue-600 to-blue-400' },
  'chrome-adblock': { label: 'Chrome Ad Blocker', icon: '🌐', color: 'from-yellow-600 to-green-500' },
  'dns-blocker': { label: 'DNS Ad Blocker', icon: '📡', color: 'from-gray-600 to-gray-500' },
  'unknown': { label: 'Ad Blocker', icon: '🚫', color: 'from-red-600 to-orange-500' },
};

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs dark:text-gray-400 text-gray-500">
      <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{n}</span>
      <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  );
}

function Collapsible({ title, icon, children, defaultOpen = false }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="dark:bg-gray-800/40 bg-gray-50 rounded-xl overflow-hidden mb-1.5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-left">
        <span className="flex items-center gap-2 text-xs font-semibold dark:text-gray-200 text-gray-700">{icon} {title}</span>
        {open ? <ChevronUp className="w-3 h-3 dark:text-gray-500 text-gray-400" /> : <ChevronDown className="w-3 h-3 dark:text-gray-500 text-gray-400" />}
      </button>
      {open && <div className="px-3 pb-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function Instructions({ type }: { type: AdBlockType }) {
  switch (type) {
    case 'brave-shields':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>🛡️ shield icon</strong> in your address bar (right side)' />
        <Step n={2} text='Toggle <strong>"Shields down"</strong> for this site' />
        <Step n={3} text='Or set <strong>"Block ads" → Allow all</strong>"' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'ublock-origin':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>uBlock Origin icon</strong> (red shield) in your toolbar' />
        <Step n={2} text='Click the <strong>big power button</strong> to disable for this site' />
        <Step n={3} text='Or click the <strong>⟳ refresh icon</strong> on the popup' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'adblock-plus':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>AdBlock Plus icon</strong> (stop sign) in your toolbar' />
        <Step n={2} text='Click <strong>"Disable on this site"</strong> or the power toggle' />
        <Step n={3} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'adguard-extension':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>AdGuard icon</strong> (green shield) in your toolbar' />
        <Step n={2} text='Toggle the <strong>protection switch OFF</strong> for this site' />
        <Step n={3} text='Or go to AdGuard → Settings → Whitelist → Add <strong>ghostvpnhub.com</strong>' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'ghostery':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>Ghostery icon</strong> (ghost) in your toolbar' />
        <Step n={2} text='Click <strong>"Trust this site"</strong> to allow all trackers' />
        <Step n={3} text='Or disable ad blocking in the Ghostery panel' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'opera-built-in':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>shield icon</strong> in the address bar' />
        <Step n={2} text='Toggle <strong>"Block ads"</strong> to OFF for this site' />
        <Step n={3} text='Or go to <strong>Settings → Privacy → Block ads → Manage exceptions</strong>' />
        <Step n={4} text='Add <strong>ghostvpnhub.com</strong> to exceptions' />
        <Step n={5} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'edge-tracking':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>shield/icon</strong> in the address bar' />
        <Step n={2} text='Set tracking prevention to <strong>"Basic"</strong> for this site' />
        <Step n={3} text='Or go to <strong>Settings → Privacy → Tracking prevention → Exceptions</strong>' />
        <Step n={4} text='Add <strong>ghostvpnhub.com</strong> to exceptions' />
        <Step n={5} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'firefox-enhanced':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>shield icon</strong> in the address bar' />
        <Step n={2} text='Toggle <strong>"Enhanced Tracking Protection"</strong> OFF for this site' />
        <Step n={3} text='Or go to <strong>Settings → Privacy → Exceptions</strong> and add this site' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'vivaldi-tracker':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>shield icon</strong> in the address bar' />
        <Step n={2} text='Toggle <strong>"Block Trackers"</strong> and <strong>"Block Ads"</strong> to OFF' />
        <Step n={3} text='Or go to <strong>Settings → Privacy → Tracker and Ad Blocking</strong> → add exception' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'samsung-adblock':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Tap the <strong>☰ menu</strong> → <strong>Settings</strong>' />
        <Step n={2} text='Go to <strong>"Sites and downloads" → "Block ads"</strong>' />
        <Step n={3} text='Toggle <strong>"Block ads"</strong> OFF or add this site as an exception' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'safari-content-blocker':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Open <strong>Settings app</strong> → <strong>Safari</strong>' />
        <Step n={2} text='Tap <strong>"Content Blockers"</strong> or <strong>"Extensions"</strong>' />
        <Step n={3} text='Toggle OFF the ad blocker extension for Safari' />
        <Step n={4} text='Refresh this page and click <strong>"Check"</strong>' />
      </ol>);

    case 'chrome-adblock':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click the <strong>🔒 lock icon</strong> → <strong>Site settings</strong>' />
        <Step n={2} text='Find <strong>"Ads"</strong> and set to <strong>"Allow"</strong>' />
        <Step n={3} text='Or check your extensions: <strong>chrome://extensions</strong> → disable ad blocker' />
        <Step n={4} text='Click <strong>"Check"</strong> below' />
      </ol>);

    case 'dns-blocker':
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Whitelist <strong>ghostvpnhub.com</strong> and <strong>adsterra.com</strong> in your DNS filter' />
        <Step n={2} text='Or temporarily switch DNS to <strong>8.8.8.8</strong> or <strong>1.1.1.1</strong>' />
        <Step n={3} text='If using Pi-hole: <strong>Settings → Whitelist</strong> → add these domains' />
        <Step n={4} text='If using NextDNS: <strong>Allowlist</strong> → add these domains' />
        <Step n={5} text='Click <strong>"Check"</strong> below' />
      </ol>);

    default:
      return (<ol className="space-y-1.5 list-none">
        <Step n={1} text='Click your <strong>ad blocker icon</strong> in the browser toolbar' />
        <Step n={2} text='Click <strong>"Disable on this site"</strong> or the power toggle' />
        <Step n={3} text='Refresh the page and click <strong>"Check"</strong> below' />
      </ol>);
  }
}

export default function AdBlockOverlay() {
  const { detected, type, browserName, checking, recheck } = useAdBlockDetector();

  useEffect(() => {
    if (detected) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = orig; };
    }
  }, [detected]);

  if (!detected) return null;

  const info = BLOCKER_INFO[type] || BLOCKER_INFO['unknown'];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onContextMenu={e => e.preventDefault()} />
      <div className="relative w-full max-w-md my-4 animate-fade-in-up">
        <div className="dark:bg-gray-900 bg-white rounded-2xl shadow-2xl border dark:border-gray-700 border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${info.color} px-5 py-4 text-center`}>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              {info.icon}
            </div>
            <h2 className="text-lg font-black text-white">{info.label} Detected!</h2>
            <p className="text-white/70 text-xs mt-0.5">Disable it to continue using Ghost VPN Hub</p>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5">
            {/* Why */}
            <div className="flex items-start gap-2.5 mb-3">
              <Heart className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs dark:text-gray-400 text-gray-500 leading-relaxed">
                We provide <strong className="dark:text-white text-gray-800">free V2Ray configs</strong> to thousands of users. Ads are our only revenue to keep servers running. Please support us.
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-medium dark:text-amber-300 text-amber-700">
                You must disable your ad blocker to access this site.
              </p>
            </div>

            {/* Specific instructions */}
            <div className="mb-3">
              <p className="text-xs font-bold dark:text-white text-gray-900 flex items-center gap-1.5 mb-2">
                <ShieldOff className="w-3.5 h-3.5 text-red-400" />
                How to Disable {info.label}
              </p>
              <Instructions type={type} />
            </div>

            {/* Extra help - collapsible */}
            {type !== 'dns-blocker' && (
              <Collapsible title="Still not working?" icon="💡">
                <div className="space-y-1 text-xs dark:text-gray-400 text-gray-500">
                  <p>• Try a <strong className="dark:text-gray-200 text-gray-700">hard refresh</strong>: <code className="px-1 rounded dark:bg-gray-700 bg-gray-200">Ctrl+Shift+R</code></p>
                  <p>• Check if you have <strong className="dark:text-gray-200 text-gray-700">multiple ad blockers</strong> — disable all of them</p>
                  <p>• Clear your <strong className="dark:text-gray-200 text-gray-700">browser cache</strong> and reload</p>
                  <p>• Try using <strong className="dark:text-gray-200 text-gray-700">Incognito/Private mode</strong> without extensions</p>
                </div>
              </Collapsible>
            )}

            <Collapsible title="Using a different ad blocker?" icon="🔍">
              <ol className="text-xs dark:text-gray-400 text-gray-500 space-y-1 list-none">
                <Step n={1} text='Click your <strong>ad blocker icon</strong> in the browser toolbar' />
                <Step n={2} text='Click <strong>"Disable on this site"</strong> or the power toggle' />
                <Step n={3} text='Refresh and click <strong>"Check"</strong> below' />
              </ol>
            </Collapsible>

            <Collapsible title="Using a DNS blocker?" icon="📡">
              <ol className="text-xs dark:text-gray-400 text-gray-500 space-y-1 list-none">
                <Step n={1} text='Whitelist <strong>ghostvpnhub.com</strong> and <strong>adsterra.com</strong>' />
                <Step n={2} text='Or temporarily switch DNS to <strong>8.8.8.8</strong> or <strong>1.1.1.1</strong>' />
                <Step n={3} text='Refresh and click <strong>"Check"</strong> below' />
              </ol>
            </Collapsible>

            {/* Recheck */}
            <div className="mt-4 text-center">
              <button onClick={recheck} disabled={checking}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm">
                {checking ? <><RefreshCw className="w-4 h-4 animate-spin" /> Checking...</> : <><RefreshCw className="w-4 h-4" /> I've Disabled It — Check</>}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t dark:border-gray-800 border-gray-100 text-center">
            <p className="text-[10px] dark:text-gray-600 text-gray-400">
              Detected: {info.label} on {browserName} • By disabling your ad blocker, you help keep this service free 🙏
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
