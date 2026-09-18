import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { downloadFile } from '../utils/download';
import { Bot, BotStatus } from '../types';
import {
  Users,
  Plus,
  Trash2,
  Power,
  RotateCcw,
  Pause,
  Play,
  Copy,
  Edit2,
  Download,
  Upload,
  Check,
  X,
  Search,
  Filter,
  Layers,
  Shield,
  Activity,
  Compass,
  AlertTriangle,
  Heart,
  Server
} from 'lucide-react';
import { formatUptime, getPingColor } from '../utils/minecraftColors';

export const BotManagerView: React.FC = () => {
  const {
    bots,
    servers,
    profiles,
    selectedBotId,
    setSelectedBotId,
    connectBot,
    disconnectBot,
    reconnectBot,
    restartBot,
    pauseBot,
    resumeBot,
    renameBot,
    duplicateBot,
    removeBot,
    addBot,
    bulkConnectBots,
    bulkDisconnectBots,
    bulkSetGroup,
    bulkSetProfile,
    exportBots,
    importBots,
    setActiveView,
    addNotification
  } = useBotContext();

  const [search, setSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');
  const [deleteConfirmBot, setDeleteConfirmBot] = useState<Bot | null>(null);

  // New single bot form state
  const [newBotName, setNewBotName] = useState('');
  const [newBotServerId, setNewBotServerId] = useState(servers[0]?.id || 'server-1');
  const [newBotGroup, setNewBotGroup] = useState('Mining Bots');
  const [newBotProfile, setNewBotProfile] = useState(profiles[0]?.id || 'prof-mining');
  const [newBotAuth, setNewBotAuth] = useState<'microsoft' | 'offline'>('microsoft');

  // Batch bot generator form state
  const [batchPrefix, setBatchPrefix] = useState('WorkerBot_');
  const [batchCount, setBatchCount] = useState(3);
  const [batchGroup, setBatchGroup] = useState('Mining Bots');
  const [batchProfile, setBatchProfile] = useState(profiles[0]?.id || 'prof-mining');

  const groups = [
    'Combat Bots',
    'Mining Bots',
    'Farming Bots',
    'AFK Bots',
    'Exploration Bots',
    'Testing Bots'
  ];

  // Filtering
  const filteredBots = bots.filter(b => {
    const matchesSearch =
      (b.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.group || '').toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'all' || b.group === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    addBot({
      name: newBotName.trim(),
      serverId: newBotServerId,
      group: newBotGroup,
      profileId: newBotProfile
    });
    setNewBotName('');
    setShowAddModal(false);
  };

  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 1; i <= batchCount; i++) {
      addBot({
        name: `${batchPrefix}${i.toString().padStart(2, '0')}`,
        serverId: servers[0]?.id || 'server-1',
        group: batchGroup,
        profileId: batchProfile
      });
    }
    setShowBatchModal(false);
  };

  const handleExportJson = () => {
    const json = exportBots();
    const ok = downloadFile(`minecontrol-bots-${Date.now()}.json`, json, 'application/json');
    if (!ok) {
      addNotification({
        title: 'Export Blocked',
        message: 'This environment blocks file downloads. The bot JSON is available via the import/export panel.',
        severity: 'warning'
      });
    }
  };

  const handleImportJson = () => {
    setImportError('');
    if (!importJsonText.trim()) return;
    const ok = importBots(importJsonText);
    if (ok) {
      setShowImportModal(false);
      setImportJsonText('');
    } else {
      setImportError('Invalid JSON format. Please ensure valid bot array data.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>BOT LIFECYCLE & FLEET MANAGER</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Deploy, duplicate, configure, and manage groups across all connected bot instances
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-3 py-1.5 text-xs font-mono bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-cyan-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Batch Create</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-mono bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-slate-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 text-xs font-mono bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-slate-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1220] p-3 rounded-xl border border-[#1b2840] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bots by name or group..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111929] border border-[#22334f] text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono w-full md:w-auto">
          <button
            onClick={() => setSelectedGroupFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedGroupFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:bg-[#121c2e]'
            }`}
          >
            All ({bots.length})
          </button>
          {groups.map(grp => {
            const count = bots.filter(b => b.group === grp).length;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroupFilter(grp)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedGroupFilter === grp
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-[#121c2e]'
                }`}
              >
                {grp.replace(' Bots', '')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bot Roster Table */}
      <div className="bg-[#0b101c] border border-[#1a273e] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e1628] border-b border-[#1b2b45] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Bot Identity</th>
                <th className="py-3 px-3">Server & Ping</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Vitals</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Group</th>
                <th className="py-3 px-3">Profile</th>
                <th className="py-3 px-3">Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152136]">
              {filteredBots.map(bot => {
                const server = servers.find(s => s.id === bot.serverId);
                const profile = profiles.find(p => p.id === bot.profileId);
                const isOnline = bot.status === 'healthy' || bot.status === 'warning';
                const isEditing = editingBotId === bot.id;

                return (
                  <tr
                    key={bot.id}
                    className={`hover:bg-[#111a2d] transition-colors ${
                      selectedBotId === bot.id ? 'bg-[#142137]/60' : ''
                    }`}
                  >
                    {/* Bot Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="relative">
                          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 uppercase">
                            {bot.name.slice(0, 2)}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
                              bot.status === 'healthy'
                                ? 'bg-emerald-400'
                                : bot.status === 'warning'
                                ? 'bg-amber-400'
                                : bot.status === 'error'
                                ? 'bg-rose-500'
                                : 'bg-slate-500'
                            }`}
                          />
                        </div>

                        {isEditing ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={editNameText}
                              onChange={e => setEditNameText(e.target.value)}
                              className="bg-[#18253e] border border-cyan-500 px-1.5 py-0.5 rounded text-xs text-slate-100 font-mono w-28 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editNameText.trim()) renameBot(bot.id, editNameText.trim());
                                setEditingBotId(null);
                              }}
                              className="p-1 hover:text-emerald-400"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingBotId(null)}
                              className="p-1 hover:text-rose-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 group">
                            <span
                              onClick={() => {
                                setSelectedBotId(bot.id);
                                setActiveView('dashboard');
                              }}
                              className="font-bold text-slate-100 hover:text-cyan-300 cursor-pointer"
                            >
                              {bot.name}
                            </span>
                            <button
                              onClick={() => {
                                setEditingBotId(bot.id);
                                setEditNameText(bot.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-0.5"
                              title="Rename bot"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Server & Ping */}
                    <td className="py-3 px-3">
                      <div className="text-slate-200 truncate max-w-[120px]">{server?.name || 'SMP Alpha'}</div>
                      <div className={`text-[11px] ${getPingColor(bot.ping)}`}>{isOnline ? `${bot.ping} ms` : '---'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          bot.status === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : bot.status === 'warning'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : bot.status === 'error'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {bot.status}
                      </span>
                    </td>

                    {/* Vitals */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-1 text-rose-400">
                          <Heart className="w-3 h-3 fill-rose-500/80" />
                          <span>{bot.health}</span>
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-amber-400">{bot.hunger}f</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-cyan-400">{bot.armor}a</span>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-3">
                      <div className="text-slate-300">
                        {bot.position.x.toFixed(0)}, {bot.position.y.toFixed(0)}, {bot.position.z.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">{bot.position.dimension}</div>
                    </td>

                    {/* Group */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#162238] border border-[#223554] text-slate-300">
                        {bot.group}
                      </span>
                    </td>

                    {/* Profile */}
                    <td className="py-3 px-3">
                      <span className="text-cyan-300 text-[11px] truncate block max-w-[110px]">
                        {profile?.name || 'Default'}
                      </span>
                    </td>

                    {/* Activity */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-emerald-400">{bot.activity}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {bot.status === 'disconnected' ? (
                          <button
                            onClick={() => connectBot(bot.id)}
                            className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 rounded transition-colors"
                            title="Connect"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => (bot.activity === 'Idle' ? resumeBot(bot.id) : pauseBot(bot.id))}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                              title={bot.activity === 'Idle' ? 'Resume' : 'Pause'}
                            >
                              {bot.activity === 'Idle' ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                            </button>
                            <button
                              onClick={() => reconnectBot(bot.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors"
                              title="Reconnect"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => disconnectBot(bot.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded transition-colors"
                              title="Disconnect"
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => duplicateBot(bot.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                          title="Duplicate configuration"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmBot(bot)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors"
                          title="Delete bot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmBot && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e1628] border border-rose-500/40 rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Bot Deletion</span>
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              Are you sure you want to permanently delete <strong className="text-white">{deleteConfirmBot.name}</strong>? All runtime statistics and state will be discarded.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                onClick={() => setDeleteConfirmBot(null)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeBot(deleteConfirmBot.id);
                  setDeleteConfirmBot(null);
                }}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                Delete Instance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Single Bot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateBot}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add New Minecraft Bot</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Bot Username</label>
                <input
                  type="text"
                  placeholder="e.g. Apex_Miner_01"
                  value={newBotName}
                  onChange={e => setNewBotName(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Server</label>
                <select
                  value={newBotServerId}
                  onChange={e => setNewBotServerId(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {servers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.address}:{s.port})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bot Group</label>
                <select
                  value={newBotGroup}
                  onChange={e => setNewBotGroup(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {groups.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Initial Automation Profile</label>
                <select
                  value={newBotProfile}
                  onChange={e => setNewBotProfile(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Authentication Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewBotAuth('microsoft')}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-mono transition-colors ${
                      newBotAuth === 'microsoft'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#121c2e] border-[#223352] text-slate-400'
                    }`}
                  >
                    Microsoft / Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBotAuth('offline')}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-mono transition-colors ${
                      newBotAuth === 'offline'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-[#121c2e] border-[#223352] text-slate-400'
                    }`}
                  >
                    Offline / Cracked
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              >
                Create Bot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batch Bot Generator Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleBatchGenerate}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>Batch Generate Bots</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Quickly instantiate multiple bot worker threads with sequenced naming.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Prefix / Pattern</label>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={e => setBatchPrefix(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Number of Bots to Generate (1 - 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={batchCount}
                  onChange={e => setBatchCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign Group</label>
                <select
                  value={batchGroup}
                  onChange={e => setBatchGroup(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {groups.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign Behavior Profile</label>
                <select
                  value={batchProfile}
                  onChange={e => setBatchProfile(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Generate Fleet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Import Bot Cluster (JSON)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Paste exported configuration JSON below to restore or import multi-bot profiles.
            </p>

            {importError && (
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {importError}
              </div>
            )}

            <textarea
              rows={8}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste bot JSON array here..."
              className="w-full bg-[#111929] border border-[#22334f] text-slate-200 font-mono text-xs rounded-lg p-3 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Import Configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
