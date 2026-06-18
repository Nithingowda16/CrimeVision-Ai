import React from 'react';
import { IntelligenceProvider, useIntelligence, type ModuleType } from './context/IntelligenceContext';
import { CommandCenter } from './views/CommandCenter';
import { AICrimeAssistant } from './views/AICrimeAssistant';
import { NetworkIntelligence } from './views/NetworkIntelligence';
import { GeospatialIntelligence } from './views/GeospatialIntelligence';
import { CrimeForecasting } from './views/CrimeForecasting';
import { CaseWorkspace } from './views/CaseWorkspace';
import { FinancialCrime } from './views/FinancialCrime';
import { BehavioralProfiling } from './views/BehavioralProfiling';
import { ExecutiveCenter } from './views/ExecutiveCenter';
import { SecurityConfig } from './views/SecurityConfig';
import { LoginPortal } from './views/LoginPortal';

import {
  LayoutDashboard,
  MessageSquare,
  GitMerge,
  Map,
  LineChart,
  Briefcase,
  Coins,
  Contact,
  Sliders,
  ShieldAlert,
  Shield,
  Activity,
  AlertOctagon,
  Clock
} from 'lucide-react';

const SidebarItem: React.FC<{
  module: ModuleType;
  label: string;
  icon: React.ReactNode;
}> = ({ module, label, icon }) => {
  const { currentModule, setCurrentModule } = useIntelligence();
  const isActive = currentModule === module;

  return (
    <button
      onClick={() => setCurrentModule(module)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all border ${
        isActive
          ? 'bg-ksp-primary/15 border-ksp-primary text-white shadow-neon-blue'
          : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
      }`}
    >
      <div className={`${isActive ? 'text-ksp-primary' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
};

const MainDashboardLayout: React.FC = () => {
  const { currentModule, globalThreatScore, userRole, isAuthenticated, currentUser, logoutUser } = useIntelligence();

  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  const renderActiveView = () => {
    switch (currentModule) {
      case 'command-center':
        return <CommandCenter />;
      case 'ai-assistant':
        return <AICrimeAssistant />;
      case 'network-intel':
        return <NetworkIntelligence />;
      case 'geospatial-intel':
        return <GeospatialIntelligence />;
      case 'forecasting':
        return <CrimeForecasting />;
      case 'case-workspace':
        return <CaseWorkspace />;
      case 'financial-crime':
        return <FinancialCrime />;
      case 'behavioral-profiling':
        return <BehavioralProfiling />;
      case 'executive-center':
        return <ExecutiveCenter />;
      case 'security-config':
        return <SecurityConfig />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-ksp-bg overflow-hidden relative">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-ksp-primary/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-800 bg-[#0B1020]/90 backdrop-blur-md flex flex-col justify-between z-10 flex-shrink-0">
        <div>
          {/* Logo / Crest */}
          <div className="p-5 border-b border-gray-850 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-ksp-primary to-ksp-accent rounded-xl text-white shadow-neon-blue">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-wider text-white">CRIMEVISION AI</h1>
              <p className="text-[9px] font-mono text-ksp-accent uppercase tracking-wider font-semibold">KSP INTELLIGENCE SYSTEM</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <SidebarItem module="command-center" label="Command Center" icon={<LayoutDashboard className="h-4.5 w-4.5" />} />
            <SidebarItem module="ai-assistant" label="AI Crime Assistant" icon={<MessageSquare className="h-4.5 w-4.5" />} />
            <SidebarItem module="network-intel" label="Criminal Networks" icon={<GitMerge className="h-4.5 w-4.5" />} />
            <SidebarItem module="geospatial-intel" label="Geospatial Map" icon={<Map className="h-4.5 w-4.5" />} />
            <SidebarItem module="forecasting" label="Crime Forecasting" icon={<LineChart className="h-4.5 w-4.5" />} />
            <SidebarItem module="case-workspace" label="Case Workspace" icon={<Briefcase className="h-4.5 w-4.5" />} />
            <SidebarItem module="financial-crime" label="Financial Trails" icon={<Coins className="h-4.5 w-4.5" />} />
            <SidebarItem module="behavioral-profiling" label="Behavioral Dossier" icon={<Contact className="h-4.5 w-4.5" />} />
            <SidebarItem module="executive-center" label="Executive Center" icon={<Sliders className="h-4.5 w-4.5" />} />
            <SidebarItem module="security-config" label="Governance & Audits" icon={<ShieldAlert className="h-4.5 w-4.5" />} />
          </nav>
        </div>

        {/* Officer Profile & Log Out */}
        {currentUser && (
          <div className="p-4 border-t border-gray-850 flex items-center justify-between gap-3 text-xs bg-gray-950/20">
            <div className="min-w-0">
              <span className="font-bold text-gray-200 block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-ksp-accent font-mono block uppercase">{currentUser.role}</span>
            </div>
            <button
              onClick={logoutUser}
              className="text-[10px] font-mono text-ksp-danger hover:underline border border-ksp-danger/20 hover:border-ksp-danger/40 px-2 py-1 rounded bg-ksp-danger/5 transition"
            >
              Log Out
            </button>
          </div>
        )}

        {/* System Health / Footer */}
        <div className="p-4 border-t border-gray-850 bg-gray-950/20 text-[10px] font-mono text-ksp-muted space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-ksp-success"><Activity className="h-3.5 w-3.5" /> SECURE LINK</span>
            <span>v4.0.2</span>
          </div>
          <p className="text-[9px] uppercase tracking-wider text-center text-gray-500 font-semibold">Zero-Trust Cryptographic Core</p>
        </div>
      </aside>

      {/* Main Contents Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header Panel */}
        <header className="h-16 border-b border-gray-800 bg-[#0B1020]/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-4.5 w-4.5 text-ksp-accent animate-bounce" />
            <span className="text-xs font-mono font-bold text-gray-300">
              Active Security Clearance: <span className="text-ksp-accent">{userRole}</span>
            </span>
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-6">
            {/* Threat indicator tag */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-ksp-muted">State Threat Level:</span>
              <span className={`font-bold ${globalThreatScore > 80 ? 'text-ksp-danger animate-pulse' : 'text-ksp-warning'}`}>
                {globalThreatScore}%
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 font-mono text-xs text-ksp-muted">
              <Clock className="h-3.5 w-3.5 text-ksp-accent" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        {/* View Viewport */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <IntelligenceProvider>
      <MainDashboardLayout />
    </IntelligenceProvider>
  );
}

export default App;
