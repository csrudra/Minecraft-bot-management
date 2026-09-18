import React from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Sprout,
  Play,
  Pause,
  Wheat,
  RotateCcw,
  Archive,
  BarChart2,
  Clock,
  Sparkles,
  Check,
  Percent,
  Sliders
} from 'lucide-react';
import { formatUptime } from '../utils/minecraftColors';

export const FarmingView: React.FC = () => {
  const { selectedBot, updateBotFarming, updateBot, simulateEvent } = useBotContext();

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  const farm = selectedBot.farming;
  const stats = farm.stats;

  const cropOptions = [
    { id: 'wheat', name: 'Wheat & Seeds' },
    { id: 'carrots', name: 'Carrots' },
    { id: 'potatoes', name: 'Potatoes' },
    { id: 'beetroot', name: 'Beetroot' },
    { id: 'nether_wart', name: 'Nether Wart' },
    { id: 'sugar_cane', name: 'Sugar Cane' },
    { id: 'pumpkin', name: 'Pumpkin' },
    { id: 'melon', name: 'Melon' }
  ];

  const handleToggleCrop = (cropId: string) => {
    const list = farm.cropTypes.includes(cropId)
      ? farm.cropTypes.filter(c => c !== cropId)
      : [...farm.cropTypes, cropId];
    updateBotFarming(selectedBot.id, { cropTypes: list });
  };

  const handleToggleFarmingActive = () => {
    const next = !farm.enabled;
    updateBotFarming(selectedBot.id, { enabled: next });
    updateBot(selectedBot.id, { activity: next ? 'Farming' : 'Idle' });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              AGRICULTURAL & CROP HARVEST AUTOMATION
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-amber-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automated block state age=7 detection, zero-tick replanting, composter recycling, and silo transport
          </p>
        </div>

        {/* Master Farming Toggle */}
        <div className="flex items-center space-x-3 bg-[#0c1220] p-2 rounded-xl border border-[#1d2a44]">
          <span className="text-xs font-mono text-slate-300">Harvester State:</span>
          <button
            onClick={handleToggleFarmingActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              farm.enabled
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {farm.enabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{farm.enabled ? 'FARMING ACTIVE' : 'HARVESTER PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Farming Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Crops Harvested</span>
            <Wheat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{stats.cropsHarvested}</div>
          <div className="text-[10px] text-slate-500 mt-1">Wheat, Carrots, Potatoes</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Replant Accuracy</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.replantRate}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Immediate seed replacement</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Yield Rate</span>
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{stats.yieldPerHour} / hr</div>
          <div className="text-[10px] text-slate-500 mt-1">Estimated crop units/hour</div>
        </div>

        <div className="bg-[#0e1627] p-4 rounded-xl border border-[#1b2942]">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Silo Capacity</span>
            <Archive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">{stats.storageUsage}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Central crop hopper array</div>
        </div>
      </div>

      {/* Config Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Whitelist Selection */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Wheat className="w-4 h-4 text-amber-400" />
            <span>Target Crop Cultivation Whitelist</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {cropOptions.map(crop => {
              const isChecked = farm.cropTypes.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  onClick={() => handleToggleCrop(crop.id)}
                  className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                    isChecked
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-[#121c2e] border-[#1b2b45] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{crop.name}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#18263f]">
            <button
              onClick={() => simulateEvent('crop_harvest')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold"
            >
              + Simulate Instant Crop Harvest Cycle (+8 Wheat)
            </button>
          </div>
        </div>

        {/* Harvest Behaviors & Storage */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Harvesting & Silo Automation Rules</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Mature Crops Only (Age 7)</div>
                <div className="text-[10px] text-slate-400">Ignores immature growing crops to maximize yield</div>
              </div>
              <input
                type="checkbox"
                checked={farm.matureOnly}
                onChange={e => updateBotFarming(selectedBot.id, { matureOnly: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Instant Replanting</div>
                <div className="text-[10px] text-slate-400">Right-clicks matching seeds in same client tick</div>
              </div>
              <input
                type="checkbox"
                checked={farm.replantImmediately}
                onChange={e => updateBotFarming(selectedBot.id, { replantImmediately: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Seed Reserve Management</div>
                <div className="text-[10px] text-slate-400">Keeps 1 stack (64) seeds; deposits excess into composter</div>
              </div>
              <input
                type="checkbox"
                checked={farm.seedManagement}
                onChange={e => updateBotFarming(selectedBot.id, { seedManagement: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
