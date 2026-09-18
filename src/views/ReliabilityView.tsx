import React from 'react';
import { useBotContext } from '../context/BotContext';
import {
  ShieldAlert,
  RotateCcw,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Zap,
  Play,
  Clock,
  Wifi,
  Power
} from 'lucide-react';

export const ReliabilityView: React.FC = () => {
  const { selectedBot, updateBotReliability, simulateEvent, reconnectBot, restartBot } = useBotContext();

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  const rel = selectedBot.reliability;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              ANTI-DISCONNECT & WATCHDOG RELIABILITY
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Auto-reconnect policies, exponential backoff with jitter, session timeout recovery, and heartbeat watchdog
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => simulateEvent('server_kick')}
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Server Kick</span>
          </button>
          <button
            onClick={() => restartBot(selectedBot.id)}
            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Watchdog Restart</span>
          </button>
        </div>
      </div>

      {/* 5-State Bot Health Indicator Banner */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>5-State Health Lifecycle Status</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Uptime SLA: {rel.uptimePercentage}%
          </span>
        </div>

        {/* 5 status badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          {[
            { id: 'healthy', label: 'Healthy', color: 'border-emerald-500 bg-emerald-500/15 text-emerald-300', desc: 'Heartbeat normal' },
            { id: 'warning', label: 'Warning', color: 'border-amber-500 bg-amber-500/15 text-amber-300', desc: 'High ping / low HP' },
            { id: 'recovering', label: 'Recovering', color: 'border-cyan-500 bg-cyan-500/15 text-cyan-300', desc: 'Reconnecting attempt' },
            { id: 'error', label: 'Error', color: 'border-rose-500 bg-rose-500/15 text-rose-300', desc: 'Auth fail or kicked' },
            { id: 'disconnected', label: 'Disconnected', color: 'border-slate-600 bg-slate-800 text-slate-400', desc: 'Offline thread' }
          ].map(st => {
            const isCurrent = selectedBot.status === st.id;
            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent ? `${st.color} shadow-lg ring-1 ring-current` : 'bg-[#121c2e] border-[#1b2b45] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>{st.label}</span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                </div>
                <div className="text-[10px] text-slate-400">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reconnect Policies & Watchdog Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reconnect Policy Settings */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Exponential Backoff Retry Policy</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rel.autoReconnect}
                onChange={e => updateBotReliability(selectedBot.id, { autoReconnect: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs font-mono text-slate-300">Auto Reconnect</span>
            </label>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Initial Delay */}
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Initial Retry Delay:</span>
                <span className="text-cyan-400 font-bold">{rel.initialDelayMs / 1000} seconds</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={rel.initialDelayMs}
                onChange={e => updateBotReliability(selectedBot.id, { initialDelayMs: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Backoff Multiplier */}
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Backoff Multiplier:</span>
                <span className="text-cyan-400 font-bold">{rel.backoffMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="3.0"
                step="0.1"
                value={rel.backoffMultiplier}
                onChange={e => updateBotReliability(selectedBot.id, { backoffMultiplier: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Max Attempts */}
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Maximum Retry Attempts:</span>
                <span className="text-cyan-400 font-bold">{rel.maxAttempts} retries</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={rel.maxAttempts}
                onChange={e => updateBotReliability(selectedBot.id, { maxAttempts: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Watchdog Heartbeat Diagnostics */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Connection Health & Kick Inspector</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
              <div className="text-slate-400 text-[11px]">Heartbeat Signal Interval</div>
              <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active (2,000 ms TCP keep-alive probe)</span>
              </div>
            </div>

            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
              <div className="text-slate-400 text-[11px]">Last Server Kick / Disconnect Diagnostic:</div>
              <div className="text-slate-200 font-semibold break-all text-[11px]">
                {rel.lastKickReason || 'No anomalous disconnects recorded. Clean session.'}
              </div>
            </div>

            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[11px]">Current Reconnect Count:</div>
                <div className="text-slate-100 font-bold">{selectedBot.stats.reconnects} events</div>
              </div>
              <button
                onClick={() => reconnectBot(selectedBot.id)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                Force Reconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
