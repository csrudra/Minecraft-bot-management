export type Dimension = 'overworld' | 'nether' | 'the_end';

export type BotStatus = 'healthy' | 'warning' | 'disconnected' | 'error' | 'recovering';

export type BotActivity = 
  | 'Idle' 
  | 'Mining' 
  | 'Combat' 
  | 'Farming' 
  | 'Patrolling' 
  | 'Eating' 
  | 'Retreating' 
  | 'Navigating'
  | 'Sorting Inventory'
  | 'Reconnecting';

export interface Position3D {
  x: number;
  y: number;
  z: number;
  yaw?: number;
  pitch?: number;
  dimension: Dimension;
}

export interface InventoryItem {
  slot: number; // 0-35 (hotbar 0-8, main 9-35), 36-39 armor, 40 offhand
  id: string; // e.g. 'minecraft:diamond_pickaxe'
  name: string;
  count: number;
  maxCount: number;
  durability?: number;
  maxDurability?: number;
  enchantments?: { name: string; level: number }[];
  category: 'tool' | 'weapon' | 'armor' | 'food' | 'block' | 'resource' | 'misc';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic';
}

export interface Equipment {
  helmet: InventoryItem | null;
  chestplate: InventoryItem | null;
  leggings: InventoryItem | null;
  boots: InventoryItem | null;
  mainHand: InventoryItem | null;
  offHand: InventoryItem | null;
}

export interface CombatTarget {
  id: string;
  name: string;
  type: 'zombie' | 'skeleton' | 'creeper' | 'spider' | 'enderman' | 'witch' | 'player' | 'cow' | 'pig';
  distance: number;
  health: number;
  maxHealth: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'In Range' | 'Targeted' | 'Engaging' | 'Retreating';
  isPlayer?: boolean;
}

export interface MiningStats {
  blocksMined: number;
  timeMiningSeconds: number;
  itemsCollected: { name: string; count: number }[];
  toolsConsumed: number;
  currentObjective: string;
}

export interface FarmingStats {
  cropsHarvested: number;
  replantRate: number;
  yieldPerHour: number;
  timeActiveSeconds: number;
  storageUsage: number;
}

export interface BotStats {
  uptimeSeconds: number;
  timeOnlineSeconds: number;
  distanceTraveledBlocks: number;
  kills: number;
  deaths: number;
  damageDealt: number;
  damageTaken: number;
  reconnects: number;
  tasksCompleted: number;
  tasksFailed: number;
}

export interface BotReliability {
  autoReconnect: boolean;
  initialDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
  maxAttempts: number;
  currentAttempts: number;
  heartbeatIntervalMs: number;
  lastHeartbeat: number;
  lastKickReason: string | null;
  healthState: BotStatus;
  uptimePercentage: number;
}

export interface MovementSettings {
  fly: boolean;
  highJump: boolean;
  speedMultiplier: number;
  stepHeight: number;
  sprint: boolean;
  autoWalk: boolean;
  autoSprint: boolean;
  autoJump: boolean;
  noFall: boolean;
  movementSpeed: number; // blocks/sec
  jumpHeight: number; // blocks
  verticalControl: 'none' | 'ascend' | 'descend' | 'hover';
  pathfinding: {
    allowParkour: boolean;
    avoidLava: boolean;
    avoidWater: boolean;
    canDig: boolean;
    heuristicWeight: number;
  };
  isRecording: boolean;
  recordedPath: Position3D[];
  playbackActive: boolean;
}

export interface CombatSettings {
  enabled: boolean;
  targetDetection: 'all_mobs' | 'hostile_only' | 'passive_only' | 'players' | 'custom';
  targetFiltering: string[];
  autoAttack: boolean;
  autoTarget: boolean;
  targetPriority: 'closest' | 'lowest_health' | 'highest_threat' | 'players_first';
  attackRange: number; // 1.0 - 6.0
  attackDelayMs: number; // 200 - 1500 (1.9 combat cooldown)
  rotationBehavior: 'instant' | 'smooth' | 'legit_curve';
  weaponSelection: 'best_sword' | 'best_axe' | 'trident' | 'bow_ranged';
  shieldHandling: boolean;
  criticalHits: boolean;
  friendlyWhitelist: string[];
  healthThresholdPercent: number; // Retreat if below this
  distanceLimit: number;
  safetyBoundaryEnabled: boolean;
  antiCheatCompliance: boolean;
}

export interface SurvivalSettings {
  autoFood: boolean;
  hungerThreshold: number; // 0-20
  foodPriority: string[];
  avoidBadFood: boolean;
  autoHeal: boolean;
  healThreshold: number; // 0-20
  healMethod: 'splash_potion' | 'golden_apple' | 'totem' | 'rest';
  autoArmor: boolean;
  autoWeaponSelect: boolean;
  autoItemReplace: boolean;
  emergencyRetreat: {
    enabled: boolean;
    healthThreshold: number; // percent
    defensiveItem: string;
    safeWaypointId: string;
    recoveryHealthThreshold: number; // percent
    resumePreviousTask: boolean;
  };
  inventoryCleanup: boolean;
  itemSorting: boolean;
}

export interface MiningSettings {
  enabled: boolean;
  targetBlocks: string[];
  whitelist: string[];
  blacklist: string[];
  miningRange: number;
  toolPreference: 'netherite' | 'diamond' | 'iron' | 'auto';
  fortunePriority: boolean;
  durabilityWarningPercent: number;
  autoToolReplace: boolean;
  inventoryFullAction: 'drop_trash' | 'return_to_storage' | 'alert_pause';
  storageWaypointId: string;
  pattern: 'strip' | 'quarry' | 'vein' | 'staircase';
  branchSpacing: number;
  targetYLevel: number;
  torchInterval: number;
  stats: MiningStats;
}

