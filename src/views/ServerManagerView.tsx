import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { Server } from '../types';
import {
  Server as ServerIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Users,
  Shield,
  Layers,
  ArrowRight,
  Radio,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';
import { renderMinecraftText, getPingColor } from '../utils/minecraftColors';

export const ServerManagerView: React.FC = () => {
  const {
    servers,
    addServer,
    updateServer,
    removeServer,
    testServerPing,
    runServerCapabilityScan,
    bots,
    bulkConnectBots
  } = useBotContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [port, setPort] = useState(25565);
  const [version, setVersion] = useState('1.20.4');
  const [authType, setAuthType] = useState<'microsoft' | 'offline' | 'custom_token'>('microsoft');
  const [defaultUsername, setDefaultUsername] = useState('MineBot');
  const [timeoutMs, setTimeoutMs] = useState(15000);
  const [reconnectDelaySec, setReconnectDelaySec] = useState(8);
  const [maxReconnectAttempts, setMaxReconnectAttempts] = useState(5);
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyType, setProxyType] = useState<'socks5' | 'http'>('socks5');
  const [proxyHost, setProxyHost] = useState('');
  const [proxyPort, setProxyPort] = useState(1080);

  const resetForm = () => {
    setName('');
    setAddress('');
    setPort(25565);
    setVersion('1.20.4');
    setAuthType('microsoft');
    setDefaultUsername('MineBot');
    setTimeoutMs(15000);
    setReconnectDelaySec(8);
    setMaxReconnectAttempts(5);
    setProxyEnabled(false);
    setProxyHost('');
    setProxyPort(1080);
    setEditingServer(null);
  };

  const openEditModal = (s: Server) => {
    setEditingServer(s);
    setName(s.name);
    setAddress(s.address);
    setPort(s.port);
    setVersion(s.version);
    setAuthType(s.authType);
    setDefaultUsername(s.defaultUsername);
    setTimeoutMs(s.timeoutMs);
    setReconnectDelaySec(s.reconnectDelaySec);
    setMaxReconnectAttempts(s.maxReconnectAttempts);
    setProxyEnabled(s.proxy.enabled);
    setProxyType(s.proxy.type);
    setProxyHost(s.proxy.host);
    setProxyPort(s.proxy.port);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const payload = {
      name,
      address,
      port,
      version,
      authType,
      defaultUsername,
      timeoutMs,
      reconnectDelaySec,
      maxReconnectAttempts,
      proxy: {
        enabled: proxyEnabled,
        type: proxyType,
        host: proxyHost,
        port: proxyPort
      }
    };

    if (editingServer) {
      updateServer(editingServer.id, payload);
    } else {
      addServer(payload);
    }

    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide flex items-center space-x-2">
            <ServerIcon className="w-5 h-5 text-cyan-400" />
            <span>SERVER FLEET CONFIGURATOR</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage multi-network endpoints, proxy tunnels, handshake protocols, and ping diagnostics
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center space-x-1.5 shadow-lg shadow-cyan-950/40 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Server</span>
        </button>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {servers.map(server => {
          const botsOnServer = bots.filter(b => b.serverId === server.id);
          const onlineBotsCount = botsOnServer.filter(b => b.status === 'healthy' || b.status === 'warning').length;

          return (
            <div
              key={server.id}
              className="bg-[#0d1424] border border-[#1b2840] rounded-xl overflow-hidden hover:border-[#2b4166] transition-all flex flex-col justify-between shadow-xl"
            >
              {/* Header with MOTD preview */}
              <div className="p-4 bg-[#0f1729]/80 border-b border-[#182338]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-mono font-bold text-base text-slate-100">{server.name}</h3>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                        {server.version}
                      </span>
                      {server.proxy.enabled && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>SOCKS5 Proxy</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-0.5 flex items-center space-x-2">
                      <span>{server.address}:{server.port}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{server.software}</span>
                    </div>
                  </div>

                  {/* Status badge & Ping */}
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase">ONLINE</span>
                    </div>
                    <div className={`text-xs font-mono font-bold ${getPingColor(server.latency)}`}>
                      {server.latency} ms ping
                    </div>
                  </div>
                </div>

                {/* MOTD Banner */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#070b14] border border-[#152136] font-mono text-xs shadow-inner">
                  {renderMinecraftText(server.motd)}
                </div>
              </div>

              {/* Server Details & Specs */}
              <div className="p-4 space-y-4 text-xs font-mono">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45]">
                    <div className="text-slate-500 text-[10px]">PLAYERS ONLINE</div>
                    <div className="font-bold text-slate-200 mt-0.5 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{server.playerCount.online} / {server.playerCount.max}</span>
                    </div>
                  </div>

                  <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45]">
                    <div className="text-slate-500 text-[10px]">BOTS CONNECTED</div>
                    <div className="font-bold text-emerald-400 mt-0.5 flex items-center space-x-1">
                      <Radio className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{onlineBotsCount} / {botsOnServer.length}</span>
                    </div>
                  </div>

                  <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45]">
                    <div className="text-slate-500 text-[10px]">AUTH MODE</div>
                    <div className="font-bold text-slate-200 mt-0.5 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="capitalize">{server.authType}</span>
                    </div>
                  </div>
                </div>

                {/* Connection History Log */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Recent Connection Handshakes</span>
                    <span className="text-[10px] text-slate-500">Auto-reconnect: {server.reconnectDelaySec}s delay</span>
                  </div>
                  <div className="space-y-1 bg-[#090e1a] p-2 rounded-lg border border-[#141f33] max-h-24 overflow-y-auto">
                    {server.connectionHistory.map((hist, hIdx) => (
                      <div key={hIdx} className="flex items-center space-x-2 text-[11px] text-slate-300">
                        <span className="text-slate-500 text-[10px]">
                          {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            hist.status === 'connected' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        <span className="truncate">{hist.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {server.errors.length > 0 && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                    {server.errors.join(', ')}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-[#0a101d] border-t border-[#162238] flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => testServerPing(server.id)}
                    className="p-1.5 bg-[#121c2e] hover:bg-[#1a273e] border border-[#20324f] text-cyan-300 rounded-lg text-xs font-mono flex items-center space-x-1 transition-colors"
                    title="Send Ping Handshake"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ping</span>
                  </button>
                  <button
                    onClick={() => runServerCapabilityScan(server.id)}
                    className="p-1.5 bg-[#121c2e] hover:bg-[#1a273e] border border-[#20324f] text-emerald-300 rounded-lg text-xs font-mono flex items-center space-x-1 transition-colors"
                    title="Run Capability Audit"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>
                  <button
                    onClick={() => openEditModal(server)}
                    className="p-1.5 bg-[#121c2e] hover:bg-[#1a273e] border border-[#20324f] text-slate-300 rounded-lg text-xs font-mono transition-colors"
                    title="Edit Configuration"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeServer(server.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-mono transition-colors"
                    title="Remove Server"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    const botIds = botsOnServer.map(b => b.id);
                    if (botIds.length > 0) bulkConnectBots(botIds);
                  }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <span>Connect All ({botsOnServer.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSave}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <ServerIcon className="w-4 h-4 text-cyan-400" />
              <span>{editingServer ? 'Edit Server Configuration' : 'Add New Minecraft Server'}</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Friendly Server Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypixel Survival"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Minecraft Version</label>
                  <select
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1.20.4">1.20.4 (Recommended)</option>
                    <option value="1.20.1">1.20.1</option>
                    <option value="1.19.4">1.19.4</option>
                    <option value="1.18.2">1.18.2</option>
                    <option value="1.16.5">1.16.5</option>
                    <option value="1.12.2">1.12.2</option>
                    <option value="1.8.9">1.8.9 (Legacy PvP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Server IP / Hostname</label>
                  <input
                    type="text"
                    placeholder="play.example.com"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Port</label>
                  <input
                    type="number"
                    value={port}
                    onChange={e => setPort(parseInt(e.target.value) || 25565)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Authentication Mode</label>
                  <select
                    value={authType}
                    onChange={e => setAuthType(e.target.value as any)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="microsoft">Microsoft / Mojang Online</option>
                    <option value="offline">Offline / Cracked Mode</option>
                    <option value="custom_token">Custom Token / Proxy</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Default Bot Username</label>
                  <input
                    type="text"
                    value={defaultUsername}
                    onChange={e => setDefaultUsername(e.target.value)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Reliability thresholds */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Timeout (ms)</label>
                  <input
                    type="number"
                    value={timeoutMs}
                    onChange={e => setTimeoutMs(parseInt(e.target.value) || 15000)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Reconnect (sec)</label>
                  <input
                    type="number"
                    value={reconnectDelaySec}
                    onChange={e => setReconnectDelaySec(parseInt(e.target.value) || 8)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Max Retries</label>
                  <input
                    type="number"
                    value={maxReconnectAttempts}
                    onChange={e => setMaxReconnectAttempts(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Proxy Settings */}
              <div className="pt-2 border-t border-[#1a283f] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Proxy Configuration (Optional)</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proxyEnabled}
                      onChange={e => setProxyEnabled(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-400">Enable Proxy</span>
                  </label>
                </div>

                {proxyEnabled && (
                  <div className="grid grid-cols-3 gap-2 bg-[#111a2d] p-3 rounded-lg border border-[#223352]">
                    <div>
                      <label className="text-slate-400 block mb-1 text-[10px]">Type</label>
                      <select
                        value={proxyType}
                        onChange={e => setProxyType(e.target.value as any)}
                        className="w-full bg-[#16223a] border border-[#283d62] text-slate-200 rounded p-1.5 text-xs"
                      >
                        <option value="socks5">SOCKS5</option>
                        <option value="http">HTTP</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-[10px]">Proxy Host</label>
                      <input
                        type="text"
                        placeholder="127.0.0.1"
                        value={proxyHost}
                        onChange={e => setProxyHost(e.target.value)}
                        className="w-full bg-[#16223a] border border-[#283d62] text-slate-100 rounded p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-[10px]">Proxy Port</label>
                      <input
                        type="number"
                        placeholder="1080"
                        value={proxyPort}
                        onChange={e => setProxyPort(parseInt(e.target.value) || 1080)}
                        className="w-full bg-[#16223a] border border-[#283d62] text-slate-100 rounded p-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                {editingServer ? 'Save Changes' : 'Add Server'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
