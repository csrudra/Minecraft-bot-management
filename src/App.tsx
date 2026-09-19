import React from 'react';
import { BotProvider, useBotContext } from './context/BotContext';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

// Views
import { DashboardView } from './views/DashboardView';
import { BotManagerView } from './views/BotManagerView';
import { ServerManagerView } from './views/ServerManagerView';
import { MovementView } from './views/MovementView';
import { CombatView } from './views/CombatView';
import { InteractionView } from './views/InteractionView';
import { SurvivalView } from './views/SurvivalView';
import { MiningView } from './views/MiningView';
import { FarmingView } from './views/FarmingView';
import { NavigationView } from './views/NavigationView';
import { AutomationBuilderView } from './views/AutomationBuilderView';
import { ProfilesView } from './views/ProfilesView';
import { InventoryView } from './views/InventoryView';
import { LiveConsoleView } from './views/LiveConsoleView';
import { ChatInterfaceView } from './views/ChatInterfaceView';
import { ReliabilityView } from './views/ReliabilityView';
import { CapabilityView } from './views/CapabilityView';
import { PermissionsView } from './views/PermissionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { NotificationsCenterView } from './views/NotificationsCenterView';
import { DevModeView } from './views/DevModeView';

const VIEW_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  bots: 'Bot Manager',
  servers: 'Server Manager',
  movement: 'Movement & Mobility',
  combat: 'Combat Automation',
  interaction: 'Interaction Tools',
  survival: 'Survival Automation',
  mining: 'Mining Automation',
  farming: 'Farming Automation',
  navigation: 'Navigation & Map',
  builder: 'Automation Builder',
  profiles: 'Profiles',
  inventory: 'Inventory Manager',
  console: 'Live Console',
  chat: 'Chat Interface',
  reliability: 'Anti-Disconnect',
  capabilities: 'Capability Scanner',
  permissions: 'Permissions & Audit',
  analytics: 'Analytics & Stats',
  notifications: 'Notifications',
  devmode: 'Developer / Packets',
};

const MainContent: React.FC = () => {
  const { activeView } = useBotContext();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'bots':
        return <BotManagerView />;
      case 'servers':
        return <ServerManagerView />;
      case 'movement':
        return <MovementView />;
      case 'combat':
        return <CombatView />;
      case 'interaction':
        return <InteractionView />;
      case 'survival':
        return <SurvivalView />;
      case 'mining':
        return <MiningView />;
      case 'farming':
        return <FarmingView />;
      case 'navigation':
        return <NavigationView />;
      case 'builder':
        return <AutomationBuilderView />;
      case 'profiles':
        return <ProfilesView />;
      case 'inventory':
        return <InventoryView />;
      case 'console':
        return <LiveConsoleView />;
      case 'chat':
        return <ChatInterfaceView />;
      case 'reliability':
        return <ReliabilityView />;
      case 'capabilities':
        return <CapabilityView />;
      case 'permissions':
        return <PermissionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'notifications':
        return <NotificationsCenterView />;
      case 'devmode':
        return <DevModeView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b14] relative">
      {/* Keyed by activeView: switching modules automatically clears a crash. */}
      <ErrorBoundary label={VIEW_LABELS[activeView] || 'Dashboard'} resetKey={activeView}>
        {renderView()}
      </ErrorBoundary>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary label="Application">
      <BotProvider>
        <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans">
          <ErrorBoundary label="Top Bar">
            <TopNavbar />
          </ErrorBoundary>
          <div className="flex-1 flex overflow-hidden">
            <ErrorBoundary label="Navigation">
              <Sidebar />
            </ErrorBoundary>
            <MainContent />
          </div>
        </div>
      </BotProvider>
    </ErrorBoundary>
  );
};

export default App;
