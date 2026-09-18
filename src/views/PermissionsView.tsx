import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  KeyRound,
  Shield,
  UserCheck,
  History,
  Lock,
  Download,
  Filter,
  Check,
  X
} from 'lucide-react';

export const PermissionsView: React.FC = () => {
  const {
    allUserRoles,
    currentUserRole,
    setCurrentUserRole,
    auditLogs
  } = useBotContext();

  const [searchAudit, setSearchAudit] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (searchAudit && !log.action.toLowerCase().includes(searchAudit.toLowerCase()) && !log.target.toLowerCase().includes(searchAudit.toLowerCase())) return false;
    return true;
  });

  const handleExportAudit = () => {
    const json = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              ROLE ACCESS CONTROL & COMPLIANCE AUDIT
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Granular privilege management, operational roles, and cryptographic action logging
          </p>
        </div>

        {/* Active Role Switcher */}
        <div className="flex items-center space-x-3 bg-[#0c1220] p-2 rounded-xl border border-[#1d2a44] font-mono text-xs">
          <span className="text-slate-400">Current Session Role:</span>
          <select
            value={currentUserRole.id}
            onChange={e => setCurrentUserRole(e.target.value as any)}
            className="bg-[#142034] border border-[#223352] text-emerald-400 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            {allUserRoles.map(r => (
              <option key={r.id} value={r.id}>
                {r.label} ({r.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Role Capability & Permission Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#121c2e] border-b border-[#1b2b45] text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Bot Fleet</th>
                <th className="py-2.5 px-3">Servers</th>
                <th className="py-2.5 px-3">Combat Controls</th>
                <th className="py-2.5 px-3">Workflows</th>
                <th className="py-2.5 px-3">CLI Terminal</th>
                <th className="py-2.5 px-3">Raw Packets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172338]">
              {allUserRoles.map(role => {
                const isCurrent = currentUserRole.id === role.id;
                const p = role.permissions;
                return (
                  <tr key={role.id} className={isCurrent ? 'bg-cyan-500/10' : ''}>
                    <td className="py-2.5 px-3 font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{role.label}</span>
                      {isCurrent && <span className="text-[9px] px-1 bg-cyan-500/30 text-cyan-300 rounded">ACTIVE</span>}
                    </td>
                    <td className="py-2.5 px-3">{p.manageBots ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                    <td className="py-2.5 px-3">{p.manageServers ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                    <td className="py-2.5 px-3">{p.combatControls ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                    <td className="py-2.5 px-3">{p.automationEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                    <td className="py-2.5 px-3">{p.executeCommands ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                    <td className="py-2.5 px-3">{p.viewDebugLogs ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Audit Log Table */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Immutable Action Audit Trail ({auditLogs.length})</span>
          </h3>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchAudit}
              onChange={e => setSearchAudit(e.target.value)}
              className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            />
            <button
              onClick={handleExportAudit}
              className="px-2.5 py-1 bg-[#121c2e] hover:bg-[#18253e] border border-[#223352] text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Trail</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#121c2e] border-b border-[#1b2b45] text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Instance</th>
                <th className="py-2.5 px-3">Previous State</th>
                <th className="py-2.5 px-3">New State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172338]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#121c2e] transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-semibold">{log.user}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{log.target}</td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] truncate max-w-[150px]">{log.previousValue || '---'}</td>
                  <td className="py-2.5 px-3 text-emerald-300 text-[11px] truncate max-w-[150px]">{log.newValue || 'Executed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
