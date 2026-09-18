import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Users,
  Server as ServerIcon,
  Activity,
  Swords,
  AlertTriangle,
  Wifi,
  Cpu,
  Layers,
  CheckSquare,
  Square,
  Play,
  Pause,
  RotateCw,
  Power,
  ShieldAlert,
  ArrowUpRight,
  Compass,
  Box,
  Heart,
  Shield,
  Zap,
  Filter,
  Eye
} from 'lucide-react';
import { formatUptime, getPingColor } from '../utils/minecraftColors';

export const DashboardView: React.FC = () => {
  const {
    bots,
    servers,
    selectedBotId,
    setSelectedBotId,
    multiSelectedBotIds,
    toggleMultiSelectBot,
    selectAllBots,
    clearMultiSelect,
    bulkConnectBots,
    bulkDisconnectBots,
    bulkSetGroup,
    bulkSetProfile,
    emergencyStopAll,
    profiles,
    setActiveView,
    connectBot,
    disconnectBot,
    reconnectBot,
    pauseBot,
    resumeBot,
    consoleLogs
  } = useBotContext();

  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [targetGroup, setTargetGroup] = useState<string>('Mining Bots');
  const [targetProfile, setTargetProfile] = useState<string>(profiles[0]?.id || '');

  // Computed metrics
  const totalBots = bots.length;
  const onlineBots = bots.filter(b => b.status === 'healthy' || b.status === 'warning').length;
  const offlineBots = bots.filter(b => b.status === 'disconnected').length;
  const combatBots = bots.filter(b => b.activity === 'Combat').length;
  const attentionBots = bots.filter(b => b.status === 'warning' || b.status === 'error' || b.health <= 8).length;
  const activeTasks = bots.filter(b => b.activity !== 'Idle' && b.status !== 'disconnected').length;
  const connectedServersCount = servers.filter(s => s.status === 'online').length;
  const avgLatency = Math.round(bots.reduce((a, b) => a + (b.ping || 0), 0) / (onlineBots || 1));

  // Filtered bot list
  const filteredBots = bots.filter(bot => {
    if (filterGroup !== 'all' && bot.group !== filterGroup) return false;
    if (filterStatus === 'online' && bot.status === 'disconnected') return false;
    if (filterStatus === 'offline' && bot.status !== 'disconnected') return false;
    if (filterStatus === 'combat' && bot.activity !== 'Combat') return false;
    if (filterStatus === 'attention' && bot.status !== 'warning' && bot.status !== 'error' && bot.health > 8) return false;
    return true;
  });

  const allSelected = bots.length > 0 && multiSelectedBotIds.length === bots.length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide flex items-center space-x-2">
            <span>COMMAND DASHBOARD</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Centralized orchestration and telemetry across multi-bot clusters
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (allSelected) clearMultiSelect();
              else selectAllBots();
            }}
            className="px-3 py-1.5 text-xs font-mono bg-[#111a2c] hover:bg-[#18253e] border border-[#20324f] rounded-lg text-slate-300 flex items-center space-x-2 transition-colors"
          >
            {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
            <span>{allSelected ? 'Deselect All' : 'Select All Bots'}</span>
          </button>

          <button
            onClick={emergencyStopAll}
            className="px-3 py-1.5 text-xs font-mono bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency Stop</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Bots</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{totalBots}</span>
            <span className="text-xs font-mono text-emerald-400">{onlineBots} Online</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(onlineBots / totalBots) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Tasks</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{activeTasks}</span>
            <span className="text-xs font-mono text-slate-400">running</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">Mining, Farming, Sentry</div>
        </div>

        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">In Combat</span>
            <Swords className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${combatBots > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {combatBots}
            </span>
            <span className="text-xs font-mono text-slate-400">engaging</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">Auto-shield & cooldown sync</div>
        </div>

        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Attention</span>
            <AlertTriangle className={`w-4 h-4 ${attentionBots > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${attentionBots > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
              {attentionBots}
            </span>
            <span className="text-xs font-mono text-slate-400">bots</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">Low HP or Connection Warning</div>
        </div>

        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Latency</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${getPingColor(avgLatency)}`}>{avgLatency}</span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">{connectedServersCount} connected servers</div>
        </div>

        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-3.5 hover:border-[#2b4168] transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Cluster TPS</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">20.0</span>
            <span className="text-xs font-mono text-slate-400">/ 20</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">CPU: 4.2% • Heap: 342MB</div>
        </div>
      </div>

      {/* Bulk Action Sticky Bar (Appears when 1 or more bots are selected) */}
      {multiSelectedBotIds.length > 0 && (
        <div className="bg-gradient-to-r from-[#132238] to-[#162740] border border-cyan-500/40 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded font-mono text-xs font-bold">
              {multiSelectedBotIds.length} BOTS SELECTED
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">Apply bulk operation:</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => bulkConnectBots(multiSelectedBotIds)}
              className="px-2.5 py-1 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center space-x-1 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
            <button
              onClick={() => bulkDisconnectBots(multiSelectedBotIds)}
              className="px-2.5 py-1 text-xs font-mono bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md flex items-center space-x-1 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-2.5 py-1 text-xs font-mono bg-[#1c2d4a] hover:bg-[#253b61] border border-[#2d4670] text-cyan-300 rounded-md flex items-center space-x-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Assign Group / Profile</span>
            </button>
            <button
              onClick={clearMultiSelect}
              className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a101d] p-2.5 rounded-xl border border-[#18243a]">
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono">
          <span className="text-slate-400 flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Bots' },
            { id: 'online', label: 'Online' },
            { id: 'offline', label: 'Offline' },
            { id: 'combat', label: 'In Combat' },
            { id: 'attention', label: 'Attention' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:bg-[#121c2e] hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Group Filter */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Group:</span>
          <select
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
            className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Groups</option>
            <option value="Combat Bots">Combat Bots</option>
            <option value="Mining Bots">Mining Bots</option>
            <option value="Farming Bots">Farming Bots</option>
            <option value="AFK Bots">AFK Bots</option>
            <option value="Exploration Bots">Exploration Bots</option>
            <option value="Testing Bots">Testing Bots</option>
          </select>
        </div>
      </div>

      {/* Live Bot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map(bot => {
          const isSelected = selectedBotId === bot.id;
          const isChecked = multiSelectedBotIds.includes(bot.id);
          const server = servers.find(s => s.id === bot.serverId);
          const profile = profiles.find(p => p.id === bot.profileId);
          const isOnline = bot.status === 'healthy' || bot.status === 'warning';

          return (
            <div
              key={bot.id}
              className={`bg-[#0d1424] border rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between group hover:border-[#2b4166] ${
                isSelected
                  ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-[#1b2840]'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 pb-3 border-b border-[#162238] bg-[#0f1729]/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {/* Checkbox for multi-select */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMultiSelectBot(bot.id);
                      }}
                      className="text-slate-400 hover:text-emerald-400"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {/* Bot Avatar Icon */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center font-mono font-bold text-xs text-slate-200 uppercase shadow-inner">
                        {bot.name.slice(0, 2)}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d1424] ${
                          bot.status === 'healthy'
                            ? 'bg-emerald-400'
                            : bot.status === 'warning'
                            ? 'bg-amber-400 animate-pulse'
                            : bot.status === 'error'
                            ? 'bg-rose-500 animate-pulse'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {bot.name}
                        </span>
                        {bot.activity === 'Combat' && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-bold uppercase animate-pulse">
                            Combat
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                        <span className="truncate max-w-[130px]">{server?.name || 'Server'}</span>
                        <span>•</span>
                        <span className={getPingColor(bot.ping)}>{bot.ping}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        bot.status === 'healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : bot.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : bot.status === 'error'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {bot.status}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {isOnline ? formatUptime(bot.uptime) : 'Offline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Vital Gauges (Health, Hunger, Armor) */}
              <div className="p-4 space-y-3 text-xs font-mono">
                {/* Health Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/80" />
                      <span>Health</span>
                    </span>
                    <span className={`font-bold ${bot.health < 8 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {bot.health} / {bot.maxHealth} HP
                    </span>
                  </div>
                  <div className="w-full bg-[#18233a] h-2 rounded-full overflow-hidden border border-[#202f4a]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        bot.health > 14
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : bot.health > 7
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                          : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse'
                      }`}
                      style={{ width: `${(bot.health / bot.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Hunger & Armor in two columns */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {/* Hunger */}
                  <div className="bg-[#121c2e] p-2 rounded-lg border border-[#1b2b45]">
                    <div className="flex items-center justify-between text-slate-400 mb-0.5">
                      <span>Hunger:</span>
                      <span className="text-amber-400 font-bold">{bot.hunger}/20</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${(bot.hunger / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Armor */}
                  <div className="bg-[#121c2e] p-2 rounded-lg border border-[#1b2b45]">
                    <div className="flex items-center justify-between text-slate-400 mb-0.5">
                      <span className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span>Armor:</span>
                      </span>
                      <span className="text-cyan-400 font-bold">{bot.armor}/20</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${(bot.armor / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Coordinates & Dimension */}
                <div className="bg-[#101828] p-2.5 rounded-lg border border-[#1a283f] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-bold">
                      X: {bot.position.x.toFixed(0)} Y: {bot.position.y.toFixed(0)} Z: {bot.position.z.toFixed(0)}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                      bot.position.dimension === 'overworld'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : bot.position.dimension === 'nether'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {bot.position.dimension}
                  </span>
                </div>

                {/* Activity & Target telemetry */}
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Activity:</span>
                    <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{bot.activity}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[160px]">
                      {bot.target ? `${bot.target.name} (${bot.target.distance.toFixed(1)}b)` : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Profile:</span>
                    <span className="text-cyan-300 font-mono text-[10px] truncate max-w-[160px]">
                      {profile?.name || 'Default'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Quick Actions */}
              <div className="p-3 bg-[#0a101d] border-t border-[#162238] flex items-center justify-between gap-1.5">
                <button
                  onClick={() => {
                    setSelectedBotId(bot.id);
                    setActiveView('bots');
                  }}
                  className="flex-1 py-1.5 px-2 bg-[#121c2e] hover:bg-[#192740] border border-[#20324f] text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center justify-center space-x-1 transition-colors"
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>Inspect</span>
                </button>

                {bot.status === 'disconnected' ? (
                  <button
                    onClick={() => connectBot(bot.id)}
                    className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono flex items-center space-x-1 transition-colors"
                    title="Connect Bot"
                  >
                    <Power className="w-3 h-3" />
                    <span>Connect</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => (bot.activity === 'Idle' ? resumeBot(bot.id) : pauseBot(bot.id))}
                      className="p-1.5 bg-[#121c2e] hover:bg-[#1a283e] border border-[#223352] text-slate-300 rounded-lg text-xs transition-colors"
                      title={bot.activity === 'Idle' ? 'Resume Task' : 'Pause Task'}
                    >
                      {bot.activity === 'Idle' ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                    <button
                      onClick={() => reconnectBot(bot.id)}
                      className="p-1.5 bg-[#121c2e] hover:bg-[#1a283e] border border-[#223352] text-slate-300 rounded-lg text-xs transition-colors"
                      title="Reconnect"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => disconnectBot(bot.id)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-xs transition-colors"
                      title="Disconnect"
                    >
                      <Power className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Assignment Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
              Batch Configure {multiSelectedBotIds.length} Bots
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Apply group assignments and behavior profile to all selected bot instances simultaneously.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Group</label>
                <select
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Combat Bots">Combat Bots</option>
                  <option value="Mining Bots">Mining Bots</option>
                  <option value="Farming Bots">Farming Bots</option>
                  <option value="AFK Bots">AFK Bots</option>
                  <option value="Exploration Bots">Exploration Bots</option>
                  <option value="Testing Bots">Testing Bots</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Behavior Profile</label>
                <select
                  value={targetProfile}
                  onChange={e => setTargetProfile(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.group})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  bulkSetGroup(multiSelectedBotIds, targetGroup);
                  if (targetProfile) {
                    bulkSetProfile(multiSelectedBotIds, targetProfile);
                  }
                  setShowBulkModal(false);
                }}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Apply to All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Live Stream Footer */}
      <div className="bg-[#0b101c] border border-[#1b2840] rounded-xl p-4">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#182338]">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-time Bot Event Feed</span>
          </span>
          <button
            onClick={() => setActiveView('console')}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Open Full Console</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto">
          {consoleLogs.slice(-6).map(log => (
            <div key={log.id} className="flex items-center space-x-2 text-slate-300">
              <span className="text-slate-500 text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                {log.botName}
              </span>
              <span
                className={`text-[10px] uppercase font-bold ${
                  log.level === 'warn'
                    ? 'text-amber-400'
                    : log.level === 'combat'
                    ? 'text-rose-400'
                    : log.level === 'task'
                    ? 'text-emerald-400'
                    : 'text-cyan-400'
                }`}
              >
                [{log.level}]
              </span>
              <span className="truncate text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
