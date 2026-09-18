import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  MessageSquare,
  Send,
  Zap,
  Plus,
  Trash2,
  Check,
  Radio,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { renderMinecraftText } from '../utils/minecraftColors';

export const ChatInterfaceView: React.FC = () => {
  const {
    chatMessages,
    chatTriggers,
    sendChatMessage,
    addChatTrigger,
    toggleChatTrigger,
    removeChatTrigger,
    bots,
    selectedBot,
    selectedBotId
  } = useBotContext();

  const [inputMsg, setInputMsg] = useState('');
  const [broadcastAll, setBroadcastAll] = useState(false);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [showAddTriggerModal, setShowAddTriggerModal] = useState(false);

  // New Trigger Form
  const [trigPattern, setTrigPattern] = useState('');
  const [trigRegex, setTrigRegex] = useState(false);
  const [trigAction, setTrigAction] = useState<'reply' | 'run_command' | 'trigger_rule' | 'retreat'>('reply');
  const [trigPayload, setTrigPayload] = useState('MineControl Bot active');
  const [trigDesc, setTrigDesc] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg.trim(), selectedBotId, broadcastAll);
    setInputMsg('');
  };

  const handleCreateTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigPattern.trim()) return;
    addChatTrigger({
      pattern: trigPattern.trim(),
      isRegex: trigRegex,
      enabled: true,
      action: trigAction,
      actionPayload: trigPayload.trim(),
      description: trigDesc.trim() || 'Automated message responder'
    });
    setTrigPattern('');
    setTrigPayload('');
    setTrigDesc('');
    setShowAddTriggerModal(false);
  };

  const filteredMessages = chatMessages.filter(msg => {
    if (channelFilter !== 'all' && msg.channel !== channelFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              MINECRAFT IN-GAME CHAT & EVENT TRIGGERS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Bi-directional server chat relay, channel filters, broadcast dispatcher, and reactive message parsing
          </p>
        </div>

        <button
          onClick={() => setShowAddTriggerModal(true)}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center space-x-1.5 shadow-lg shadow-purple-950/40 transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span>New Chat Trigger</span>
        </button>
      </div>

      {/* Main Grid: Left Chat Panel, Right Chat Triggers Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live In-Game Chat Feed */}
        <div className="lg:col-span-2 bg-[#0a0f1d] border border-[#1b2840] rounded-xl flex flex-col justify-between h-[580px] shadow-2xl overflow-hidden">
          {/* Chat Channel Filter Tabs */}
          <div className="p-3 bg-[#0d1526] border-b border-[#172338] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-1">
              {[
                { id: 'all', label: 'All Chat' },
                { id: 'global', label: 'Global' },
                { id: 'server', label: 'Server / Broadcast' },
                { id: 'system', label: 'System' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setChannelFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    channelFilter === tab.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-[#121c2e]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastAll}
                  onChange={e => setBroadcastAll(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Broadcast to all bots</span>
              </label>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 font-mono text-xs bg-[#070b14]">
            {filteredMessages.map(msg => {
              const isServer = msg.channel === 'server';
              const isBot = msg.rank === 'Bot';

              return (
                <div key={msg.id} className="flex items-start space-x-2 hover:bg-[#0c1424] p-1 rounded transition-colors">
                  <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                    [{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                  </span>

                  {/* Rank badge */}
                  {msg.rank && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                        msg.rank === 'Server'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : msg.rank === 'Admin'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : msg.rank === 'VIP'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {msg.rank}
                    </span>
                  )}

                  {/* Sender Name */}
                  <span className="font-bold text-slate-300 shrink-0">&lt;{msg.sender}&gt;</span>

                  {/* Message Body */}
                  <span className="text-slate-100 flex-1 leading-relaxed">
                    {renderMinecraftText(msg.message)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#0d1526] border-t border-[#172338] flex items-center space-x-2 font-mono text-xs">
            <input
              type="text"
              placeholder={`Send chat as ${broadcastAll ? 'ALL BOTS (Cluster)' : selectedBot?.name || 'Bot'}...`}
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              className="flex-1 bg-[#121c2e] border border-[#223352] text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Col: Reactive Chat Event Triggers Manager */}
        <div className="space-y-4">
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Message Event Triggers</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{chatTriggers.length} Active</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {chatTriggers.map(trig => (
                <div
                  key={trig.id}
                  className="bg-[#121c2e] p-3 rounded-xl border border-[#1b2b45] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 text-[11px] truncate max-w-[180px]">
                      "{trig.pattern}"
                    </span>
                    <button
                      onClick={() => toggleChatTrigger(trig.id)}
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        trig.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {trig.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-snug">{trig.description}</p>

                  <div className="pt-1.5 border-t border-[#192742] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="capitalize text-cyan-300">Action: {trig.action.replace('_', ' ')}</span>
                    <button
                      onClick={() => removeChatTrigger(trig.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Trigger Modal */}
      {showAddTriggerModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateTrigger}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create New Chat Trigger Rule
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Incoming Match Pattern</label>
                <input
                  type="text"
                  placeholder="e.g. Restarting in (.*) seconds"
                  value={trigPattern}
                  onChange={e => setTrigPattern(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="regexCheck"
                  checked={trigRegex}
                  onChange={e => setTrigRegex(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <label htmlFor="regexCheck" className="text-slate-300 text-xs">Treat as Regular Expression (RegEx)</label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Trigger Action</label>
                <select
                  value={trigAction}
                  onChange={e => setTrigAction(e.target.value as any)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2"
                >
                  <option value="reply">Auto-Reply in Chat</option>
                  <option value="run_command">Execute Terminal / Slash Command</option>
                  <option value="trigger_rule">Execute Automation Workflow</option>
                  <option value="retreat">Emergency Retreat to Waypoint</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action Payload</label>
                <input
                  type="text"
                  value={trigPayload}
                  onChange={e => setTrigPayload(e.target.value)}
                  placeholder="e.g. Current Bot Health: {hp}"
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={trigDesc}
                  onChange={e => setTrigDesc(e.target.value)}
                  placeholder="Brief description of behavior..."
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowAddTriggerModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
              >
                Save Trigger
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
