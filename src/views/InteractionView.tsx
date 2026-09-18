import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  MousePointerClick,
  Box,
  Magnet,
  Filter,
  AlertTriangle,
  Check,
  ShieldAlert,
  ArrowRight,
  Hand,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';

export const InteractionView: React.FC = () => {
  const { selectedBot, botInventoryAction, addNotification } = useBotContext();

  const [reachDistance, setReachDistance] = useState(4.5);
  const [ghostHandEnabled, setGhostHandEnabled] = useState(false);
  const [autoPickup, setAutoPickup] = useState(true);
  const [pickupFilter, setPickupFilter] = useState<'all' | 'whitelist' | 'blacklist'>('whitelist');
  const [selectedContainer, setSelectedContainer] = useState('Central Drop Silo (Chest)');

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <MousePointerClick className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              WORLD INTERACTION & CONTAINER TOOLS
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Block right-clicking, container synchronization, item vacuum filters, and raycast hand physics
          </p>
        </div>
      </div>

      {/* Distinction & Permission Notice */}
      <div className="p-3 bg-[#111827] border border-[#233555] rounded-xl flex items-start space-x-3 text-xs font-mono text-slate-300">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-cyan-300">PROTOCOL BOUNDARY SPECIFICATION: </span>
          Standard block and container interactions respect the 4.5 block survival raycast boundary. <span className="text-rose-400 font-bold">"Ghost Hand"</span> (interacting with chests or levers through solid walls) requires client-side packet spoofing or custom server permissions and is rejected by modern Paper/Purpur servers.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Range & Ghost Hand */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Hand className="w-4 h-4 text-emerald-400" />
            <span>Block & Item Interaction Range</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* Range Slider */}
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Interaction Reach Distance:</span>
                <span className="text-cyan-400 font-bold">{reachDistance.toFixed(1)} blocks</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.1"
                value={reachDistance}
                onChange={e => setReachDistance(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2.0b (Close)</span>
                <span className="text-emerald-400 font-bold">4.5b (Vanilla Safe)</span>
                <span className="text-rose-400">8.0b (Mod Required)</span>
              </div>
            </div>

            {/* Ghost Hand Toggle */}
            <div className="p-3.5 rounded-lg bg-[#121c2e] border border-[#1b2b45] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 font-bold text-slate-200">
                  <span>Ghost-Hand Wall Penetration</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    Mod Required
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Allows interacting with buttons, doors, or chests through solid obsidian/stone
                </div>
              </div>

              <input
                type="checkbox"
                checked={ghostHandEnabled}
                onChange={e => setGhostHandEnabled(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => addNotification({
                  title: 'Interaction Dispatched',
                  message: `Sent right-click interact packet to the block under ${selectedBot.name}'s crosshair.`,
                  severity: 'info',
                  botId: selectedBot.id
                })}
                className="py-2 px-3 bg-[#16233a] hover:bg-[#1f2f4e] border border-[#243756] text-cyan-300 rounded-lg text-xs font-mono font-semibold transition-colors text-center"
              >
                Send Right-Click Block
              </button>

              <button
                onClick={() => addNotification({
                  title: 'Item Used',
                  message: `Used the held item in ${selectedBot.name}'s main hand.`,
                  severity: 'success',
                  botId: selectedBot.id
                })}
                className="py-2 px-3 bg-[#16233a] hover:bg-[#1f2f4e] border border-[#243756] text-emerald-300 rounded-lg text-xs font-mono font-semibold transition-colors text-center"
              >
                Use Held Item / Potion
              </button>
            </div>
          </div>
        </div>

        {/* Container Management & Item Filtering */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Box className="w-4 h-4 text-amber-400" />
            <span>Chest & Container Management</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Target Storage Container</label>
              <select
                value={selectedContainer}
                onChange={e => setSelectedContainer(e.target.value)}
                className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="Central Drop Silo (Chest)">Central Drop Silo (Double Chest at 110, 64, -330)</option>
                <option value="Bunker Vault (Chest)">Bunker Vault (Ender Chest / Trapped Chest)</option>
                <option value="Farm Hopper Barrel">Farm Hopper Barrel (Plot A)</option>
              </select>
            </div>

            {/* Container Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => botInventoryAction(selectedBot.id, 'sort')}
                className="py-2 px-2 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-slate-200 rounded-lg text-center transition-colors text-[11px]"
              >
                Auto-Sort Chest
              </button>
              <button
                onClick={() => addNotification({
                  title: 'Deposit Complete',
                  message: `Deposited non-essential ores into ${selectedContainer}.`,
                  severity: 'success',
                  botId: selectedBot.id
                })}
                className="py-2 px-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-lg text-center transition-colors text-[11px]"
              >
                Quick Deposit All
              </button>
              <button
                onClick={() => addNotification({
                  title: 'Supplies Restocked',
                  message: `Restocked food and torches from ${selectedContainer}.`,
                  severity: 'info',
                  botId: selectedBot.id
                })}
                className="py-2 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-center transition-colors text-[11px]"
              >
                Refill Supplies
              </button>
            </div>

            {/* Item Pickup Vacuum Filter */}
            <div className="pt-2 border-t border-[#18263f] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center space-x-1">
                  <Magnet className="w-3.5 h-3.5 text-purple-400" />
                  <span>Item Pickup Vacuum & Filter</span>
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPickup}
                    onChange={e => setAutoPickup(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-400">Auto Magnet</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ✓ Keep Ores & Gems
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ✓ Keep Food & Totems
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ✕ Auto-Discard Dirt / Cobble
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
