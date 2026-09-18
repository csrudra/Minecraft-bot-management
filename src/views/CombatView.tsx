import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Swords,
  Shield,
  Crosshair,
  AlertTriangle,
  Flame,
  Target,
  Sliders,
  Users,
  Eye,
  Check,
  Zap,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const CombatView: React.FC = () => {
  const { selectedBot, updateBotCombat, updateBot } = useBotContext();
  const [friendNameInput, setFriendNameInput] = useState('');

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  const combat = selectedBot.combat;

  // Mock nearby detected entities for radar
  const detectedTargets = [
    {
      id: 'tgt-1',
      name: 'Armed Skeleton (Power II)',
      type: 'skeleton',
      distance: 6.4,
      health: 14,
      maxHealth: 20,
      threatLevel: 'high' as const,
      status: selectedBot.target?.name.includes('Skeleton') ? ('Targeted' as const) : ('In Range' as const),
      isPlayer: false
    },
    {
      id: 'tgt-2',
      name: 'Creeper (Approaching)',
      type: 'creeper',
      distance: 8.2,
      health: 20,
      maxHealth: 20,
      threatLevel: 'critical' as const,
      status: 'In Range' as const,
      isPlayer: false
    },
    {
      id: 'tgt-3',
      name: 'Zombie Villager',
      type: 'zombie',
      distance: 12.0,
      health: 18,
      maxHealth: 20,
      threatLevel: 'medium' as const,
      status: 'In Range' as const,
      isPlayer: false
    },
    {
      id: 'tgt-4',
      name: 'Spider (Climbing)',
      type: 'spider',
      distance: 15.4,
      health: 16,
      maxHealth: 16,
      threatLevel: 'medium' as const,
      status: 'In Range' as const,
      isPlayer: false
    }
  ];

  const handleToggleMobFilter = (mob: string) => {
    const list = combat.targetFiltering.includes(mob)
      ? combat.targetFiltering.filter(m => m !== mob)
      : [...combat.targetFiltering, mob];
    updateBotCombat(selectedBot.id, { targetFiltering: list });
  };

  const handleAddFriend = () => {
    if (!friendNameInput.trim()) return;
    if (!combat.friendlyWhitelist.includes(friendNameInput.trim())) {
      updateBotCombat(selectedBot.id, {
        friendlyWhitelist: [...combat.friendlyWhitelist, friendNameInput.trim()]
      });
    }
    setFriendNameInput('');
  };

  const handleRemoveFriend = (name: string) => {
    updateBotCombat(selectedBot.id, {
      friendlyWhitelist: combat.friendlyWhitelist.filter(f => f !== name)
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Swords className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              COMBAT & TARGETING AUTOMATION
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Raycast hit verification, 1.9 weapon cooldown sync, projectile shield deflection, and threat scoring
          </p>
        </div>

        {/* Master Combat Toggle */}
        <div className="flex items-center space-x-3 bg-[#0c1220] p-2 rounded-xl border border-[#1d2a44]">
          <span className="text-xs font-mono text-slate-300">Combat Engine:</span>
          <button
            onClick={() => updateBotCombat(selectedBot.id, { enabled: !combat.enabled })}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              combat.enabled
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {combat.enabled ? 'ACTIVE & ENGAGING' : 'DISARMED / OFF'}
          </button>
        </div>
      </div>

      {/* Safety Boundary Notice */}
      <div className="p-3 bg-[#111624] border border-[#223049] rounded-xl flex items-start space-x-3 text-xs font-mono">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <span className="font-bold text-emerald-400">VANILLA LEGIT COMPLIANCE MODE: </span>
          Combat reach is constrained to standard 3.0–3.5 blocks with raycast field-of-view alignment. Attack delays strictly match 1.9 swing cooldowns (~625ms for swords) to prevent server-side anti-cheat flags (GrimAC / Vulcan / Spartan).
        </div>
      </div>

      {/* Grid: 2 Cols Left for Config, 1 Col Right for Radar & Visual Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Targeting, Rotation, Weapon, Shield, Criticals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Detection & Behavior */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Target Detection & Threat Prioritization</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Detection Filter */}
              <div>
                <label className="text-slate-400 block mb-1">Target Detection Filter</label>
                <select
                  value={combat.targetDetection}
                  onChange={e => updateBotCombat(selectedBot.id, { targetDetection: e.target.value as any })}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  <option value="hostile_only">Hostile Mobs Only (Zombies, Skeletons, etc.)</option>
                  <option value="all_mobs">All Mobs (Hostile + Passive animals)</option>
                  <option value="players">Players (PvP Mode)</option>
                  <option value="custom">Custom Entity Filter</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-slate-400 block mb-1">Target Priority Algorithm</label>
                <select
                  value={combat.targetPriority}
                  onChange={e => updateBotCombat(selectedBot.id, { targetPriority: e.target.value as any })}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                  <option value="highest_threat">Highest Threat First (Creepers & Skeletons)</option>
                  <option value="closest">Closest Distance</option>
                  <option value="lowest_health">Lowest Health (Execute Low HP)</option>
                  <option value="players_first">Players First (PvP Focus)</option>
                </select>
              </div>
            </div>

            {/* Entity Whitelist Chips */}
            <div>
              <span className="text-slate-400 text-xs font-mono block mb-2">Target Entity Types</span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['creeper', 'skeleton', 'zombie', 'spider', 'enderman', 'witch', 'blaze', 'player'].map(mob => {
                  const isChecked = combat.targetFiltering.includes(mob);
                  return (
                    <button
                      key={mob}
                      onClick={() => handleToggleMobFilter(mob)}
                      className={`px-3 py-1.5 rounded-lg border uppercase text-[11px] font-bold transition-colors ${
                        isChecked
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-[#121c2e] border-[#223352] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {mob} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Combat Kinematics & Mechanics (Range, Delay, Rotation, Shield, Crits) */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Attack Kinematics & Damage Modifiers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Attack Range Slider */}
              <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Attack Reach:</span>
                  <span className="text-cyan-400 font-bold">{combat.attackRange.toFixed(1)} blocks</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.5"
                  step="0.1"
                  value={combat.attackRange}
                  onChange={e => updateBotCombat(selectedBot.id, { attackRange: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2.0b (Close)</span>
                  <span className="text-emerald-400 font-bold">3.2b (Vanilla Legit)</span>
                  <span>4.5b (Mod)</span>
                </div>
              </div>

              {/* Attack Delay (1.9 Cooldown) */}
              <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Attack Cooldown:</span>
                  <span className="text-emerald-400 font-bold">{combat.attackDelayMs} ms</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1200"
                  step="25"
                  value={combat.attackDelayMs}
                  onChange={e => updateBotCombat(selectedBot.id, { attackDelayMs: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>250ms (Spam)</span>
                  <span className="text-emerald-400 font-bold">625ms (1.9 Sword Full Cooldown)</span>
                  <span>1200ms (Axe)</span>
                </div>
              </div>
            </div>

            {/* Rotational Aiming & Shield / Criticals toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2 border-t border-[#1a283f]">
              <button
                onClick={() => updateBotCombat(selectedBot.id, { shieldHandling: !combat.shieldHandling })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  combat.shieldHandling
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Auto Shield</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${combat.shieldHandling ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Raises shield on projectile / strike</div>
              </button>

              <button
                onClick={() => updateBotCombat(selectedBot.id, { criticalHits: !combat.criticalHits })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  combat.criticalHits
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Jump Criticals</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${combat.criticalHits ? 'bg-amber-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Strikes while falling for 1.5x damage</div>
              </button>

              <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#223352]">
                <label className="text-slate-400 block mb-1 text-[11px]">Weapon Preference</label>
                <select
                  value={combat.weaponSelection}
                  onChange={e => updateBotCombat(selectedBot.id, { weaponSelection: e.target.value as any })}
                  className="w-full bg-[#16223a] border border-[#283d62] text-slate-200 rounded p-1 text-xs"
                >
                  <option value="best_sword">Best Sword (DPS)</option>
                  <option value="best_axe">Best Axe (Shield Break)</option>
                  <option value="bow_ranged">Bow / Crossbow (Ranged)</option>
                  <option value="trident">Trident</option>
                </select>
              </div>
            </div>
          </div>

          {/* Friendly Player Whitelist (PvP Protection) */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Friendly Player Whitelist (No Friendly Fire)</span>
            </h3>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <input
                type="text"
                placeholder="Enter player username..."
                value={friendNameInput}
                onChange={e => setFriendNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddFriend()}
                className="bg-[#111929] border border-[#22334f] text-slate-200 rounded-lg px-3 py-1.5 flex-1 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddFriend}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Add Friend
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {combat.friendlyWhitelist.map(friend => (
                <div
                  key={friend}
                  className="bg-[#131e33] border border-[#223354] px-2.5 py-1 rounded-lg text-emerald-300 flex items-center space-x-2"
                >
                  <span>{friend}</span>
                  <button
                    onClick={() => handleRemoveFriend(friend)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Visual Target Radar & Engaging Targets */}
        <div className="space-y-6">
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-2">
                <Target className="w-4 h-4 text-rose-400 animate-spin-slow" />
                <span>Nearby Entity Radar</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Radius: {combat.distanceLimit}b</span>
            </div>

            {/* Target List */}
            <div className="space-y-2.5 font-mono text-xs">
              {detectedTargets.map(tgt => {
                const isTargeted = tgt.status === 'Targeted';
                return (
                  <div
                    key={tgt.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isTargeted
                        ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-950/20'
                        : 'bg-[#121c2e] border-[#1b2b45] hover:border-[#2b4166]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                          <span>{tgt.name}</span>
                          {tgt.threatLevel === 'critical' && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-rose-600 text-white rounded font-bold">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Type: {tgt.type} • Distance: <span className="text-cyan-400">{tgt.distance}b</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isTargeted
                            ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tgt.status}
                      </span>
                    </div>

                    {/* Target Health Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>HP: {tgt.health} / {tgt.maxHealth}</span>
                        <span>{Math.round((tgt.health / tgt.maxHealth) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(tgt.health / tgt.maxHealth) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-2.5 pt-2 border-t border-[#18263f] flex items-center justify-between">
                      <button
                        onClick={() => {
                          updateBot(selectedBot.id, {
                            activity: 'Combat',
                            target: tgt as any
                          });
                        }}
                        className="text-[10px] text-cyan-300 hover:text-cyan-200 font-bold flex items-center space-x-1"
                      >
                        <span>Lock Target</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleToggleMobFilter(tgt.type)}
                        className="text-[10px] text-slate-500 hover:text-rose-400"
                      >
                        Blacklist Type
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
