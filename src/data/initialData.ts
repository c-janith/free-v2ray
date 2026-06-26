import { Server, ISP, VpnPackage, V2RayConfig, AppNotification } from '../types';

export const initialServers: Server[] = [
  { id: 'sg1', name: 'Singapore SG-1', location: 'Singapore', flag: '🇸🇬', status: 'online', load: 45 },
  { id: 'jp1', name: 'Japan JP-1', location: 'Tokyo, Japan', flag: '🇯🇵', status: 'online', load: 32 },
  { id: 'nl1', name: 'Netherlands NL-1', location: 'Amsterdam, NL', flag: '🇳🇱', status: 'online', load: 58 },
  { id: 'de1', name: 'Germany DE-1', location: 'Frankfurt, DE', flag: '🇩🇪', status: 'online', load: 27 },
  { id: 'us1', name: 'USA US-1', location: 'New York, USA', flag: '🇺🇸', status: 'online', load: 41 },
  { id: 'in1', name: 'India IN-1', location: 'Mumbai, India', flag: '🇮🇳', status: 'online', load: 63 },
  { id: 'sg2', name: 'Singapore SG-2', location: 'Singapore', flag: '🇸🇬', status: 'maintenance', load: 0 },
  { id: 'uk1', name: 'UK UK-1', location: 'London, UK', flag: '🇬🇧', status: 'online', load: 35 },
];

export const initialISPs: ISP[] = [
  { id: 'dialog', name: 'Dialog', logo: '💬', color: '#2563eb' },
  { id: 'hutch', name: 'Hutch', logo: '📱', color: '#f97316' },
  { id: 'airtel', name: 'Airtel', logo: '🔴', color: '#ef4444' },
  { id: 'slt', name: 'SLT/Fiber', logo: '🌐', color: '#22c55e' },
];

export const initialPackages: VpnPackage[] = [
  // Dialog
  { id: 'dialog-zoom', name: 'Zoom Unlimited', ispId: 'dialog', description: 'Full access with Zoom unlimited package', speed: 'Unlimited' },
  { id: 'dialog-social', name: 'Social', ispId: 'dialog', description: 'Social media access with Dialog Social package', speed: 'High' },
  // Hutch
  { id: 'hutch-social', name: 'Social', ispId: 'hutch', description: 'Social media access with Hutch Social package', speed: 'High' },
  { id: 'hutch-tiktok', name: 'TikTok', ispId: 'hutch', description: 'TikTok access with Hutch TikTok package', speed: 'High' },
  // Airtel
  { id: 'airtel-social', name: 'Social', ispId: 'airtel', description: 'Social media access with Airtel Social package', speed: 'High' },
  { id: 'airtel-tiktok', name: 'TikTok', ispId: 'airtel', description: 'TikTok access with Airtel TikTok package', speed: 'High' },
  { id: 'airtel-youtube', name: 'YouTube', ispId: 'airtel', description: 'YouTube access with Airtel YouTube package', speed: 'Ultra HD' },
  { id: 'airtel-all-social', name: 'All Social Packages', ispId: 'airtel', description: 'Complete social media access with Airtel All Social', speed: 'Ultra HD' },
  // SLT/Fiber
  { id: 'slt-zoom', name: 'Zoom', ispId: 'slt', description: 'Zoom meeting access with SLT Zoom package', speed: 'Ultra HD' },
  { id: 'slt-entertainment', name: 'Entertainment', ispId: 'slt', description: 'Entertainment streaming with SLT Entertainment', speed: '4K' },
];

function makeVless(uuid: string, server: string, port: number, host: string, path: string, name: string): string {
  return `vless://${uuid}@${server}:${port}?type=ws&security=tls&host=${host}&path=${encodeURIComponent(path)}&sni=${host}&fp=chrome&pbk=&sid=&alpn=http%2F1.1#${encodeURIComponent(name)}`;
}

