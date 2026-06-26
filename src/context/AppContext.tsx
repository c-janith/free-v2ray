import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Server, ISP, VpnPackage, V2RayConfig, AppNotification, AppSettings, CopyStat } from '../types';
import { initialServers, initialISPs, initialPackages, initialConfigs, initialNotifications, defaultSettings, ADMIN_PASSWORD } from '../data/initialData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc,
  increment, query, orderBy, limit, writeBatch
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  loading: boolean;
  servers: Server[];
  isps: ISP[];
  packages: VpnPackage[];
  configs: V2RayConfig[];
  notifications: AppNotification[];
  copyStats: CopyStat[];
  settings: AppSettings;
  adminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addServer: (server: Server) => void;
  updateServer: (server: Server) => void;
  deleteServer: (id: string) => void;
  addISP: (isp: ISP) => void;
  updateISP: (isp: ISP) => void;
  deleteISP: (id: string) => void;
  addPackage: (pkg: VpnPackage) => void;
  updatePackage: (pkg: VpnPackage) => void;
  deletePackage: (id: string) => void;
  addConfig: (config: V2RayConfig) => void;
  updateConfig: (config: V2RayConfig) => void;
  deleteConfig: (id: string) => void;
  addNotification: (notif: AppNotification) => void;
  updateNotification: (notif: AppNotification) => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  recordCopy: (configId: string) => void;
  getTotalCopies: () => number;
  getTodayCopies: () => number;
  getPopularISP: () => ISP | null;
  getPopularPackage: () => VpnPackage | null;
  getPopularServer: () => Server | null;
  getCopiesByISP: () => Record<string, number>;
  getCopiesByPackage: () => Record<string, number>;
  getCopiesByServer: () => Record<string, number>;
  getRecentStats: () => CopyStat[];
  seedDatabase: () => Promise<void>;
  toast: string | null;
  showToast: (msg: string) => void;
  usingFirebase: boolean;
  watchingAds: boolean;
  setWatchingAds: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadLS<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function saveLS<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* full */ }
}

