import React, { useState, useRef, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Terminal,
  Search,
  Filter,
  Trash2,
  Download,
  Send,
  CornerDownLeft,
  ArrowDown,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export const LiveConsoleView: React.FC = () => {
  const {
    consoleLogs,
    bots,
    selectedBot,
    selectedBotId,
    setSelectedBotId,
    executeTerminalCommand,
    clearConsoleLogs,
    exportConsoleLogs
  } = useBotContext();

  const [inputCmd, setInputCmd] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [botFilter, setBotFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, autoScroll]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    executeTerminalCommand(inputCmd.trim(), botFilter !== 'all' ? botFilter : selectedBotId);
    setInputCmd('');
  };

  const handleExport = () => {
    const text = exportConsoleLogs();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-logs-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = consoleLogs.filter(log => {
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    if (botFilter !== 'all' && log.botId !== botFilter) return false;
    if (search.trim() && !log.message.toLowerCase().includes(search.toLowerCase()) && !log.botName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const quickCommands = [
    '/help',
    '/status',
    '/coords',
    '/inventory',
    '/say Hello from bot'
  ];

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col justify-between">
      {/* Header & Filter Controls */}
      <div className="space-y-3 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#1b273d]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              LIVE SYSTEM CONSOLE & CLI
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              STDOUT / STDERR
            </span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors ${
                autoScroll
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-[#121c2e] border-[#223352] text-slate-400'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Auto-Scroll</span>
            </button>

            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 bg-[#121c2e] hover:bg-[#18253e] border border-[#223352] text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => clearConsoleLogs(botFilter !== 'all' ? botFilter : undefined)}
              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/30 transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#0b101c] p-2.5 rounded-xl border border-[#1b2840] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center flex-wrap gap-2">
            {/* Search */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter output..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#121c2e] border border-[#223352] text-slate-200 text-xs rounded-lg pl-8 pr-2.5 py-1 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Level Dropdown */}
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="info">INFO</option>
              <option value="task">TASK</option>
              <option value="combat">COMBAT</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
            </select>

            {/* Bot Scope Dropdown */}
            <select
              value={botFilter}
              onChange={e => setBotFilter(e.target.value)}
              className="bg-[#121c2e] border border-[#223352] text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">Cluster (All Bots)</option>
              {bots.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.group})
                </option>
              ))}
            </select>
          </div>

          {/* Quick command buttons */}
          <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span>Quick:</span>
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                onClick={() => executeTerminalCommand(cmd, botFilter !== 'all' ? botFilter : selectedBotId)}
                className="px-2 py-0.5 rounded bg-[#131e33] hover:bg-[#1a2b47] text-cyan-300 border border-[#223352] transition-colors"
              >
                {cmd.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div className="flex-1 bg-[#060a12] border border-[#1b2840] rounded-xl p-4 overflow-y-auto font-mono text-xs shadow-inner space-y-1.5 my-2 min-h-[300px]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 py-12 text-center">
            No matching console logs recorded. Type a command below to test.
          </div>
        ) : (
          filteredLogs.map(log => {
            return (
              <div key={log.id} className="flex items-start space-x-2 leading-relaxed hover:bg-[#0c1424] px-1 py-0.5 rounded">
                <span className="text-slate-500 text-[11px] shrink-0 select-none">
                  [{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </span>
                <span className="text-cyan-400 font-bold shrink-0">
                  [{log.botName}]
                </span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
                    log.level === 'warn'
                      ? 'bg-amber-500/20 text-amber-400'
                      : log.level === 'error'
                      ? 'bg-rose-500/20 text-rose-400'
                      : log.level === 'combat'
                      ? 'bg-rose-500/20 text-rose-300'
                      : log.level === 'task'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.level}
                </span>
                <span className={`break-all ${
                  log.message.startsWith('>') ? 'text-cyan-300 font-bold' : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>

      {/* Interactive Command Input Prompt */}
      <form onSubmit={handleSendCommand} className="shrink-0 flex items-center space-x-2 font-mono text-xs">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-cyan-400 font-bold select-none">&gt;</span>
          <input
            type="text"
            placeholder={`Execute command on ${botFilter !== 'all' ? bots.find(b => b.id === botFilter)?.name : selectedBot?.name || 'cluster'} (e.g. /help, /coords, /mine, /status)...`}
            value={inputCmd}
            onChange={e => setInputCmd(e.target.value)}
            className="w-full bg-[#0d1424] border border-[#223352] text-slate-100 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 shadow-lg"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow-lg shadow-cyan-950/40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};
