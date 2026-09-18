import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  ChatMessage,
  ChatTrigger,
  ConsoleLog,
  NetworkPacket,
  UserRoleDefinition,
  MovementSettings,
  CombatSettings,
  SurvivalSettings,
  MiningSettings,
  FarmingSettings,
  BotReliability,
  InventoryItem,
  Position3D,
} from '../types';
import {
  INITIAL_BOTS,
  INITIAL_SERVERS,
  INITIAL_WAYPOINTS,
  INITIAL_ROUTES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_PROFILES,
  CAPABILITY_CATALOG,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_TRIGGERS,
  INITIAL_USER_ROLES,
} from '../data/mockData';
import { sound } from '../utils/audio';
import { loadPersisted, savePersisted } from '../utils/storage';

interface BotContextType {
  bots: Bot[];
  servers: Server[];
  waypoints: Waypoint[];
  routes: Route[];
  profiles: Profile[];
  automationRules: AutomationRule[];
  capabilities: CapabilityItem[];
  auditLogs: AuditLogItem[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  chatTriggers: ChatTrigger[];
  consoleLogs: ConsoleLog[];
  networkPackets: NetworkPacket[];
  selectedBotId: string;
  selectedBot: Bot | null;
  multiSelectedBotIds: string[];
  currentUserRole: UserRoleDefinition;
  allUserRoles: UserRoleDefinition[];
  activeView: string;
  isDevMode: boolean;
  soundEnabled: boolean;
  isSimulating: boolean;

  // Actions
  setActiveView: (view: string) => void;
  setSelectedBotId: (id: string) => void;
  toggleMultiSelectBot: (id: string) => void;
  selectAllBots: () => void;
  clearMultiSelect: () => void;
  toggleDevMode: () => void;
  toggleSound: () => void;
  toggleSimulation: () => void;
  setCurrentUserRole: (roleId: 'Admin' | 'Operator' | 'Viewer' | 'Custom') => void;

  // Bot Lifecycle
  addBot: (botData: Partial<Bot>) => void;
  removeBot: (botId: string) => void;
  connectBot: (botId: string) => void;
  disconnectBot: (botId: string) => void;
  reconnectBot: (botId: string) => void;
  restartBot: (botId: string) => void;
  pauseBot: (botId: string) => void;
  resumeBot: (botId: string) => void;
  renameBot: (botId: string, newName: string) => void;
  duplicateBot: (botId: string) => void;
  bulkConnectBots: (botIds: string[]) => void;
  bulkDisconnectBots: (botIds: string[]) => void;
  bulkSetGroup: (botIds: string[], groupName: string) => void;
  bulkSetProfile: (botIds: string[], profileId: string) => void;
  emergencyStopAll: () => void;
  importBots: (jsonStr: string) => boolean;
  exportBots: () => string;

  // Bot Subsystem updates
  updateBot: (botId: string, updates: Partial<Bot>) => void;
  updateBotMovement: (botId: string, updates: Partial<MovementSettings>) => void;
  updateBotCombat: (botId: string, updates: Partial<CombatSettings>) => void;
  updateBotSurvival: (botId: string, updates: Partial<SurvivalSettings>) => void;
  updateBotMining: (botId: string, updates: Partial<MiningSettings>) => void;
  updateBotFarming: (botId: string, updates: Partial<FarmingSettings>) => void;
  updateBotReliability: (botId: string, updates: Partial<BotReliability>) => void;
  botInventoryAction: (botId: string, action: 'drop' | 'equip' | 'sort' | 'trash' | 'deposit' | 'withdraw', slot?: number) => void;

  // Servers
  addServer: (serverData: Partial<Server>) => void;
  updateServer: (serverId: string, updates: Partial<Server>) => void;
  removeServer: (serverId: string) => void;
  testServerPing: (serverId: string) => void;
  runServerCapabilityScan: (serverId: string) => void;

  // Waypoints & Navigation
  addWaypoint: (wp: Omit<Waypoint, 'id'>) => void;
  updateWaypoint: (id: string, updates: Partial<Waypoint>) => void;
  removeWaypoint: (id: string) => void;
  navigateBotToWaypoint: (botId: string, waypointId: string) => void;
  teleportBotToWaypoint: (botId: string, waypointId: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  toggleRoute: (routeId: string) => void;
  removeRoute: (routeId: string) => void;

  // Profiles & Automation Rules
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  cloneProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  assignProfileToBot: (botId: string, profileId: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  toggleAutomationRule: (id: string) => void;
  removeAutomationRule: (id: string) => void;
  testTriggerRule: (ruleId: string, botId: string) => void;

  // Console & Chat
  sendChatMessage: (message: string, botId?: string, isBroadcast?: boolean) => void;
  executeTerminalCommand: (command: string, botId?: string) => void;
  clearConsoleLogs: (botId?: string) => void;
  exportConsoleLogs: () => string;
  addChatTrigger: (trigger: Omit<ChatTrigger, 'id'>) => void;
  toggleChatTrigger: (id: string) => void;
  removeChatTrigger: (id: string) => void;

  // Notifications & Audit
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Simulation Triggers for Live Testing
  simulateEvent: (type: 'ambush' | 'diamond_found' | 'server_kick' | 'crop_harvest') => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary State
  // NOTE: reads are routed through utils/storage so that unavailable or
  // corrupted localStorage (sandboxed iframes, private mode, stale saves)
  // can never crash the initial render. Saved values are also re-hydrated
  // against the default shape, so data written by an older build is upgraded
  // instead of blowing up on a missing nested field.
  const [bots, setBots] = useState<Bot[]>(() => loadPersisted('minecontrol_bots', INITIAL_BOTS));

  const [servers, setServers] = useState<Server[]>(() => loadPersisted('minecontrol_servers', INITIAL_SERVERS));

  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => loadPersisted('minecontrol_waypoints', INITIAL_WAYPOINTS));

  const [routes, setRoutes] = useState<Route[]>(() => loadPersisted('minecontrol_routes', INITIAL_ROUTES));

  const [profiles, setProfiles] = useState<Profile[]>(() => loadPersisted('minecontrol_profiles', INITIAL_PROFILES));

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() =>
    loadPersisted('minecontrol_rules', INITIAL_AUTOMATION_RULES)
  );

  const [capabilities] = useState<CapabilityItem[]>(CAPABILITY_CATALOG);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [chatTriggers, setChatTriggers] = useState<ChatTrigger[]>(INITIAL_CHAT_TRIGGERS);

  // Active UI states
  const [selectedBotId, setSelectedBotId] = useState<string>('bot-1');
  const [multiSelectedBotIds, setMultiSelectedBotIds] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRoleDefinition>(INITIAL_USER_ROLES[0]);

  // Real-time streams
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    {
      id: 'log-1',
      botId: 'bot-1',
      botName: 'QuarryMaster_X',
      timestamp: Date.now() - 45000,
      level: 'info',
      message: 'Chunk [-9, 24] cached. Surface raycast clear.'
    },
    {
      id: 'log-2',
      botId: 'bot-1',
      botName: 'QuarryMaster_X',
      timestamp: Date.now() - 30000,
      level: 'task',
      message: 'Mined block minecraft:deepslate_diamond_ore at (142, -58, -388). Yield: 3x Diamond (Fortune III).'
    },
    {
      id: 'log-3',
      botId: 'bot-2',
      botName: 'Aegis_Vanguard',
      timestamp: Date.now() - 15000,
      level: 'combat',
      message: 'Target acquired: Skeleton [HP: 14/20, Dist: 6.4b]. Shield raised, strafing left.'
    },
    {
      id: 'log-4',
      botId: 'bot-5',
      botName: 'EnderScout_01',
      timestamp: Date.now() - 5000,
      level: 'warn',
      message: 'Health below threshold (7/20 HP). Rule "Emergency Low Health Retreat" triggered!'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-1',
      botId: 'bot-1',
      botName: 'QuarryMaster_X',
      sender: 'Server',
      channel: 'server',
      message: '§6[Server] Welcome to SMP Network Alpha. Keep builds 100 blocks from spawn.',
      timestamp: Date.now() - 120000,
      rank: 'Server'
    },
    {
      id: 'chat-2',
      botId: 'bot-1',
      botName: 'QuarryMaster_X',
      sender: 'Krypton88',
      channel: 'global',
      message: 'Anyone have spare mending books near the portal hub?',
      timestamp: Date.now() - 80000,
      rank: 'VIP'
    },
    {
      id: 'chat-3',
      botId: 'bot-2',
      botName: 'Aegis_Vanguard',
      sender: 'MineCommander',
      channel: 'global',
      message: 'Defensive perimeter holding at North Outpost.',
      timestamp: Date.now() - 40000,
      rank: 'Admin'
    }
  ]);

  const [networkPackets, setNetworkPackets] = useState<NetworkPacket[]>([
    {
      id: 'pkt-1',
      direction: 'inbound',
      packetName: 'clientbound/minecraft:player_position',
      channel: 'gameplay',
      sizeBytes: 38,
      timestamp: Date.now() - 4000,
      payloadSummary: 'X: 142.4, Y: -58.0, Z: -388.2, OnGround: true',
      fullPayload: { x: 142.4, y: -58.0, z: -388.2, yaw: 182.5, pitch: 12.0, flags: 0, teleportId: 1042 }
    },
    {
      id: 'pkt-2',
      direction: 'outbound',
      packetName: 'serverbound/minecraft:player_action',
      channel: 'interaction',
      sizeBytes: 16,
      timestamp: Date.now() - 3200,
      payloadSummary: 'Action: START_DESTROY_BLOCK at (142, -58, -388)',
      fullPayload: { action: 'START_DESTROY_BLOCK', location: { x: 142, y: -58, z: -388 }, direction: 'UP', sequence: 489 }
    },
    {
      id: 'pkt-3',
      direction: 'inbound',
      packetName: 'clientbound/minecraft:keep_alive',
      channel: 'network',
      sizeBytes: 8,
      timestamp: Date.now() - 1500,
      payloadSummary: 'KeepAliveId: 0x7FA291B84',
      fullPayload: { keepAliveId: '0x7FA291B84' }
    }
  ]);

  // Sync to localStorage (never throws, silently degrades to in-memory)
  useEffect(() => {
    savePersisted('minecontrol_bots', bots);
  }, [bots]);

  useEffect(() => {
    savePersisted('minecontrol_servers', servers);
  }, [servers]);

  useEffect(() => {
    savePersisted('minecontrol_waypoints', waypoints);
  }, [waypoints]);

  useEffect(() => {
    savePersisted('minecontrol_routes', routes);
  }, [routes]);

  useEffect(() => {
    savePersisted('minecontrol_profiles', profiles);
  }, [profiles]);

  useEffect(() => {
    savePersisted('minecontrol_rules', automationRules);
  }, [automationRules]);

  // Audit logging helper
  const addAuditLog = useCallback((action: string, target: string, prev?: string, next?: string) => {
    const newLog: AuditLogItem = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      user: `${currentUserRole.label} User`,
      role: currentUserRole.id,
      action,
      target,
      timestamp: Date.now(),
      previousValue: prev,
      newValue: next,
      ip: '127.0.0.1'
    };
    setAuditLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]);
  }, [currentUserRole]);

  // Add Notification
  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
    if (notif.severity === 'critical') {
      sound.playAlarm();
    } else if (notif.severity === 'warning') {
      sound.playWarning();
    } else {
      sound.playSuccess();
    }
  }, []);

  // Set sound enabled
  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  }, [soundEnabled]);

  const toggleDevMode = useCallback(() => {
    setIsDevMode(prev => !prev);
    sound.playClick();
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
    sound.playClick();
  }, []);

  const setCurrentUserRole = useCallback((roleId: 'Admin' | 'Operator' | 'Viewer' | 'Custom') => {
    const role = INITIAL_USER_ROLES.find(r => r.id === roleId) || INITIAL_USER_ROLES[0];
    setCurrentUserRoleState(role);
    sound.playClick();
    addAuditLog('CHANGE_ROLE', role.label);
  }, [addAuditLog]);

  // Multi select helpers
  const toggleMultiSelectBot = useCallback((id: string) => {
    sound.playClick();
    setMultiSelectedBotIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  }, []);

  const selectAllBots = useCallback(() => {
    sound.playClick();
    setMultiSelectedBotIds(bots.map(b => b.id));
  }, [bots]);

  const clearMultiSelect = useCallback(() => {
    setMultiSelectedBotIds([]);
  }, []);

  // Update bot directly
  const updateBot = useCallback((botId: string, updates: Partial<Bot>) => {
    setBots(prev => prev.map(b => b.id === botId ? { ...b, ...updates } : b));
  }, []);

  // Update subsystems
  const updateBotMovement = useCallback((botId: string, updates: Partial<MovementSettings>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, movement: { ...b.movement, ...updates } };
    }));
    sound.playClick();
    addAuditLog('UPDATE_MOVEMENT', `Bot ${botId}`);
  }, [addAuditLog]);

  const updateBotCombat = useCallback((botId: string, updates: Partial<CombatSettings>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, combat: { ...b.combat, ...updates } };
    }));
    sound.playClick();
    addAuditLog('UPDATE_COMBAT', `Bot ${botId}`);
  }, [addAuditLog]);

  const updateBotSurvival = useCallback((botId: string, updates: Partial<SurvivalSettings>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, survival: { ...b.survival, ...updates } };
    }));
    sound.playClick();
    addAuditLog('UPDATE_SURVIVAL', `Bot ${botId}`);
  }, [addAuditLog]);

  const updateBotMining = useCallback((botId: string, updates: Partial<MiningSettings>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, mining: { ...b.mining, ...updates } };
    }));
    sound.playClick();
    addAuditLog('UPDATE_MINING', `Bot ${botId}`);
  }, [addAuditLog]);

  const updateBotFarming = useCallback((botId: string, updates: Partial<FarmingSettings>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, farming: { ...b.farming, ...updates } };
    }));
    sound.playClick();
    addAuditLog('UPDATE_FARMING', `Bot ${botId}`);
  }, [addAuditLog]);

  const updateBotReliability = useCallback((botId: string, updates: Partial<BotReliability>) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, reliability: { ...b.reliability, ...updates } };
    }));
    sound.playClick();
  }, []);

  // Bot Lifecycle actions
  const connectBot = useCallback((botId: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        status: 'healthy',
        ping: Math.floor(20 + Math.random() * 25),
        reliability: { ...b.reliability, healthState: 'healthy', currentAttempts: 0 }
      };
    }));
    sound.playSuccess();
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      addAuditLog('CONNECT_BOT', bot.name, 'disconnected', 'healthy');
      addNotification({
        title: 'Bot Connected',
        message: `${bot.name} connected successfully to server.`,
        severity: 'success',
        botId
      });
    }
  }, [bots, addAuditLog, addNotification]);

  const disconnectBot = useCallback((botId: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        status: 'disconnected',
        ping: 0,
        activity: 'Idle',
        target: null,
        reliability: { ...b.reliability, healthState: 'disconnected', lastKickReason: 'Manual operator disconnect' }
      };
    }));
    sound.playClick();
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      addAuditLog('DISCONNECT_BOT', bot.name, bot.status, 'disconnected');
      addNotification({
        title: 'Bot Disconnected',
        message: `${bot.name} disconnected by user.`,
        severity: 'info',
        botId
      });
    }
  }, [bots, addAuditLog, addNotification]);

  const reconnectBot = useCallback((botId: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        status: 'recovering',
        activity: 'Reconnecting',
        reliability: { ...b.reliability, healthState: 'recovering', currentAttempts: b.reliability.currentAttempts + 1 }
      };
    }));
    sound.playClick();

    setTimeout(() => {
      setBots(prev => prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          status: 'healthy',
          ping: Math.floor(22 + Math.random() * 15),
          activity: 'Idle',
          reliability: { ...b.reliability, healthState: 'healthy', currentAttempts: 0 }
        };
      }));
      sound.playSuccess();
    }, 1500);
  }, []);

  const restartBot = useCallback((botId: string) => {
    disconnectBot(botId);
    setTimeout(() => {
      connectBot(botId);
    }, 1200);
  }, [disconnectBot, connectBot]);

  const pauseBot = useCallback((botId: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return { ...b, activity: 'Idle', target: null };
    }));
    sound.playClick();
  }, []);

  const resumeBot = useCallback((botId: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      const act = b.group.includes('Mining') ? 'Mining' : b.group.includes('Combat') ? 'Combat' : b.group.includes('Farming') ? 'Farming' : 'Patrolling';
      return { ...b, activity: act };
    }));
    sound.playSuccess();
  }, []);

  const renameBot = useCallback((botId: string, newName: string) => {
    setBots(prev => prev.map(b => b.id === botId ? { ...b, name: newName } : b));
    sound.playClick();
    addAuditLog('RENAME_BOT', botId, '', newName);
  }, [addAuditLog]);

  const duplicateBot = useCallback((botId: string) => {
    const existing = bots.find(b => b.id === botId);
    if (!existing) return;
    const newBot: Bot = {
      ...JSON.parse(JSON.stringify(existing)),
      id: 'bot-' + Date.now(),
      name: `${existing.name}_Clone`,
      status: 'disconnected',
      uptime: 0,
      stats: { ...existing.stats, uptimeSeconds: 0, timeOnlineSeconds: 0, kills: 0, deaths: 0 }
    };
    setBots(prev => [...prev, newBot]);
    sound.playSuccess();
    addAuditLog('DUPLICATE_BOT', newBot.name);
  }, [bots, addAuditLog]);

  const addBot = useCallback((botData: Partial<Bot>) => {
    const template = INITIAL_BOTS[0];
    const newBot: Bot = {
      ...JSON.parse(JSON.stringify(template)),
      id: 'bot-' + Date.now(),
      name: botData.name || `Bot_${Math.floor(Math.random() * 900 + 100)}`,
      serverId: botData.serverId || servers[0]?.id || 'server-1',
      group: botData.group || 'Exploration Bots',
      profileId: botData.profileId || profiles[0]?.id || 'prof-mining',
      status: 'disconnected',
      uptime: 0,
      activity: 'Idle',
      target: null,
      ...botData
    };
    setBots(prev => [...prev, newBot]);
    sound.playSuccess();
    addAuditLog('ADD_BOT', newBot.name);
    addNotification({
      title: 'Bot Created',
      message: `${newBot.name} added to ${newBot.group}.`,
      severity: 'info'
    });
  }, [servers, profiles, addAuditLog, addNotification]);

  const removeBot = useCallback((botId: string) => {
    const bot = bots.find(b => b.id === botId);
    setBots(prev => prev.filter(b => b.id !== botId));
    setMultiSelectedBotIds(prev => prev.filter(id => id !== botId));
    if (selectedBotId === botId) {
      setSelectedBotId(bots[0]?.id || '');
    }
    sound.playClick();
    if (bot) addAuditLog('REMOVE_BOT', bot.name);
  }, [bots, selectedBotId, addAuditLog]);

  // Bulk actions
  const bulkConnectBots = useCallback((botIds: string[]) => {
    setBots(prev => prev.map(b => botIds.includes(b.id) ? { ...b, status: 'healthy', ping: Math.floor(20 + Math.random() * 20) } : b));
    sound.playSuccess();
    addAuditLog('BULK_CONNECT', `${botIds.length} bots`);
  }, [addAuditLog]);

  const bulkDisconnectBots = useCallback((botIds: string[]) => {
    setBots(prev => prev.map(b => botIds.includes(b.id) ? { ...b, status: 'disconnected', ping: 0, activity: 'Idle', target: null } : b));
    sound.playClick();
    addAuditLog('BULK_DISCONNECT', `${botIds.length} bots`);
  }, [addAuditLog]);

  const bulkSetGroup = useCallback((botIds: string[], groupName: string) => {
    setBots(prev => prev.map(b => botIds.includes(b.id) ? { ...b, group: groupName } : b));
    sound.playClick();
    addAuditLog('BULK_SET_GROUP', `${botIds.length} bots -> ${groupName}`);
  }, [addAuditLog]);

  const bulkSetProfile = useCallback((botIds: string[], profileId: string) => {
    const prof = profiles.find(p => p.id === profileId);
    setBots(prev => prev.map(b => {
      if (!botIds.includes(b.id)) return b;
      return {
        ...b,
        profileId,
        movement: prof?.movement ? { ...b.movement, ...prof.movement } : b.movement,
        combat: prof?.combat ? { ...b.combat, ...prof.combat } : b.combat,
        survival: prof?.survival ? { ...b.survival, ...prof.survival } : b.survival,
        mining: prof?.mining ? { ...b.mining, ...prof.mining } : b.mining,
        farming: prof?.farming ? { ...b.farming, ...prof.farming } : b.farming
      };
    }));
    sound.playSuccess();
    addAuditLog('BULK_SET_PROFILE', `${botIds.length} bots -> ${prof?.name || profileId}`);
  }, [profiles, addAuditLog]);

  const emergencyStopAll = useCallback(() => {
    setBots(prev => prev.map(b => ({
      ...b,
      activity: 'Idle',
      target: null,
      movement: { ...b.movement, autoWalk: false, sprint: false, fly: false, highJump: false },
      combat: { ...b.combat, autoAttack: false }
    })));
    sound.playAlarm();
    addAuditLog('EMERGENCY_STOP_ALL', 'All active bots halted');
    addNotification({
      title: 'EMERGENCY STOP TRIGGERED',
      message: 'All bot automation tasks, attacks, and movement halted immediately.',
      severity: 'critical'
    });
  }, [addAuditLog, addNotification]);

  const exportBots = useCallback(() => {
    return JSON.stringify(bots, null, 2);
  }, [bots]);

  const importBots = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
        setBots(parsed);
        sound.playSuccess();
        addAuditLog('IMPORT_BOTS', `${parsed.length} bots loaded`);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [addAuditLog]);

  // Inventory actions
  const botInventoryAction = useCallback((botId: string, action: 'drop' | 'equip' | 'sort' | 'trash' | 'deposit' | 'withdraw', slot?: number) => {
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      let newInv = [...b.inventory];
      if (action === 'sort') {
        newInv.sort((a, b) => a.category.localeCompare(b.category));
      } else if (action === 'drop' && slot !== undefined) {
        newInv = newInv.filter(item => item.slot !== slot);
      } else if (action === 'trash' && slot !== undefined) {
        newInv = newInv.filter(item => item.slot !== slot);
      }
      return { ...b, inventory: newInv };
    }));
    sound.playClick();
  }, []);

  // Server management
  const addServer = useCallback((serverData: Partial<Server>) => {
    const newServer: Server = {
      id: 'server-' + Date.now(),
      name: serverData.name || 'New Minecraft Server',
      address: serverData.address || 'localhost',
      port: serverData.port || 25565,
      version: serverData.version || '1.20.4',
      authType: serverData.authType || 'microsoft',
      defaultUsername: serverData.defaultUsername || 'Bot',
      timeoutMs: 15000,
      reconnectDelaySec: 8,
      maxReconnectAttempts: 5,
      proxy: { enabled: false, type: 'socks5', host: '', port: 1080 },
      status: 'online',
      latency: 35,
      playerCount: { online: 12, max: 100 },
      motd: '§aA Minecraft Server',
      software: 'Paper 1.20.4',
      connectionHistory: [{ timestamp: Date.now(), status: 'connected', detail: 'Configured' }],
      errors: [],
      lastConnectedAt: Date.now(),
      ...serverData
    };
    setServers(prev => [...prev, newServer]);
    sound.playSuccess();
    addAuditLog('ADD_SERVER', newServer.name);
  }, [addAuditLog]);

  const updateServer = useCallback((serverId: string, updates: Partial<Server>) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, ...updates } : s));
    sound.playClick();
    addAuditLog('UPDATE_SERVER', serverId);
  }, [addAuditLog]);

  const removeServer = useCallback((serverId: string) => {
    const s = servers.find(sv => sv.id === serverId);
    setServers(prev => prev.filter(sv => sv.id !== serverId));
    sound.playClick();
    if (s) addAuditLog('REMOVE_SERVER', s.name);
  }, [servers, addAuditLog]);

  const testServerPing = useCallback((serverId: string) => {
    sound.playClick();
    setServers(prev => prev.map(s => {
      if (s.id !== serverId) return s;
      const newLat = Math.floor(18 + Math.random() * 35);
      return {
        ...s,
        latency: newLat,
        connectionHistory: [
          { timestamp: Date.now(), status: 'connected', detail: `Ping response: ${newLat}ms (Handshake OK)` },
          ...s.connectionHistory.slice(0, 9)
        ]
      };
    }));
  }, []);

  const runServerCapabilityScan = useCallback((serverId: string) => {
    sound.playSuccess();
    addNotification({
      title: 'Capability Scan Complete',
      message: `Audited 13 features on server. 7 Vanilla Safe, 4 Require Op/Mod, 2 Unsupported.`,
      severity: 'info'
    });
  }, [addNotification]);

  // Waypoints & Navigation
  const addWaypoint = useCallback((wp: Omit<Waypoint, 'id'>) => {
    const newWp: Waypoint = {
      ...wp,
      id: 'wp-' + Date.now()
    };
    setWaypoints(prev => [...prev, newWp]);
    sound.playSuccess();
    addAuditLog('ADD_WAYPOINT', newWp.name);
  }, [addAuditLog]);

  const updateWaypoint = useCallback((id: string, updates: Partial<Waypoint>) => {
    setWaypoints(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    sound.playClick();
  }, []);

  const removeWaypoint = useCallback((id: string) => {
    const wp = waypoints.find(w => w.id === id);
    setWaypoints(prev => prev.filter(w => w.id !== id));
    sound.playClick();
    if (wp) addAuditLog('REMOVE_WAYPOINT', wp.name);
  }, [waypoints, addAuditLog]);

  const navigateBotToWaypoint = useCallback((botId: string, waypointId: string) => {
    const wp = waypoints.find(w => w.id === waypointId);
    if (!wp) return;
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        activity: 'Navigating',
        position: { ...b.position, dimension: wp.dimension }
      };
    }));
    sound.playSuccess();
    addNotification({
      title: 'Navigation Started',
      message: `Bot navigating to waypoint "${wp.name}" (${wp.x}, ${wp.y}, ${wp.z})`,
      severity: 'info',
      botId
    });
  }, [waypoints, addNotification]);

  const teleportBotToWaypoint = useCallback((botId: string, waypointId: string) => {
    const wp = waypoints.find(w => w.id === waypointId);
    if (!wp) return;
    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        position: { x: wp.x, y: wp.y, z: wp.z, dimension: wp.dimension, yaw: b.position.yaw, pitch: b.position.pitch }
      };
    }));
    sound.playSuccess();
    addAuditLog('TELEPORT_BOT', `Bot ${botId} to ${wp.name}`);
  }, [waypoints, addAuditLog]);

  const addRoute = useCallback((route: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...route,
      id: 'route-' + Date.now()
    };
    setRoutes(prev => [...prev, newRoute]);
    sound.playSuccess();
  }, []);

  const toggleRoute = useCallback((routeId: string) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, active: !r.active } : r));
    sound.playClick();
  }, []);

  const removeRoute = useCallback((routeId: string) => {
    setRoutes(prev => prev.filter(r => r.id !== routeId));
    sound.playClick();
  }, []);

  // Profiles
  const addProfile = useCallback((profile: Omit<Profile, 'id'>) => {
    const newProf: Profile = {
      ...profile,
      id: 'prof-' + Date.now()
    };
    setProfiles(prev => [...prev, newProf]);
    sound.playSuccess();
    addAuditLog('ADD_PROFILE', newProf.name);
  }, [addAuditLog]);

  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    sound.playClick();
    addAuditLog('UPDATE_PROFILE', id);
  }, [addAuditLog]);

  const cloneProfile = useCallback((id: string) => {
    const existing = profiles.find(p => p.id === id);
    if (!existing) return;
    const newProf: Profile = {
      ...JSON.parse(JSON.stringify(existing)),
      id: 'prof-' + Date.now(),
      name: `${existing.name} (Copy)`
    };
    setProfiles(prev => [...prev, newProf]);
    sound.playSuccess();
  }, [profiles]);

  const removeProfile = useCallback((id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    sound.playClick();
  }, []);

  const assignProfileToBot = useCallback((botId: string, profileId: string) => {
    bulkSetProfile([botId], profileId);
  }, [bulkSetProfile]);

  // Automation Rules
  const addAutomationRule = useCallback((rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...rule,
      id: 'rule-' + Date.now()
    };
    setAutomationRules(prev => [...prev, newRule]);
    sound.playSuccess();
    addAuditLog('ADD_RULE', newRule.name);
  }, [addAuditLog]);

  const updateAutomationRule = useCallback((id: string, updates: Partial<AutomationRule>) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    sound.playClick();
  }, []);

  const toggleAutomationRule = useCallback((id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    sound.playClick();
  }, []);

  const removeAutomationRule = useCallback((id: string) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
    sound.playClick();
  }, []);

  const testTriggerRule = useCallback((ruleId: string, botId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    const bot = bots.find(b => b.id === botId);
    if (!rule || !bot) return;

    sound.playAlarm();
    addNotification({
      title: `Rule Triggered: ${rule.name}`,
      message: `Executing simulated workflow on ${bot.name}: Low HP retreat sequence initiated.`,
      severity: 'warning',
      botId
    });

    setBots(prev => prev.map(b => {
      if (b.id !== botId) return b;
      return {
        ...b,
        activity: 'Retreating',
        target: null,
        activeAutomationRuleId: ruleId
      };
    }));
  }, [automationRules, bots, addNotification]);

  // Chat & Console
  const sendChatMessage = useCallback((message: string, botId?: string, isBroadcast?: boolean) => {
    const targetBot = bots.find(b => b.id === (botId || selectedBotId)) || bots[0];
    const newMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      botId: targetBot?.id || 'bot-1',
      botName: targetBot?.name || 'Bot',
      sender: targetBot?.name || 'Bot',
      channel: isBroadcast ? 'global' : 'global',
      message: message,
      timestamp: Date.now(),
      rank: 'Bot'
    };
    setChatMessages(prev => [...prev, newMsg]);
    sound.playClick();

    // Check triggers
    chatTriggers.forEach(trigger => {
      if (!trigger.enabled) return;
      let matched = false;
      if (trigger.isRegex) {
        try {
          const re = new RegExp(trigger.pattern, 'i');
          matched = re.test(message);
        } catch (e) {}
      } else {
        matched = message.toLowerCase().includes(trigger.pattern.toLowerCase());
      }

      if (matched) {
        setTimeout(() => {
          if (trigger.action === 'reply') {
            const replyMsg: ChatMessage = {
              id: 'chat-reply-' + Date.now(),
              botId: targetBot.id,
              botName: targetBot.name,
              sender: targetBot.name,
              channel: 'global',
              message: trigger.actionPayload.replace('{hp}', `${targetBot.health}/20`),
              timestamp: Date.now(),
              rank: 'Bot'
            };
            setChatMessages(prev => [...prev, replyMsg]);
          }
        }, 600);
      }
    });
  }, [bots, selectedBotId, chatTriggers]);

  const executeTerminalCommand = useCallback((command: string, botId?: string) => {
    const bot = bots.find(b => b.id === (botId || selectedBotId)) || bots[0];
    const logId = 'log-' + Date.now();
    sound.playClick();

    // Command log
    const cmdLog: ConsoleLog = {
      id: logId,
      botId: bot.id,
      botName: bot.name,
      timestamp: Date.now(),
      level: 'info',
      message: `> ${command}`
    };

    let responseLog: ConsoleLog = {
      id: logId + '-resp',
      botId: bot.id,
      botName: bot.name,
      timestamp: Date.now() + 50,
      level: 'task',
      message: `Command executed successfully.`
    };

    const trimmed = command.trim();
    if (trimmed === '/help') {
      responseLog.message = 'Available commands: /help, /coords, /inventory, /mine, /attack, /goto [x] [y] [z], /say [text], /clear, /status';
    } else if (trimmed === '/coords') {
      responseLog.message = `Pos: X=${bot.position.x.toFixed(1)}, Y=${bot.position.y.toFixed(1)}, Z=${bot.position.z.toFixed(1)} Dim: ${bot.position.dimension}`;
    } else if (trimmed === '/inventory') {
      responseLog.message = `Inventory: ${bot.inventory.length}/36 slots occupied. Mainhand: ${bot.equipment.mainHand?.name || 'Empty'}`;
    } else if (trimmed.startsWith('/goto')) {
      const parts = trimmed.split(' ');
      if (parts.length >= 4) {
        const x = parseFloat(parts[1]) || bot.position.x;
        const y = parseFloat(parts[2]) || bot.position.y;
        const z = parseFloat(parts[3]) || bot.position.z;
        updateBot(bot.id, { position: { ...bot.position, x, y, z }, activity: 'Navigating' });
        responseLog.message = `Pathfinding route plotted to (${x}, ${y}, ${z}). ETA: 12 seconds.`;
      }
    } else if (trimmed === '/status') {
      responseLog.message = `Status: ${bot.status.toUpperCase()} | Health: ${bot.health}/20 | Hunger: ${bot.hunger}/20 | Activity: ${bot.activity}`;
    } else if (trimmed.startsWith('/say ')) {
      sendChatMessage(trimmed.slice(5), bot.id);
      responseLog.message = `Broadcasted message: "${trimmed.slice(5)}"`;
    }

    setConsoleLogs(prev => [...prev.slice(-300), cmdLog, responseLog]);
  }, [bots, selectedBotId, updateBot, sendChatMessage]);

  const clearConsoleLogs = useCallback((botId?: string) => {
    if (botId) {
      setConsoleLogs(prev => prev.filter(l => l.botId !== botId));
    } else {
      setConsoleLogs([]);
    }
  }, []);

  const exportConsoleLogs = useCallback(() => {
    return consoleLogs.map(l => `[${new Date(l.timestamp).toISOString()}] [${l.botName}] [${l.level.toUpperCase()}]: ${l.message}`).join('\n');
  }, [consoleLogs]);

  const addChatTrigger = useCallback((trigger: Omit<ChatTrigger, 'id'>) => {
    const newTrig: ChatTrigger = {
      ...trigger,
      id: 'trig-' + Date.now()
    };
    setChatTriggers(prev => [...prev, newTrig]);
    sound.playSuccess();
  }, []);

  const toggleChatTrigger = useCallback((id: string) => {
    setChatTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    sound.playClick();
  }, []);

  const removeChatTrigger = useCallback((id: string) => {
    setChatTriggers(prev => prev.filter(t => t.id !== id));
    sound.playClick();
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Interactive Live Testing Events
  const simulateEvent = useCallback((type: 'ambush' | 'diamond_found' | 'server_kick' | 'crop_harvest') => {
    const bot = bots.find(b => b.id === selectedBotId) || bots[0];
    if (!bot) return;

    if (type === 'ambush') {
      sound.playAlarm();
      updateBot(bot.id, {
        health: Math.max(4, bot.health - 6),
        activity: 'Combat',
        target: {
          id: 'target-creeper',
          name: 'Charged Creeper (Threat)',
          type: 'creeper',
          distance: 3.2,
          health: 20,
          maxHealth: 20,
          threatLevel: 'critical',
          status: 'Engaging'
        }
      });
      addNotification({
        title: 'Mob Ambush Detected',
        message: `${bot.name} took 6 damage from hostile mob! Combat mode active.`,
        severity: 'critical',
        botId: bot.id
      });
    } else if (type === 'diamond_found') {
      sound.playSuccess();
      updateBotMining(bot.id, {
        stats: {
          ...bot.mining.stats,
          blocksMined: bot.mining.stats.blocksMined + 1,
          itemsCollected: [
            ...bot.mining.stats.itemsCollected,
            { name: 'Diamond', count: 3 }
          ]
        }
      });
      addNotification({
        title: 'Ore Vein Excavated',
        message: `${bot.name} mined Deepslate Diamond Ore and collected 3x Diamond!`,
        severity: 'success',
        botId: bot.id
      });
    } else if (type === 'server_kick') {
      sound.playWarning();
      updateBot(bot.id, {
        status: 'error',
        ping: 0,
        activity: 'Idle',
        reliability: {
          ...bot.reliability,
          healthState: 'error',
          lastKickReason: 'Internal Exception: io.netty.handler.timeout.ReadTimeoutException'
        }
      });
      addNotification({
        title: 'Bot Disconnected (Kick)',
        message: `${bot.name} was disconnected: ReadTimeoutException. Auto-reconnect watchdog active.`,
        severity: 'warning',
        botId: bot.id
      });
    } else if (type === 'crop_harvest') {
      sound.playSuccess();
      updateBotFarming(bot.id, {
        stats: {
          ...bot.farming.stats,
          cropsHarvested: bot.farming.stats.cropsHarvested + 8,
          storageUsage: Math.min(100, bot.farming.stats.storageUsage + 2)
        }
      });
    }
  }, [bots, selectedBotId, updateBot, updateBotMining, updateBotFarming, addNotification]);

  // Real-time background simulation tick loop (Runs smoothly every 1.5 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBots(prevBots => {
        return prevBots.map(bot => {
          if (bot.status === 'disconnected' || bot.status === 'error') return bot;

          let newUptime = bot.uptime + 2;
          let newActivity = bot.activity;
          let newHealth = bot.health;
          let newHunger = bot.hunger;
          let newTarget = bot.target ? { ...bot.target } : null;
          let newPos = { ...bot.position };
          let newStats = { ...bot.stats, uptimeSeconds: bot.stats.uptimeSeconds + 2 };

          // Low health survival check (simulates prompt rule: health drops below 30% -> retreat & heal)
          const healthPercent = (newHealth / bot.maxHealth) * 100;
          if (bot.survival.emergencyRetreat.enabled && healthPercent <= bot.survival.emergencyRetreat.healthThreshold) {
            newActivity = 'Retreating';
            // heal back slowly if retreating
            newHealth = Math.min(20, newHealth + 1);
            if (newHealth >= 16) {
              newActivity = bot.group.includes('Mining') ? 'Mining' : bot.group.includes('Combat') ? 'Combat' : 'Idle';
            }
          }

          // Specific activity simulation
          if (bot.activity === 'Mining') {
            // slightly drift pos or simulate branch mining
            newPos.x += (Math.random() - 0.5) * 0.2;
            newStats.distanceTraveledBlocks += 0.3;
          } else if (bot.activity === 'Combat' && newTarget) {
            // Target takes damage
            if (newTarget.health > 2) {
              newTarget.health -= 2;
            } else {
              // Target defeated!
              newTarget = null;
              newStats.kills += 1;
              newActivity = 'Patrolling';
            }
          } else if (bot.activity === 'Navigating' || bot.activity === 'Patrolling') {
            newPos.x += (Math.random() - 0.48) * 0.8;
            newPos.z += (Math.random() - 0.5) * 0.8;
            newStats.distanceTraveledBlocks += 1.2;
          }

          // Occasional hunger tick
          if (Math.random() < 0.1 && newHunger > 6) {
            newHunger -= 1;
          }
          // Auto food
          if (bot.survival.autoFood && newHunger <= bot.survival.hungerThreshold) {
            newHunger = 20;
          }

          return {
            ...bot,
            uptime: newUptime,
            health: newHealth,
            hunger: newHunger,
            position: newPos,
            activity: newActivity,
            target: newTarget,
            stats: newStats
          };
        });
      });

      // Generate dev mode network packets occasionally
      if (Math.random() < 0.5) {
        const samplePackets = [
          { name: 'clientbound/minecraft:entity_teleport', dir: 'inbound', size: 28, summary: 'EntityId: 489 at (208.5, 72.0, -278.0)' },
          { name: 'serverbound/minecraft:swing_arm', dir: 'outbound', size: 4, summary: 'Hand: MAIN_HAND' },
          { name: 'clientbound/minecraft:sound_effect', dir: 'inbound', size: 32, summary: 'Sound: block.stone.break at (142, -58, -388)' },
          { name: 'serverbound/minecraft:player_input', dir: 'outbound', size: 12, summary: 'Forward: true, Jumping: false, Sneaking: false' }
        ];
        const pick = samplePackets[Math.floor(Math.random() * samplePackets.length)];
        const newPkt: NetworkPacket = {
          id: 'pkt-' + Date.now(),
          direction: pick.dir as 'inbound' | 'outbound',
          packetName: pick.name,
          channel: 'gameplay',
          sizeBytes: pick.size,
          timestamp: Date.now(),
          payloadSummary: pick.summary,
          fullPayload: { timestamp: Date.now(), sequence: Math.floor(Math.random() * 9999) }
        };
        setNetworkPackets(prev => [newPkt, ...prev.slice(0, 49)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, selectedBotId]);

  const selectedBot = bots.find(b => b.id === selectedBotId) || bots[0] || null;

  return (
    <BotContext.Provider
      value={{
        bots,
        servers,
        waypoints,
        routes,
        profiles,
        automationRules,
        capabilities,
        auditLogs,
        notifications,
        chatMessages,
        chatTriggers,
        consoleLogs,
        networkPackets,
        selectedBotId,
        selectedBot,
        multiSelectedBotIds,
        currentUserRole,
        allUserRoles: INITIAL_USER_ROLES,
        activeView,
        isDevMode,
        soundEnabled,
        isSimulating,
        setActiveView,
        setSelectedBotId,
        toggleMultiSelectBot,
        selectAllBots,
        clearMultiSelect,
        toggleDevMode,
        toggleSound,
        toggleSimulation,
        setCurrentUserRole,
        addBot,
        removeBot,
        connectBot,
        disconnectBot,
        reconnectBot,
        restartBot,
        pauseBot,
        resumeBot,
        renameBot,
        duplicateBot,
        bulkConnectBots,
        bulkDisconnectBots,
        bulkSetGroup,
        bulkSetProfile,
        emergencyStopAll,
        importBots,
        exportBots,
        updateBot,
        updateBotMovement,
        updateBotCombat,
        updateBotSurvival,
        updateBotMining,
        updateBotFarming,
        updateBotReliability,
        botInventoryAction,
        addServer,
        updateServer,
        removeServer,
        testServerPing,
        runServerCapabilityScan,
        addWaypoint,
        updateWaypoint,
        removeWaypoint,
        navigateBotToWaypoint,
        teleportBotToWaypoint,
        addRoute,
        toggleRoute,
        removeRoute,
        addProfile,
        updateProfile,
        cloneProfile,
        removeProfile,
        assignProfileToBot,
        addAutomationRule,
        updateAutomationRule,
        toggleAutomationRule,
        removeAutomationRule,
        testTriggerRule,
        sendChatMessage,
        executeTerminalCommand,
        clearConsoleLogs,
        exportConsoleLogs,
        addChatTrigger,
        toggleChatTrigger,
        removeChatTrigger,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        simulateEvent,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBotContext = () => {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBotContext must be used within BotProvider');
  return ctx;
};
