import React from 'react';
import { useBotContext } from '../context/BotContext';
import {
  HeartPulse,
  Utensils,
  Shield,
  RotateCcw,
  AlertTriangle,
  Play,
  Check,
  ShieldAlert,
  ArrowRight,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const SurvivalView: React.FC = () => {
  const { selectedBot, updateBotSurvival, waypoints, simulateEvent, testTriggerRule } = useBotContext();

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  const surv = selectedBot.survival;
  const retreat = surv.emergencyRetreat;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              SURVIVAL & HEALTH SAFEGUARD AUTOMATION
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Defensive retreat triggers, nutrition watchers, auto-totem offhand swapping, and auto-healing
          </p>
        </div>

        {/* Current status pill */}
        <div className="flex items-center space-x-3 bg-[#0c1220] px-3.5 py-2 rounded-xl border border-[#1d2a44] font-mono text-xs">
          <span className="text-slate-400">Vitals:</span>
          <span className="text-rose-400 font-bold">{selectedBot.health}/20 HP</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-bold">{selectedBot.hunger}/20 Food</span>
        </div>
      </div>

      {/* Flagship Feature: Emergency Low Health Retreat Workflow Card */}
      <div className="bg-gradient-to-r from-[#172033] to-[#121a2c] border-2 border-rose-500/40 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide">
              Emergency Low Health Retreat Workflow
            </h3>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={retreat.enabled}
              onChange={e =>
                updateBotSurvival(selectedBot.id, {
                  emergencyRetreat: { ...retreat, enabled: e.target.checked }
                })
              }
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
            />
            <span className="text-xs font-mono font-bold text-rose-400">
              {retreat.enabled ? 'WORKFLOW ENABLED' : 'WORKFLOW DISABLED'}
            </span>
          </label>
        </div>

        {/* Visual Behavior Rule Flow */}
        <div className="bg-[#090d18] border border-[#1d2a45] rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">
            Automated Rule Sequence Definition:
          </div>
          <div className="flex flex-wrap items-center gap-2 text-slate-200">
            <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              WHEN Health &lt; {retreat.healthThreshold}% ({Math.round(20 * (retreat.healthThreshold / 100))} HP)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Stop Current Task
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Equip {retreat.defensiveItem.replace('minecraft:', '')}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Retreat to Safe Bunker
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Wait until Health &gt; {retreat.recoveryHealthThreshold}%
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Resume Previous Task
            </span>
          </div>
        </div>

        {/* Workflow Configuration Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-1">
          {/* Health Trigger Slider */}
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#1e2c47] space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Retreat Trigger HP:</span>
              <span className="text-rose-400 font-bold">{retreat.healthThreshold}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="5"
              value={retreat.healthThreshold}
              onChange={e =>
                updateBotSurvival(selectedBot.id, {
                  emergencyRetreat: { ...retreat, healthThreshold: parseInt(e.target.value) }
                })
              }
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">
              Triggers when bot reaches {Math.round(20 * (retreat.healthThreshold / 100))} / 20 HP
            </div>
          </div>

          {/* Safe Waypoint Selector */}
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#1e2c47] space-y-1.5">
            <label className="text-slate-300 block">Designated Safe Waypoint</label>
            <select
              value={retreat.safeWaypointId}
              onChange={e =>
                updateBotSurvival(selectedBot.id, {
                  emergencyRetreat: { ...retreat, safeWaypointId: e.target.value }
                })
              }
              className="w-full bg-[#16233a] border border-[#243756] text-slate-200 rounded p-1.5 text-xs focus:outline-none"
            >
              {waypoints.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.x}, {w.y}, {w.z})
                </option>
              ))}
            </select>
            <div className="text-[10px] text-slate-500">Bot will pathfind here upon trigger</div>
          </div>

          {/* Recovery Threshold & Defensive Item */}
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#1e2c47] space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Recovery HP Threshold:</span>
              <span className="text-emerald-400 font-bold">{retreat.recoveryHealthThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="5"
              value={retreat.recoveryHealthThreshold}
              onChange={e =>
                updateBotSurvival(selectedBot.id, {
                  emergencyRetreat: { ...retreat, recoveryHealthThreshold: parseInt(e.target.value) }
                })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Resumes task once recovered</div>
          </div>
        </div>

        {/* Live Test Trigger Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e2c47]">
          <span className="text-xs font-mono text-slate-400">
            Verify behavior execution in current environment:
          </span>
          <button
            onClick={() => simulateEvent('ambush')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-rose-950/40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate Low HP Retreat</span>
          </button>
        </div>
      </div>

      {/* Auto-Food, Auto-Heal & Equipment Automation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auto Food Module */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Nutrition & Auto-Food Manager</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={surv.autoFood}
                onChange={e => updateBotSurvival(selectedBot.id, { autoFood: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span className="text-xs font-mono text-slate-300">Enabled</span>
            </label>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Hunger threshold */}
            <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Eat When Hunger Reaches:</span>
                <span className="text-amber-400 font-bold">{surv.hungerThreshold} / 20</span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                value={surv.hungerThreshold}
                onChange={e => updateBotSurvival(selectedBot.id, { hungerThreshold: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">Prevents sprint exhaustion</div>
            </div>

            {/* Food Priority */}
            <div>
              <span className="text-slate-400 block mb-1.5">Food Priority Hierarchy</span>
              <div className="flex flex-wrap gap-1.5">
                {surv.foodPriority.map((food, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-1 bg-[#142034] border border-[#233554] text-slate-200 rounded text-[11px]"
                  >
                    #{fIdx + 1} {food}
                  </span>
                ))}
              </div>
            </div>

            {/* Avoid bad food */}
            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={surv.avoidBadFood}
                onChange={e => updateBotSurvival(selectedBot.id, { avoidBadFood: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span className="text-slate-300">Avoid Rotten Flesh, Spider Eye, and Pufferfish</span>
            </label>
          </div>
        </div>

        {/* Auto Equipment & Inventory Organization */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Equipment & Inventory Automation</span>
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Auto Armor Optimizer</div>
                <div className="text-[10px] text-slate-400">Instantly equips highest protection armor pieces</div>
              </div>
              <input
                type="checkbox"
                checked={surv.autoArmor}
                onChange={e => updateBotSurvival(selectedBot.id, { autoArmor: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Auto Weapon & Tool Switching</div>
                <div className="text-[10px] text-slate-400">Swaps to sword on mob target, pickaxe on stone</div>
              </div>
              <input
                type="checkbox"
                checked={surv.autoWeaponSelect}
                onChange={e => updateBotSurvival(selectedBot.id, { autoWeaponSelect: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#121c2e] border border-[#1b2b45] cursor-pointer">
              <div>
                <div className="font-bold text-slate-200">Broken Tool & Item Replacement</div>
                <div className="text-[10px] text-slate-400">Hot-swaps pickaxes or totems before breakage</div>
              </div>
              <input
                type="checkbox"
                checked={surv.autoItemReplace}
                onChange={e => updateBotSurvival(selectedBot.id, { autoItemReplace: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
