import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { downloadFile } from '../utils/download';
import { Profile } from '../types';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  Check,
  Users,
  Compass,
  Swords,
  Pickaxe,
  Sprout,
  HeartPulse,
  Tag
} from 'lucide-react';

export const ProfilesView: React.FC = () => {
  const {
    profiles,
    addProfile,
    updateProfile,
    cloneProfile,
    removeProfile,
    assignProfileToBot,
    bots,
    bulkSetProfile,
    addNotification
  } = useBotContext();

  const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0]?.id || '');
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedBotIdsForProfile, setSelectedBotIdsForProfile] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileGroup, setNewProfileGroup] = useState('Combat Bots');
  const [newProfileDesc, setNewProfileDesc] = useState('');

  const currentProf = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleExportProfile = (prof: Profile) => {
    const json = JSON.stringify(prof, null, 2);
    const ok = downloadFile(`profile-${prof.name.toLowerCase().replace(/\s+/g, '-')}.json`, json, 'application/json');
    if (!ok) {
      addNotification({
        title: 'Export Blocked',
        message: 'This environment blocks file downloads. The profile configuration remains active in this dashboard.',
        severity: 'warning'
      });
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    addProfile({
      name: newProfileName.trim(),
      description: newProfileDesc.trim() || 'Custom bot automation profile',
      group: newProfileGroup,
      customTags: ['custom'],
      movement: { speedMultiplier: 1.0, autoSprint: false, fly: false },
      combat: { enabled: true, attackRange: 3.2, attackDelayMs: 625 },
      survival: { autoFood: true, hungerThreshold: 14, autoHeal: true },
      mining: { enabled: false, targetBlocks: [], stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' } },
      farming: { enabled: false, cropTypes: [], stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 } },
      automationRuleIds: ['rule-emergency-retreat']
    });
    setNewProfileName('');
    setNewProfileDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              REUSABLE BOT BEHAVIOR PROFILES
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Encapsulate movement kinematics, combat cooldowns, and task directives into one-click deployable profiles
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center space-x-1.5 shadow-lg shadow-cyan-950/40 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Profile</span>
        </button>
      </div>

      {/* Main Grid: Left Profile Cards, Right Details & Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile List */}
        <div className="space-y-3">
          {profiles.map(prof => {
            const isActive = currentProf?.id === prof.id;
            const botsUsingProfile = bots.filter(b => b.profileId === prof.id);

            return (
              <div
                key={prof.id}
                onClick={() => setActiveProfileId(prof.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-[#121c2e] border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                    : 'bg-[#0e1627] border-[#1b2942] hover:border-[#2b4166]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-mono font-bold text-sm text-slate-100">{prof.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        {prof.group}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          cloneProfile(prof.id);
                        }}
                        className="p-1 hover:text-cyan-300 text-slate-400"
                        title="Clone"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleExportProfile(prof);
                        }}
                        className="p-1 hover:text-emerald-300 text-slate-400"
                        title="Export JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {prof.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#17243b] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>{botsUsingProfile.length} Bots Assigned</span>
                  </span>
                  <div className="flex space-x-1">
                    {prof.customTags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Profile Configuration Summary & Bulk Assignment */}
        <div className="lg:col-span-2 space-y-6">
          {currentProf && (
            <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-6 space-y-6">
              {/* Header & Assign Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#18263f]">
                <div>
                  <h3 className="font-mono font-bold text-lg text-slate-100">{currentProf.name}</h3>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">{currentProf.description}</div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBotIdsForProfile(bots.map(b => b.id));
                    setShowAssignModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-cyan-950/40"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Assign Profile to Bots</span>
                </button>
              </div>

              {/* Subsystem Specifications Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Movement Config */}
                <div className="bg-[#121c2e] p-4 rounded-xl border border-[#1b2b45] space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Movement Subsystem</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>Speed Multiplier: <strong className="text-slate-200">{currentProf.movement.speedMultiplier || 1.0}x</strong></div>
                    <div>Sprint: <strong className="text-slate-200">{currentProf.movement.sprint ? 'Enabled' : 'Disabled'}</strong></div>
                    <div>Flight: <strong className="text-slate-200">{currentProf.movement.fly ? 'Enabled (Op)' : 'Disabled'}</strong></div>
                  </div>
                </div>

                {/* Combat Config */}
                <div className="bg-[#121c2e] p-4 rounded-xl border border-[#1b2b45] space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span>Combat Subsystem</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>Master State: <strong className="text-slate-200">{currentProf.combat.enabled ? 'Armed' : 'Disarmed'}</strong></div>
                    <div>Reach Range: <strong className="text-slate-200">{currentProf.combat.attackRange || 3.2}b</strong></div>
                    <div>Attack Delay: <strong className="text-slate-200">{currentProf.combat.attackDelayMs || 625}ms</strong></div>
                  </div>
                </div>

                {/* Survival Config */}
                <div className="bg-[#121c2e] p-4 rounded-xl border border-[#1b2b45] space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Survival Safeguards</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>Auto Food: <strong className="text-slate-200">{currentProf.survival.autoFood ? 'Enabled' : 'Disabled'}</strong></div>
                    <div>Auto Heal: <strong className="text-slate-200">{currentProf.survival.autoHeal ? 'Enabled' : 'Disabled'}</strong></div>
                    <div>Emergency Retreat: <strong className="text-slate-200">{currentProf.survival.emergencyRetreat?.enabled ? 'Active (<30% HP)' : 'Disabled'}</strong></div>
                  </div>
                </div>

                {/* Automation Rules */}
                <div className="bg-[#121c2e] p-4 rounded-xl border border-[#1b2b45] space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Attached Workflows</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>Linked Rules: <strong className="text-purple-300">{currentProf.automationRuleIds.length} rules active</strong></div>
                    <div className="truncate text-[10px]">
                      {currentProf.automationRuleIds.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign to Bots Modal */}
      {showAssignModal && currentProf && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Assign "{currentProf.name}" to Bots
            </h3>
            <p className="text-slate-400 text-[11px]">
              Select which bots should adopt this configuration profile:
            </p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto bg-[#111929] p-2 rounded-lg border border-[#22334f]">
              {bots.map(b => {
                const isChecked = selectedBotIdsForProfile.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedBotIdsForProfile(selectedBotIdsForProfile.filter(id => id !== b.id));
                      } else {
                        setSelectedBotIdsForProfile([...selectedBotIdsForProfile, b.id]);
                      }
                    }}
                    className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                      isChecked ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-[#16233a] text-slate-300'
                    }`}
                  >
                    <span>{b.name} ({b.group})</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  bulkSetProfile(selectedBotIdsForProfile, currentProf.id);
                  setShowAssignModal(false);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                Assign to {selectedBotIdsForProfile.length} Bots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateProfile}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create New Behavior Profile
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nether Blaze Farmer"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Group</label>
                <select
                  value={newProfileGroup}
                  onChange={e => setNewProfileGroup(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2"
                >
                  <option value="Combat Bots">Combat Bots</option>
                  <option value="Mining Bots">Mining Bots</option>
                  <option value="Farming Bots">Farming Bots</option>
                  <option value="AFK Bots">AFK Bots</option>
                  <option value="Exploration Bots">Exploration Bots</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProfileDesc}
                  onChange={e => setNewProfileDesc(e.target.value)}
                  placeholder="Operational purpose..."
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
