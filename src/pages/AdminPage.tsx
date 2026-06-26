import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Server, ISP, VpnPackage, V2RayConfig, AppNotification } from '../types';
import {
  Lock, BarChart3, Server as ServerIcon, Wifi, Package, Code, Bell,
  Plus, Pencil, Trash2, X, Check, LogOut, Eye, TrendingUp,
  Globe, Shield, ChevronRight
} from 'lucide-react';

type AdminTab = 'overview' | 'servers' | 'isps' | 'packages' | 'configs' | 'notifications';

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto dark:bg-gray-900 bg-white rounded-2xl shadow-2xl border dark:border-gray-700 border-gray-200 modal-scroll">
        <div className="sticky top-0 dark:bg-gray-900 bg-white z-10 flex items-center justify-between p-4 border-b dark:border-gray-700 border-gray-200">
          <h3 className="font-bold dark:text-white text-gray-900">{title}</h3>
          <button onClick={onClose} className="dark:text-gray-400 text-gray-500 hover:text-red-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl dark:bg-gray-800 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl dark:bg-gray-800 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-xl dark:bg-gray-800 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-mono"
      />
    </div>
  );
}

function BarChart({ data, labels, title }: { data: Record<string, number>; labels: Record<string, string>; title: string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...Object.values(data), 1);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-bold dark:text-white text-gray-900 mb-4 text-sm">{title}</h3>
      <div className="space-y-3">
        {entries.map(([key, val]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="dark:text-gray-300 text-gray-600">{labels[key] || key}</span>
              <span className="dark:text-gray-400 text-gray-500">{val}</span>
            </div>
            <div className="h-2 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 transition-all duration-500" style={{ width: `${(val / maxVal) * 100}%` }} />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-4">No data yet</p>}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const app = useApp();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!app.adminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg px-4">
        <div className="glass rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-2xl font-black dark:text-white text-gray-900 mb-2">Admin Login</h2>
          <p className="dark:text-gray-400 text-gray-500 text-sm mb-6">Enter the admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setLoginError(false); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (!app.adminLogin(password)) setLoginError(true);
              }
            }}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl dark:bg-gray-800 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-white text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-center"
          />
          {loginError && <p className="text-red-400 text-sm mb-3">Incorrect password</p>}
          <button
            onClick={() => { if (!app.adminLogin(password)) setLoginError(true); }}
            className="w-full px-6 py-3 bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all"
          >
            Login
          </button>
          <p className="text-xs dark:text-gray-500 text-gray-400 mt-4">Default: ghostvpn2024</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'servers', label: 'Servers', icon: ServerIcon },
    { id: 'isps', label: 'ISPs', icon: Wifi },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'configs', label: 'Configs', icon: Code },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const totalCopies = app.getTotalCopies();
  const todayCopies = app.getTodayCopies();
  const popularISP = app.getPopularISP();
  const popularPackage = app.getPopularPackage();
  const popularServer = app.getPopularServer();
  const ispStats = app.getCopiesByISP();
  const packageStats = app.getCopiesByPackage();
  const serverStats = app.getCopiesByServer();
  const recentStats = app.getRecentStats();

  const ispLabels: Record<string, string> = {};
  app.isps.forEach(i => { ispLabels[i.id] = i.name; });
  const packageLabels: Record<string, string> = {};
  app.packages.forEach(p => { packageLabels[p.id] = p.name; });
  const serverLabels: Record<string, string> = {};
  app.servers.forEach(s => { serverLabels[s.id] = s.name; });

  // CRUD helpers
  const openAddModal = (_tab?: AdminTab) => {
    setEditingItem(null);
    setFormState({});
    setModalOpen(true);
  };

  const openEditModal = (item: any, tab: AdminTab) => {
    setEditingItem(item);
    if (tab === 'servers') {
      setFormState({ id: item.id, name: item.name, location: item.location, flag: item.flag, status: item.status, load: String(item.load) });
    } else if (tab === 'isps') {
      setFormState({ id: item.id, name: item.name, logo: item.logo, color: item.color });
    } else if (tab === 'packages') {
      setFormState({ id: item.id, name: item.name, ispId: item.ispId, description: item.description, speed: item.speed });
    } else if (tab === 'configs') {
      setFormState({ id: item.id, serverId: item.serverId, packageId: item.packageId, config: item.config, protocol: item.protocol, lastUpdated: item.lastUpdated });
    } else if (tab === 'notifications') {
      setFormState({ id: item.id, title: item.title, message: item.message, date: item.date, type: item.type, pinned: String(item.pinned) });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (activeTab === 'servers') {
      const server: Server = {
        id: editingItem?.id || formState.id || `srv-${Date.now()}`,
        name: formState.name || '',
        location: formState.location || '',
        flag: formState.flag || '🌐',
        status: (formState.status as Server['status']) || 'online',
        load: parseInt(formState.load) || 0,
      };
      if (editingItem) app.updateServer(server); else app.addServer(server);
    } else if (activeTab === 'isps') {
      const isp: ISP = {
        id: editingItem?.id || formState.id || `isp-${Date.now()}`,
        name: formState.name || '',
        logo: formState.logo || '📡',
        color: formState.color || '#10b981',
      };
      if (editingItem) app.updateISP(isp); else app.addISP(isp);
    } else if (activeTab === 'packages') {
      const pkg: VpnPackage = {
        id: editingItem?.id || formState.id || `pkg-${Date.now()}`,
        name: formState.name || '',
        ispId: formState.ispId || '',
        description: formState.description || '',
        speed: formState.speed || '',
      };
      if (editingItem) app.updatePackage(pkg); else app.addPackage(pkg);
    } else if (activeTab === 'configs') {
      const config: V2RayConfig = {
        id: editingItem?.id || formState.id || `cfg-${Date.now()}`,
        serverId: formState.serverId || '',
        packageId: formState.packageId || '',
        config: formState.config || '',
        protocol: formState.protocol || 'vless',
        copyCount: editingItem?.copyCount || 0,
        lastUpdated: formState.lastUpdated || new Date().toISOString().split('T')[0],
      };
      if (editingItem) app.updateConfig(config); else app.addConfig(config);
    } else if (activeTab === 'notifications') {
      const notif: AppNotification = {
        id: editingItem?.id || formState.id || `notif-${Date.now()}`,
        title: formState.title || '',
        message: formState.message || '',
        date: formState.date || new Date().toISOString().split('T')[0],
        type: (formState.type as AppNotification['type']) || 'info',
        pinned: formState.pinned === 'true',
      };
      if (editingItem) app.updateNotification(notif); else app.addNotification(notif);
    }
    setModalOpen(false);
    setFormState({});
    setEditingItem(null);
    app.showToast(editingItem ? 'Updated successfully!' : 'Added successfully!');
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'servers') app.deleteServer(id);
    else if (activeTab === 'isps') app.deleteISP(id);
    else if (activeTab === 'packages') app.deletePackage(id);
    else if (activeTab === 'configs') app.deleteConfig(id);
    else if (activeTab === 'notifications') app.deleteNotification(id);
    setDeleteConfirm(null);
    app.showToast('Deleted successfully!');
  };

  const renderModalForm = () => {
    if (activeTab === 'servers') {
      return (
        <>
          {!editingItem && <InputField label="ID" value={formState.id || ''} onChange={v => setFormState(s => ({ ...s, id: v }))} placeholder="e.g., sg3" />}
          <InputField label="Name" value={formState.name || ''} onChange={v => setFormState(s => ({ ...s, name: v }))} placeholder="e.g., Singapore SG-3" />
          <InputField label="Location" value={formState.location || ''} onChange={v => setFormState(s => ({ ...s, location: v }))} placeholder="e.g., Singapore" />
          <InputField label="Flag Emoji" value={formState.flag || ''} onChange={v => setFormState(s => ({ ...s, flag: v }))} placeholder="🇸🇬" />
          <SelectField label="Status" value={formState.status || 'online'} onChange={v => setFormState(s => ({ ...s, status: v }))} options={[
            { value: 'online', label: 'Online' }, { value: 'offline', label: 'Offline' }, { value: 'maintenance', label: 'Maintenance' }
          ]} />
          <InputField label="Load %" value={formState.load || '0'} onChange={v => setFormState(s => ({ ...s, load: v }))} type="number" />
        </>
      );
    } else if (activeTab === 'isps') {
      return (
        <>
          {!editingItem && <InputField label="ID" value={formState.id || ''} onChange={v => setFormState(s => ({ ...s, id: v }))} placeholder="e.g., mobitel" />}
          <InputField label="Name" value={formState.name || ''} onChange={v => setFormState(s => ({ ...s, name: v }))} placeholder="e.g., Mobitel" />
          <InputField label="Logo Emoji" value={formState.logo || ''} onChange={v => setFormState(s => ({ ...s, logo: v }))} placeholder="📡" />
          <InputField label="Brand Color" value={formState.color || ''} onChange={v => setFormState(s => ({ ...s, color: v }))} placeholder="#10b981" />
        </>
      );
    } else if (activeTab === 'packages') {
      return (
        <>
          {!editingItem && <InputField label="ID" value={formState.id || ''} onChange={v => setFormState(s => ({ ...s, id: v }))} placeholder="e.g., dialog-youtube" />}
          <InputField label="Name" value={formState.name || ''} onChange={v => setFormState(s => ({ ...s, name: v }))} placeholder="e.g., YouTube" />
          <SelectField label="ISP" value={formState.ispId || ''} onChange={v => setFormState(s => ({ ...s, ispId: v }))} options={[
            { value: '', label: 'Select ISP' }, ...app.isps.map(i => ({ value: i.id, label: i.name }))
          ]} />
          <InputField label="Description" value={formState.description || ''} onChange={v => setFormState(s => ({ ...s, description: v }))} placeholder="Package description" />
          <InputField label="Speed" value={formState.speed || ''} onChange={v => setFormState(s => ({ ...s, speed: v }))} placeholder="e.g., High, Ultra HD" />
        </>
      );
    } else if (activeTab === 'configs') {
      return (
        <>
          {!editingItem && <InputField label="ID" value={formState.id || ''} onChange={v => setFormState(s => ({ ...s, id: v }))} placeholder="e.g., cfg-30" />}
          <SelectField label="Server" value={formState.serverId || ''} onChange={v => setFormState(s => ({ ...s, serverId: v }))} options={[
            { value: '', label: 'Select Server' }, ...app.servers.map(s => ({ value: s.id, label: s.name }))
          ]} />
          <SelectField label="Package" value={formState.packageId || ''} onChange={v => setFormState(s => ({ ...s, packageId: v }))} options={[
            { value: '', label: 'Select Package' }, ...app.packages.map(p => {
              const isp = app.isps.find(i => i.id === p.ispId);
              return { value: p.id, label: `${isp?.name || ''} - ${p.name}` };
            })
          ]} />
          <SelectField label="Protocol" value={formState.protocol || 'vless'} onChange={v => setFormState(s => ({ ...s, protocol: v }))} options={[
            { value: 'vless', label: 'VLESS' }, { value: 'vmess', label: 'VMess' }
          ]} />
          <TextAreaField label="Config String" value={formState.config || ''} onChange={v => setFormState(s => ({ ...s, config: v }))} rows={6} />
          <InputField label="Last Updated" value={formState.lastUpdated || ''} onChange={v => setFormState(s => ({ ...s, lastUpdated: v }))} type="date" />
        </>
      );
    } else if (activeTab === 'notifications') {
      return (
        <>
          {!editingItem && <InputField label="ID" value={formState.id || ''} onChange={v => setFormState(s => ({ ...s, id: v }))} placeholder="e.g., notif-5" />}
          <InputField label="Title" value={formState.title || ''} onChange={v => setFormState(s => ({ ...s, title: v }))} placeholder="Notification title" />
          <TextAreaField label="Message" value={formState.message || ''} onChange={v => setFormState(s => ({ ...s, message: v }))} rows={3} />
          <SelectField label="Type" value={formState.type || 'info'} onChange={v => setFormState(s => ({ ...s, type: v }))} options={[
            { value: 'info', label: 'ℹ️ Info' }, { value: 'success', label: '✅ Success' }, { value: 'warning', label: '⚠️ Warning' }, { value: 'error', label: '❌ Error' }
          ]} />
          <SelectField label="Pinned" value={formState.pinned || 'false'} onChange={v => setFormState(s => ({ ...s, pinned: v }))} options={[
            { value: 'false', label: 'Not Pinned' }, { value: 'true', label: 'Pinned' }
          ]} />
          <InputField label="Date" value={formState.date || ''} onChange={v => setFormState(s => ({ ...s, date: v }))} type="date" />
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white text-gray-900">Admin Dashboard</h1>
            <p className="dark:text-gray-400 text-gray-500 text-sm">Manage your VPN service</p>
          </div>
          <button onClick={app.adminLogout} className="flex items-center gap-2 px-4 py-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 shrink-0">
            <div className="glass rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id ? 'bg-brand-500/20 text-brand-400' : 'dark:text-gray-400 text-gray-500 hover:text-brand-400 hover:bg-brand-500/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Copies', value: totalCopies, icon: Eye, color: 'brand' },
                    { label: 'Today', value: todayCopies, icon: TrendingUp, color: 'cyan' },
                    { label: 'Servers', value: app.servers.length, icon: Globe, color: 'violet' },
                    { label: 'Configs', value: app.configs.length, icon: Code, color: 'amber' },
                  ].map((stat, i) => (
                    <div key={i} className="glass rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color === 'brand' ? 'text-brand-400' : stat.color === 'cyan' ? 'text-cyan-400' : stat.color === 'violet' ? 'text-violet-400' : 'text-amber-400'}`} />
                        <span className="text-xs dark:text-gray-400 text-gray-500">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-black dark:text-white text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Popular items */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass rounded-2xl p-5">
                    <div className="text-xs dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Popular Server</div>
                    <div className="font-bold dark:text-white text-gray-900">{popularServer ? `${popularServer.flag} ${popularServer.name}` : 'No data'}</div>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="text-xs dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-1"><Shield className="w-3 h-3" /> Popular ISP</div>
                    <div className="font-bold dark:text-white text-gray-900">{popularISP ? `${popularISP.logo} ${popularISP.name}` : 'No data'}</div>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="text-xs dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-1"><Package className="w-3 h-3" /> Popular Package</div>
                    <div className="font-bold dark:text-white text-gray-900">{popularPackage ? popularPackage.name : 'No data'}</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BarChart data={ispStats} labels={ispLabels} title="Copies by ISP" />
                  <BarChart data={packageStats} labels={packageLabels} title="Copies by Package" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BarChart data={serverStats} labels={serverLabels} title="Copies by Server" />
                  {/* Recent Activity */}
                  <div className="glass rounded-2xl p-5">
                    <h3 className="font-bold dark:text-white text-gray-900 mb-4 text-sm">Recent Activity</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {recentStats.length === 0 ? (
                        <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-4">No activity yet</p>
                      ) : (
                        recentStats.map(stat => (
                          <div key={stat.id} className="flex items-center gap-2 text-xs p-2 rounded-lg dark:bg-gray-800/50 bg-gray-50">
                            <ChevronRight className="w-3 h-3 text-brand-400" />
                            <span className="dark:text-gray-300 text-gray-600 truncate">
                              {serverLabels[stat.serverId] || stat.serverId} → {ispLabels[stat.ispId] || stat.ispId} → {packageLabels[stat.packageId] || stat.packageId}
                            </span>
                            <span className="dark:text-gray-500 text-gray-400 ml-auto whitespace-nowrap">
                              {new Date(stat.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Configs Table */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-bold dark:text-white text-gray-900 mb-4 text-sm">Top Configs by Copy Count</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="dark:text-gray-400 text-gray-500 border-b dark:border-gray-700 border-gray-200">
                          <th className="text-left py-2 px-2">Config</th>
                          <th className="text-left py-2 px-2">Server</th>
                          <th className="text-left py-2 px-2">Package</th>
                          <th className="text-right py-2 px-2">Copies</th>
                          <th className="text-right py-2 px-2">Protocol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...app.configs].sort((a, b) => b.copyCount - a.copyCount).slice(0, 10).map(cfg => (
                          <tr key={cfg.id} className="border-b dark:border-gray-800 border-gray-100">
                            <td className="py-2 px-2 dark:text-gray-300 text-gray-600 font-mono text-xs">{cfg.id}</td>
                            <td className="py-2 px-2 dark:text-gray-300 text-gray-600">{serverLabels[cfg.serverId] || cfg.serverId}</td>
                            <td className="py-2 px-2 dark:text-gray-300 text-gray-600">{packageLabels[cfg.packageId] || cfg.packageId}</td>
                            <td className="py-2 px-2 text-right dark:text-brand-400 text-brand-600 font-bold">{cfg.copyCount}</td>
                            <td className="py-2 px-2 text-right"><span className="text-xs px-2 py-0.5 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600">{cfg.protocol.toUpperCase()}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Servers Tab */}
            {activeTab === 'servers' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">Servers ({app.servers.length})</h2>
                  <button onClick={() => openAddModal('servers')} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
                    <Plus className="w-4 h-4" /> Add Server
                  </button>
                </div>
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="dark:text-gray-400 text-gray-500 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-gray-50">
                          <th className="text-left py-3 px-4">Server</th>
                          <th className="text-left py-3 px-4">Location</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Load</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.servers.map(srv => (
                          <tr key={srv.id} className="border-b dark:border-gray-800 border-gray-100 hover:dark:bg-gray-800/30 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4"><span className="mr-2">{srv.flag}</span><span className="dark:text-white text-gray-900 font-medium">{srv.name}</span></td>
                            <td className="py-3 px-4 dark:text-gray-300 text-gray-600">{srv.location}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                                srv.status === 'online' ? 'bg-green-500/15 text-green-400' :
                                srv.status === 'maintenance' ? 'bg-amber-500/15 text-amber-400' :
                                'bg-red-500/15 text-red-400'
                              }`}>
                                <span className={`status-dot status-${srv.status}`} />
                                {srv.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 dark:text-gray-300 text-gray-600">{srv.load}%</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditModal(srv, 'servers')} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                                {deleteConfirm === srv.id ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => handleDelete(srv.id)} className="p-1.5 text-red-400 hover:text-red-300"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setDeleteConfirm(null)} className="p-1.5 dark:text-gray-400 text-gray-500"><X className="w-4 h-4" /></button>
                                  </div>
                                ) : (
                                  <button onClick={() => setDeleteConfirm(srv.id)} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ISPs Tab */}
            {activeTab === 'isps' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">ISPs ({app.isps.length})</h2>
                  <button onClick={() => openAddModal('isps')} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
                    <Plus className="w-4 h-4" /> Add ISP
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {app.isps.map(isp => (
                    <div key={isp.id} className="glass rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{isp.logo}</span>
                          <div>
                            <h3 className="font-bold dark:text-white text-gray-900">{isp.name}</h3>
                            <span className="text-xs dark:text-gray-400 text-gray-500">{isp.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(isp, 'isps')} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                          {deleteConfirm === isp.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(isp.id)} className="p-1.5 text-red-400"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-1.5 dark:text-gray-400 text-gray-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(isp.id)} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: isp.color }} />
                        <span className="text-xs dark:text-gray-400 text-gray-500">{isp.color}</span>
                        <span className="text-xs dark:text-gray-500 text-gray-400 ml-auto">{app.packages.filter(p => p.ispId === isp.id).length} packages</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">Packages ({app.packages.length})</h2>
                  <button onClick={() => openAddModal('packages')} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
                    <Plus className="w-4 h-4" /> Add Package
                  </button>
                </div>
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="dark:text-gray-400 text-gray-500 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-gray-50">
                          <th className="text-left py-3 px-4">Package</th>
                          <th className="text-left py-3 px-4">ISP</th>
                          <th className="text-left py-3 px-4">Speed</th>
                          <th className="text-left py-3 px-4">Configs</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.packages.map(pkg => {
                          const isp = app.isps.find(i => i.id === pkg.ispId);
                          const configCount = app.configs.filter(c => c.packageId === pkg.id).length;
                          return (
                            <tr key={pkg.id} className="border-b dark:border-gray-800 border-gray-100">
                              <td className="py-3 px-4">
                                <div className="dark:text-white text-gray-900 font-medium">{pkg.name}</div>
                                <div className="text-xs dark:text-gray-500 text-gray-400">{pkg.description}</div>
                              </td>
                              <td className="py-3 px-4 dark:text-gray-300 text-gray-600">{isp?.logo} {isp?.name}</td>
                              <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600">{pkg.speed}</span></td>
                              <td className="py-3 px-4 dark:text-gray-300 text-gray-600">{configCount}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => openEditModal(pkg, 'packages')} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                                  {deleteConfirm === pkg.id ? (
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => handleDelete(pkg.id)} className="p-1.5 text-red-400"><Check className="w-4 h-4" /></button>
                                      <button onClick={() => setDeleteConfirm(null)} className="p-1.5 dark:text-gray-400 text-gray-500"><X className="w-4 h-4" /></button>
                                    </div>
                                  ) : (
                                    <button onClick={() => setDeleteConfirm(pkg.id)} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Configs Tab */}
            {activeTab === 'configs' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">V2Ray Configs ({app.configs.length})</h2>
                  <button onClick={() => openAddModal('configs')} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
                    <Plus className="w-4 h-4" /> Add Config
                  </button>
                </div>
                <div className="space-y-3">
                  {app.configs.map(cfg => {
                    const srv = app.servers.find(s => s.id === cfg.serverId);
                    const pkg = app.packages.find(p => p.id === cfg.packageId);
                    const isp = pkg ? app.isps.find(i => i.id === pkg.ispId) : null;
                    return (
                      <div key={cfg.id} className="glass rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-bold dark:text-white text-gray-900">{cfg.id}</span>
                              <span className="text-xs px-2 py-0.5 rounded-lg bg-brand-500/15 text-brand-400">{cfg.protocol.toUpperCase()}</span>
                              <span className="text-xs dark:text-gray-500 text-gray-400">Copies: {cfg.copyCount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs dark:text-gray-400 text-gray-500 flex-wrap">
                              <span>{srv?.flag} {srv?.name}</span>
                              <span>→</span>
                              <span>{isp?.logo} {isp?.name}</span>
                              <span>→</span>
                              <span>{pkg?.name}</span>
                            </div>
                            <div className="mt-2 dark:bg-gray-900/50 bg-gray-50 rounded-lg p-2 text-xs font-mono dark:text-gray-400 text-gray-500 truncate">
                              {cfg.config.substring(0, 80)}...
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => openEditModal(cfg, 'configs')} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                            {deleteConfirm === cfg.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(cfg.id)} className="p-1.5 text-red-400"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteConfirm(null)} className="p-1.5 dark:text-gray-400 text-gray-500"><X className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(cfg.id)} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white text-gray-900">Notifications ({app.notifications.length})</h2>
                  <button onClick={() => openAddModal('notifications')} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
                    <Plus className="w-4 h-4" /> Add Notification
                  </button>
                </div>
                <div className="space-y-3">
                  {app.notifications.map(notif => (
                    <div key={notif.id} className={`glass rounded-xl p-4 ${notif.pinned ? 'border-l-4 border-brand-500' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold dark:text-white text-gray-900">{notif.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              notif.type === 'success' ? 'bg-green-500/15 text-green-400' :
                              notif.type === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                              notif.type === 'error' ? 'bg-red-500/15 text-red-400' :
                              'bg-blue-500/15 text-blue-400'
                            }`}>{notif.type}</span>
                            {notif.pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400">📌 Pinned</span>}
                          </div>
                          <p className="text-sm dark:text-gray-400 text-gray-500">{notif.message}</p>
                          <span className="text-xs dark:text-gray-600 text-gray-400">{notif.date}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => openEditModal(notif, 'notifications')} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                          {deleteConfirm === notif.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(notif.id)} className="p-1.5 text-red-400"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-1.5 dark:text-gray-400 text-gray-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(notif.id)} className="p-1.5 dark:text-gray-400 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {app.notifications.length === 0 && (
                    <div className="text-center py-12 dark:text-gray-500 text-gray-400">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setFormState({}); setEditingItem(null); }}
          title={editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
        >
          {renderModalForm()}
          <div className="flex gap-3 mt-4 pt-4 border-t dark:border-gray-700 border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
            >
              {editingItem ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => { setModalOpen(false); setFormState({}); setEditingItem(null); }}
              className="px-4 py-2 glass rounded-xl dark:text-gray-300 text-gray-600 hover:text-red-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