function getDB(): Firestore {
  return db!;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadLS('gvh-theme', 'dark'));
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState<Server[]>([]);
  const [isps, setISPs] = useState<ISP[]>([]);
  const [packages, setPackages] = useState<VpnPackage[]>([]);
  const [configs, setConfigs] = useState<V2RayConfig[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [copyStats, setCopyStats] = useState<CopyStat[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [watchingAds, setWatchingAds] = useState(false);

  // Persist theme
  useEffect(() => {
    saveLS('gvh-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load data - Firebase or localStorage
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const database = db;
      const collNames = [
        { name: 'servers', setter: setServers as (v: any[]) => void },
        { name: 'isps', setter: setISPs as (v: any[]) => void },
        { name: 'packages', setter: setPackages as (v: any[]) => void },
        { name: 'configs', setter: setConfigs as (v: any[]) => void },
        { name: 'notifications', setter: setNotifications as (v: any[]) => void },
      ];

      const unsubs = collNames.map(({ name, setter }) =>
        onSnapshot(collection(database, name), (snap) => {
          setter(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        })
      );

      unsubs.push(
        onSnapshot(doc(database, 'settings', 'app'), (snap) => {
          if (snap.exists()) setSettings(snap.data() as AppSettings);
        })
      );

      unsubs.push(
        onSnapshot(query(collection(database, 'copyStats'), orderBy('timestamp', 'desc'), limit(500)), (snap) => {
          setCopyStats(snap.docs.map(d => ({ id: d.id, ...d.data() } as CopyStat)));
        })
      );

      setLoading(false);
      return () => unsubs.forEach(u => u());
    } else {
      setServers(loadLS('gvh-servers', initialServers));
      setISPs(loadLS('gvh-isps', initialISPs));
      setPackages(loadLS('gvh-packages', initialPackages));
      setConfigs(loadLS('gvh-configs', initialConfigs));
      setNotifications(loadLS('gvh-notifications', initialNotifications));
      setCopyStats(loadLS('gvh-copyStats', []));
      setSettings(loadLS('gvh-settings', defaultSettings));
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-servers', servers); }, [servers]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-isps', isps); }, [isps]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-packages', packages); }, [packages]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-configs', configs); }, [configs]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-notifications', notifications); }, [notifications]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-copyStats', copyStats); }, [copyStats]);
  useEffect(() => { if (!isFirebaseConfigured) saveLS('gvh-settings', settings); }, [settings]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const adminLogin = useCallback((pw: string) => { if (pw === ADMIN_PASSWORD) { setAdminAuthenticated(true); return true; } return false; }, []);
  const adminLogout = useCallback(() => setAdminAuthenticated(false), []);
  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); }, []);

  // CRUD Servers
  const addServer = useCallback((s: Server) => {
    if (isFirebaseConfigured) { const { id, ...data } = s; setDoc(doc(getDB(), 'servers', id), data); }
    else { setServers(prev => { const n = [...prev, s]; saveLS('gvh-servers', n); return n; }); }
  }, []);
  const updateServer = useCallback((s: Server) => {
    if (isFirebaseConfigured) { const { id, ...data } = s; updateDoc(doc(getDB(), 'servers', id), data); }
    else { setServers(prev => { const n = prev.map(x => x.id === s.id ? s : x); saveLS('gvh-servers', n); return n; }); }
  }, []);
  const deleteServer = useCallback((id: string) => {
    if (isFirebaseConfigured) { deleteDoc(doc(getDB(), 'servers', id)); }
    else { setServers(prev => { const n = prev.filter(x => x.id !== id); saveLS('gvh-servers', n); return n; }); }
  }, []);

  // CRUD ISPs
  const addISP = useCallback((i: ISP) => {
    if (isFirebaseConfigured) { const { id, ...data } = i; setDoc(doc(getDB(), 'isps', id), data); }
    else { setISPs(prev => { const n = [...prev, i]; saveLS('gvh-isps', n); return n; }); }
  }, []);
  const updateISP = useCallback((i: ISP) => {
    if (isFirebaseConfigured) { const { id, ...data } = i; updateDoc(doc(getDB(), 'isps', id), data); }
    else { setISPs(prev => { const n = prev.map(x => x.id === i.id ? i : x); saveLS('gvh-isps', n); return n; }); }
  }, []);
  const deleteISP = useCallback((id: string) => {
    if (isFirebaseConfigured) { deleteDoc(doc(getDB(), 'isps', id)); }
    else { setISPs(prev => { const n = prev.filter(x => x.id !== id); saveLS('gvh-isps', n); return n; }); }
  }, []);

  // CRUD Packages
  const addPackage = useCallback((p: VpnPackage) => {
    if (isFirebaseConfigured) { const { id, ...data } = p; setDoc(doc(getDB(), 'packages', id), data); }
    else { setPackages(prev => { const n = [...prev, p]; saveLS('gvh-packages', n); return n; }); }
  }, []);
  const updatePackage = useCallback((p: VpnPackage) => {
    if (isFirebaseConfigured) { const { id, ...data } = p; updateDoc(doc(getDB(), 'packages', id), data); }
    else { setPackages(prev => { const n = prev.map(x => x.id === p.id ? p : x); saveLS('gvh-packages', n); return n; }); }
  }, []);
  const deletePackage = useCallback((id: string) => {
    if (isFirebaseConfigured) { deleteDoc(doc(getDB(), 'packages', id)); }
    else { setPackages(prev => { const n = prev.filter(x => x.id !== id); saveLS('gvh-packages', n); return n; }); }
  }, []);

  // CRUD Configs
  const addConfig = useCallback((c: V2RayConfig) => {
    if (isFirebaseConfigured) { const { id, ...data } = c; setDoc(doc(getDB(), 'configs', id), data); }
    else { setConfigs(prev => { const n = [...prev, c]; saveLS('gvh-configs', n); return n; }); }
  }, []);
  const updateConfig = useCallback((c: V2RayConfig) => {
    if (isFirebaseConfigured) { const { id, ...data } = c; updateDoc(doc(getDB(), 'configs', id), data); }
    else { setConfigs(prev => { const n = prev.map(x => x.id === c.id ? c : x); saveLS('gvh-configs', n); return n; }); }
  }, []);
  const deleteConfig = useCallback((id: string) => {
    if (isFirebaseConfigured) { deleteDoc(doc(getDB(), 'configs', id)); }
    else { setConfigs(prev => { const n = prev.filter(x => x.id !== id); saveLS('gvh-configs', n); return n; }); }
  }, []);

  // CRUD Notifications
  const addNotification = useCallback((n: AppNotification) => {
    if (isFirebaseConfigured) { const { id, ...data } = n; setDoc(doc(getDB(), 'notifications', id), data); }
    else { setNotifications(prev => { const next = [n, ...prev]; saveLS('gvh-notifications', next); return next; }); }
  }, []);
  const updateNotification = useCallback((n: AppNotification) => {
    if (isFirebaseConfigured) { const { id, ...data } = n; updateDoc(doc(getDB(), 'notifications', id), data); }
    else { setNotifications(prev => { const next = prev.map(x => x.id === n.id ? n : x); saveLS('gvh-notifications', next); return next; }); }
  }, []);
  const deleteNotification = useCallback((id: string) => {
    if (isFirebaseConfigured) { deleteDoc(doc(getDB(), 'notifications', id)); }
    else { setNotifications(prev => { const nv = prev.filter(x => x.id !== id); saveLS('gvh-notifications', nv); return nv; }); }
  }, []);

  // Settings
  const updateSettings = useCallback((s: AppSettings) => {
    if (isFirebaseConfigured) { setDoc(doc(getDB(), 'settings', 'app'), s); }
    else { setSettings(s); saveLS('gvh-settings', s); }
  }, []);

  // Record copy
  const recordCopy = useCallback((configId: string) => {
    const config = configs.find(c => c.id === configId);
    if (!config) return;
    const pkg = packages.find(p => p.id === config.packageId);
    const stat: CopyStat = {
      id: `stat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      configId, timestamp: new Date().toISOString(),
      serverId: config.serverId, ispId: pkg?.ispId || '', packageId: config.packageId,
    };
    if (isFirebaseConfigured) {
      addDoc(collection(getDB(), 'copyStats'), stat);
      updateDoc(doc(getDB(), 'configs', configId), { copyCount: increment(1) });
    } else {
      setCopyStats(prev => { const n = [...prev, stat]; saveLS('gvh-copyStats', n); return n; });
      setConfigs(prev => { const n = prev.map(c => c.id === configId ? { ...c, copyCount: c.copyCount + 1 } : c); saveLS('gvh-configs', n); return n; });
    }
  }, [configs, packages]);

  // Stats
  const getTotalCopies = useCallback(() => copyStats.length, [copyStats]);
  const getTodayCopies = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return copyStats.filter(s => s.timestamp.startsWith(today)).length;
  }, [copyStats]);
  const getPopularISP = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.ispId] = (c[s.ispId] || 0) + 1; });
    const topId = Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0];
    return isps.find(i => i.id === topId) || null;
  }, [copyStats, isps]);
  const getPopularPackage = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.packageId] = (c[s.packageId] || 0) + 1; });
    const topId = Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0];
    return packages.find(p => p.id === topId) || null;
  }, [copyStats, packages]);
  const getPopularServer = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.serverId] = (c[s.serverId] || 0) + 1; });
    const topId = Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0];
    return servers.find(sv => sv.id === topId) || null;
  }, [copyStats, servers]);
  const getCopiesByISP = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.ispId] = (c[s.ispId] || 0) + 1; }); return c;
  }, [copyStats]);
  const getCopiesByPackage = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.packageId] = (c[s.packageId] || 0) + 1; }); return c;
  }, [copyStats]);
  const getCopiesByServer = useCallback(() => {
    const c: Record<string, number> = {}; copyStats.forEach(s => { c[s.serverId] = (c[s.serverId] || 0) + 1; }); return c;
  }, [copyStats]);
  const getRecentStats = useCallback(() => [...copyStats].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20), [copyStats]);

  // Seed database
  const seedDatabase = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    try {
      const database = getDB();
      const batch = writeBatch(database);
      initialServers.forEach(s => { batch.set(doc(database, 'servers', s.id), s); });
      initialISPs.forEach(i => { batch.set(doc(database, 'isps', i.id), i); });
      initialPackages.forEach(p => { batch.set(doc(database, 'packages', p.id), p); });
      initialConfigs.forEach(c => { batch.set(doc(database, 'configs', c.id), c); });
      initialNotifications.forEach(n => { batch.set(doc(database, 'notifications', n.id), n); });
      batch.set(doc(database, 'settings', 'app'), defaultSettings);
      await batch.commit();
      showToast('Database seeded successfully! 🎉');
    } catch (e: any) {
      showToast('Error seeding: ' + e.message);
    }
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, loading,
      servers, isps, packages, configs, notifications, copyStats, settings,
      adminAuthenticated, adminLogin, adminLogout,
      addServer, updateServer, deleteServer,
      addISP, updateISP, deleteISP,
      addPackage, updatePackage, deletePackage,
      addConfig, updateConfig, deleteConfig,
      addNotification, updateNotification, deleteNotification,
      updateSettings,
      recordCopy, getTotalCopies, getTodayCopies,
      getPopularISP, getPopularPackage, getPopularServer,
      getCopiesByISP, getCopiesByPackage, getCopiesByServer,
      getRecentStats, seedDatabase,
      toast, showToast, usingFirebase: isFirebaseConfigured,
      watchingAds, setWatchingAds,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
