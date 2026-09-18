import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Code2,
  Bell,
  Activity,
  Zap,
  Swords,
  ChevronDown,
  Check,
  AlertTriangle,
  Play,
  Flame,
  Gem,
  WifiOff,
  Sprout
} from 'lucide-react';
import { formatUptime } from '../utils/minecraftColors';

export const TopNavbar: React.FC = () => {
  const {
    bots,
    selectedBot,
    setSelectedBotId,
    emergencyStopAll,
    soundEnabled,
    toggleSound,
    isDevMode,
    toggleDevMode,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    currentUserRole,
    setCurrentUserRole,
    allUserRoles,
    simulateEvent,
    isSimulating,
    toggleSimulation
  } = useBotContext();

  const [botDropdownOpen, setBotDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [simDropdownOpen, setSimDropdownOpen] = useState(false);

  const totalBots = bots.length;
  const onlineBots = bots.filter(b => b.status === 'healthy' || b.status === 'warning').length;
  const inCombat = bots.filter(b => b.activity === 'Combat').length;
  const attentionRequired = bots.filter(b => b.status === 'warning' || b.status === 'error' || b.health < 10).length;
  const avgPing = Math.round(bots.reduce((acc, b) => acc + (b.ping || 0), 0) / (onlineBots || 1));
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[#0a0f1d] border-b border-[#1f2c47] flex items-center justify-between px-4 z-40 sticky top-0 select-none">
      {/* Brand & Global Stats */}
      <div className="flex items-center space-x-6">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          title="Reload dashboard"
          onClick={() => {
            // location.reload() can throw inside restricted/sandboxed frames.
            try {
              window.location.reload();
            } catch {
              /* ignore — the dashboard stays interactive */
            }
          }}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[6px] flex items-center justify-center">
              <span className="font-mono font-bold text-emerald-400 text-base">⬡</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-mono font-bold text-sm tracking-wider text-slate-100 uppercase">MineControl</h1>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">OS v3.2</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span>{isSimulating ? 'ENGINE LIVE (20.0 TPS)' : 'ENGINE PAUSED'}</span>
            </p>
          </div>
        </div>

        {/* Global Summary Badges */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-[#121b2d] border border-[#223352] px-2.5 py-1 rounded-md text-slate-300">
            <span className="text-slate-400">Bots:</span>
            <span className="text-emerald-400 font-bold">{onlineBots}</span>
            <span className="text-slate-500">/</span>
            <span>{totalBots}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#121b2d] border border-[#223352] px-2.5 py-1 rounded-md text-slate-300">
            <span className="text-slate-400">Combat:</span>
            <span className={inCombat > 0 ? "text-rose-400 font-bold flex items-center" : "text-slate-400 font-bold"}>
              {inCombat > 0 && <Swords className="w-3 h-3 mr-1 animate-pulse" />}
              {inCombat}
            </span>
          </div>

          {attentionRequired > 0 && (
            <div className="flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-md text-rose-300 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Attention:</span>
              <span className="font-bold">{attentionRequired}</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 bg-[#121b2d] border border-[#223352] px-2.5 py-1 rounded-md text-slate-300">
            <span className="text-slate-400">Avg Ping:</span>
            <span className={avgPing < 50 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{avgPing}ms</span>
          </div>
        </div>
      </div>

      {/* Middle: Active Bot Quick Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setBotDropdownOpen(!botDropdownOpen);
            setRoleDropdownOpen(false);
            setNotifDropdownOpen(false);
            setSimDropdownOpen(false);
          }}
          className="flex items-center space-x-2.5 bg-[#121b2d] hover:bg-[#18243c] border border-[#243554] px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shadow-inner"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-[10px] text-slate-200 uppercase">
              {selectedBot?.name.slice(0, 2) || 'MC'}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0f1d] ${
                selectedBot?.status === 'healthy'
                  ? 'bg-emerald-400'
                  : selectedBot?.status === 'warning'
                  ? 'bg-amber-400'
                  : selectedBot?.status === 'error'
                  ? 'bg-rose-500'
                  : 'bg-slate-500'
              }`}
            />
          </div>
          <div className="text-left">
            <div className="text-slate-200 font-semibold leading-none">{selectedBot?.name || 'Select Bot'}</div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
              <span>{selectedBot?.group}</span>
              <span>•</span>
              <span className="text-emerald-400">{selectedBot?.activity}</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {botDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 bg-[#0e1628] border border-[#233555] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-slate-400 border-b border-[#1f2f4c]">
              Select Active Bot Focus
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-[#172338]">
              {bots.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBotId(b.id);
                    setBotDropdownOpen(false);
                  }}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#17233a] transition-colors ${
                    selectedBot?.id === b.id ? 'bg-[#1b2a47]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="relative">
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-200 uppercase">
                        {b.name.slice(0, 2)}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
                          b.status === 'healthy'
                            ? 'bg-emerald-400'
                            : b.status === 'warning'
                            ? 'bg-amber-400'
                            : b.status === 'error'
                            ? 'bg-rose-500'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{b.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        HP: {b.health}/20 • {b.group}
                      </div>
                    </div>
                  </div>
                  {selectedBot?.id === b.id && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Simulation Event Trigger Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setSimDropdownOpen(!simDropdownOpen);
              setBotDropdownOpen(false);
              setRoleDropdownOpen(false);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono bg-[#16233a] hover:bg-[#1e2f4f] text-cyan-300 border border-cyan-500/30 rounded-lg transition-colors"
            title="Simulate live in-game events to test automation"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Simulate Event</span>
            <ChevronDown className="w-3 h-3 text-cyan-400" />
          </button>

          {simDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0e1628] border border-cyan-500/30 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-cyan-400 font-bold border-b border-[#1b2b45]">
                Inject Live Event to {selectedBot?.name}
              </div>
              <button
                onClick={() => {
                  simulateEvent('ambush');
                  setSimDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-rose-300 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="font-semibold">Mob Ambush (Low HP)</div>
                  <div className="text-[10px] text-slate-400">Tests retreat & auto-heal rules</div>
                </div>
              </button>
              <button
                onClick={() => {
                  simulateEvent('diamond_found');
                  setSimDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-cyan-300 hover:bg-cyan-500/10 flex items-center space-x-2 transition-colors"
              >
                <Gem className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold">Diamond Vein Found</div>
                  <div className="text-[10px] text-slate-400">+3 Diamonds & stats tick</div>
                </div>
              </button>
              <button
                onClick={() => {
                  simulateEvent('crop_harvest');
                  setSimDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:bg-amber-500/10 flex items-center space-x-2 transition-colors"
              >
                <Sprout className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold">Crop Cycle Harvest</div>
                  <div className="text-[10px] text-slate-400">+8 Wheat & auto-replant</div>
                </div>
              </button>
              <button
                onClick={() => {
                  simulateEvent('server_kick');
                  setSimDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-700/40 flex items-center space-x-2 transition-colors"
              >
                <WifiOff className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold">Simulate Server Kick</div>
                  <div className="text-[10px] text-slate-400">Tests auto-reconnect watchdog</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Global Emergency Stop Button */}
        <button
          onClick={emergencyStopAll}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-lg border border-red-500/50 shadow-lg shadow-rose-900/30 transition-all active:scale-95 group"
          title="HALT all bot tasks, combat, and movement immediately"
        >
          <ShieldAlert className="w-4 h-4 group-hover:animate-bounce" />
          <span>E-STOP ALL</span>
        </button>

        {/* Role Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setBotDropdownOpen(false);
              setNotifDropdownOpen(false);
              setSimDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono bg-[#11192b] hover:bg-[#18243e] border border-[#223352] rounded-lg text-slate-300 transition-colors"
            title="Switch Dashboard User Role"
          >
            <span className="text-slate-400">Role:</span>
            <span className="text-emerald-400 font-bold">{currentUserRole.id}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0e1628] border border-[#233555] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-[#1b2b45]">
                Change Permission Role
              </div>
              {allUserRoles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentUserRole(r.id);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between hover:bg-[#192742] ${
                    currentUserRole.id === r.id ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentUserRole.id === r.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-[#121c2e] border-[#223454] text-emerald-400 hover:text-emerald-300'
              : 'bg-[#0f1624] border-[#1b263b] text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? 'Mute Interface Audio' : 'Unmute Interface Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Dev Mode Toggle */}
        <button
          onClick={toggleDevMode}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-colors ${
            isDevMode
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
              : 'bg-[#121c2e] border-[#223454] text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Developer & Packet Inspector Mode"
        >
          <Code2 className="w-4 h-4" />
          <span className="hidden sm:inline">Dev Mode</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setBotDropdownOpen(false);
              setRoleDropdownOpen(false);
              setSimDropdownOpen(false);
            }}
            className="p-2 rounded-lg bg-[#121c2e] border border-[#223454] text-slate-300 hover:text-slate-100 relative transition-colors"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0e1628] border border-[#233555] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-2 border-b border-[#1b2b45] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase">Alerts & Events</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#172338]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-500 font-mono">
                    No active notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`px-3 py-2.5 hover:bg-[#16233a] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#142034]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            n.severity === 'critical'
                              ? 'text-rose-400'
                              : n.severity === 'warning'
                              ? 'text-amber-400'
                              : n.severity === 'success'
                              ? 'text-emerald-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
