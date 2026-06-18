import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { KSP_SUSPECTS } from '../mockData/intelligenceDb';
import { User, ShieldAlert, Clock, BrainCircuit } from 'lucide-react';

export const BehavioralProfiling: React.FC = () => {
  const { selectedSuspect, setSelectedSuspect } = useIntelligence();

  const activeSuspect = selectedSuspect || KSP_SUSPECTS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Suspect Catalog sidebar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col gap-4 overflow-y-auto">
        <div className="pb-3 border-b border-gray-800">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Offender Registry</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Select suspect for profile audit</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {KSP_SUSPECTS.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSuspect(s)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                activeSuspect.id === s.id
                  ? 'bg-ksp-danger/10 border-ksp-danger text-white shadow-neon-blue'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              {/* Dummy Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 flex-shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-200 truncate">{s.name}</h4>
                <p className="text-[9px] font-mono text-ksp-accent truncate capitalize">{s.primaryCrimeType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Dossier Workspace */}
      <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-1">
        {/* Core Profile Header */}
        <div className="glass-panel p-5 rounded-xl flex flex-col sm:flex-row gap-5 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ksp-danger/5 rounded-full blur-3xl"></div>

          {/* Large Avatar container */}
          <div className="w-24 h-24 rounded-full bg-gray-950 border-2 border-ksp-danger flex items-center justify-center font-bold text-white text-3xl shadow-neon-cyan flex-shrink-0">
            {activeSuspect.name[0]}
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
              <h2 className="text-xl font-bold text-white">{activeSuspect.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                activeSuspect.status === 'ACTIVE'
                  ? 'bg-ksp-danger/25 text-ksp-danger border border-ksp-danger/30'
                  : 'bg-ksp-warning/25 text-ksp-warning border border-ksp-warning/30'
              }`}>
                {activeSuspect.status}
              </span>
            </div>
            <p className="text-xs text-ksp-accent font-mono">Aliases: {activeSuspect.aliases} | Age: {activeSuspect.age}</p>
            <p className="text-xs text-gray-300 capitalize">Category Focus: {activeSuspect.primaryCrimeType}</p>
          </div>

          {/* Quick Stats side */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-64">
            <div className="p-3 bg-gray-950/60 border border-gray-900 rounded-lg text-center">
              <span className="text-[9px] font-mono text-ksp-muted block">Threat Score</span>
              <span className="text-lg font-bold font-mono text-ksp-danger">{activeSuspect.threatScore}%</span>
            </div>
            <div className="p-3 bg-gray-950/60 border border-gray-900 rounded-lg text-center">
              <span className="text-[9px] font-mono text-ksp-muted block">Recidivism Risk</span>
              <span className="text-lg font-bold font-mono text-ksp-warning">{activeSuspect.recidivismScore}%</span>
            </div>
          </div>
        </div>

        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operating Parameters */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
              <Clock className="h-4 w-4 text-ksp-accent animate-pulse" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Modus Operandi Vectors</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Operating Window:</span>
                <span className="text-gray-200 font-mono">{activeSuspect.operatingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Target Class:</span>
                <span className="text-gray-200 font-mono text-right truncate max-w-[200px]">{activeSuspect.targetPreference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Geographic Vector:</span>
                <span className="text-gray-200 font-mono text-right truncate max-w-[200px]">{activeSuspect.geographicPreference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Syndicate Level:</span>
                <span className="text-gray-200 font-mono capitalize">{activeSuspect.networkInfluence} Network Role</span>
              </div>
            </div>
          </div>

          {/* Psychology & Indicators */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
              <User className="h-4 w-4 text-ksp-primary" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Psychological Profiles</h3>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeSuspect.psychologicalIndicators.map((ind, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2.5 py-1 bg-gray-950 border border-gray-900 rounded-lg text-gray-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-ksp-danger" /> {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative analysis generated by AI (Palantir/OpenAI style) */}
        <div className="glass-panel p-5 rounded-xl space-y-4 relative">
          <div className="absolute top-4 right-4 text-ksp-accent animate-pulse">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <div className="pb-2 border-b border-gray-800">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">AI Generated Behavioral Dossier</h3>
            <p className="text-[9px] text-ksp-muted font-mono">Gemini-Cognitive engine auto-summarized overview</p>
          </div>

          <div className="p-4 bg-gray-950 border border-gray-900 rounded-lg text-xs sm:text-sm text-gray-300 leading-relaxed font-sans relative">
            <p>{activeSuspect.narrativeSummary}</p>
          </div>

          {/* Associated Gangs */}
          <div className="space-y-2 pt-2 text-xs">
            <span className="text-ksp-muted font-mono uppercase font-bold tracking-wider text-[10px]">Associated Cartels</span>
            <div className="flex gap-2">
              {activeSuspect.associatedGangs.map((gang, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-gray-900 border border-gray-850 text-ksp-accent font-mono rounded text-[10px]">
                  {gang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
