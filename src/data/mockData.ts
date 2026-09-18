import { 
  Bot, 
  Server, 
  Waypoint, 
  Route, 
  AutomationRule, 
  Profile, 
  CapabilityItem, 
  AuditLogItem, 
  AppNotification,
  UserRoleDefinition,
  ChatTrigger
} from '../types';

export const INITIAL_SERVERS: Server[] = [
  {
    id: 'server-1',
    name: 'SMP Network Alpha',
    address: 'mc.smp-network.net',
    port: 25565,
    version: '1.20.4',
    authType: 'microsoft',
    defaultUsername: 'MineCommander',
    timeoutMs: 15000,
    reconnectDelaySec: 8,
    maxReconnectAttempts: 5,
    proxy: {
      enabled: false,
      type: 'socks5',
      host: '',
      port: 1080
    },
    status: 'online',
    latency: 28,
    playerCount: { online: 46, max: 150 },
    motd: '§6★ SMP Network ★ §7Season 8 §8| §aVanilla+ Survival §e[1.20.4]',
    software: 'Paper 1.20.4-R0.1',
    connectionHistory: [
      { timestamp: Date.now() - 3600000 * 2, status: 'connected', detail: 'Handshake complete (Protocol 765)' },
      { timestamp: Date.now() - 3600000 * 5, status: 'disconnected', detail: 'Normal disconnect for server reboot' },
      { timestamp: Date.now() - 3600000 * 5 + 60000, status: 'connected', detail: 'Reconnected successfully' }
    ],
    errors: [],
    lastConnectedAt: Date.now() - 120000
  },
  {
    id: 'server-2',
    name: 'Anarchy Realm',
    address: 'anarchy.mc-grid.io',
    port: 25565,
    version: '1.20.2',
    authType: 'microsoft',
    defaultUsername: 'ShadowProxy',
    timeoutMs: 20000,
    reconnectDelaySec: 15,
    maxReconnectAttempts: 10,
    proxy: {
      enabled: true,
      type: 'socks5',
      host: '198.51.100.44',
      port: 9050,
      auth: { username: 'proxy_usr', password: '***' }
    },
    status: 'online',
    latency: 64,
    playerCount: { online: 88, max: 250 },
    motd: '§4§lANARCHY 2026 §8- §cNo Rules §8| §7GrimAC Patched §8| §fNo Resets',
    software: 'Purpur 1.20.2 (GrimAC)',
    connectionHistory: [
      { timestamp: Date.now() - 7200000, status: 'connected', detail: 'SOCKS5 tunnel verified' },
      { timestamp: Date.now() - 1800000, status: 'kick', detail: 'Packet rate throttle warning' }
    ],
    errors: ['Warning: Strict movement packet checks detected'],
    lastConnectedAt: Date.now() - 600000
  },
  {
    id: 'server-3',
    name: 'Fabric Automation Lab',
    address: '192.168.1.150',
    port: 25565,
    version: '1.20.4',
    authType: 'offline',
    defaultUsername: 'TestSubject',
    timeoutMs: 10000,
    reconnectDelaySec: 5,
    maxReconnectAttempts: 3,
    proxy: { enabled: false, type: 'socks5', host: '', port: 0 },
    status: 'online',
    latency: 6,
    playerCount: { online: 4, max: 20 },
    motd: '§bCarpet Mod Testbed §8- §eFull Mod/Plugin Permissions Enabled',
    software: 'Fabric 1.20.4 (Carpet + Lithium)',
    connectionHistory: [
      { timestamp: Date.now() - 18000000, status: 'connected', detail: 'Direct LAN socket opened' }
    ],
    errors: [],
    lastConnectedAt: Date.now() - 300000
  }
];

