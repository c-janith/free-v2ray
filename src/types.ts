export interface Server {
  id: string;
  name: string;
  location: string;
  flag: string;
  status: 'online' | 'offline' | 'maintenance';
  load: number;
}

export interface ISP {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface VpnPackage {
  id: string;
  name: string;
  ispId: string;
  description: string;
  speed: string;
}

export interface V2RayConfig {
  id: string;
  serverId: string;
  packageId: string;
  config: string;
  protocol: string;
  copyCount: number;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'error';
  pinned: boolean;
}

export interface AppSettings {
  adUrls: string[];
  adWaitTime: number;
}

export interface CopyStat {
  id: string;
  configId: string;
  timestamp: string;
  serverId: string;
  ispId: string;
  packageId: string;
}

export type Page = 'home' | 'vpn' | 'tutorials' | 'admin';
