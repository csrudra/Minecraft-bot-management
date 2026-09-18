import React from 'react';
import { useBotContext } from '../context/BotContext';
import {
  LayoutDashboard,
  Users,
  Server,
  Compass,
  MousePointerClick,
  Swords,
  HeartPulse,
  Pickaxe,
  Sprout,
  MapPin,
  Workflow,
  Layers,
  Box,
  Terminal,
  MessageSquare,
  ShieldAlert,
  CheckCheck,
  KeyRound,
  BarChart3,
  BellRing,
  Cpu,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  badgeRequired?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, bots, notifications, isDevMode } = useBotContext();

  const onlineBots = bots.filter(b => b.status === 'healthy' || b.status === 'warning').length;
  const inCombat = bots.filter(b => b.activity === 'Combat').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navGroups: NavGroup[] = [
    {
      title: 'Operations Center',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bots', label: 'Bot Manager', icon: Users, badge: `${onlineBots}/${bots.length}`, badgeColor: 'bg-emerald-500/20 text-emerald-400' },
        { id: 'servers', label: 'Server Manager', icon: Server, badge: '3 Active', badgeColor: 'bg-slate-700 text-slate-300' }
      ]
    },
    {
      title: 'Modules & Automation',
      items: [
        { id: 'movement', label: 'Movement & Mobility', icon: Compass },
        { id: 'interaction', label: 'Interaction Tools', icon: MousePointerClick },
        { id: 'combat', label: 'Combat Automation', icon: Swords, badge: inCombat > 0 ? `${inCombat} In Fight` : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 animate-pulse' },
        { id: 'survival', label: 'Survival Automation', icon: HeartPulse },
        { id: 'mining', label: 'Mining Automation', icon: Pickaxe },
        { id: 'farming', label: 'Farming Automation', icon: Sprout },
        { id: 'navigation', label: 'Navigation & Map', icon: MapPin },
        { id: 'builder', label: 'Automation Builder', icon: Workflow },
        { id: 'profiles', label: 'Profiles', icon: Layers }
      ]
    },
    {
      title: 'Real-Time Interface',
      items: [
        { id: 'inventory', label: 'Inventory Manager', icon: Box },
        { id: 'console', label: 'Live Console', icon: Terminal, badge: 'CLI', badgeColor: 'bg-cyan-500/20 text-cyan-400' },
        { id: 'chat', label: 'Chat Interface', icon: MessageSquare }
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'reliability', label: 'Anti-Disconnect', icon: ShieldAlert },
        { id: 'capabilities', label: 'Capability Scanner', icon: CheckCheck },
        { id: 'permissions', label: 'Permissions & Audit', icon: KeyRound },
        { id: 'analytics', label: 'Analytics & Stats', icon: BarChart3 },
        { id: 'notifications', label: 'Notifications', icon: BellRing, badge: unreadNotifs > 0 ? unreadNotifs : undefined, badgeColor: 'bg-rose-500 text-white' },
        { id: 'devmode', label: 'Developer / Packets', icon: Cpu, badge: isDevMode ? 'Active' : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-400' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#1f2c47] flex flex-col justify-between shrink-0 select-none overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="py-3 px-2 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="px-3 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 font-semibold border-l-2 border-emerald-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold font-mono ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-[#182337] bg-[#070b16]">
        <div className="p-2.5 rounded-lg bg-[#0e1627] border border-[#1b2b45] text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Cluster TPS:</span>
            <span className="text-emerald-400 font-bold">20.0 ★</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Node Memory:</span>
            <span className="text-slate-200 font-bold">342 MB / 2 GB</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Protocol:</span>
            <span className="text-cyan-400">Mineflayer 4.20.1</span>
          </div>
          <div className="pt-1.5 border-t border-[#19273f] flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              All systems nominal
            </span>
            <span className="text-slate-400">100% Legit</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