function makeVmess(uuid: string, server: string, port: number, host: string, path: string, name: string): string {
  const config = {
    v: "2",
    ps: name,
    add: server,
    port: port,
    id: uuid,
    aid: 0,
    net: "ws",
    type: "none",
    host: host,
    path: path,
    tls: "tls",
    sni: host,
    alpn: "http/1.1",
  };
  return `vmess://${btoa(JSON.stringify(config))}`;
}

const uuid1 = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const uuid2 = 'f0e1d2c3-b4a5-6789-0abc-def123456789';
const uuid3 = '12345678-90ab-cdef-0123-456789abcdef';
const uuid4 = '98765432-10fe-dcba-0987-654321fedcba';

export const initialConfigs: V2RayConfig[] = [
  // Singapore + Dialog
  { id: 'cfg1', serverId: 'sg1', packageId: 'dialog-zoom', config: makeVless(uuid1, 'sg1.ghostvpnhub.com', 443, 'sg1.ghostvpnhub.com', '/ws-dialog-zoom', 'SG-1 | Dialog Zoom Unlimited'), protocol: 'vless', copyCount: 342, lastUpdated: '2024-12-01' },
  { id: 'cfg2', serverId: 'sg1', packageId: 'dialog-social', config: makeVmess(uuid2, 'sg1.ghostvpnhub.com', 443, 'sg1.ghostvpnhub.com', '/ws-dialog-social', 'SG-1 | Dialog Social'), protocol: 'vmess', copyCount: 567, lastUpdated: '2024-12-05' },
  // Singapore + Hutch
  { id: 'cfg3', serverId: 'sg1', packageId: 'hutch-social', config: makeVless(uuid3, 'sg1.ghostvpnhub.com', 2083, 'sg1.ghostvpnhub.com', '/ws-hutch-social', 'SG-1 | Hutch Social'), protocol: 'vless', copyCount: 234, lastUpdated: '2024-12-03' },
  { id: 'cfg4', serverId: 'sg1', packageId: 'hutch-tiktok', config: makeVless(uuid1, 'sg1.ghostvpnhub.com', 2083, 'sg1.ghostvpnhub.com', '/ws-hutch-tiktok', 'SG-1 | Hutch TikTok'), protocol: 'vless', copyCount: 189, lastUpdated: '2024-12-04' },
  // Singapore + Airtel
  { id: 'cfg5', serverId: 'sg1', packageId: 'airtel-social', config: makeVmess(uuid4, 'sg1.ghostvpnhub.com', 443, 'sg1.ghostvpnhub.com', '/ws-airtel-social', 'SG-1 | Airtel Social'), protocol: 'vmess', copyCount: 456, lastUpdated: '2024-12-02' },
  { id: 'cfg6', serverId: 'sg1', packageId: 'airtel-youtube', config: makeVless(uuid2, 'sg1.ghostvpnhub.com', 2087, 'sg1.ghostvpnhub.com', '/ws-airtel-youtube', 'SG-1 | Airtel YouTube'), protocol: 'vless', copyCount: 678, lastUpdated: '2024-12-06' },
  { id: 'cfg7', serverId: 'sg1', packageId: 'airtel-tiktok', config: makeVmess(uuid3, 'sg1.ghostvpnhub.com', 443, 'sg1.ghostvpnhub.com', '/ws-airtel-tiktok', 'SG-1 | Airtel TikTok'), protocol: 'vmess', copyCount: 312, lastUpdated: '2024-12-01' },
  { id: 'cfg8', serverId: 'sg1', packageId: 'airtel-all-social', config: makeVless(uuid4, 'sg1.ghostvpnhub.com', 2083, 'sg1.ghostvpnhub.com', '/ws-airtel-all-social', 'SG-1 | Airtel All Social'), protocol: 'vless', copyCount: 523, lastUpdated: '2024-12-05' },
  // Singapore + SLT
  { id: 'cfg9', serverId: 'sg1', packageId: 'slt-zoom', config: makeVmess(uuid1, 'sg1.ghostvpnhub.com', 443, 'sg1.ghostvpnhub.com', '/ws-slt-zoom', 'SG-1 | SLT Zoom'), protocol: 'vmess', copyCount: 198, lastUpdated: '2024-12-04' },
  { id: 'cfg10', serverId: 'sg1', packageId: 'slt-entertainment', config: makeVless(uuid2, 'sg1.ghostvpnhub.com', 2087, 'sg1.ghostvpnhub.com', '/ws-slt-entertainment', 'SG-1 | SLT Entertainment'), protocol: 'vless', copyCount: 287, lastUpdated: '2024-12-06' },
  // Japan + Dialog
  { id: 'cfg11', serverId: 'jp1', packageId: 'dialog-zoom', config: makeVless(uuid3, 'jp1.ghostvpnhub.com', 443, 'jp1.ghostvpnhub.com', '/ws-dialog-zoom', 'JP-1 | Dialog Zoom Unlimited'), protocol: 'vless', copyCount: 156, lastUpdated: '2024-12-03' },
  { id: 'cfg12', serverId: 'jp1', packageId: 'dialog-social', config: makeVmess(uuid4, 'jp1.ghostvpnhub.com', 443, 'jp1.ghostvpnhub.com', '/ws-dialog-social', 'JP-1 | Dialog Social'), protocol: 'vmess', copyCount: 234, lastUpdated: '2024-12-05' },
  // Japan + Airtel
  { id: 'cfg13', serverId: 'jp1', packageId: 'airtel-youtube', config: makeVless(uuid1, 'jp1.ghostvpnhub.com', 2083, 'jp1.ghostvpnhub.com', '/ws-airtel-youtube', 'JP-1 | Airtel YouTube'), protocol: 'vless', copyCount: 445, lastUpdated: '2024-12-02' },
  { id: 'cfg14', serverId: 'jp1', packageId: 'airtel-all-social', config: makeVmess(uuid2, 'jp1.ghostvpnhub.com', 443, 'jp1.ghostvpnhub.com', '/ws-airtel-all-social', 'JP-1 | Airtel All Social'), protocol: 'vmess', copyCount: 378, lastUpdated: '2024-12-04' },
  // Japan + SLT
  { id: 'cfg15', serverId: 'jp1', packageId: 'slt-entertainment', config: makeVless(uuid3, 'jp1.ghostvpnhub.com', 2087, 'jp1.ghostvpnhub.com', '/ws-slt-entertainment', 'JP-1 | SLT Entertainment'), protocol: 'vless', copyCount: 201, lastUpdated: '2024-12-06' },
  // Netherlands + all
  { id: 'cfg16', serverId: 'nl1', packageId: 'dialog-zoom', config: makeVmess(uuid4, 'nl1.ghostvpnhub.com', 443, 'nl1.ghostvpnhub.com', '/ws-dialog-zoom', 'NL-1 | Dialog Zoom Unlimited'), protocol: 'vmess', copyCount: 123, lastUpdated: '2024-12-01' },
  { id: 'cfg17', serverId: 'nl1', packageId: 'hutch-tiktok', config: makeVless(uuid1, 'nl1.ghostvpnhub.com', 2083, 'nl1.ghostvpnhub.com', '/ws-hutch-tiktok', 'NL-1 | Hutch TikTok'), protocol: 'vless', copyCount: 167, lastUpdated: '2024-12-03' },
  { id: 'cfg18', serverId: 'nl1', packageId: 'airtel-youtube', config: makeVmess(uuid2, 'nl1.ghostvpnhub.com', 443, 'nl1.ghostvpnhub.com', '/ws-airtel-youtube', 'NL-1 | Airtel YouTube'), protocol: 'vmess', copyCount: 289, lastUpdated: '2024-12-05' },
  { id: 'cfg19', serverId: 'nl1', packageId: 'slt-zoom', config: makeVless(uuid3, 'nl1.ghostvpnhub.com', 2087, 'nl1.ghostvpnhub.com', '/ws-slt-zoom', 'NL-1 | SLT Zoom'), protocol: 'vless', copyCount: 145, lastUpdated: '2024-12-04' },
  // Germany
  { id: 'cfg20', serverId: 'de1', packageId: 'dialog-social', config: makeVless(uuid4, 'de1.ghostvpnhub.com', 443, 'de1.ghostvpnhub.com', '/ws-dialog-social', 'DE-1 | Dialog Social'), protocol: 'vless', copyCount: 98, lastUpdated: '2024-12-02' },
  { id: 'cfg21', serverId: 'de1', packageId: 'airtel-all-social', config: makeVmess(uuid1, 'de1.ghostvpnhub.com', 443, 'de1.ghostvpnhub.com', '/ws-airtel-all-social', 'DE-1 | Airtel All Social'), protocol: 'vmess', copyCount: 234, lastUpdated: '2024-12-06' },
  // USA
  { id: 'cfg22', serverId: 'us1', packageId: 'dialog-zoom', config: makeVless(uuid2, 'us1.ghostvpnhub.com', 443, 'us1.ghostvpnhub.com', '/ws-dialog-zoom', 'US-1 | Dialog Zoom Unlimited'), protocol: 'vless', copyCount: 178, lastUpdated: '2024-12-03' },
  { id: 'cfg23', serverId: 'us1', packageId: 'airtel-youtube', config: makeVmess(uuid3, 'us1.ghostvpnhub.com', 443, 'us1.ghostvpnhub.com', '/ws-airtel-youtube', 'US-1 | Airtel YouTube'), protocol: 'vmess', copyCount: 345, lastUpdated: '2024-12-05' },
  { id: 'cfg24', serverId: 'us1', packageId: 'slt-entertainment', config: makeVless(uuid4, 'us1.ghostvpnhub.com', 2087, 'us1.ghostvpnhub.com', '/ws-slt-entertainment', 'US-1 | SLT Entertainment'), protocol: 'vless', copyCount: 167, lastUpdated: '2024-12-06' },
  // India
  { id: 'cfg25', serverId: 'in1', packageId: 'hutch-social', config: makeVmess(uuid1, 'in1.ghostvpnhub.com', 443, 'in1.ghostvpnhub.com', '/ws-hutch-social', 'IN-1 | Hutch Social'), protocol: 'vmess', copyCount: 189, lastUpdated: '2024-12-01' },
  { id: 'cfg26', serverId: 'in1', packageId: 'airtel-all-social', config: makeVless(uuid2, 'in1.ghostvpnhub.com', 2083, 'in1.ghostvpnhub.com', '/ws-airtel-all-social', 'IN-1 | Airtel All Social'), protocol: 'vless', copyCount: 278, lastUpdated: '2024-12-04' },
  // UK
  { id: 'cfg27', serverId: 'uk1', packageId: 'dialog-social', config: makeVless(uuid3, 'uk1.ghostvpnhub.com', 443, 'uk1.ghostvpnhub.com', '/ws-dialog-social', 'UK-1 | Dialog Social'), protocol: 'vless', copyCount: 134, lastUpdated: '2024-12-02' },
  { id: 'cfg28', serverId: 'uk1', packageId: 'slt-zoom', config: makeVmess(uuid4, 'uk1.ghostvpnhub.com', 443, 'uk1.ghostvpnhub.com', '/ws-slt-zoom', 'UK-1 | SLT Zoom'), protocol: 'vmess', copyCount: 112, lastUpdated: '2024-12-05' },
];

export const initialNotifications: AppNotification[] = [
  { id: 'notif1', title: '🎉 New Singapore Server Added', message: 'SG-2 server is now online with improved speeds! Try it now.', date: '2024-12-06', type: 'success', pinned: true },
  { id: 'notif2', title: '⚠️ Maintenance Notice', message: 'SG-2 server will undergo maintenance on Dec 8th, 2AM-6AM SGT.', date: '2024-12-05', type: 'warning', pinned: true },
  { id: 'notif3', title: '🔄 Config Updates', message: 'All Airtel configs have been updated with new endpoints for better performance.', date: '2024-12-04', type: 'info', pinned: false },
  { id: 'notif4', title: '📊 30TB Milestone!', message: 'We have crossed 30TB of traffic this year! Thank you for your support.', date: '2024-12-01', type: 'success', pinned: false },
];

export const ADMIN_PASSWORD = 'ghostvpn2024';