export const INITIAL_WAYPOINTS: Waypoint[] = [
  {
    id: 'wp-safe-room',
    name: 'Safe Room / Bunker',
    x: 125,
    y: 65,
    z: -340,
    dimension: 'overworld',
    color: '#10b981',
    icon: 'Shield',
    notes: 'Reinforced obsidian bunker with regeneration beacon & chests'
  },
  {
    id: 'wp-strip-mine',
    name: 'Diamond Mine Hub Y-58',
    x: 140,
    y: -58,
    z: -390,
    dimension: 'overworld',
    color: '#06b6d4',
    icon: 'Pickaxe',
    notes: 'Main branch mining sector 4'
  },
  {
    id: 'wp-wheat-farm',
    name: 'Wheat & Potato Farm Plot A',
    x: 95,
    y: 63,
    z: -310,
    dimension: 'overworld',
    color: '#f59e0b',
    icon: 'Wheat',
    notes: 'Automated 16x16 farm plot with composters'
  },
  {
    id: 'wp-storage-silo',
    name: 'Central Drop Silo',
    x: 110,
    y: 64,
    z: -330,
    dimension: 'overworld',
    color: '#8b5cf6',
    icon: 'Archive',
    notes: 'Auto-sorting hopper array for raw ores and crops'
  },
  {
    id: 'wp-perimeter-post',
    name: 'North Outpost Perimeter',
    x: 210,
    y: 72,
    z: -280,
    dimension: 'overworld',
    color: '#ef4444',
    icon: 'Crosshair',
    notes: 'Perimeter defense line against night mob spawns'
  },
  {
    id: 'wp-nether-portal',
    name: 'Nether Fortress Bridge',
    x: 52,
    y: 74,
    z: -14,
    dimension: 'nether',
    color: '#f43f5e',
    icon: 'Flame',
    notes: 'Blaze spawner corridor'
  }
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-patrol',
    name: 'Perimeter Sentry Route',
    waypointIds: ['wp-safe-room', 'wp-perimeter-post', 'wp-storage-silo'],
    mode: 'loop',
    active: true
  },
  {
    id: 'route-mine-run',
    name: 'Mining Haul Circuit',
    waypointIds: ['wp-strip-mine', 'wp-storage-silo'],
    mode: 'ping-pong',
    active: false
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-emergency-retreat',
    name: 'Emergency Low Health Retreat',
    description: 'If health drops below 30%, stop current task, equip healing item, retreat to bunker, and recover to 80%',
    enabled: true,
    priority: 100,
    triggers: [
      { id: 'trig-1', type: 'health_below', threshold: 30 }
    ],
    conditions: [
      { id: 'cond-1', type: 'is_online', value: 'true' }
    ],
    actions: [
      { id: 'act-1', type: 'stop_task' },
      { id: 'act-2', type: 'equip_item', targetItem: 'minecraft:golden_apple' },
      { id: 'act-3', type: 'move_to_waypoint', waypointId: 'wp-safe-room' },
      { id: 'act-4', type: 'wait_until_health', healthTarget: 16 },
      { id: 'act-5', type: 'resume_previous_task' }
    ],
    onFail: 'Disconnect immediately and send critical alert'
  },
  {
    id: 'rule-inventory-full-unload',
    name: 'Inventory Full Auto-Unload',
    description: 'When inventory is full of mined ores, deposit items in Central Drop Silo and return to mine',
    enabled: true,
    priority: 80,
    triggers: [
      { id: 'trig-inv', type: 'inventory_full', threshold: 32 }
    ],
    conditions: [
      { id: 'cond-inv', type: 'has_item', value: 'minecraft:diamond' }
    ],
    actions: [
      { id: 'act-inv-1', type: 'stop_task' },
      { id: 'act-inv-2', type: 'move_to_waypoint', waypointId: 'wp-storage-silo' },
      { id: 'act-inv-3', type: 'drop_item', targetItem: 'raw_materials' },
      { id: 'act-inv-4', type: 'move_to_waypoint', waypointId: 'wp-strip-mine' },
      { id: 'act-inv-5', type: 'resume_previous_task' }
    ]
  },
  {
    id: 'rule-anti-afk',
    name: 'Anti-AFK Behavioral Jiggle',
    description: 'Execute randomized yaw look adjustments and occasional sneak to avoid server AFK kicks',
    enabled: true,
    priority: 20,
    triggers: [
      { id: 'trig-timer', type: 'timer_interval', intervalSeconds: 45 }
    ],
    conditions: [],
    actions: [
      { id: 'act-afk-1', type: 'chat_command', command: '/afk_keepalive' },
      { id: 'act-afk-2', type: 'wait_delay', delayMs: 400 }
    ]
  },
  {
    id: 'rule-tool-saver',
    name: 'Pickaxe Durability Saver',
    description: 'When primary diamond pickaxe drops under 10% durability, swap with backup from inventory',
    enabled: true,
    priority: 90,
    triggers: [
      { id: 'trig-dur', type: 'tool_durability', threshold: 10 }
    ],
    conditions: [],
    actions: [
      { id: 'act-dur-1', type: 'equip_item', targetItem: 'minecraft:diamond_pickaxe' }
    ]
  }
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof-mining',
    name: 'Deepslate Strip Miner',
    description: 'Optimized for Y=-58 branch mining, diamond priority, torch placement, and auto-store',
    group: 'Mining Bots',
    customTags: ['mining', 'diamonds', 'safe'],
    movement: {
      speedMultiplier: 1.0,
      autoWalk: false,
      sprint: false,
      stepHeight: 0.6,
      noFall: false
    },
    combat: {
      enabled: true,
      targetDetection: 'hostile_only',
      autoAttack: true,
      attackRange: 3.2,
      attackDelayMs: 625,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 14,
      autoHeal: true,
      healThreshold: 12,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 30,
        defensiveItem: 'minecraft:shield',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 80,
        resumePreviousTask: true
      }
    },
    mining: {
      enabled: true,
      targetBlocks: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore', 'minecraft:iron_ore', 'minecraft:gold_ore', 'minecraft:ancient_debris'],
      whitelist: ['diamond_ore', 'iron_ore', 'gold_ore', 'coal_ore', 'lapis_ore'],
      blacklist: ['gravel', 'lava', 'water'],
      miningRange: 4.2,
      toolPreference: 'netherite',
      fortunePriority: true,
      durabilityWarningPercent: 12,
      autoToolReplace: true,
      inventoryFullAction: 'return_to_storage',
      storageWaypointId: 'wp-storage-silo',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: -58,
      torchInterval: 7,
      stats: {
        blocksMined: 1482,
        timeMiningSeconds: 4320,
        itemsCollected: [
          { name: 'Diamond', count: 34 },
          { name: 'Raw Iron', count: 184 },
          { name: 'Raw Gold', count: 56 },
          { name: 'Redstone', count: 240 }
        ],
        toolsConsumed: 3,
        currentObjective: 'Excavating Branch #12 at Y=-58'
      }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    },
    automationRuleIds: ['rule-emergency-retreat', 'rule-inventory-full-unload', 'rule-tool-saver']
  },
  {
    id: 'prof-combat',
    name: 'Vanguard Mob Enforcer',
    description: 'High-speed hostile mob clearing, auto-shield deflection, jump criticals, and perimeter defense',
    group: 'Combat Bots',
    customTags: ['pvp', 'pve', 'defense'],
    movement: {
      speedMultiplier: 1.2,
      sprint: true,
      autoJump: true,
      stepHeight: 0.6
    },
    combat: {
      enabled: true,
      targetDetection: 'hostile_only',
      targetFiltering: ['zombie', 'skeleton', 'spider', 'creeper', 'witch', 'enderman'],
      autoAttack: true,
      autoTarget: true,
      targetPriority: 'highest_threat',
      attackRange: 3.8,
      attackDelayMs: 550,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: true,
      criticalHits: true,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true,
      friendlyWhitelist: ['MineCommander', 'SMP_Mod', 'Aegis_Vanguard']
    },
    survival: {
      autoFood: true,
      hungerThreshold: 16,
      autoHeal: true,
      healThreshold: 14,
      autoArmor: true,
      autoWeaponSelect: true,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 35,
        defensiveItem: 'minecraft:golden_apple',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 85,
        resumePreviousTask: true
      }
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3.5,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'alert_pause',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    },
    automationRuleIds: ['rule-emergency-retreat']
  },
  {
    id: 'prof-farming',
    name: 'Botanical Harvester',
    description: 'Automated wheat, carrot, and potato harvesting with instant replant and silo storage deposit',
    group: 'Farming Bots',
    customTags: ['agriculture', 'automation'],
    movement: { speedMultiplier: 0.9, autoWalk: true, sprint: false },
    combat: { enabled: false, targetDetection: 'hostile_only', autoAttack: false, attackRange: 2.5, attackDelayMs: 800, rotationBehavior: 'smooth', weaponSelection: 'best_sword', shieldHandling: false, criticalHits: false, targetPriority: 'closest', autoTarget: false, friendlyWhitelist: [], healthThresholdPercent: 20, distanceLimit: 10, safetyBoundaryEnabled: true, antiCheatCompliance: true, targetFiltering: [] },
    survival: { autoFood: true, hungerThreshold: 14, autoHeal: true, healThreshold: 10, autoArmor: true, autoWeaponSelect: false, autoItemReplace: true, emergencyRetreat: { enabled: true, healthThreshold: 25, defensiveItem: 'minecraft:shield', safeWaypointId: 'wp-safe-room', recoveryHealthThreshold: 75, resumePreviousTask: true }, inventoryCleanup: true, itemSorting: true, foodPriority: ['Bread', 'Baked Potato'], avoidBadFood: true, healMethod: 'rest' },
    mining: { enabled: false, targetBlocks: [], whitelist: [], blacklist: [], miningRange: 3, toolPreference: 'auto', fortunePriority: false, durabilityWarningPercent: 10, autoToolReplace: false, inventoryFullAction: 'return_to_storage', storageWaypointId: '', pattern: 'strip', branchSpacing: 3, targetYLevel: 64, torchInterval: 8, stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' } },
    farming: {
      enabled: true,
      cropTypes: ['wheat', 'carrots', 'potatoes', 'beetroot'],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: true,
      routePattern: 'grid',
      storageWaypointId: 'wp-storage-silo',
      autoToolSelect: true,
      stats: {
        cropsHarvested: 3120,
        replantRate: 99.4,
        yieldPerHour: 620,
        timeActiveSeconds: 7200,
        storageUsage: 64
      }
    },
    automationRuleIds: ['rule-emergency-retreat']
  },
  {
    id: 'prof-afk',
    name: 'Passive AFK Keepalive',
    description: 'Subtle yaw rotation, random sneak and jump intervals to prevent idle kick while keeping resource use low',
    group: 'AFK Bots',
    customTags: ['afk', 'stealth'],
    movement: { speedMultiplier: 0.5, sprint: false, autoWalk: false },
    combat: { enabled: false, targetDetection: 'hostile_only', autoAttack: false, attackRange: 2.0, attackDelayMs: 1000, rotationBehavior: 'legit_curve', weaponSelection: 'best_sword', shieldHandling: true, criticalHits: false, targetPriority: 'closest', autoTarget: false, friendlyWhitelist: [], healthThresholdPercent: 30, distanceLimit: 5, safetyBoundaryEnabled: true, antiCheatCompliance: true, targetFiltering: [] },
    survival: { autoFood: true, hungerThreshold: 12, autoHeal: true, healThreshold: 14, autoArmor: true, autoWeaponSelect: false, autoItemReplace: true, emergencyRetreat: { enabled: true, healthThreshold: 40, defensiveItem: 'minecraft:shield', safeWaypointId: 'wp-safe-room', recoveryHealthThreshold: 90, resumePreviousTask: true }, inventoryCleanup: false, itemSorting: false, foodPriority: ['Steak', 'Cooked Porkchop'], avoidBadFood: true, healMethod: 'golden_apple' },
    mining: { enabled: false, targetBlocks: [], whitelist: [], blacklist: [], miningRange: 3, toolPreference: 'auto', fortunePriority: false, durabilityWarningPercent: 10, autoToolReplace: false, inventoryFullAction: 'alert_pause', storageWaypointId: '', pattern: 'strip', branchSpacing: 3, targetYLevel: 64, torchInterval: 8, stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' } },
    farming: { enabled: false, cropTypes: [], matureOnly: true, replantImmediately: false, seedManagement: false, routePattern: 'grid', storageWaypointId: '', autoToolSelect: false, stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 } },
    automationRuleIds: ['rule-anti-afk']
  }
];

