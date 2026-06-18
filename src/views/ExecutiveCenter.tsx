import React, { useState, useMemo } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { KSP_DISTRICTS } from '../mockData/intelligenceDb';
import { Printer } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const ExecutiveCenter: React.FC = () => {
  const { globalThreatScore } = useIntelligence();

  // Policy Simulator inputs
  const [personnelInc, setPersonnelInc] = useState(0); // 0 to 100%
  const [cctvInc, setCctvInc] = useState(0); // 0 to 100%
  const [facialRec, setFacialRec] = useState(false);
  const [cyberBudget, setCyberBudget] = useState(0); // 0 to 100%

  // Compute simulated impact
  const simulationResults = useMemo(() => {
    // personnel reduces overall crime by up to 15%
    const pImpact = (personnelInc / 100) * 15;
    // CCTV reduces property/violent crime by up to 20%
    const cImpact = (cctvInc / 100) * 20;
    // Facial recognition reduces violent/extortion by 8%
    const fImpact = facialRec ? 8 : 0;
    // Cyber budget reduces cyber/financial by up to 25%
    const cyImpact = (cyberBudget / 100) * 25;

    const totalDropPercent = Math.min(60, pImpact + cImpact + fImpact + cyImpact);
    const simulatedFutureThreatScore = Math.max(30, Math.round(globalThreatScore * (1 - totalDropPercent / 100)));

    // Generate future timeline charts
    const simChartData = [
      { name: 'Current', Baseline: globalThreatScore, Projected: globalThreatScore },
      { name: 'Month 1', Baseline: globalThreatScore, Projected: Math.round(globalThreatScore - (totalDropPercent * 0.2)) },
      { name: 'Month 2', Baseline: globalThreatScore, Projected: Math.round(globalThreatScore - (totalDropPercent * 0.5)) },
      { name: 'Month 3', Baseline: globalThreatScore, Projected: Math.round(globalThreatScore - (totalDropPercent * 0.8)) },
      { name: 'Month 4', Baseline: globalThreatScore, Projected: simulatedFutureThreatScore }
    ];

    return {
      totalDropPercent: totalDropPercent.toFixed(1),
      simulatedFutureThreatScore,
      simChartData
    };
  }, [personnelInc, cctvInc, facialRec, cyberBudget, globalThreatScore]);

  // Sorting
  const rankedDistricts = [...KSP_DISTRICTS].sort((a, b) => b.threatIndex - a.threatIndex);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Executive Decision Support Center</h2>
          <p className="text-xs text-ksp-muted">DG & IGP Strategic Planning and Resource Allocation Sandbox</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-ksp-primary hover:bg-ksp-primary/80 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-neon-blue active:scale-95"
        >
          <Printer className="h-4 w-4" /> Export Strategic Briefing
        </button>
      </div>

      {/* Main Sandbox & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator controls */}
        <div className="glass-panel p-5 rounded-xl space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Policy Impact Simulator</h3>
            <p className="text-[10px] text-ksp-muted font-mono mb-4">Slide policy inputs to predict threat index drops</p>
          </div>

          <div className="space-y-4">
            {/* Personnel */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300">Add Patrol Forces</span>
                <span className="text-ksp-accent font-bold">+{personnelInc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={personnelInc}
                onChange={(e) => setPersonnelInc(Number(e.target.value))}
                className="w-full accent-ksp-primary bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* CCTV */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300">CCTV Surveillance Density</span>
                <span className="text-ksp-accent font-bold">+{cctvInc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cctvInc}
                onChange={(e) => setCctvInc(Number(e.target.value))}
                className="w-full accent-ksp-primary bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cyber budgets */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300">Cyber Defense Allocations</span>
                <span className="text-ksp-accent font-bold">+{cyberBudget}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cyberBudget}
                onChange={(e) => setCyberBudget(Number(e.target.value))}
                className="w-full accent-ksp-primary bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* AI Facial recognition */}
            <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-900 rounded-lg">
              <div className="text-xs">
                <span className="font-bold text-white block">Deploy AI FaceRec Cameras</span>
                <p className="text-[10px] text-ksp-muted">Automatic suspect database matchers</p>
              </div>
              <input
                type="checkbox"
                checked={facialRec}
                onChange={(e) => setFacialRec(e.target.checked)}
                className="rounded border-gray-800 text-ksp-primary focus:ring-ksp-primary/20 bg-gray-950 h-4 w-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-850 text-center">
            <span className="text-[10px] font-mono text-ksp-muted uppercase">Computed Reduction Index</span>
            <p className="text-3xl font-extrabold text-ksp-success font-mono mt-1">-{simulationResults.totalDropPercent}%</p>
          </div>
        </div>

        {/* Projected impact graph */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Projected Policy Curve</h3>
            <p className="text-[10px] text-ksp-muted font-mono">Simulated future threat curve based on active allocations</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationResults.simChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} domain={[20, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(59,130,246,0.3)' }} />
                <Line type="monotone" dataKey="Baseline" stroke="#4B5563" strokeWidth={1.5} strokeDasharray="3 3" name="Baseline Threat" />
                <Line type="monotone" dataKey="Projected" stroke="#10B981" strokeWidth={3} name="Simulated Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-850">
            <div className="p-3 bg-gray-950/60 border border-gray-900 rounded-lg text-center">
              <span className="text-[9px] font-mono text-ksp-muted block">Baseline Threat Score</span>
              <span className="text-lg font-bold font-mono text-white">{globalThreatScore}%</span>
            </div>
            <div className="p-3 bg-gray-950/60 border border-gray-900 rounded-lg text-center">
              <span className="text-[9px] font-mono text-ksp-muted block">Projected Threat Score</span>
              <span className="text-lg font-bold font-mono text-ksp-success">{simulationResults.simulatedFutureThreatScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Risk Assessment district grids */}
      <div className="glass-panel p-5 rounded-xl space-y-4">
        <div>
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Strategic Range Risk Scores</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Ranked index of all ranges requiring resource deployment priorities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {rankedDistricts.map((d, index) => (
            <div key={d.id} className="p-3.5 bg-gray-950 border border-gray-900 rounded-lg flex flex-col justify-between hover:border-ksp-primary/45 transition">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-ksp-muted font-bold">RANK #{index + 1}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                  d.riskCategory === 'CRITICAL' ? 'bg-ksp-danger/20 text-ksp-danger' : d.riskCategory === 'HIGH' ? 'bg-ksp-warning/20 text-ksp-warning' : 'bg-ksp-primary/20 text-ksp-accent'
                }`}>
                  {d.riskCategory}
                </span>
              </div>
              <h4 className="font-bold text-xs text-white mt-3 leading-tight">{d.name}</h4>
              <div className="mt-4 pt-2 border-t border-gray-900 flex justify-between items-baseline font-mono text-[10px]">
                <span className="text-ksp-muted">Threat Factor:</span>
                <span className="font-bold text-white">{d.threatIndex}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
