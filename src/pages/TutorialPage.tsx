import { useApp } from '../context/AppContext';
import { Monitor, Smartphone, Download, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface TutorialApp {
  name: string;
  platform: string;
  icon: string;
  downloadUrl: string;
  steps: string[];
  features: string[];
}

const windowsApps: TutorialApp[] = [
  {
    name: 'Netmod',
    platform: 'Windows',
    icon: '🖥️',
    downloadUrl: 'https://github.com/netmod-v2ray/netmod/releases',
    steps: [
      'Download Netmod from the link above and install it.',
      'Open Netmod and click on "Server" or "Import" button.',
      'Paste the V2Ray config you copied from Ghost VPN Hub.',
      'Click "Connect" to establish the VPN connection.',
      'Once connected, you can browse the internet securely!',
    ],
    features: ['Easy GUI interface', 'Supports VMess & VLESS', 'Auto-reconnect', 'System proxy mode'],
  },
  {
    name: 'Netch',
    platform: 'Windows',
    icon: '🎮',
    downloadUrl: 'https://github.com/netchx/netch/releases',
    steps: [
      'Download Netch from the link above and extract the ZIP file.',
      'Run Netch.exe as Administrator.',
      'Go to "Server" → "Add VMess/VLESS Server" from the menu.',
      'Paste the V2Ray config or manually enter the server details.',
      'Select the server and mode (e.g., "Mode 1: Process Proxy").',
      'Click "Start" to connect.',
    ],
    features: ['Process-level proxy', 'Multiple modes', 'Low latency', 'Game-friendly'],
  },
  {
    name: 'Happ',
    platform: 'Windows',
    icon: '😊',
    downloadUrl: 'https://github.com/happ-v2ray/happ/releases',
    steps: [
      'Download Happ from the link above and install it.',
      'Open Happ and navigate to the configuration section.',
      'Click "Import from Clipboard" to paste the V2Ray config.',
      'Select the imported server from the list.',
      'Click "Connect" and wait for the connection to establish.',
    ],
    features: ['Simple interface', 'Quick setup', 'Stable connections', 'Auto-update configs'],
  },
];

const androidApps: TutorialApp[] = [
  {
    name: 'v2rayNG',
    platform: 'Android',
    icon: '📱',
    downloadUrl: 'https://github.com/2dust/v2rayNG/releases',
    steps: [
      'Download v2rayNG from the link above or Google Play Store.',
      'Install and open v2rayNG.',
      'Tap the "+" button or go to the import section.',
      'Select "Import from Clipboard" — the config will auto-detect.',
      'Tap the server entry to select it, then tap the connect button.',
      'Allow VPN permission when prompted.',
      'You are now connected! The key icon will appear in your status bar.',
    ],
    features: ['Most popular Android client', 'Supports all protocols', 'Subscription support', 'Route settings'],
  },
  {
    name: 'Netmod',
    platform: 'Android',
    icon: '📲',
    downloadUrl: 'https://github.com/netmod-v2ray/netmod-android/releases',
    steps: [
      'Download Netmod for Android from the link above.',
      'Install the APK (you may need to enable "Unknown Sources").',
      'Open Netmod and tap "Import Config".',
      'Paste the V2Ray config from your clipboard.',
      'Tap "Connect" and grant VPN permission.',
      'Your connection is now active!',
    ],
    features: ['Clean UI', 'Easy import', 'Stable performance', 'Battery optimized'],
  },
];

const iosApps: TutorialApp[] = [
  {
    name: 'V2Box',
    platform: 'iOS',
    icon: '🍎',
    downloadUrl: 'https://apps.apple.com/app/v2box/id6476700831',
    steps: [
      'Download V2Box from the App Store using the link above.',
      'Open V2Box and tap the "+" button to add a server.',
      'Select "Import from Clipboard" to paste the config automatically.',
      'Alternatively, you can scan a QR code or enter details manually.',
      'Select the server and tap the connect button.',
      'Allow VPN permission when prompted by iOS.',
      'You are now connected securely!',
    ],
    features: ['App Store approved', 'Clean interface', 'QR code support', 'Low battery usage'],
  },
];

function AppCard({ app }: { app: TutorialApp }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{app.icon}</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold dark:text-white text-gray-900">{app.name}</h3>
            <span className="text-sm dark:text-gray-400 text-gray-500">{app.platform}</span>
          </div>
          <a
            href={app.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {app.features.map((f, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-lg dark:bg-gray-700/50 bg-gray-100 dark:text-gray-300 text-gray-600">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-brand-400 font-medium hover:text-brand-300 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          {expanded ? 'Hide Tutorial' : 'Show Tutorial'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="border-t dark:border-gray-700 border-gray-200 pt-4">
            <h4 className="font-semibold dark:text-white text-gray-900 mb-3">Step-by-Step Setup:</h4>
            <ol className="space-y-3">
              {app.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm dark:text-gray-300 text-gray-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TutorialPage() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black dark:text-white text-gray-900 mb-4">
            Setup <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto text-lg">
            Follow our step-by-step guides to configure your V2Ray client and start using Ghost VPN Hub.
          </p>
          <button
            onClick={() => setCurrentPage('vpn')}
            className="mt-4 text-brand-400 font-medium hover:text-brand-300 transition-colors inline-flex items-center gap-1"
          >
            Get your config first →
          </button>
        </div>

        {/* Windows Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">Windows</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500">Choose from 3 supported Windows clients</p>
            </div>
          </div>
          <div className="space-y-4">
            {windowsApps.map(app => <AppCard key={app.name} app={app} />)}
          </div>
        </section>

        {/* Android Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">Android</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500">V2Ray clients for Android devices</p>
            </div>
          </div>
          <div className="space-y-4">
            {androidApps.map(app => <AppCard key={app.name} app={app} />)}
          </div>
        </section>

        {/* iOS Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
              <span className="text-lg">🍎</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">iOS</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500">V2Ray client for iPhone & iPad</p>
            </div>
          </div>
          <div className="space-y-4">
            {iosApps.map(app => <AppCard key={app.name} app={app} />)}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">❓ Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Which client should I use?', a: 'For Windows, we recommend Netmod for beginners and Netch for advanced users. On Android, v2rayNG is the most popular and stable choice. iOS users should use V2Box.' },
                { q: 'Why is my connection slow?', a: 'Try switching to a different server. Server load percentages are shown on the server selection page. Lower load usually means better speed.' },
                { q: 'My config is not working!', a: 'Make sure you selected the correct ISP and package that matches your active mobile data plan. Configs are optimized for specific packages only.' },
                { q: 'Do I need to watch ads every time?', a: 'Yes, you need to watch 3 short ads each time to get a new config. This helps us keep the service free for everyone.' },
                { q: 'Is this safe to use?', a: 'Yes! V2Ray is a well-known and trusted protocol. Our configs use TLS encryption to protect your data.' },
              ].map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b dark:border-gray-700 border-gray-200 pb-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="font-semibold dark:text-white text-gray-900 text-sm">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 dark:text-gray-400 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400 text-gray-500 shrink-0" />}
      </button>
      {open && <p className="text-sm dark:text-gray-400 text-gray-500 mt-2 animate-fade-in">{answer}</p>}
    </div>
  );
}
