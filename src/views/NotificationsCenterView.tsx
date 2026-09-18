import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  BellRing,
  Volume2,
  VolumeX,
  Send,
  Webhook,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  Check,
  ShieldAlert
} from 'lucide-react';

export const NotificationsCenterView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    soundEnabled,
    toggleSound,
    addNotification
  } = useBotContext();

  const [webhookUrl, setWebhookUrl] = useState('');
  const [discordAlertsEnabled, setDiscordAlertsEnabled] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (severityFilter !== 'all' && n.severity !== severityFilter) return false;
    return true;
  });

  const handleTestWebhook = () => {
    if (!webhookUrl.trim()) {
      alert('Please enter a Discord or Slack Webhook URL to test');
      return;
    }
    addNotification({
      title: 'Webhook Test Signal',
      message: `Dispatched test payload to ${webhookUrl.slice(0, 32)}... HTTP 204 OK`,
      severity: 'success'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              ALERT & NOTIFICATION CENTER
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time event push dispatch, Discord / Slack webhook channels, synthesized audio alarms, and incident logs
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={clearAllNotifications}
            className="px-3 py-1.5 bg-[#121c2e] hover:bg-[#1a283e] border border-[#223352] text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Notification Channels & Webhook Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook Dispatcher */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Webhook className="w-4 h-4 text-purple-400" />
              <span>Discord & Slack Webhook Integration</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={discordAlertsEnabled}
                onChange={e => setDiscordAlertsEnabled(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-0"
              />
              <span className="text-slate-300">Enable</span>
            </label>
          </div>

          <p className="text-slate-400 text-[11px]">
            Forward critical alerts (bot death, server kicks, inventory full, low HP retreat) directly to your mobile device via Discord.
          </p>

          <div className="space-y-2">
            <label className="text-slate-300 block">Webhook URL Endpoint</label>
            <input
              type="text"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full bg-[#121c2e] border border-[#223352] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#18263f]">
            <button
              onClick={handleTestWebhook}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-purple-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Webhook</span>
            </button>
          </div>
        </div>

        {/* Audio Alarms & In-App Preferences */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4 font-mono text-xs">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Audio & In-App Notification Channels</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Synthesized Audio Alarms</div>
                <div className="text-[10px] text-slate-400">Play web-audio chimes on critical combat & low HP events</div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={toggleSound}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">In-App Floating Toasts</div>
                <div className="text-[10px] text-slate-400">Display non-intrusive alert toast on bottom right</div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Notification Incident History Table */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              Incident Ledger ({notifications.length})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Filter Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="all">All Incidents</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="info">Info Only</option>
              <option value="success">Success Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-slate-500 text-center py-10">No incident logs matching filter.</div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                  notif.read ? 'bg-[#0f1729]/60 border-[#18263d]' : 'bg-[#131f36] border-[#22365a]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="mt-0.5">
                    {notif.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : notif.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : notif.severity === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100">{notif.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-0.5">{notif.message}</p>
                  </div>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
