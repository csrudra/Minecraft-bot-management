import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Pickaxe,
  Play,
  Pause,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Archive,
  BarChart2,
  Clock,
  Compass,
  Zap,
  Sliders,
  Check
} from 'lucide-react';
import { formatUptime } from '../utils/minecraftColors';

export const MiningView: React.FC = () => {
  const { selectedBot, updateBotMining, updateBot, waypoints, simulateEvent } = useBotContext();

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot from the top bar.
      </div>
    );
  }

  const mine = selectedBot.mining;
  const stats = mine.stats;

  const targetOreOptions = [
    { id: 'minecraft:diamond_ore', name: 'Diamond Ore', color: 'text-cyan-400' },
    { id: 'minecraft:deepslate_diamond_ore', name: 'Deepslate Diamond Ore', color: 'text-cyan-300' },
    { id: 'minecraft:ancient_debris', name: 'Ancient Debris', color: 'text-rose-400' },
    { id: 'minecraft:iron_ore', name: 'Iron Ore', color: 'text-amber-200' },
    { id: 'minecraft:gold_ore', name: 'Gold Ore', color: 'text-amber-400' },
    { id: 'minecraft:coal_ore', name: 'Coal Ore', color: 'text-slate-300' },
    { id: 'minecraft:redstone_ore', name: 'Redstone Ore', color: 'text-red-400' },
    { id: 'minecraft:lapis_ore', name: 'Lapis Ore', color: 'text-blue-400' }
  ];

  const handleToggleTargetBlock = (blockId: string) => {
    const list = mine.targetBlocks.includes(blockId)
      ? mine.targetBlocks.filter(b => b !== blockId)
      : [...mine.targetBlocks, blockId];
    updateBotMining(selectedBot.id, { targetBlocks: list });
  };

  const handleToggleMiningActive = () => {
    const next = !mine.enabled;
    updateBotMining(selectedBot.id, { enabled: next });
    updateBot(selectedBot.id, { activity: next ? 'Mining' : 'Idle' });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Pickaxe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              MINING & RESOURCE AUTOMATION
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Branch strip mining, vein excavation, Fortune/Silk-touch tool monitoring, and auto-hauling
          </p>
        </div>

        {/* Master Mining Toggle */}
        <div className="flex items-center space-x-3 bg-[#0c1220] p-2 rounded-xl border border-[#1d2a44]">
          <span className="text-xs font-mono text-slate-300">Excavator State:</span>
          <button
            onClick={handleToggleMiningActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              mine.enabled
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {mine.enabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{mine.enabled ? 'MINING ACTIVE' : 'EXCAVATOR PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Mining Telemetry & Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Blocks Mined</span>
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{stats.blocksMined}</div>
          <div className="text-[10px] text-slate-500 mt-1">Deepslate, stone & ores</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Mining Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {formatUptime(stats.timeMiningSeconds)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Active excavation time</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tools Consumed</span>
            <Pickaxe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{stats.toolsConsumed}</div>
          <div className="text-[10px] text-slate-500 mt-1">Pickaxes retired / replaced</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Current Objective</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate mt-1">{stats.currentObjective}</div>
          <div className="text-[10px] text-slate-500 mt-1">Target Y Level: {mine.targetYLevel}</div>
        </div>
      </div>

      {/* Target Ore Selection & Collected Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mining Pattern, Block Whitelist, Tool Wear */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Ore Whitelist Builder */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Target Ore Whitelist & Prioritization</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              {targetOreOptions.map(ore => {
                const isChecked = mine.targetBlocks.includes(ore.id);
                return (
                  <button
                    key={ore.id}
                    onClick={() => handleToggleTargetBlock(ore.id)}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                      isChecked
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                        : 'bg-[#121c2e] border-[#1b2b45] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{ore.name}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mining Pattern & Branch Configuration */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Excavation Pattern & Geometrics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Pattern Selector */}
              <div>
                <label className="text-slate-400 block mb-1">Excavation Strategy</label>
                <select
                  value={mine.pattern}
                  onChange={e => updateBotMining(selectedBot.id, { pattern: e.target.value as any })}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  <option value="strip">Branch / Strip Mining (Optimal)</option>
                  <option value="vein">Vein Miner (Follow connected ores)</option>
                  <option value="quarry">Quarry Box Excavation</option>
                  <option value="staircase">Staircase Down to Deepslate</option>
                </select>
              </div>

              {/* Target Y Level */}
              <div>
                <label className="text-slate-400 block mb-1">Target Y Altitude Level</label>
                <input
                  type="number"
                  value={mine.targetYLevel}
                  onChange={e => updateBotMining(selectedBot.id, { targetYLevel: parseInt(e.target.value) || -58 })}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Y=-58 is peak Diamond depth</span>
              </div>

              {/* Branch Spacing */}
              <div>
                <label className="text-slate-400 block mb-1">Branch Tunnel Spacing</label>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={mine.branchSpacing}
                  onChange={e => updateBotMining(selectedBot.id, { branchSpacing: parseInt(e.target.value) || 3 })}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">3 blocks spacing guarantees zero missed veins</span>
              </div>
            </div>

            {/* Durability warning & Inventory full action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-2 border-t border-[#18263f]">
              <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Pickaxe Durability Warning:</span>
                  <span className="text-amber-400 font-bold">{mine.durabilityWarningPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={mine.durabilityWarningPercent}
                  onChange={e => updateBotMining(selectedBot.id, { durabilityWarningPercent: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Replaces tool before breaking</span>
              </div>

              <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
                <label className="text-slate-300 block">Inventory-Full Action</label>
                <select
                  value={mine.inventoryFullAction}
                  onChange={e => updateBotMining(selectedBot.id, { inventoryFullAction: e.target.value as any })}
                  className="w-full bg-[#16223a] border border-[#283d62] text-slate-200 rounded p-1.5 text-xs focus:outline-none"
                >
                  <option value="return_to_storage">Return to Storage Bunker & Deposit</option>
                  <option value="drop_trash">Drop Cobblestone & Keep Mining</option>
                  <option value="alert_pause">Pause Mining & Send Alert</option>
                </select>
                <span className="text-[10px] text-slate-500">Executes when 32+ slots filled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Mined Items Yield List & Storage Actions */}
        <div className="space-y-6">
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                <Archive className="w-4 h-4 text-cyan-400" />
                <span>Ore Haul Yield Ledger</span>
              </h3>
              <button
                onClick={() => simulateEvent('diamond_found')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold"
              >
                + Simulate Ore
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {stats.itemsCollected.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between"
                >
                  <span className="text-slate-200 font-semibold">{item.name}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    ×{item.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#18263f]">
              <button
                onClick={() => {
                  updateBot(selectedBot.id, {
                    activity: 'Sorting Inventory'
                  });
                  setTimeout(() => {
                    updateBot(selectedBot.id, { activity: 'Mining' });
                  }, 1200);
                }}
                className="w-full py-2 bg-[#142034] hover:bg-[#1d2d48] border border-[#233554] text-cyan-300 font-mono text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Archive className="w-4 h-4" />
                <span>Return & Deposit Ores to Storage Silo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
