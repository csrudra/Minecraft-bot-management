import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { AutomationRule, AutomationTrigger, AutomationCondition, AutomationAction } from '../types';
import {
  Workflow,
  Plus,
  Trash2,
  Play,
  Copy,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Settings
} from 'lucide-react';

export const AutomationBuilderView: React.FC = () => {
  const {
    automationRules,
    addAutomationRule,
    updateAutomationRule,
    toggleAutomationRule,
    removeAutomationRule,
    testTriggerRule,
    selectedBot,
    waypoints
  } = useBotContext();

  const [activeRuleId, setActiveRuleId] = useState<string>(automationRules[0]?.id || '');
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  const currentRule = automationRules.find(r => r.id === activeRuleId) || automationRules[0];

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;
    const newRule: Omit<AutomationRule, 'id'> = {
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || 'Custom user constructed automation workflow',
      enabled: true,
      priority: 50,
      triggers: [{ id: 'trig-' + Date.now(), type: 'health_below', threshold: 30 }],
      conditions: [{ id: 'cond-' + Date.now(), type: 'is_online', value: 'true' }],
      actions: [
        { id: 'act-1-' + Date.now(), type: 'stop_task' },
        { id: 'act-2-' + Date.now(), type: 'move_to_waypoint', waypointId: waypoints[0]?.id || 'wp-safe-room' },
        { id: 'act-3-' + Date.now(), type: 'resume_previous_task' }
      ]
    };
    addAutomationRule(newRule);
    setNewRuleName('');
    setNewRuleDesc('');
    setShowNewRuleModal(false);
  };

  const addActionToCurrent = (type: AutomationAction['type']) => {
    if (!currentRule) return;
    const newAct: AutomationAction = {
      id: 'act-' + Date.now(),
      type,
      delayMs: type === 'wait_delay' ? 1000 : undefined,
      command: type === 'chat_command' ? '/say Executed' : undefined,
      waypointId: type === 'move_to_waypoint' ? waypoints[0]?.id : undefined,
      healthTarget: type === 'wait_until_health' ? 18 : undefined
    };
    updateAutomationRule(currentRule.id, {
      actions: [...currentRule.actions, newAct]
    });
  };

  const removeActionFromCurrent = (actionId: string) => {
    if (!currentRule) return;
    updateAutomationRule(currentRule.id, {
      actions: currentRule.actions.filter(a => a.id !== actionId)
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              VISUAL AUTOMATION & BEHAVIOR BUILDER
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Construct reactive state-machine workflows with conditional triggers, actions, and failsafe branches
          </p>
        </div>

        <button
          onClick={() => setShowNewRuleModal(true)}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center space-x-1.5 shadow-lg shadow-purple-950/40 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow Rule</span>
        </button>
      </div>

      {/* Main Grid: Left Rules Sidebar, Right Visual Rule Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rules Sidebar */}
        <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-[#18263f]">
            Workflow Catalog ({automationRules.length})
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto">
            {automationRules.map(rule => {
              const isActive = currentRule?.id === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-purple-500/20 border-purple-500/60 shadow-md text-purple-200'
                      : 'bg-[#121c2e] border-[#1b2b45] text-slate-300 hover:bg-[#162238]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{rule.name}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleAutomationRule(rule.id);
                      }}
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        rule.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {rule.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {rule.description}
                  </div>
                  <div className="text-[9px] text-purple-300/80 mt-2 flex items-center justify-between">
                    <span>Priority: {rule.priority}</span>
                    <span>{rule.actions.length} Steps</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3 Cols: Active Rule Editor & Flow Visualizer */}
        <div className="lg:col-span-3 space-y-5">
          {currentRule && (
            <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-6 space-y-6">
              {/* Rule Title & Test Execution Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b2b45]">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono font-bold text-base text-slate-100">{currentRule.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Priority: {currentRule.priority}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">{currentRule.description}</p>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <button
                    onClick={() => selectedBot && testTriggerRule(currentRule.id, selectedBot.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-950/40"
                    title="Simulate rule execution on selected bot"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Run on {selectedBot?.name || 'Bot'}</span>
                  </button>

                  <button
                    onClick={() => removeAutomationRule(currentRule.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1. WHEN Block (Triggers) */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">WHEN</span>
                  <span>Event Trigger Conditions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {currentRule.triggers.map((trig, tIdx) => (
                    <div
                      key={trig.id}
                      className="bg-[#121c2e] p-3.5 rounded-xl border border-cyan-500/30 space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-300 font-bold">
                        <span className="capitalize">{trig.type.replace('_', ' ')}</span>
                        <span className="text-cyan-400">
                          {trig.threshold !== undefined ? `Threshold: ${trig.threshold}%` : `${trig.intervalSeconds}s`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {trig.type === 'health_below' && `Fires instantaneously if bot HP drops below ${trig.threshold}%`}
                        {trig.type === 'inventory_full' && `Fires when bot inventory has ${trig.threshold} or more slots filled`}
                        {trig.type === 'timer_interval' && `Fires periodically every ${trig.intervalSeconds} seconds`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. AND Block (Conditions) */}
              {currentRule.conditions.length > 0 && (
                <div className="space-y-3 font-mono">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">AND</span>
                    <span>State Validation Guard</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {currentRule.conditions.map(cond => (
                      <div
                        key={cond.id}
                        className="bg-[#121c2e] p-3 rounded-xl border border-amber-500/30 flex items-center justify-between text-slate-300"
                      >
                        <span className="capitalize">{cond.type.replace('_', ' ')}</span>
                        <span className="text-amber-300 font-bold">{cond.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. THEN Block (Ordered Action Pipeline) */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">THEN</span>
                    <span>Sequential Action Pipeline</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{currentRule.actions.length} Sequential Steps</span>
                </div>

                <div className="space-y-2 text-xs">
                  {currentRule.actions.map((act, index) => {
                    return (
                      <div
                        key={act.id}
                        className="bg-[#101726] p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-200 capitalize">
                              {act.type.replace(/_/g, ' ')}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {act.targetItem && `Target Item: ${act.targetItem}`}
                              {act.waypointId && `Target Waypoint: ${waypoints.find(w => w.id === act.waypointId)?.name || act.waypointId}`}
                              {act.command && `Execute Chat: "${act.command}"`}
                              {act.healthTarget && `Condition: Wait until health reaches ${act.healthTarget} HP`}
                              {act.delayMs && `Pause execution for ${act.delayMs}ms`}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeActionFromCurrent(act.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Action Buttons */}
                <div className="pt-2 border-t border-[#18263f] flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 flex items-center text-[11px] mr-1">
                    <Plus className="w-3 h-3 mr-0.5" /> Append Step:
                  </span>
                  <button
                    onClick={() => addActionToCurrent('stop_task')}
                    className="px-2.5 py-1 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-slate-300 rounded text-[11px]"
                  >
                    + Stop Task
                  </button>
                  <button
                    onClick={() => addActionToCurrent('equip_item')}
                    className="px-2.5 py-1 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-amber-300 rounded text-[11px]"
                  >
                    + Equip Item
                  </button>
                  <button
                    onClick={() => addActionToCurrent('move_to_waypoint')}
                    className="px-2.5 py-1 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-emerald-300 rounded text-[11px]"
                  >
                    + Move to Waypoint
                  </button>
                  <button
                    onClick={() => addActionToCurrent('wait_until_health')}
                    className="px-2.5 py-1 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-cyan-300 rounded text-[11px]"
                  >
                    + Wait for Health
                  </button>
                  <button
                    onClick={() => addActionToCurrent('resume_previous_task')}
                    className="px-2.5 py-1 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-purple-300 rounded text-[11px]"
                  >
                    + Resume Task
                  </button>
                </div>
              </div>

              {/* Failsafe Boundary */}
              {currentRule.onFail && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>ON EXCEPTION / FAILURE:</strong> {currentRule.onFail}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Rule Modal */}
      {showNewRuleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateRule}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create Automation Workflow
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nightfall Perimeter Bunker Return"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain trigger condition and purpose..."
                  value={newRuleDesc}
                  onChange={e => setNewRuleDesc(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowNewRuleModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
