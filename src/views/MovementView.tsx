import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import {
  Compass,
  Zap,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Navigation,
  MapPin,
  Play,
  Square,
  Repeat,
  RotateCw,
  Plus,
  Sliders,
  AlertTriangle,
  Check,
  Footprints,
  Wind
} from 'lucide-react';

export const MovementView: React.FC = () => {
  const {
    selectedBot,
    updateBotMovement,
    updateBot,
    waypoints,
    addWaypoint,
    navigateBotToWaypoint,
    teleportBotToWaypoint
  } = useBotContext();

  const [inputX, setInputX] = useState<number>(selectedBot ? Math.round(selectedBot.position.x) : 0);
  const [inputY, setInputY] = useState<number>(selectedBot ? Math.round(selectedBot.position.y) : 64);
  const [inputZ, setInputZ] = useState<number>(selectedBot ? Math.round(selectedBot.position.z) : 0);
  const [waypointName, setWaypointName] = useState('');
  const [showWpModal, setShowWpModal] = useState(false);

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot from the top navigation bar.
      </div>
    );
  }

  const mov = selectedBot.movement;

  const handleApplyCoords = () => {
    updateBot(selectedBot.id, {
      position: {
        ...selectedBot.position,
        x: inputX,
        y: inputY,
        z: inputZ
      }
    });
  };

  const handleWalkToCoords = () => {
    updateBot(selectedBot.id, {
      activity: 'Navigating',
      position: {
        ...selectedBot.position,
        x: inputX,
        y: inputY,
        z: inputZ
      }
    });
  };

  const handleCreateWaypoint = () => {
    if (!waypointName.trim()) return;
    addWaypoint({
      name: waypointName.trim(),
      x: inputX,
      y: inputY,
      z: inputZ,
      dimension: selectedBot.position.dimension,
      color: '#06b6d4',
      icon: 'MapPin',
      notes: `Created from movement console for ${selectedBot.name}`
    });
    setWaypointName('');
    setShowWpModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              MOVEMENT & MOBILITY ENGINE
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              Active Focus: {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Pathfinding algorithms, kinematic modifiers, waypoint routing, and coordinate manipulation
          </p>
        </div>

        {/* Current position telemetry pill */}
        <div className="flex items-center space-x-3 bg-[#0c1220] px-3.5 py-2 rounded-xl border border-[#1d2a44] font-mono text-xs">
          <span className="text-slate-400">Current Position:</span>
          <span className="text-emerald-400 font-bold">
            X={selectedBot.position.x.toFixed(1)} Y={selectedBot.position.y.toFixed(1)} Z={selectedBot.position.z.toFixed(1)}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 uppercase">{selectedBot.position.dimension}</span>
        </div>
      </div>

      {/* Permission & Server Compliance Disclaimer Notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-xs font-mono text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-300">SERVER SAFETY BOUNDARY: </span>
          Features marked with <span className="text-rose-300 font-bold">[MOD / OP REQUIRED]</span> bypass vanilla physics packets and require server operator access (`/fly`) or specialized client mods. Enabling them on public servers running NoCheatPlus, GrimAC, or Vulcan will result in immediate kick or ban. Vanilla pathfinding and sprint-jumping are 100% safe.
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mobility Modules & Sliders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Autonomous Movement Modules */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>Vanilla-Safe Autonomous Locomotion</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => updateBotMovement(selectedBot.id, { autoWalk: !mov.autoWalk })}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  mov.autoWalk
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Auto Walk</span>
                  <span className={`w-2 h-2 rounded-full ${mov.autoWalk ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Continuous forward traversal</div>
              </button>

              <button
                onClick={() => updateBotMovement(selectedBot.id, { autoSprint: !mov.autoSprint })}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  mov.autoSprint
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Auto Sprint</span>
                  <span className={`w-2 h-2 rounded-full ${mov.autoSprint ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Maintains sprint stamina</div>
              </button>

              <button
                onClick={() => updateBotMovement(selectedBot.id, { autoJump: !mov.autoJump })}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  mov.autoJump
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Auto Jump</span>
                  <span className={`w-2 h-2 rounded-full ${mov.autoJump ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Jumps 1-block elevation</div>
              </button>

              <button
                onClick={() => updateBotMovement(selectedBot.id, { sprint: !mov.sprint })}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  mov.sprint
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Sprint Lock</span>
                  <span className={`w-2 h-2 rounded-full ${mov.sprint ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                </div>
                <div className="text-[10px] text-slate-400">Force FOV sprint speed</div>
              </button>
            </div>
          </div>

          {/* Special & Permission-Restricted Modules */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Permission & Mod Restricted Modules</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Fly */}
              <button
                onClick={() => updateBotMovement(selectedBot.id, { fly: !mov.fly })}
                className={`p-3 rounded-xl border text-left transition-all font-mono relative overflow-hidden ${
                  mov.fly
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>Fly Mode</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 rounded">
                    OP
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Requires /fly enabled</div>
              </button>

              {/* High Jump */}
              <button
                onClick={() => updateBotMovement(selectedBot.id, { highJump: !mov.highJump })}
                className={`p-3 rounded-xl border text-left transition-all font-mono relative overflow-hidden ${
                  mov.highJump
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>High Jump</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 rounded">
                    MOD
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Velocity packet boost</div>
              </button>

              {/* Step Assist */}
              <button
                onClick={() => updateBotMovement(selectedBot.id, { stepHeight: mov.stepHeight > 0.6 ? 0.6 : 1.25 })}
                className={`p-3 rounded-xl border text-left transition-all font-mono relative overflow-hidden ${
                  mov.stepHeight > 0.6
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>Step Assist</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded">
                    MOD
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Height: {mov.stepHeight}b</div>
              </button>

              {/* No Fall */}
              <button
                onClick={() => updateBotMovement(selectedBot.id, { noFall: !mov.noFall })}
                className={`p-3 rounded-xl border text-left transition-all font-mono relative overflow-hidden ${
                  mov.noFall
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-[#121c2e] border-[#223352] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>No-Fall</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded">
                    PACKET
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Spoofs onGround: true</div>
              </button>
            </div>
          </div>

          {/* Speed & Jump Sliders */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Kinematic Speed & Vertical Motion Controls</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              {/* Speed Multiplier Slider */}
              <div className="space-y-1.5 bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Speed Multiplier:</span>
                  <span className="text-emerald-400 font-bold">{mov.speedMultiplier.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={mov.speedMultiplier}
                  onChange={e => updateBotMovement(selectedBot.id, { speedMultiplier: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.5x (Stealth)</span>
                  <span>1.0x (Vanilla)</span>
                  <span>2.5x (Fast)</span>
                </div>
              </div>

              {/* Movement Speed blocks/sec */}
              <div className="space-y-1.5 bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Target Velocity:</span>
                  <span className="text-cyan-400 font-bold">{mov.movementSpeed.toFixed(1)} blocks/sec</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="9.0"
                  step="0.2"
                  value={mov.movementSpeed}
                  onChange={e => updateBotMovement(selectedBot.id, { movementSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2.0 b/s (Sneak)</span>
                  <span>4.3 b/s (Walk)</span>
                  <span>9.0 b/s (Sprint-Jump)</span>
                </div>
              </div>
            </div>

            {/* Vertical Movement Controls (Ascend, Descend, Hover) */}
            <div className="pt-2 border-t border-[#18263f]">
              <span className="text-xs font-mono text-slate-400 block mb-2">Vertical Altitude Control</span>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={() => updateBot(selectedBot.id, { position: { ...selectedBot.position, y: selectedBot.position.y + 1 } })}
                  className="px-3 py-2 bg-[#142034] hover:bg-[#1d2d48] border border-[#233554] text-cyan-300 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Ascend (+1Y)</span>
                </button>
                <button
                  onClick={() => updateBot(selectedBot.id, { position: { ...selectedBot.position, y: selectedBot.position.y - 1 } })}
                  className="px-3 py-2 bg-[#142034] hover:bg-[#1d2d48] border border-[#233554] text-cyan-300 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Descend (-1Y)</span>
                </button>
                <button
                  onClick={() => updateBotMovement(selectedBot.id, { verticalControl: mov.verticalControl === 'hover' ? 'none' : 'hover' })}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    mov.verticalControl === 'hover'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#142034] border-[#233554] text-slate-400'
                  }`}
                >
                  <span>Hover Altitude Lock</span>
                </button>
              </div>
            </div>
          </div>

          {/* Position Recording & Playback */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Repeat className="w-4 h-4 text-purple-400" />
                <span>Motion Path Recording & Playback</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {mov.recordedPath.length} recorded points
              </span>
            </div>

            <div className="flex items-center space-x-3 font-mono text-xs">
              <button
                onClick={() => updateBotMovement(selectedBot.id, { isRecording: !mov.isRecording })}
                className={`px-4 py-2 rounded-lg border font-bold flex items-center space-x-1.5 transition-colors ${
                  mov.isRecording
                    ? 'bg-rose-600/30 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-[#142034] hover:bg-[#1c2c48] border-[#233554] text-slate-300'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${mov.isRecording ? 'bg-rose-500' : 'bg-slate-500'}`} />
                <span>{mov.isRecording ? 'Stop Recording' : 'Start Path Record'}</span>
              </button>

              <button
                onClick={() => updateBotMovement(selectedBot.id, { playbackActive: !mov.playbackActive })}
                className={`px-4 py-2 rounded-lg border font-bold flex items-center space-x-1.5 transition-colors ${
                  mov.playbackActive
                    ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                    : 'bg-[#142034] hover:bg-[#1c2c48] border-[#233554] text-slate-300'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-purple-400" />
                <span>{mov.playbackActive ? 'Pause Playback' : 'Playback Trail'}</span>
              </button>

              <button
                onClick={() => updateBotMovement(selectedBot.id, { recordedPath: [] })}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
              >
                Clear Trail
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Coordinate Editor & Waypoints */}
        <div className="space-y-6">
          {/* Interactive Coordinate Editor */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Interactive Coordinate Editor</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* X Coord */}
              <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between">
                <span className="text-slate-400 font-bold w-6">X:</span>
                <input
                  type="number"
                  value={inputX}
                  onChange={e => setInputX(parseFloat(e.target.value) || 0)}
                  className="bg-[#17243b] border border-[#233554] rounded px-2 py-1 text-slate-100 font-bold w-24 text-right focus:outline-none focus:border-cyan-500"
                />
                <div className="flex space-x-1 ml-2">
                  <button onClick={() => setInputX(x => x - 10)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">-10</button>
                  <button onClick={() => setInputX(x => x + 10)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">+10</button>
                </div>
              </div>

              {/* Y Coord */}
              <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between">
                <span className="text-slate-400 font-bold w-6">Y:</span>
                <input
                  type="number"
                  value={inputY}
                  onChange={e => setInputY(parseFloat(e.target.value) || 0)}
                  className="bg-[#17243b] border border-[#233554] rounded px-2 py-1 text-slate-100 font-bold w-24 text-right focus:outline-none focus:border-cyan-500"
                />
                <div className="flex space-x-1 ml-2">
                  <button onClick={() => setInputY(y => y - 1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">-1</button>
                  <button onClick={() => setInputY(y => y + 1)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">+1</button>
                </div>
              </div>

              {/* Z Coord */}
              <div className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between">
                <span className="text-slate-400 font-bold w-6">Z:</span>
                <input
                  type="number"
                  value={inputZ}
                  onChange={e => setInputZ(parseFloat(e.target.value) || 0)}
                  className="bg-[#17243b] border border-[#233554] rounded px-2 py-1 text-slate-100 font-bold w-24 text-right focus:outline-none focus:border-cyan-500"
                />
                <div className="flex space-x-1 ml-2">
                  <button onClick={() => setInputZ(z => z - 10)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">-10</button>
                  <button onClick={() => setInputZ(z => z + 10)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]">+10</button>
                </div>
              </div>

              {/* Coords Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWalkToCoords}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Footprints className="w-4 h-4" />
                  <span>Pathfind & Walk To Coords</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleApplyCoords}
                    className="py-1.5 px-2 bg-[#16233a] hover:bg-[#1e2f4e] border border-[#233554] text-cyan-300 rounded-lg text-center transition-colors text-[11px]"
                    title="Instantly sets position coordinates"
                  >
                    Teleport Coords (Op)
                  </button>

                  <button
                    onClick={() => setShowWpModal(true)}
                    className="py-1.5 px-2 bg-[#16233a] hover:bg-[#1e2f4e] border border-[#233554] text-emerald-300 rounded-lg text-center transition-colors text-[11px]"
                  >
                    Save as Waypoint
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Waypoint Navigation List */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Waypoints Destination Dispatch</span>
            </h3>

            <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto">
              {waypoints.map(wp => (
                <div
                  key={wp.id}
                  className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between hover:border-[#2b4166] transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{wp.name}</div>
                    <div className="text-[10px] text-slate-400">
                      ({wp.x}, {wp.y}, {wp.z}) • {wp.dimension}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => navigateBotToWaypoint(selectedBot.id, wp.id)}
                      className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded text-[11px] transition-colors"
                      title="Plot path and walk"
                    >
                      Walk
                    </button>
                    <button
                      onClick={() => teleportBotToWaypoint(selectedBot.id, wp.id)}
                      className="px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 rounded text-[11px] transition-colors"
                      title="Instant teleport"
                    >
                      TP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Waypoint Modal */}
      {showWpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-sm p-5 shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create New Named Waypoint
            </h3>
            <div className="space-y-2">
              <label className="text-slate-400 block">Waypoint Name</label>
              <input
                type="text"
                placeholder="e.g. Diamond Storage Vault"
                value={waypointName}
                onChange={e => setWaypointName(e.target.value)}
                className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
              <div className="text-slate-400 text-[11px]">
                Coordinates: ({inputX}, {inputY}, {inputZ}) [{selectedBot.position.dimension}]
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                onClick={() => setShowWpModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWaypoint}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Save Waypoint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
