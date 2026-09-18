import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  BarChart3,
  Clock,
  Pickaxe,
  Swords,
  Compass,
  RotateCcw,
  Skull,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatUptime } from '../utils/minecraftColors';

export const AnalyticsView: React.FC = () => {
  const { bots, servers } = useBotContext();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Aggregated Cluster Metrics
  const totalUptimeSeconds = bots.reduce((acc, b) => acc + (b.stats.uptimeSeconds || 0), 0);
  const totalDistance = bots.reduce((acc, b) => acc + (b.stats.distanceTraveledBlocks || 0), 0);
  const totalBlocksMined = bots.reduce((acc, b) => acc + (b.mining.stats.blocksMined || 0), 0);
  const totalKills = bots.reduce((acc, b) => acc + (b.stats.kills || 0), 0);
  const totalDeaths = bots.reduce((acc, b) => acc + (b.stats.deaths || 0), 0);
  const totalTasksCompleted = bots.reduce((acc, b) => acc + (b.stats.tasksCompleted || 0), 0);
  const totalTasksFailed = bots.reduce((acc, b) => acc + (b.stats.tasksFailed || 0), 0);

  const successRate = totalTasksCompleted + totalTasksFailed > 0
    ? ((totalTasksCompleted / (totalTasksCompleted + totalTasksFailed)) * 100).toFixed(1)
    : '100.0';

  // Sample data points for Server Latency Chart (SVG Line Graph)
  const latencyPoints = [26, 28, 25, 32, 29, 27, 35, 42, 30, 28, 24, 27, 26, 29, 31, 28];
  const maxLat = Math.max(...latencyPoints, 50);

  // Sample hourly mining blocks
  const hourlyMiningData = [
    { hour: '12:00', blocks: 180 },
    { hour: '13:00', blocks: 240 },
    { hour: '14:00', blocks: 310 },
    { hour: '15:00', blocks: 290 },
    { hour: '16:00', blocks: 350 },
    { hour: '17:00', blocks: 420 },
    { hour: '18:00', blocks: 380 }
  ];
  const maxBlocks = Math.max(...hourlyMiningData.map(d => d.blocks));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              FLEET TELEMETRY & PRODUCTIVITY ANALYTICS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Aggregated mining yield, combat efficiency ratios, packet round-trip time, and task success metrics
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-1 bg-[#0c1220] p-1 rounded-xl border border-[#1d2a44] font-mono text-xs">
          {(['1h', '6h', '24h', '7d'] as const).map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-3 py-1 rounded-lg transition-colors uppercase ${
                timeRange === tr
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Uptime</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">{formatUptime(totalUptimeSeconds)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Across all bots</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Blocks Mined</span>
            <Pickaxe className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300">{totalBlocksMined.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-1">Ores & stone</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Combat K/D</span>
            <Swords className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-300">
            {totalKills} <span className="text-slate-500 text-xs">/ {totalDeaths}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Ratio: {(totalKills / (totalDeaths || 1)).toFixed(1)}</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Distance Traveled</span>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300">{Math.round(totalDistance).toLocaleString()} b</div>
          <div className="text-[10px] text-slate-500 mt-1">Overworld & Nether</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Success Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{successRate}%</div>
          <div className="text-[10px] text-slate-500 mt-1">{totalTasksCompleted} tasks OK</div>
        </div>

        <div className="bg-[#0e1627] p-3.5 rounded-xl border border-[#1b2942]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Cluster TPS</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">20.0 ★</div>
          <div className="text-[10px] text-slate-500 mt-1">0% Tick Drop</div>
        </div>
      </div>

      {/* Charts Grid: 1 Latency Line Chart, 1 Mining Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Latency Over Time Line Chart */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Server Connection Latency Over Time (ms)</span>
            </h3>
            <span className="text-cyan-400 font-bold">SMP Network (28ms avg)</span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-44 w-full bg-[#090d18] rounded-lg p-3 border border-[#172236] relative flex flex-col justify-between">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#162238" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#162238" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#162238" strokeDasharray="3 3" />

              {/* Area Gradient fill */}
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Polygon Area */}
              <polygon
                points={`0,120 ${latencyPoints.map((val, idx) => {
                  const x = (idx / (latencyPoints.length - 1)) * 400;
                  const y = 120 - (val / maxLat) * 110;
                  return `${x},${y}`;
                }).join(' ')} 400,120`}
                fill="url(#latencyGrad)"
              />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                points={latencyPoints.map((val, idx) => {
                  const x = (idx / (latencyPoints.length - 1)) * 400;
                  const y = 120 - (val / maxLat) * 110;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data points */}
              {latencyPoints.map((val, idx) => {
                const x = (idx / (latencyPoints.length - 1)) * 400;
                const y = 120 - (val / maxLat) * 110;
                return (
                  <circle key={idx} cx={x} cy={y} r="3" fill="#38bdf8" stroke="#090d18" strokeWidth="1.5" />
                );
              })}
            </svg>

            <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-[#141f33]">
              <span>-60 min</span>
              <span>-45 min</span>
              <span>-30 min</span>
              <span>-15 min</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Mining Productivity Hourly Bar Chart */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Pickaxe className="w-4 h-4 text-emerald-400" />
              <span>Mining Productivity (Blocks / Hour)</span>
            </h3>
            <span className="text-emerald-400 font-bold">Deepslate Y=-58</span>
          </div>

          <div className="h-44 w-full bg-[#090d18] rounded-lg p-3 border border-[#172236] flex items-end justify-between gap-3">
            {hourlyMiningData.map((d, dIdx) => {
              const heightPct = Math.round((d.blocks / maxBlocks) * 100);
              return (
                <div key={dIdx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <span className="text-[9px] text-emerald-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {d.blocks}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all group-hover:from-emerald-500 group-hover:to-emerald-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-slate-500 mt-1">{d.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Comparison Table */}
      <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4 font-mono text-xs">
        <h3 className="font-bold text-slate-200 uppercase tracking-wider">
          Individual Bot Telemetry Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#121c2e] border-b border-[#1b2b45] text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Bot Name</th>
                <th className="py-2.5 px-3">Group</th>
                <th className="py-2.5 px-3">Uptime</th>
                <th className="py-2.5 px-3">Blocks Mined</th>
                <th className="py-2.5 px-3">Kills</th>
                <th className="py-2.5 px-3">Distance</th>
                <th className="py-2.5 px-3">Tasks Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172338]">
              {bots.map(bot => (
                <tr key={bot.id} className="hover:bg-[#121c2e] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-100">{bot.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{bot.group}</td>
                  <td className="py-2.5 px-3 text-emerald-300">{formatUptime(bot.uptime)}</td>
                  <td className="py-2.5 px-3 text-cyan-300">{bot.mining.stats.blocksMined}</td>
                  <td className="py-2.5 px-3 text-rose-300">{bot.stats.kills}</td>
                  <td className="py-2.5 px-3 text-purple-300">{bot.stats.distanceTraveledBlocks.toFixed(0)}b</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{bot.stats.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