export const INITIAL_BOTS: Bot[] = [
  {
    id: 'bot-1',
    name: 'QuarryMaster_X',
    serverId: 'server-1',
    status: 'healthy',
    health: 19,
    maxHealth: 20,
    hunger: 18,
    saturation: 14,
    armor: 16,
    position: { x: 142.4, y: -58.0, z: -388.2, yaw: 182.5, pitch: 12.0, dimension: 'overworld' },
    ping: 24,
    activity: 'Mining',
    target: {
      id: 'target-ore-1',
      name: 'Deepslate Diamond Ore',
      type: 'zombie', // internal dummy for entity/block
      distance: 2.1,
      health: 1,
      maxHealth: 1,
      threatLevel: 'low',
      status: 'Targeted'
    },
    profileId: 'prof-mining',
    group: 'Mining Bots',
    uptime: 14250,
    inventory: [
      { slot: 0, id: 'minecraft:netherite_pickaxe', name: 'Netherite Pickaxe', count: 1, maxCount: 1, durability: 1820, maxDurability: 2031, enchantments: [{ name: 'Efficiency', level: 5 }, { name: 'Fortune', level: 3 }, { name: 'Unbreaking', level: 3 }], category: 'tool', rarity: 'epic' },
      { slot: 1, id: 'minecraft:diamond_pickaxe', name: 'Diamond Pickaxe (Backup)', count: 1, maxCount: 1, durability: 1240, maxDurability: 1561, enchantments: [{ name: 'Efficiency', level: 4 }], category: 'tool', rarity: 'rare' },
      { slot: 2, id: 'minecraft:diamond_sword', name: 'Diamond Sword', count: 1, maxCount: 1, durability: 1500, maxDurability: 1561, enchantments: [{ name: 'Sharpness', level: 4 }, { name: 'Looting', level: 3 }], category: 'weapon', rarity: 'rare' },
      { slot: 3, id: 'minecraft:cooked_beef', name: 'Cooked Beef', count: 48, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 4, id: 'minecraft:torch', name: 'Torch', count: 64, maxCount: 64, category: 'block', rarity: 'common' },
      { slot: 5, id: 'minecraft:water_bucket', name: 'Water Bucket', count: 1, maxCount: 1, category: 'tool', rarity: 'common' },
      { slot: 6, id: 'minecraft:golden_apple', name: 'Golden Apple', count: 4, maxCount: 64, category: 'food', rarity: 'rare' },
      { slot: 7, id: 'minecraft:cobblestone', name: 'Deepslate Cobblestone', count: 64, maxCount: 64, category: 'block', rarity: 'common' },
      { slot: 8, id: 'minecraft:iron_ingot', name: 'Iron Ingot', count: 24, maxCount: 64, category: 'resource', rarity: 'common' },
      { slot: 9, id: 'minecraft:diamond', name: 'Diamond', count: 28, maxCount: 64, category: 'resource', rarity: 'rare' },
      { slot: 10, id: 'minecraft:raw_iron', name: 'Raw Iron', count: 64, maxCount: 64, category: 'resource', rarity: 'common' },
      { slot: 11, id: 'minecraft:raw_gold', name: 'Raw Gold', count: 32, maxCount: 64, category: 'resource', rarity: 'common' },
      { slot: 12, id: 'minecraft:redstone', name: 'Redstone Dust', count: 64, maxCount: 64, category: 'resource', rarity: 'common' },
      { slot: 13, id: 'minecraft:lapis_lazuli', name: 'Lapis Lazuli', count: 45, maxCount: 64, category: 'resource', rarity: 'common' },
      { slot: 14, id: 'minecraft:coal', name: 'Coal', count: 54, maxCount: 64, category: 'resource', rarity: 'common' }
    ],
    equipment: {
      helmet: { slot: 36, id: 'minecraft:diamond_helmet', name: 'Diamond Helmet', count: 1, maxCount: 1, durability: 320, maxDurability: 363, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      chestplate: { slot: 37, id: 'minecraft:diamond_chestplate', name: 'Diamond Chestplate', count: 1, maxCount: 1, durability: 490, maxDurability: 528, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      leggings: { slot: 38, id: 'minecraft:diamond_leggings', name: 'Diamond Leggings', count: 1, maxCount: 1, durability: 440, maxDurability: 495, enchantments: [{ name: 'Protection', level: 3 }], category: 'armor' },
      boots: { slot: 39, id: 'minecraft:diamond_boots', name: 'Diamond Boots', count: 1, maxCount: 1, durability: 380, maxDurability: 429, enchantments: [{ name: 'Protection', level: 3 }, { name: 'Feather Falling', level: 4 }], category: 'armor' },
      mainHand: { slot: 0, id: 'minecraft:netherite_pickaxe', name: 'Netherite Pickaxe', count: 1, maxCount: 1, category: 'tool' },
      offHand: { slot: 40, id: 'minecraft:torch', name: 'Torch', count: 64, maxCount: 64, category: 'block' }
    },
    stats: {
      uptimeSeconds: 14250,
      timeOnlineSeconds: 14250,
      distanceTraveledBlocks: 3410,
      kills: 4,
      deaths: 0,
      damageDealt: 120,
      damageTaken: 18,
      reconnects: 1,
      tasksCompleted: 42,
      tasksFailed: 0
    },
    reliability: {
      autoReconnect: true,
      initialDelayMs: 3000,
      backoffMultiplier: 1.5,
      maxDelayMs: 30000,
      maxAttempts: 5,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: Date.now() - 800,
      lastKickReason: null,
      healthState: 'healthy',
      uptimePercentage: 99.8
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 1.0,
      stepHeight: 0.6,
      sprint: false,
      autoWalk: false,
      autoSprint: false,
      autoJump: false,
      noFall: false,
      movementSpeed: 4.3,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: true, avoidLava: true, avoidWater: false, canDig: true, heuristicWeight: 1.2 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: true,
      targetDetection: 'hostile_only',
      targetFiltering: ['zombie', 'skeleton', 'creeper'],
      autoAttack: true,
      autoTarget: true,
      targetPriority: 'closest',
      attackRange: 3.2,
      attackDelayMs: 625,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: true,
      criticalHits: false,
      friendlyWhitelist: [],
      healthThresholdPercent: 30,
      distanceLimit: 12,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 14,
      foodPriority: ['Cooked Beef', 'Golden Apple'],
      avoidBadFood: true,
      autoHeal: true,
      healThreshold: 12,
      healMethod: 'golden_apple',
      autoArmor: true,
      autoWeaponSelect: true,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 30,
        defensiveItem: 'minecraft:golden_apple',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 80,
        resumePreviousTask: true
      },
      inventoryCleanup: true,
      itemSorting: true
    },
    mining: {
      enabled: true,
      targetBlocks: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore', 'minecraft:iron_ore'],
      whitelist: ['diamond_ore', 'iron_ore', 'gold_ore'],
      blacklist: ['gravel'],
      miningRange: 4.2,
      toolPreference: 'netherite',
      fortunePriority: true,
      durabilityWarningPercent: 12,
      autoToolReplace: true,
      inventoryFullAction: 'return_to_storage',
      storageWaypointId: 'wp-storage-silo',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: -58,
      torchInterval: 7,
      stats: {
        blocksMined: 1482,
        timeMiningSeconds: 4320,
        itemsCollected: [{ name: 'Diamond', count: 34 }, { name: 'Raw Iron', count: 184 }],
        toolsConsumed: 3,
        currentObjective: 'Excavating Branch #12 at Y=-58'
      }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    }
  },
  {
    id: 'bot-2',
    name: 'Aegis_Vanguard',
    serverId: 'server-1',
    status: 'healthy',
    health: 16,
    maxHealth: 20,
    hunger: 20,
    saturation: 18,
    armor: 20,
    position: { x: 208.7, y: 72.0, z: -278.4, yaw: 94.2, pitch: -4.5, dimension: 'overworld' },
    ping: 31,
    activity: 'Combat',
    target: {
      id: 'target-mob-2',
      name: 'Armed Skeleton (Power II)',
      type: 'skeleton',
      distance: 6.4,
      health: 14,
      maxHealth: 20,
      threatLevel: 'high',
      status: 'Engaging'
    },
    profileId: 'prof-combat',
    group: 'Combat Bots',
    uptime: 18400,
    inventory: [
      { slot: 0, id: 'minecraft:netherite_sword', name: 'Netherite Sword', count: 1, maxCount: 1, durability: 1950, maxDurability: 2031, enchantments: [{ name: 'Sharpness', level: 5 }, { name: 'Fire Aspect', level: 2 }, { name: 'Unbreaking', level: 3 }], category: 'weapon', rarity: 'epic' },
      { slot: 1, id: 'minecraft:bow', name: 'Power Bow', count: 1, maxCount: 1, durability: 350, maxDurability: 384, enchantments: [{ name: 'Power', level: 5 }, { name: 'Flame', level: 1 }, { name: 'Infinity', level: 1 }], category: 'weapon', rarity: 'rare' },
      { slot: 2, id: 'minecraft:arrow', name: 'Arrow', count: 1, maxCount: 64, category: 'misc', rarity: 'common' },
      { slot: 3, id: 'minecraft:golden_apple', name: 'Golden Apple', count: 12, maxCount: 64, category: 'food', rarity: 'rare' },
      { slot: 4, id: 'minecraft:shield', name: 'Reinforced Shield', count: 1, maxCount: 1, durability: 310, maxDurability: 336, enchantments: [{ name: 'Unbreaking', level: 3 }], category: 'armor', rarity: 'uncommon' },
      { slot: 5, id: 'minecraft:cooked_porkchop', name: 'Cooked Porkchop', count: 64, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 6, id: 'minecraft:ender_pearl', name: 'Ender Pearl', count: 16, maxCount: 16, category: 'misc', rarity: 'rare' }
    ],
    equipment: {
      helmet: { slot: 36, id: 'minecraft:netherite_helmet', name: 'Netherite Helmet', count: 1, maxCount: 1, durability: 390, maxDurability: 407, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      chestplate: { slot: 37, id: 'minecraft:netherite_chestplate', name: 'Netherite Chestplate', count: 1, maxCount: 1, durability: 570, maxDurability: 592, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      leggings: { slot: 38, id: 'minecraft:netherite_leggings', name: 'Netherite Leggings', count: 1, maxCount: 1, durability: 530, maxDurability: 555, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      boots: { slot: 39, id: 'minecraft:netherite_boots', name: 'Netherite Boots', count: 1, maxCount: 1, durability: 460, maxDurability: 481, enchantments: [{ name: 'Protection', level: 4 }], category: 'armor' },
      mainHand: { slot: 0, id: 'minecraft:netherite_sword', name: 'Netherite Sword', count: 1, maxCount: 1, category: 'weapon' },
      offHand: { slot: 40, id: 'minecraft:shield', name: 'Reinforced Shield', count: 1, maxCount: 1, category: 'armor' }
    },
    stats: {
      uptimeSeconds: 18400,
      timeOnlineSeconds: 18400,
      distanceTraveledBlocks: 8940,
      kills: 62,
      deaths: 1,
      damageDealt: 1480,
      damageTaken: 260,
      reconnects: 0,
      tasksCompleted: 88,
      tasksFailed: 2
    },
    reliability: {
      autoReconnect: true,
      initialDelayMs: 2000,
      backoffMultiplier: 1.5,
      maxDelayMs: 20000,
      maxAttempts: 8,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: Date.now() - 400,
      lastKickReason: null,
      healthState: 'healthy',
      uptimePercentage: 99.9
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 1.2,
      stepHeight: 0.6,
      sprint: true,
      autoWalk: false,
      autoSprint: true,
      autoJump: true,
      noFall: false,
      movementSpeed: 5.4,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: true, avoidLava: true, avoidWater: false, canDig: false, heuristicWeight: 1.0 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: true,
      targetDetection: 'hostile_only',
      targetFiltering: ['skeleton', 'creeper', 'zombie', 'spider'],
      autoAttack: true,
      autoTarget: true,
      targetPriority: 'highest_threat',
      attackRange: 3.8,
      attackDelayMs: 550,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: true,
      criticalHits: true,
      friendlyWhitelist: ['MineCommander', 'Aegis_Vanguard'],
      healthThresholdPercent: 35,
      distanceLimit: 24,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 16,
      foodPriority: ['Golden Apple', 'Cooked Porkchop'],
      avoidBadFood: true,
      autoHeal: true,
      healThreshold: 14,
      healMethod: 'golden_apple',
      autoArmor: true,
      autoWeaponSelect: true,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 35,
        defensiveItem: 'minecraft:golden_apple',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 85,
        resumePreviousTask: true
      },
      inventoryCleanup: true,
      itemSorting: true
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'alert_pause',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Patrolling' }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    }
  },
  {
    id: 'bot-3',
    name: 'FarmHand_Beta',
    serverId: 'server-1',
    status: 'healthy',
    health: 20,
    maxHealth: 20,
    hunger: 19,
    saturation: 15,
    armor: 11,
    position: { x: 96.2, y: 63.0, z: -308.5, yaw: 45.0, pitch: 20.0, dimension: 'overworld' },
    ping: 27,
    activity: 'Farming',
    target: {
      id: 'target-crop-1',
      name: 'Mature Wheat (Age 7)',
      type: 'cow', // indicator
      distance: 1.4,
      health: 1,
      maxHealth: 1,
      threatLevel: 'low',
      status: 'Targeted'
    },
    profileId: 'prof-farming',
    group: 'Farming Bots',
    uptime: 21600,
    inventory: [
      { slot: 0, id: 'minecraft:diamond_hoe', name: 'Diamond Hoe', count: 1, maxCount: 1, durability: 1480, maxDurability: 1561, enchantments: [{ name: 'Unbreaking', level: 3 }], category: 'tool', rarity: 'rare' },
      { slot: 1, id: 'minecraft:wheat_seeds', name: 'Wheat Seeds', count: 64, maxCount: 64, category: 'misc', rarity: 'common' },
      { slot: 2, id: 'minecraft:wheat', name: 'Wheat', count: 64, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 3, id: 'minecraft:bread', name: 'Bread', count: 32, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 4, id: 'minecraft:potato', name: 'Potato', count: 48, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 5, id: 'minecraft:carrot', name: 'Carrot', count: 52, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 6, id: 'minecraft:bone_meal', name: 'Bone Meal', count: 64, maxCount: 64, category: 'misc', rarity: 'common' }
    ],
    equipment: {
      helmet: { slot: 36, id: 'minecraft:iron_helmet', name: 'Iron Helmet', count: 1, maxCount: 1, durability: 140, maxDurability: 165, category: 'armor' },
      chestplate: { slot: 37, id: 'minecraft:iron_chestplate', name: 'Iron Chestplate', count: 1, maxCount: 1, durability: 210, maxDurability: 240, category: 'armor' },
      leggings: { slot: 38, id: 'minecraft:iron_leggings', name: 'Iron Leggings', count: 1, maxCount: 1, durability: 195, maxDurability: 225, category: 'armor' },
      boots: { slot: 39, id: 'minecraft:iron_boots', name: 'Iron Boots', count: 1, maxCount: 1, durability: 170, maxDurability: 195, category: 'armor' },
      mainHand: { slot: 0, id: 'minecraft:diamond_hoe', name: 'Diamond Hoe', count: 1, maxCount: 1, category: 'tool' },
      offHand: { slot: 40, id: 'minecraft:wheat_seeds', name: 'Wheat Seeds', count: 64, maxCount: 64, category: 'misc' }
    },
    stats: {
      uptimeSeconds: 21600,
      timeOnlineSeconds: 21600,
      distanceTraveledBlocks: 4520,
      kills: 0,
      deaths: 0,
      damageDealt: 0,
      damageTaken: 0,
      reconnects: 0,
      tasksCompleted: 312,
      tasksFailed: 0
    },
    reliability: {
      autoReconnect: true,
      initialDelayMs: 4000,
      backoffMultiplier: 1.5,
      maxDelayMs: 30000,
      maxAttempts: 5,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: Date.now() - 1100,
      lastKickReason: null,
      healthState: 'healthy',
      uptimePercentage: 100
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 0.9,
      stepHeight: 0.6,
      sprint: false,
      autoWalk: true,
      autoSprint: false,
      autoJump: false,
      noFall: false,
      movementSpeed: 3.8,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: false, avoidLava: true, avoidWater: false, canDig: false, heuristicWeight: 1.0 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: false,
      targetDetection: 'hostile_only',
      targetFiltering: [],
      autoAttack: false,
      autoTarget: false,
      targetPriority: 'closest',
      attackRange: 2.5,
      attackDelayMs: 800,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: false,
      criticalHits: false,
      friendlyWhitelist: [],
      healthThresholdPercent: 25,
      distanceLimit: 10,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 14,
      foodPriority: ['Bread', 'Baked Potato'],
      avoidBadFood: true,
      autoHeal: true,
      healThreshold: 10,
      healMethod: 'rest',
      autoArmor: true,
      autoWeaponSelect: false,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 25,
        defensiveItem: 'minecraft:shield',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 75,
        resumePreviousTask: true
      },
      inventoryCleanup: true,
      itemSorting: true
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'return_to_storage',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' }
    },
    farming: {
      enabled: true,
      cropTypes: ['wheat', 'carrots', 'potatoes', 'beetroot'],
      matureOnly: true,
      replantImmediately: true,
      seedManagement: true,
      routePattern: 'grid',
      storageWaypointId: 'wp-storage-silo',
      autoToolSelect: true,
      stats: {
        cropsHarvested: 3120,
        replantRate: 99.4,
        yieldPerHour: 620,
        timeActiveSeconds: 7200,
        storageUsage: 64
      }
    }
  },
  {
    id: 'bot-4',
    name: 'AFK_Fisher_99',
    serverId: 'server-1',
    status: 'healthy',
    health: 20,
    maxHealth: 20,
    hunger: 20,
    saturation: 20,
    armor: 15,
    position: { x: 124.8, y: 65.0, z: -339.6, yaw: 270.0, pitch: 0.0, dimension: 'overworld' },
    ping: 22,
    activity: 'Idle',
    target: null,
    profileId: 'prof-afk',
    group: 'AFK Bots',
    uptime: 48900,
    inventory: [
      { slot: 0, id: 'minecraft:fishing_rod', name: 'Luck of the Sea Rod', count: 1, maxCount: 1, durability: 60, maxDurability: 64, enchantments: [{ name: 'Luck of the Sea', level: 3 }, { name: 'Lure', level: 3 }, { name: 'Mending', level: 1 }], category: 'tool', rarity: 'rare' },
      { slot: 1, id: 'minecraft:cooked_salmon', name: 'Cooked Salmon', count: 32, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 2, id: 'minecraft:raw_cod', name: 'Raw Cod', count: 64, maxCount: 64, category: 'food', rarity: 'common' },
      { slot: 3, id: 'minecraft:enchanted_book', name: 'Enchanted Book (Mending)', count: 1, maxCount: 1, category: 'misc', rarity: 'epic' }
    ],
    equipment: {
      helmet: { slot: 36, id: 'minecraft:diamond_helmet', name: 'Diamond Helmet', count: 1, maxCount: 1, category: 'armor' },
      chestplate: { slot: 37, id: 'minecraft:diamond_chestplate', name: 'Diamond Chestplate', count: 1, maxCount: 1, category: 'armor' },
      leggings: { slot: 38, id: 'minecraft:diamond_leggings', name: 'Diamond Leggings', count: 1, maxCount: 1, category: 'armor' },
      boots: { slot: 39, id: 'minecraft:diamond_boots', name: 'Diamond Boots', count: 1, maxCount: 1, category: 'armor' },
      mainHand: { slot: 0, id: 'minecraft:fishing_rod', name: 'Luck of the Sea Rod', count: 1, maxCount: 1, category: 'tool' },
      offHand: null
    },
    stats: {
      uptimeSeconds: 48900,
      timeOnlineSeconds: 48900,
      distanceTraveledBlocks: 140,
      kills: 0,
      deaths: 0,
      damageDealt: 0,
      damageTaken: 0,
      reconnects: 2,
      tasksCompleted: 480,
      tasksFailed: 0
    },
    reliability: {
      autoReconnect: true,
      initialDelayMs: 5000,
      backoffMultiplier: 1.5,
      maxDelayMs: 30000,
      maxAttempts: 10,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: Date.now() - 300,
      lastKickReason: null,
      healthState: 'healthy',
      uptimePercentage: 99.7
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 0.5,
      stepHeight: 0.6,
      sprint: false,
      autoWalk: false,
      autoSprint: false,
      autoJump: false,
      noFall: false,
      movementSpeed: 2.0,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: false, avoidLava: true, avoidWater: false, canDig: false, heuristicWeight: 1.0 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: false,
      targetDetection: 'hostile_only',
      targetFiltering: [],
      autoAttack: false,
      autoTarget: false,
      targetPriority: 'closest',
      attackRange: 2.0,
      attackDelayMs: 1000,
      rotationBehavior: 'legit_curve',
      weaponSelection: 'best_sword',
      shieldHandling: true,
      criticalHits: false,
      friendlyWhitelist: [],
      healthThresholdPercent: 30,
      distanceLimit: 5,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 12,
      foodPriority: ['Cooked Salmon'],
      avoidBadFood: true,
      autoHeal: true,
      healThreshold: 14,
      healMethod: 'rest',
      autoArmor: true,
      autoWeaponSelect: false,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 40,
        defensiveItem: 'minecraft:shield',
        safeWaypointId: 'wp-safe-room',
        recoveryHealthThreshold: 90,
        resumePreviousTask: true
      },
      inventoryCleanup: false,
      itemSorting: false
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'alert_pause',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'AFK Fishing' }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: false,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    }
  },
  {
    id: 'bot-5',
    name: 'EnderScout_01',
    serverId: 'server-2',
    status: 'warning',
    health: 7, // Low health! Requiring attention
    maxHealth: 20,
    hunger: 12,
    saturation: 4,
    armor: 18,
    position: { x: 54.1, y: 74.0, z: -12.8, yaw: 310.0, pitch: 15.0, dimension: 'nether' },
    ping: 89,
    activity: 'Retreating',
    target: {
      id: 'target-blaze-1',
      name: 'Blaze Spawner Guard',
      type: 'witch',
      distance: 14.2,
      health: 20,
      maxHealth: 20,
      threatLevel: 'critical',
      status: 'Retreating'
    },
    profileId: 'prof-combat',
    group: 'Exploration Bots',
    uptime: 6200,
    inventory: [
      { slot: 0, id: 'minecraft:diamond_sword', name: 'Diamond Sword', count: 1, maxCount: 1, durability: 420, maxDurability: 1561, enchantments: [{ name: 'Bane of Arthropods', level: 4 }], category: 'weapon', rarity: 'rare' },
      { slot: 1, id: 'minecraft:shield', name: 'Charred Shield', count: 1, maxCount: 1, durability: 45, maxDurability: 336, category: 'armor', rarity: 'common' },
      { slot: 2, id: 'minecraft:golden_apple', name: 'Golden Apple', count: 1, maxCount: 64, category: 'food', rarity: 'rare' },
      { slot: 3, id: 'minecraft:ender_pearl', name: 'Ender Pearl', count: 5, maxCount: 16, category: 'misc', rarity: 'rare' },
      { slot: 4, id: 'minecraft:fire_resistance_potion', name: 'Potion of Fire Resistance (8:00)', count: 2, maxCount: 1, category: 'misc', rarity: 'uncommon' }
    ],
    equipment: {
      helmet: { slot: 36, id: 'minecraft:netherite_helmet', name: 'Netherite Helmet', count: 1, maxCount: 1, durability: 210, maxDurability: 407, category: 'armor' },
      chestplate: { slot: 37, id: 'minecraft:netherite_chestplate', name: 'Netherite Chestplate', count: 1, maxCount: 1, durability: 310, maxDurability: 592, category: 'armor' },
      leggings: { slot: 38, id: 'minecraft:netherite_leggings', name: 'Netherite Leggings', count: 1, maxCount: 1, durability: 180, maxDurability: 555, category: 'armor' },
      boots: { slot: 39, id: 'minecraft:netherite_boots', name: 'Netherite Boots', count: 1, maxCount: 1, durability: 190, maxDurability: 481, category: 'armor' },
      mainHand: { slot: 0, id: 'minecraft:diamond_sword', name: 'Diamond Sword', count: 1, maxCount: 1, category: 'weapon' },
      offHand: { slot: 40, id: 'minecraft:shield', name: 'Charred Shield', count: 1, maxCount: 1, category: 'armor' }
    },
    stats: {
      uptimeSeconds: 6200,
      timeOnlineSeconds: 6200,
      distanceTraveledBlocks: 6120,
      kills: 14,
      deaths: 2,
      damageDealt: 390,
      damageTaken: 480,
      reconnects: 1,
      tasksCompleted: 19,
      tasksFailed: 3
    },
    reliability: {
      autoReconnect: true,
      initialDelayMs: 3000,
      backoffMultiplier: 2.0,
      maxDelayMs: 45000,
      maxAttempts: 5,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: Date.now() - 950,
      lastKickReason: null,
      healthState: 'warning',
      uptimePercentage: 94.2
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 1.1,
      stepHeight: 0.6,
      sprint: true,
      autoWalk: false,
      autoSprint: true,
      autoJump: true,
      noFall: false,
      movementSpeed: 4.8,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: true, avoidLava: true, avoidWater: false, canDig: false, heuristicWeight: 1.1 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: true,
      targetDetection: 'hostile_only',
      targetFiltering: ['blaze', 'wither_skeleton', 'ghast'],
      autoAttack: true,
      autoTarget: true,
      targetPriority: 'highest_threat',
      attackRange: 3.5,
      attackDelayMs: 600,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: true,
      criticalHits: true,
      friendlyWhitelist: [],
      healthThresholdPercent: 40,
      distanceLimit: 20,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: true,
      hungerThreshold: 14,
      foodPriority: ['Golden Apple'],
      avoidBadFood: true,
      autoHeal: true,
      healThreshold: 12,
      healMethod: 'golden_apple',
      autoArmor: true,
      autoWeaponSelect: true,
      autoItemReplace: true,
      emergencyRetreat: {
        enabled: true,
        healthThreshold: 40,
        defensiveItem: 'minecraft:shield',
        safeWaypointId: 'wp-nether-portal',
        recoveryHealthThreshold: 80,
        resumePreviousTask: true
      },
      inventoryCleanup: false,
      itemSorting: true
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'alert_pause',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Idle' }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: false,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    }
  },
  {
    id: 'bot-6',
    name: 'ProxyProbe_Offline',
    serverId: 'server-3',
    status: 'disconnected',
    health: 20,
    maxHealth: 20,
    hunger: 20,
    saturation: 20,
    armor: 0,
    position: { x: 0.0, y: 64.0, z: 0.0, yaw: 0, pitch: 0, dimension: 'overworld' },
    ping: 0,
    activity: 'Idle',
    target: null,
    profileId: 'prof-afk',
    group: 'Testing Bots',
    uptime: 0,
    inventory: [],
    equipment: { helmet: null, chestplate: null, leggings: null, boots: null, mainHand: null, offHand: null },
    stats: { uptimeSeconds: 0, timeOnlineSeconds: 1200, distanceTraveledBlocks: 0, kills: 0, deaths: 0, damageDealt: 0, damageTaken: 0, reconnects: 0, tasksCompleted: 0, tasksFailed: 0 },
    reliability: {
      autoReconnect: false,
      initialDelayMs: 5000,
      backoffMultiplier: 1.5,
      maxDelayMs: 30000,
      maxAttempts: 3,
      currentAttempts: 0,
      heartbeatIntervalMs: 2000,
      lastHeartbeat: 0,
      lastKickReason: 'Manual disconnect by operator',
      healthState: 'disconnected',
      uptimePercentage: 0
    },
    movement: {
      fly: false,
      highJump: false,
      speedMultiplier: 1.0,
      stepHeight: 0.6,
      sprint: false,
      autoWalk: false,
      autoSprint: false,
      autoJump: false,
      noFall: false,
      movementSpeed: 4.3,
      jumpHeight: 1.25,
      verticalControl: 'none',
      pathfinding: { allowParkour: true, avoidLava: true, avoidWater: false, canDig: true, heuristicWeight: 1.0 },
      isRecording: false,
      recordedPath: [],
      playbackActive: false
    },
    combat: {
      enabled: false,
      targetDetection: 'hostile_only',
      targetFiltering: [],
      autoAttack: false,
      autoTarget: false,
      targetPriority: 'closest',
      attackRange: 3.0,
      attackDelayMs: 600,
      rotationBehavior: 'smooth',
      weaponSelection: 'best_sword',
      shieldHandling: false,
      criticalHits: false,
      friendlyWhitelist: [],
      healthThresholdPercent: 30,
      distanceLimit: 10,
      safetyBoundaryEnabled: true,
      antiCheatCompliance: true
    },
    survival: {
      autoFood: false,
      hungerThreshold: 14,
      foodPriority: [],
      avoidBadFood: true,
      autoHeal: false,
      healThreshold: 10,
      healMethod: 'rest',
      autoArmor: false,
      autoWeaponSelect: false,
      autoItemReplace: false,
      emergencyRetreat: { enabled: false, healthThreshold: 30, defensiveItem: '', safeWaypointId: '', recoveryHealthThreshold: 80, resumePreviousTask: false },
      inventoryCleanup: false,
      itemSorting: false
    },
    mining: {
      enabled: false,
      targetBlocks: [],
      whitelist: [],
      blacklist: [],
      miningRange: 3,
      toolPreference: 'auto',
      fortunePriority: false,
      durabilityWarningPercent: 10,
      autoToolReplace: false,
      inventoryFullAction: 'alert_pause',
      storageWaypointId: '',
      pattern: 'strip',
      branchSpacing: 3,
      targetYLevel: 64,
      torchInterval: 8,
      stats: { blocksMined: 0, timeMiningSeconds: 0, itemsCollected: [], toolsConsumed: 0, currentObjective: 'Disconnected' }
    },
    farming: {
      enabled: false,
      cropTypes: [],
      matureOnly: true,
      replantImmediately: false,
      seedManagement: false,
      routePattern: 'grid',
      storageWaypointId: '',
      autoToolSelect: false,
      stats: { cropsHarvested: 0, replantRate: 0, yieldPerHour: 0, timeActiveSeconds: 0, storageUsage: 0 }
    }
  }
];

export const CAPABILITY_CATALOG: CapabilityItem[] = [
  {
    id: 'cap-pathfinding',
    category: 'Movement',
    name: 'A* Terrain Pathfinding',
    status: 'supported',
    explanation: 'Fully supported client-side navigation using block collision maps and vanilla player movement packets.',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-sprint-jump',
    category: 'Movement',
    name: 'Vanilla Sprint-Jumping',
    status: 'supported',
    explanation: 'Legitimate player movement physics matching vanilla client tolerances.',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-flight',
    category: 'Movement',
    name: 'Client Flight / Glide Packet Bypass',
    status: 'warning',
    explanation: 'Requires server operator permission (`/fly`) or `allow-flight=true` in server.properties. Will trigger anti-cheat kicks on standard survival.',
    requiredPermissionOrMod: 'allow-flight=true OR essentials.fly',
    antiCheatRisk: 'high'
  },
  {
    id: 'cap-high-jump',
    category: 'Movement',
    name: 'High Jump / Velocity Spoof',
    status: 'unsupported',
    explanation: 'Strictly prohibited on servers running GrimAC, Vulcan, or NoCheatPlus. Will result in instantaneous packet rollback or auto-ban.',
    requiredPermissionOrMod: 'Disabled on Anarchy / SMP',
    antiCheatRisk: 'high'
  },
  {
    id: 'cap-step-assist',
    category: 'Movement',
    name: 'Step Height Assist (>0.6b)',
    status: 'warning',
    explanation: 'Requires client-side mod packet manipulation or server bypass permission node.',
    requiredPermissionOrMod: 'Fabric mod or bypass node',
    antiCheatRisk: 'medium'
  },
  {
    id: 'cap-teleport',
    category: 'Movement',
    name: 'Instant Waypoint Teleportation',
    status: 'warning',
    explanation: 'Requires `/tp` or `/teleport` command permission from server operator.',
    requiredPermissionOrMod: 'minecraft.command.teleport (Op Level 2)',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-auto-attack',
    category: 'Combat',
    name: 'Legit 1.9 Cooldown Combat',
    status: 'supported',
    explanation: 'Calculates weapon cooldown intervals precisely and respects raycast entity bounding boxes.',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-aimbot-smooth',
    category: 'Combat',
    name: 'Smooth Rotational Aiming',
    status: 'supported',
    explanation: 'Interpolates yaw and pitch angles over time to simulate mouse movement and evade rotational heuristics.',
    antiCheatRisk: 'low'
  },
  {
    id: 'cap-reach-extended',
    category: 'Combat',
    name: 'Extended Reach (>3.0 blocks)',
    status: 'unsupported',
    explanation: 'Server side distance enforcement strictly limits player interaction to 3.0 blocks in survival mode.',
    requiredPermissionOrMod: 'Creative Mode or Custom Server Mod',
    antiCheatRisk: 'high'
  },
  {
    id: 'cap-ghost-hand',
    category: 'Interaction',
    name: 'Ghost Hand (Interact Through Solid Walls)',
    status: 'unsupported',
    explanation: 'Server raycasts block line-of-sight on all interaction packets. Blocked by modern paper servers.',
    requiredPermissionOrMod: 'Special server plugin / creative',
    antiCheatRisk: 'high'
  },
  {
    id: 'cap-container-management',
    category: 'Interaction',
    name: 'Chest / Container Open & Quick Deposit',
    status: 'supported',
    explanation: 'Standard inventory window packet clicks conforming to vanilla window latency.',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-auto-replant',
    category: 'World',
    name: 'Crop Harvest & Instant Replant',
    status: 'supported',
    explanation: 'Detects block state `age=7` and sends right-click block interaction with seeds.',
    antiCheatRisk: 'none'
  },
  {
    id: 'cap-vein-miner',
    category: 'World',
    name: 'Fast Block Breaking (Vein Miner)',
    status: 'warning',
    explanation: 'Vanilla mining speed is limited by tool hardness and haste status effect. Instant break requires server mod.',
    requiredPermissionOrMod: 'VeinMiner / OreExcavator mod installed on server',
    antiCheatRisk: 'medium'
  }
];

export const INITIAL_USER_ROLES: UserRoleDefinition[] = [
  {
    id: 'Admin',
    label: 'System Administrator',
    permissions: {
      manageBots: true,
      manageServers: true,
      combatControls: true,
      automationEditing: true,
      executeCommands: true,
      viewDebugLogs: true,
      modifySettings: true
    }
  },
  {
    id: 'Operator',
    label: 'Server Operator',
    permissions: {
      manageBots: true,
      manageServers: false,
      combatControls: true,
      automationEditing: true,
      executeCommands: true,
      viewDebugLogs: false,
      modifySettings: false
    }
  },
  {
    id: 'Viewer',
    label: 'Read-Only Viewer',
    permissions: {
      manageBots: false,
      manageServers: false,
      combatControls: false,
      automationEditing: false,
      executeCommands: false,
      viewDebugLogs: false,
      modifySettings: false
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1',
    user: 'Alex (Admin)',
    role: 'Admin',
    action: 'START_BOT',
    target: 'QuarryMaster_X',
    timestamp: Date.now() - 3600000 * 3,
    previousValue: 'Status: Disconnected',
    newValue: 'Status: Healthy (Connected to SMP Network Alpha)',
    ip: '192.168.1.10'
  },
  {
    id: 'audit-2',
    user: 'Sarah (Operator)',
    role: 'Operator',
    action: 'UPDATE_PROFILE',
    target: 'Aegis_Vanguard',
    timestamp: Date.now() - 3600000 * 2,
    previousValue: 'Attack Range: 3.2',
    newValue: 'Attack Range: 3.8 (Jump Criticals Enabled)',
    ip: '192.168.1.24'
  },
  {
    id: 'audit-3',
    user: 'Alex (Admin)',
    role: 'Admin',
    action: 'ASSIGN_PROFILE',
    target: 'FarmHand_Beta',
    timestamp: Date.now() - 3600000,
    previousValue: 'Profile: None',
    newValue: 'Profile: Botanical Harvester',
    ip: '192.168.1.10'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Health Warning',
    message: 'EnderScout_01 health is critically low (7/20 HP) in the Nether! Emergency retreat initiated.',
    severity: 'critical',
    timestamp: Date.now() - 180000,
    read: false,
    botId: 'bot-5'
  },
  {
    id: 'notif-2',
    title: 'Inventory Storage Milestone',
    message: 'QuarryMaster_X has collected 34 Diamonds and 184 Raw Iron. Storage threshold reached.',
    severity: 'info',
    timestamp: Date.now() - 900000,
    read: false,
    botId: 'bot-1'
  },
  {
    id: 'notif-3',
    title: 'Anti-AFK Verification',
    message: 'Keepalive heartbeat executed smoothly across all connected bots on SMP Network Alpha.',
    severity: 'success',
    timestamp: Date.now() - 2400000,
    read: true
  }
];

export const INITIAL_CHAT_TRIGGERS: ChatTrigger[] = [
  {
    id: 'trig-chat-1',
    pattern: 'Restarting in (.*) seconds',
    isRegex: true,
    enabled: true,
    action: 'retreat',
    actionPayload: 'wp-safe-room',
    description: 'When server announce reboot countdown, move to safe room and prepare safe disconnect'
  },
  {
    id: 'trig-chat-2',
    pattern: '!status',
    isRegex: false,
    enabled: true,
    action: 'reply',
    actionPayload: 'MineControl Bot active | Health: {hp} | Mining Diamonds',
    description: 'Respond with status when authorized player asks !status in chat'
  },
  {
    id: 'trig-chat-3',
    pattern: 'You are being attacked by (.*)',
    isRegex: true,
    enabled: true,
    action: 'trigger_rule',
    actionPayload: 'rule-emergency-retreat',
    description: 'Trigger emergency defensive combat procedure on ambush'
  }
];
