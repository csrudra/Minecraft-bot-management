# MineControl OS — Minecraft Bot Management & Automation Dashboard

MineControl OS is a centralized, high-performance management and automation platform engineered for controlling, monitoring, and configuring fleets of Minecraft bots across multiple servers. Designed with a dark, technical gaming control panel aesthetic, it features real-time telemetry, modular automation systems, strict server capability detection, and interactive diagnostics.

---

## Architecture & Modules

```text
MineControl OS
├── Operations Center
│   ├── 1. Dashboard (Cluster KPIs, live bot telemetry cards, bulk actions)
│   ├── 2. Bot Manager (Complete bot lifecycle, batch generation, import/export)
│   └── 3. Server Manager (Multi-server network endpoints, ping diagnostics, proxies)
├── Modules & Automation
│   ├── 4. Movement & Mobility (Kinematics, A* pathfinding, coordinate editor, flight/step mod guards)
│   ├── 5. Combat Automation (Raycast reach, 1.9 cooldown sync, auto-shield, target radar)
│   ├── 6. Interaction Tools (Container synchronization, ghost-hand guards, item vacuum filters)
│   ├── 7. Survival Automation (Defensive retreat, auto-food, auto-heal, totem watchers)
│   ├── 8. Mining Automation (Branch mining Y=-58, target ore whitelist, durability saver)
│   ├── 9. Farming Automation (Age=7 mature crop detection, zero-tick replanting, silo drop)
│   ├── 10. Navigation & Minimap (2D coordinate radar, chunk lines, waypoint dispatch, patrol loops)
│   ├── 11. Automation Builder (Visual WHEN/THEN state-machine builder with live simulator)
│   └── 12. Profiles Manager (Reusable behavior configurations, clone, import/export)
├── Real-Time Interface
│   ├── 13. Live Console (Color-coded stdout/stderr, CLI prompt, log export)
│   ├── 14. Chat Interface (Bi-directional in-game chat, reactive message regex triggers)
│   └── 15. Inventory Manager (36-slot GUI, durability bars, enchantments, slot actions)
└── System & Security
    ├── 16. Anti-Disconnect & Watchdog (5-state health lifecycle, exponential backoff, kick diagnostics)
    ├── 17. Server Capability Scanner (Supported / Requires Op / Unsupported permission audit)
    ├── 18. Permissions & Audit (Role matrix: Admin/Operator/Viewer, immutable audit log)
    ├── 19. Notifications & Webhooks (Discord/Slack webhook integration, synthesized sound alarms)
    ├── 20. Analytics & Telemetry (Latency over time SVG chart, hourly mining productivity, K/D)
    └── 21. Developer / Debug Mode (Live TCP packet sniffer, decoded JSON payload inspector)
```

---

## Key Capabilities

1. **Safety Boundary Enforcement**: Explicitly marks client-mod or operator-restricted capabilities (e.g. Flight, High Jump, Ghost Hand, Extended Reach) to prevent server-side anti-cheat bans (GrimAC / Vulcan / NoCheatPlus).
2. **Autonomous Simulation Engine**: Includes a client-side tick loop simulating health, hunger, mining progress, combat encounters, and rule evaluations in real time (20.0 TPS).
3. **Web Audio Synthesizer**: Uses Web Audio API oscillator synthesis for clicks, warning buzzers, and alarms without requiring external audio assets.
4. **Emergency Stop (E-STOP)**: One-click global halt immediately suspending all bot movement, attacks, and pathfinding across the entire cluster.
5. **Interactive Live Minimap**: Canvas-based 2D navigation map with coordinate grids, heading arrows, waypoint markers, dimension switching (Overworld, Nether, The End), and click-to-dispatch controls.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v22)
- npm 10+

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Troubleshooting

**Dashboard is blank / a module shows nothing**
The app no longer depends on browser storage being available: sandboxed iframes,
private browsing and blocked third-party cookies all downgrade to in-memory state
instead of failing. If a previously saved dataset is corrupt, it is discarded and
the built-in demo data is restored automatically.

If you ever see the recovery card ("Recovered from a crash"), use **Reset Saved
Data & Reload** to clear the `minecontrol_*` localStorage keys, or clear them
manually in DevTools → Application → Local Storage.

Every view is wrapped in an error boundary, so one failing module can never blank
out the rest of the control panel.
