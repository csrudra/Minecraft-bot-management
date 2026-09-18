import React, { useState, useRef, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import { Waypoint, Route } from '../types';
import {
  MapPin,
  Compass,
  Navigation,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  ArrowRight,
  Shield,
  Layers,
  Check
} from 'lucide-react';

export const NavigationView: React.FC = () => {
  const {
    bots,
    selectedBot,
    waypoints,
    routes,
    addWaypoint,
    removeWaypoint,
    navigateBotToWaypoint,
    teleportBotToWaypoint,
    addRoute,
    toggleRoute,
    removeRoute,
    updateBot
  } = useBotContext();

  const [dimensionFilter, setDimensionFilter] = useState<'overworld' | 'nether' | 'the_end'>('overworld');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 120, z: -340 });
  const [showAddWpModal, setShowAddWpModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  // New Waypoint Form
  const [wpName, setWpName] = useState('');
  const [wpX, setWpX] = useState(selectedBot ? Math.round(selectedBot.position.x) : 0);
  const [wpY, setWpY] = useState(selectedBot ? Math.round(selectedBot.position.y) : 64);
  const [wpZ, setWpZ] = useState(selectedBot ? Math.round(selectedBot.position.z) : 0);
  const [wpColor, setWpColor] = useState('#10b981');

  // New Route Form
  const [routeName, setRouteName] = useState('');
  const [routeWpIds, setRouteWpIds] = useState<string[]>([]);
  const [routeMode, setRouteMode] = useState<'loop' | 'ping-pong' | 'one-way'>('loop');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render 2D live map canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background depending on dimension
    if (dimensionFilter === 'nether') {
      ctx.fillStyle = '#1c0c11';
    } else if (dimensionFilter === 'the_end') {
      ctx.fillStyle = '#0d091a';
    } else {
      ctx.fillStyle = '#070d18';
    }
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines (16-block chunk boundaries and 64-block grid)
    const centerX = width / 2;
    const centerZ = height / 2;
    const scale = 0.8 * zoomLevel;

    ctx.strokeStyle = '#142036';
    ctx.lineWidth = 1;

    // Grid
    const step = 32 * scale;
    for (let x = (centerX - mapCenter.x * scale) % step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = (centerZ - mapCenter.z * scale) % step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // World origin marker (0, 0)
    const originCanvasX = centerX + (0 - mapCenter.x) * scale;
    const originCanvasZ = centerZ + (0 - mapCenter.z) * scale;
    ctx.strokeStyle = '#23385d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(originCanvasX, originCanvasZ, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Active Routes Lines
    routes.forEach(route => {
      if (!route.active) return;
      const wps = route.waypointIds
        .map(id => waypoints.find(w => w.id === id))
        .filter((w): w is Waypoint => w !== undefined && w.dimension === dimensionFilter);

      if (wps.length > 1) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        wps.forEach((wp, idx) => {
          const cx = centerX + (wp.x - mapCenter.x) * scale;
          const cz = centerZ + (wp.z - mapCenter.z) * scale;
          if (idx === 0) ctx.moveTo(cx, cz);
          else ctx.lineTo(cx, cz);
        });
        if (route.mode === 'loop') {
          const firstCx = centerX + (wps[0].x - mapCenter.x) * scale;
          const firstCz = centerZ + (wps[0].z - mapCenter.z) * scale;
          ctx.lineTo(firstCx, firstCz);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw Waypoints
    waypoints
      .filter(w => w.dimension === dimensionFilter)
      .forEach(wp => {
        const cx = centerX + (wp.x - mapCenter.x) * scale;
        const cz = centerZ + (wp.z - mapCenter.z) * scale;

        // Marker glow
        ctx.fillStyle = wp.color;
        ctx.beginPath();
        ctx.arc(cx, cz, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(wp.name, cx + 9, cz + 3);
      });

    // Draw Bots with Directional Arrow
    bots
      .filter(b => b.position.dimension === dimensionFilter)
      .forEach(bot => {
        const cx = centerX + (bot.position.x - mapCenter.x) * scale;
        const cz = centerZ + (bot.position.z - mapCenter.z) * scale;
        const isSelected = selectedBot?.id === bot.id;

        // Pulsing ring if selected
        if (isSelected) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cz, 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Bot dot
        ctx.fillStyle = isSelected ? '#10b981' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cz, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0a0f1d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Direction heading indicator
        const yawRad = ((bot.position.yaw || 0) * Math.PI) / 180;
        const headX = cx + Math.sin(yawRad) * 14;
        const headZ = cz - Math.cos(yawRad) * 14;
        ctx.strokeStyle = isSelected ? '#34d399' : '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cz);
        ctx.lineTo(headX, headZ);
        ctx.stroke();

        // Bot Name Tag
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#34d399' : '#f1f5f9';
        ctx.fillText(bot.name, cx + 10, cz - 8);

        // Activity Tag
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`[${bot.activity}]`, cx + 10, cz + 4);
      });
  }, [bots, waypoints, routes, dimensionFilter, zoomLevel, mapCenter, selectedBot]);

  // Click on canvas to focus or plot path
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedBot) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerZ = canvas.height / 2;
    const scale = 0.8 * zoomLevel;

    const worldX = Math.round(mapCenter.x + (clickX - centerX) / scale);
    const worldZ = Math.round(mapCenter.z + (clickY - centerZ) / scale);

    // Prompt destination walk
    updateBot(selectedBot.id, {
      activity: 'Navigating',
      position: {
        ...selectedBot.position,
        x: worldX,
        z: worldZ
      }
    });
  };

  const handleCenterOnSelected = () => {
    if (selectedBot) {
      setMapCenter({ x: selectedBot.position.x, z: selectedBot.position.z });
      setDimensionFilter(selectedBot.position.dimension);
    }
  };

  const handleSaveWaypoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wpName.trim()) return;
    addWaypoint({
      name: wpName.trim(),
      x: wpX,
      y: wpY,
      z: wpZ,
      dimension: dimensionFilter,
      color: wpColor,
      icon: 'MapPin'
    });
    setWpName('');
    setShowAddWpModal(false);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || routeWpIds.length < 2) return;
    addRoute({
      name: routeName.trim(),
      waypointIds: routeWpIds,
      mode: routeMode,
      active: true
    });
    setRouteName('');
    setRouteWpIds([]);
    setShowAddRouteModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              NAVIGATION & LIVE RADAR MINIMAP
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              Active: {selectedBot?.name || 'Cluster'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time geospatial tracking, dimension hopping, patrol circuits, and return-to-base homing
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddWpModal(true)}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>New Waypoint</span>
          </button>
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="px-3 py-1.5 text-xs font-mono bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-cyan-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Create Route</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Minimap Left, Waypoint / Route Manager Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-2 bg-[#090e1a] border border-[#1b2840] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Map Top Bar */}
          <div className="p-3 bg-[#0d1526] border-b border-[#172338] flex flex-wrap items-center justify-between gap-2">
            {/* Dimension Switcher */}
            <div className="flex items-center space-x-1 font-mono text-xs">
              <button
                onClick={() => setDimensionFilter('overworld')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  dimensionFilter === 'overworld'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:bg-[#121c2e]'
                }`}
              >
                Overworld
              </button>
              <button
                onClick={() => setDimensionFilter('nether')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  dimensionFilter === 'nether'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:bg-[#121c2e]'
                }`}
              >
                The Nether
              </button>
              <button
                onClick={() => setDimensionFilter('the_end')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  dimensionFilter === 'the_end'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:bg-[#121c2e]'
                }`}
              >
                The End
              </button>
            </div>

            {/* Map Zoom & Center Controls */}
            <div className="flex items-center space-x-1 font-mono text-xs">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.4, z - 0.2))}
                className="p-1.5 bg-[#121c2e] hover:bg-[#18253e] border border-[#20324f] text-slate-300 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-slate-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.2))}
                className="p-1.5 bg-[#121c2e] hover:bg-[#18253e] border border-[#20324f] text-slate-300 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCenterOnSelected}
                className="px-2 py-1.5 bg-[#16233a] hover:bg-[#1e2f4e] border border-[#233554] text-cyan-300 rounded flex items-center space-x-1 transition-colors"
                title="Center on Active Bot"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Center Bot</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 min-h-[460px] cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={750}
              height={460}
              onClick={handleCanvasClick}
              className="w-full h-full block"
            />
            {/* Floating Map Hint */}
            <div className="absolute bottom-3 left-3 bg-[#0a101d]/90 backdrop-blur border border-[#1b2a44] px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 pointer-events-none">
              Click anywhere on map to dispatch {selectedBot?.name} • Right-click drag to pan
            </div>
          </div>
        </div>

        {/* Right Col: Waypoints List & Route Manager */}
        <div className="space-y-6">
          {/* Waypoints List */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Waypoints ({waypoints.length})</span>
            </h3>

            <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto">
              {waypoints.map(wp => (
                <div
                  key={wp.id}
                  className="bg-[#121c2e] p-2.5 rounded-lg border border-[#1b2b45] flex items-center justify-between hover:border-[#2b4166] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: wp.color }} />
                    <div>
                      <div className="font-semibold text-slate-100">{wp.name}</div>
                      <div className="text-[10px] text-slate-400">
                        ({wp.x}, {wp.y}, {wp.z}) • {wp.dimension}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => selectedBot && navigateBotToWaypoint(selectedBot.id, wp.id)}
                      className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded text-[11px] transition-colors"
                    >
                      Walk
                    </button>
                    <button
                      onClick={() => selectedBot && teleportBotToWaypoint(selectedBot.id, wp.id)}
                      className="px-2 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 rounded text-[11px] transition-colors"
                    >
                      TP
                    </button>
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Routes */}
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Patrol & Mining Circuits</span>
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {routes.map(rt => (
                <div
                  key={rt.id}
                  className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-100">{rt.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {rt.waypointIds.length} stops • Mode: <span className="uppercase text-cyan-300">{rt.mode}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRoute(rt.id)}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        rt.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rt.active ? 'ACTIVE' : 'IDLE'}
                    </button>
                    <button
                      onClick={() => removeRoute(rt.id)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Waypoint Modal */}
      {showAddWpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveWaypoint}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create New Waypoint
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Waypoint Name</label>
                <input
                  type="text"
                  placeholder="e.g. Iron Golem Farm"
                  value={wpName}
                  onChange={e => setWpName(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">X</label>
                  <input
                    type="number"
                    value={wpX}
                    onChange={e => setWpX(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Y</label>
                  <input
                    type="number"
                    value={wpY}
                    onChange={e => setWpY(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Z</label>
                  <input
                    type="number"
                    value={wpZ}
                    onChange={e => setWpZ(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Dimension</label>
                  <select
                    value={dimensionFilter}
                    onChange={e => setDimensionFilter(e.target.value as any)}
                    className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2"
                  >
                    <option value="overworld">Overworld</option>
                    <option value="nether">The Nether</option>
                    <option value="the_end">The End</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Marker Color</label>
                  <input
                    type="color"
                    value={wpColor}
                    onChange={e => setWpColor(e.target.value)}
                    className="w-full h-9 bg-[#131d31] border border-[#243756] rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowAddWpModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Save Waypoint
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveRoute}
            className="bg-[#0e1628] border border-[#233555] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4 font-mono text-xs"
          >
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Create New Waypoint Route
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Route Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sentry Perimeter Sweep"
                  value={routeName}
                  onChange={e => setRouteName(e.target.value)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Route Mode</label>
                <select
                  value={routeMode}
                  onChange={e => setRouteMode(e.target.value as any)}
                  className="w-full bg-[#131d31] border border-[#243756] text-slate-200 rounded-lg p-2"
                >
                  <option value="loop">Continuous Loop (A &rarr; B &rarr; C &rarr; A)</option>
                  <option value="ping-pong">Ping-Pong (A &rarr; B &rarr; C &rarr; B &rarr; A)</option>
                  <option value="one-way">One-Way Traversal</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Stops in Order</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto bg-[#111929] p-2 rounded-lg border border-[#22334f]">
                  {waypoints.map(wp => {
                    const isChecked = routeWpIds.includes(wp.id);
                    return (
                      <div
                        key={wp.id}
                        onClick={() => {
                          if (isChecked) {
                            setRouteWpIds(routeWpIds.filter(id => id !== wp.id));
                          } else {
                            setRouteWpIds([...routeWpIds, wp.id]);
                          }
                        }}
                        className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                          isChecked ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-[#16233a] text-slate-300'
                        }`}
                      >
                        <span>{wp.name}</span>
                        {isChecked && <span className="text-[10px]">#{routeWpIds.indexOf(wp.id) + 1}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1b2b45]">
              <button
                type="button"
                onClick={() => setShowAddRouteModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={routeWpIds.length < 2}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Save Route
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