export interface FarmingSettings {
  enabled: boolean;
  cropTypes: string[];
  matureOnly: boolean;
  replantImmediately: boolean;
  seedManagement: boolean;
  routePattern: 'grid' | 'perimeter' | 'spiral';
  storageWaypointId: string;
  autoToolSelect: boolean;
  stats: FarmingStats;
}

export interface Bot {
  id: string;
  name: string;
  serverId: string;
  status: BotStatus;
  health: number; // 0 - 20
  maxHealth: number;
  hunger: number; // 0 - 20
  saturation: number;
  armor: number; // 0 - 20
  position: Position3D;
  ping: number; // ms
  activity: BotActivity;
  target: CombatTarget | null;
  profileId: string;
  group: string;
  uptime: number; // seconds
  skinUrl?: string;
  inventory: InventoryItem[];
  equipment: Equipment;
  stats: BotStats;
  reliability: BotReliability;
  movement: MovementSettings;
  combat: CombatSettings;
  survival: SurvivalSettings;
  mining: MiningSettings;
  farming: FarmingSettings;
  activeAutomationRuleId?: string;
  selected?: boolean;
}

export interface Server {
  id: string;
  name: string;
  address: string;
  port: number;
  version: string;
  authType: 'microsoft' | 'offline' | 'custom_token';
  defaultUsername: string;
  timeoutMs: number;
  reconnectDelaySec: number;
  maxReconnectAttempts: number;
  proxy: {
    enabled: boolean;
    type: 'socks5' | 'http';
    host: string;
    port: number;
    auth?: { username: string; password: string };
  };
  status: 'online' | 'offline' | 'unreachable';
  latency: number;
  playerCount: { online: number; max: number };
  motd: string;
  software: string; // Paper, Spigot, Fabric, Vanilla, Purpur
  connectionHistory: {
    timestamp: number;
    status: 'connected' | 'disconnected' | 'kick' | 'timeout';
    detail: string;
  }[];
  errors: string[];
  lastConnectedAt: number;
}

export interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  dimension: Dimension;
  color: string;
  icon: string;
  notes?: string;
}

export interface Route {
  id: string;
  name: string;
  waypointIds: string[];
  mode: 'loop' | 'ping-pong' | 'one-way';
  active: boolean;
}

export interface AutomationTrigger {
  id: string;
  type: 'health_below' | 'hunger_below' | 'inventory_full' | 'tool_durability' | 'mob_in_range' | 'player_in_range' | 'server_message' | 'timer_interval';
  threshold?: number;
  entityType?: string;
  messagePattern?: string;
  intervalSeconds?: number;
}

export interface AutomationCondition {
  id: string;
  type: 'has_item' | 'in_dimension' | 'is_online' | 'health_above' | 'inventory_has_space';
  value: string | number;
}

export interface AutomationAction {
  id: string;
  type: 'stop_task' | 'equip_item' | 'move_to_waypoint' | 'wait_delay' | 'chat_command' | 'attack_target' | 'drop_item' | 'resume_previous_task' | 'wait_until_health';
  targetItem?: string;
  waypointId?: string;
  delayMs?: number;
  command?: string;
  healthTarget?: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  onFail?: string;
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  group: string;
  movement: Partial<MovementSettings>;
  combat: Partial<CombatSettings>;
  survival: Partial<SurvivalSettings>;
  mining: Partial<MiningSettings>;
  farming: Partial<FarmingSettings>;
  automationRuleIds: string[];
  customTags: string[];
}

export interface ConsoleLog {
  id: string;
  botId: string;
  botName: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'combat' | 'chat' | 'task' | 'packet';
  message: string;
  rawPayload?: any;
}

export interface ChatMessage {
  id: string;
  botId: string;
  botName: string;
  sender: string;
  channel: 'global' | 'whisper' | 'system' | 'server';
  message: string;
  timestamp: number;
  rank?: string;
}

export interface ChatTrigger {
  id: string;
  pattern: string;
  isRegex: boolean;
  enabled: boolean;
  action: 'reply' | 'run_command' | 'trigger_rule' | 'retreat';
  actionPayload: string;
  description: string;
}

export interface CapabilityItem {
  id: string;
  category: 'Movement' | 'Combat' | 'Interaction' | 'World' | 'Server';
  name: string;
  status: 'supported' | 'warning' | 'unsupported';
  explanation: string;
  requiredPermissionOrMod?: string;
  antiCheatRisk?: 'none' | 'low' | 'medium' | 'high';
}

export interface UserRoleDefinition {
  id: 'Admin' | 'Operator' | 'Viewer' | 'Custom';
  label: string;
  permissions: {
    manageBots: boolean;
    manageServers: boolean;
    combatControls: boolean;
    automationEditing: boolean;
    executeCommands: boolean;
    viewDebugLogs: boolean;
    modifySettings: boolean;
  };
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: number;
  previousValue?: string;
  newValue?: string;
  ip: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: number;
  read: boolean;
  botId?: string;
  actionUrl?: string;
}

export interface NetworkPacket {
  id: string;
  direction: 'inbound' | 'outbound';
  packetName: string;
  channel: string;
  sizeBytes: number;
  timestamp: number;
  payloadSummary: string;
  fullPayload: any;
}
