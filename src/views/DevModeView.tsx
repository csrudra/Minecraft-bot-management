import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { NetworkPacket } from '../types';
import {
  Cpu,
  Radio,
  Activity,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  Code2,
  Zap,
  Terminal,
  ShieldCheck,
  Check
} from 'lucide-react';

export const DevModeView: React.FC = () => {
  const { networkPackets, selectedBot, isDevMode, toggleDevMode } = useBotContext();

  const [dirFilter, setDirFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [searchPkt, setSearchPkt] = useState('');
  const [inspectedPacket, setInspectedPacket] = useState<NetworkPacket | null>(networkPackets[0] || null);

  const filteredPackets = networkPackets.filter(pkt => {
    if (dirFilter !== 'all' && pkt.direction !== dirFilter) return false;
    if (searchPkt && !pkt.packetName.toLowerCase().includes(searchPkt.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              DEVELOPER DIAGNOSTICS & PACKET INSPECTOR
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              ADVANCED DEBUGGER
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Low-level TCP protocol frames, clientbound entity metadata, serialization timings, and memory profiling
          </p>
        </div>

        <button
          onClick={toggleDevMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
            isDevMode
              ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
              : 'bg-[#121c2e] border-[#223352] text-slate-400'
          }`}
        >
          {isDevMode ? 'Advanced Mode: ACTIVE' : 'Enable Advanced Mode'}
        </button>
      </div>

      {/* Real-time Diagnostics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Heap Allocation</div>
          <div className="text-xl font-bold text-slate-100">342 MB / 2048 MB</div>
          <div className="text-[10px] text-emerald-400 mt-1">16.7% JVM / V8 Heap</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tick Timing (MSPT)</div>
          <div className="text-xl font-bold text-emerald-400">4.2 ms / 50.0 ms</div>
          <div className="text-[10px] text-slate-500 mt-1">20.0 TPS stable</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Protocol Version</div>
          <div className="text-xl font-bold text-cyan-300">765 (1.20.4)</div>
          <div className="text-[10px] text-slate-500 mt-1">Mineflayer Prismarine v4</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Packet Rate</div>
          <div className="text-xl font-bold text-purple-300">42 pkt / sec</div>
          <div className="text-[10px] text-slate-500 mt-1">0% packet drop</div>
        </div>
      </div>

      {/* Main Grid: Left Packet Sniffer Stream, Right JSON Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Packet Stream */}
        <div className="lg:col-span-2 bg-[#0e1627] border border-[#1b2942] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between font-mono text-xs">
          {/* Packet Toolbar */}
          <div className="p-3 bg-[#0d1526] border-b border-[#172338] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1">
              {(['all', 'inbound', 'outbound'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => setDirFilter(dir)}
                  className={`px-2.5 py-1 rounded-md uppercase text-[11px] font-bold transition-colors ${
                    dirFilter === dir
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-[#121c2e]'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>

            <div className="relative w-48">
              <input
                type="text"
                placeholder="Filter packet type..."
                value={searchPkt}
                onChange={e => setSearchPkt(e.target.value)}
                className="w-full bg-[#121c2e] border border-[#223352] text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Packet Stream List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-1.5 max-h-[460px] bg-[#070b14]">
            {filteredPackets.map(pkt => {
              const isInbound = pkt.direction === 'inbound';
              const isSelected = inspectedPacket?.id === pkt.id;

              return (
                <div
                  key={pkt.id}
                  onClick={() => setInspectedPacket(pkt)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200'
                      : 'bg-[#101828] border-[#18263f] hover:border-[#25395c] text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`p-1 rounded ${
                        isInbound ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {isInbound ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <div className="font-bold text-xs truncate max-w-[280px]">
                        {pkt.packetName}
                      </div>
                      <div className="text-[10px] text-slate-500">{pkt.payloadSummary}</div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 shrink-0">
                    <div>{pkt.sizeBytes} B</div>
                    <div className="text-slate-500">
                      {new Date(pkt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Raw Packet Payload Inspector */}
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Packet Payload Inspector</span>
            </h3>

            {inspectedPacket ? (
              <div className="space-y-3">
                <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] space-y-1">
                  <div className="text-cyan-300 font-bold break-all">{inspectedPacket.packetName}</div>
                  <div className="text-[10px] text-slate-400">
                    Direction: {inspectedPacket.direction.toUpperCase()} • Size: {inspectedPacket.sizeBytes} bytes
                  </div>
                </div>

                <div className="bg-[#070b14] p-3 rounded-lg border border-[#18263f] overflow-x-auto">
                  <pre className="text-[11px] text-emerald-400 leading-relaxed font-mono">
                    {JSON.stringify(inspectedPacket.fullPayload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 py-10 text-center">
                Click any packet from the left stream to inspect decoded buffer data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
