import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Server, ISP, VpnPackage, V2RayConfig, AppNotification, CopyStat, Page } from '../types';
import { initialServers, initialISPs, initialPackages, initialConfigs, initialNotifications, ADMIN_PASSWORD } from '../data/initialData';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  servers: Server[];
  isps: ISP[];
  packages: VpnPackage[];
  configs: V2RayConfig[];
  notifications: AppNotification[];
  copyStats: CopyStat[];
  adminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  // CRUD Servers
  addServer: (server: Server) => void;
  updateServer: (server: Server) => void;
  deleteServer: (id: string) => void;
  // CRUD ISPs
  addISP: (isp: ISP) => void;
  updateISP: (isp: ISP) => void;
  deleteISP: (id: string) => void;
  // CRUD Packages
  addPackage: (pkg: VpnPackage) => void;
  updatePackage: (pkg: VpnPackage) => void;
  deletePackage: (id: string) => void;
  // CRUD Configs
  addConfig: (config: V2RayConfig) => void;
  updateConfig: (config: V2RayConfig) => void;
  deleteConfig: (id: string) => void;
  // CRUD Notifications
  addNotification: (notif: AppNotification) => void;
  updateNotification: (notif: AppNotification) => void;
  deleteNotification: (id: string) => void;
  // Stats
  recordCopy: (configId: string) => void;
  getStatsForConfig: (configId: string) => number;
  getTotalCopies: () => number;
  getTodayCopies: () => number;
  getPopularISP: () => ISP | null;
  getPopularPackage: () => VpnPackage | null;
  getPopularServer: () => Server | null;
  getCopiesByISP: () => Record<string, number>;
  getCopiesByPackage: () => Record<string, number>;
  getCopiesByServer: () => Record<string, number>;
  getRecentStats: () => CopyStat[];
  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadFromStorage('gvh-theme', 'dark'));
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [servers, setServers] = useState<Server[]>(() => loadFromStorage('gvh-servers', initialServers));
  const [isps, setISPs] = useState<ISP[]>(() => loadFromStorage('gvh-isps', initialISPs));
  const [packages, setPackages] = useState<VpnPackage[]>(() => loadFromStorage('gvh-packages', initialPackages));
  const [configs, setConfigs] = useState<V2RayConfig[]>(() => loadFromStorage('gvh-configs', initialConfigs));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('gvh-notifications', initialNotifications));
  const [copyStats, setCopyStats] = useState<CopyStat[]>(() => loadFromStorage('gvh-copyStats', []));
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(() => loadFromStorage('gvh-adminAuth', false));
  const [toast, setToast] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => { saveToStorage('gvh-theme', theme); document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => { saveToStorage('gvh-servers', servers); }, [servers]);
  useEffect(() => { saveToStorage('gvh-isps', isps); }, [isps]);
  useEffect(() => { saveToStorage('gvh-packages', packages); }, [packages]);
  useEffect(() => { saveToStorage('gvh-configs', configs); }, [configs]);
  useEffect(() => { saveToStorage('gvh-notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('gvh-copyStats', copyStats); }, [copyStats]);
  useEffect(() => { saveToStorage('gvh-adminAuth', adminAuthenticated); }, [adminAuthenticated]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const adminLogin = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => setAdminAuthenticated(false), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // CRUD operations
  const addServer = useCallback((s: Server) => setServers(prev => [...prev, s]), []);
  const updateServer = useCallback((s: Server) => setServers(prev => prev.map(x => x.id === s.id ? s : x)), []);
  const deleteServer = useCallback((id: string) => { setServers(prev => prev.filter(x => x.id !== id)); setConfigs(prev => prev.filter(c => c.serverId !== id)); }, []);

  const addISP = useCallback((i: ISP) => setISPs(prev => [...prev, i]), []);
  const updateISP = useCallback((i: ISP) => setISPs(prev => prev.map(x => x.id === i.id ? i : x)), []);
  const deleteISP = useCallback((id: string) => { setISPs(prev => prev.filter(x => x.id !== id)); setPackages(prev => prev.filter(p => p.ispId !== id)); }, []);

  const addPackage = useCallback((p: VpnPackage) => setPackages(prev => [...prev, p]), []);
  const updatePackage = useCallback((p: VpnPackage) => setPackages(prev => prev.map(x => x.id === p.id ? p : x)), []);
  const deletePackage = useCallback((id: string) => { setPackages(prev => prev.filter(x => x.id !== id)); setConfigs(prev => prev.filter(c => c.packageId !== id)); }, []);

  const addConfig = useCallback((c: V2RayConfig) => setConfigs(prev => [...prev, c]), []);
  const updateConfig = useCallback((c: V2RayConfig) => setConfigs(prev => prev.map(x => x.id === c.id ? c : x)), []);
  const deleteConfig = useCallback((id: string) => setConfigs(prev => prev.filter(x => x.id !== id)), []);

  const addNotification = useCallback((n: AppNotification) => setNotifications(prev => [n, ...prev]), []);
  const updateNotification = useCallback((n: AppNotification) => setNotifications(prev => prev.map(x => x.id === n.id ? n : x)), []);
  const deleteNotification = useCallback((id: string) => setNotifications(prev => prev.filter(x => x.id !== id)), []);

  const recordCopy = useCallback((configId: string) => {
    const config = configs.find(c => c.id === configId);
    if (!config) return;
    const pkg = packages.find(p => p.id === config.packageId);
    const stat: CopyStat = {
      id: `stat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      configId,
      timestamp: new Date().toISOString(),
      serverId: config.serverId,
      ispId: pkg?.ispId || '',
      packageId: config.packageId,
    };
    setCopyStats(prev => [...prev, stat]);
    setConfigs(prev => prev.map(c => c.id === configId ? { ...c, copyCount: c.copyCount + 1 } : c));
  }, [configs, packages]);

  const getStatsForConfig = useCallback((configId: string) => {
    return copyStats.filter(s => s.configId === configId).length;
  }, [copyStats]);

  const getTotalCopies = useCallback(() => copyStats.length, [copyStats]);

  const getTodayCopies = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return copyStats.filter(s => s.timestamp.startsWith(today)).length;
  }, [copyStats]);

  const getPopularISP = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.ispId] = (counts[s.ispId] || 0) + 1; });
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return isps.find(i => i.id === topId) || null;
  }, [copyStats, isps]);

  const getPopularPackage = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.packageId] = (counts[s.packageId] || 0) + 1; });
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return packages.find(p => p.id === topId) || null;
  }, [copyStats, packages]);

  const getPopularServer = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.serverId] = (counts[s.serverId] || 0) + 1; });
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return servers.find(sv => sv.id === topId) || null;
  }, [copyStats, servers]);

  const getCopiesByISP = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.ispId] = (counts[s.ispId] || 0) + 1; });
    return counts;
  }, [copyStats]);

  const getCopiesByPackage = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.packageId] = (counts[s.packageId] || 0) + 1; });
    return counts;
  }, [copyStats]);

  const getCopiesByServer = useCallback(() => {
    const counts: Record<string, number> = {};
    copyStats.forEach(s => { counts[s.serverId] = (counts[s.serverId] || 0) + 1; });
    return counts;
  }, [copyStats]);

  const getRecentStats = useCallback(() => {
    return [...copyStats].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);
  }, [copyStats]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, currentPage, setCurrentPage,
      servers, isps, packages, configs, notifications, copyStats,
      adminAuthenticated, adminLogin, adminLogout,
      addServer, updateServer, deleteServer,
      addISP, updateISP, deleteISP,
      addPackage, updatePackage, deletePackage,
      addConfig, updateConfig, deleteConfig,
      addNotification, updateNotification, deleteNotification,
      recordCopy, getStatsForConfig, getTotalCopies, getTodayCopies,
      getPopularISP, getPopularPackage, getPopularServer,
      getCopiesByISP, getCopiesByPackage, getCopiesByServer,
      getRecentStats,
      toast, showToast,
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
