import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  CheckCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Info,
  ShieldAlert,
  Server
} from 'lucide-react';

export const CapabilityView: React.FC = () => {
  const { capabilities, servers, selectedBot, runServerCapabilityScan } = useBotContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const server = servers.find(s => s.id === selectedBot?.serverId) || servers[0];

  const handleScan = () => {
    if (!server) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      runServerCapabilityScan(server.id);
    }, 1000);
  };

  const filtered = capabilities.filter(cap => {
    if (selectedCategory !== 'all' && cap.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && cap.status !== selectedStatus) return false;
    if (search && !cap.name.toLowerCase().includes(search.toLowerCase()) && !cap.explanation.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const supportedCount = capabilities.filter(c => c.status === 'supported').length;
  const warningCount = capabilities.filter(c => c.status === 'warning').length;
  const unsupportedCount = capabilities.filter(c => c.status === 'unsupported').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              SERVER CAPABILITY & PERMISSION SCANNER
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active server audit preventing anti-cheat bans by strictly delineating supported vs restricted capabilities
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning || !server}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-950/40 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Auditing Server...' : 'Run Capability Scan'}</span>
        </button>
      </div>

      {/* Target Server Environmental Summary Card */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Audited Server Environment:</span>
          <span className="font-bold text-base text-slate-100">{server.name} ({server.address})</span>
          <div className="text-cyan-400 text-[11px] mt-0.5">
            Software: {server.software} • Protocol: {server.version} • Auth: {server.authType}
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{supportedCount} Supported</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{warningCount} Requires Op / Mod</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold flex items-center space-x-1">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>{unsupportedCount} Unsupported</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1220] p-3 rounded-xl border border-[#1b2840] flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-slate-400 mr-1">Category:</span>
          {['all', 'Movement', 'Combat', 'Interaction', 'World'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:bg-[#121c2e]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-md px-2.5 py-1 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="supported">✓ Supported Only</option>
            <option value="warning">⚠ Requires Op / Mod</option>
            <option value="unsupported">✕ Unsupported</option>
          </select>
        </div>
      </div>

      {/* Capability Audit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cap => {
          return (
            <div
              key={cap.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 font-mono ${
                cap.status === 'supported'
                  ? 'bg-[#0d1526] border-emerald-500/30'
                  : cap.status === 'warning'
                  ? 'bg-[#151421] border-amber-500/30'
                  : 'bg-[#180e14] border-rose-500/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {cap.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100 mt-0.5">{cap.name}</h3>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 flex items-center space-x-1 ${
                      cap.status === 'supported'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : cap.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {cap.status === 'supported' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {cap.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    {cap.status === 'unsupported' && <XCircle className="w-3 h-3 text-rose-400" />}
                    <span>{cap.status}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {cap.explanation}
                </p>
              </div>

              {/* Requirement & Anti-Cheat Risk Footer */}
              <div className="pt-2 border-t border-[#1e2a44] space-y-1 text-[10px]">
                {cap.requiredPermissionOrMod && (
                  <div className="text-amber-300">
                    <strong>Prerequisite:</strong> {cap.requiredPermissionOrMod}
                  </div>
                )}
                {cap.antiCheatRisk && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Anti-Cheat Detection Risk:</span>
                    <span
                      className={`font-bold uppercase ${
                        cap.antiCheatRisk === 'none'
                          ? 'text-emerald-400'
                          : cap.antiCheatRisk === 'low'
                          ? 'text-cyan-400'
                          : cap.antiCheatRisk === 'medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {cap.antiCheatRisk}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
