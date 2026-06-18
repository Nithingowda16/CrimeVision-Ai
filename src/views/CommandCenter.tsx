import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { KSP_DISTRICTS } from '../mockData/intelligenceDb';
import { Shield, AlertTriangle, Radio, TrendingUp, Cpu, Server, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const chartData = [
  { month: 'Jan', crimes: 2400, predicted: 2350, anomaly: 0 },
  { month: 'Feb', crimes: 1398, predicted: 1500, anomaly: 0 },
  { month: 'Mar', crimes: 9800, predicted: 3000, anomaly: 6800 }, // Marked anomaly
  { month: 'Apr', crimes: 3908, predicted: 3800, anomaly: 0 },
  { month: 'May', crimes: 4800, predicted: 4500, anomaly: 0 },
  { month: 'Jun', crimes: 5800, predicted: 5100, anomaly: 700 }
];

export const CommandCenter: React.FC = () => {
  const { globalThreatScore, systemAlerts, userRole } = useIntelligence();

  // Sort districts by threat index
  const sortedDistricts = [...KSP_DISTRICTS].sort((a, b) => b.threatIndex - a.threatIndex);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick State */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Statewide Threat Gauge */}
        <div className="flex-1 glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ksp-primary/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-ksp-muted font-semibold">State Threat Index</h3>
              <p className="text-xs text-ksp-accent font-mono">Real-time composite telemetry</p>
            </div>
            <div className="p-2 bg-ksp-danger/10 border border-ksp-danger/30 rounded-lg text-ksp-danger animate-pulse">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-6xl font-extrabold tracking-tight text-white font-mono">{globalThreatScore}</span>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${globalThreatScore > 80 ? 'text-ksp-danger' : 'text-ksp-warning'}`}>
                {globalThreatScore > 80 ? 'CRITICAL THREAT' : 'ELEVATED RISK'}
              </span>
              <span className="text-xs text-ksp-muted font-mono">Baseline: 70%</span>
            </div>
          </div>

          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                globalThreatScore > 85 ? 'bg-gradient-to-r from-ksp-warning to-ksp-danger shadow-neon-blue' : 'bg-gradient-to-r from-ksp-primary to-ksp-accent shadow-neon-cyan'
              }`}
              style={{ width: `${globalThreatScore}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Metric cards */}
        <div className="grid grid-cols-2 gap-4 md:w-3/5">
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-wider text-ksp-muted uppercase font-semibold">Active Cases</span>
              <Shield className="h-4 w-4 text-ksp-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">1,842</div>
              <p className="text-xs text-ksp-success flex items-center gap-1 mt-1 font-mono">
                <TrendingUp className="h-3 w-3" /> -4.2% from last month
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-wider text-ksp-muted uppercase font-semibold">Hotspot Sectors</span>
              <AlertTriangle className="h-4 w-4 text-ksp-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">76 Zones</div>
              <p className="text-xs text-ksp-danger flex items-center gap-1 mt-1 font-mono">
                <TrendingUp className="h-3 w-3" /> +2 new hotspots registered
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-wider text-ksp-muted uppercase font-semibold">Agent Node Status</span>
              <Cpu className="h-4 w-4 text-ksp-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-ksp-accent">14 Active</div>
              <p className="text-xs text-ksp-muted font-mono">Gemini-2.5-Core RAG</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-wider text-ksp-muted uppercase font-semibold">RBAC Authority</span>
              <Server className="h-4 w-4 text-ksp-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-ksp-success">{userRole}</div>
              <p className="text-xs text-ksp-muted font-mono">Zero Trust active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Trend charts */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-white">Statewide Incident Monitoring & Anomaly Spikes</h3>
              <p className="text-xs text-ksp-muted">Weekly composite analysis across 8 key police ranges</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-ksp-primary rounded-full"></span>
                <span>Crimes</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-ksp-danger rounded-full"></span>
                <span>Anomalies</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCrimes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4B5563" fontSize={11} tickLine={false} />
                <YAxis stroke="#4B5563" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(59,130,246,0.3)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="crimes" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCrimes)" name="Standard Incidents" />
                <Area type="monotone" dataKey="anomaly" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorAnomaly)" name="Anomaly Incident Spike" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Core breakdown chart */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800 text-center">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col p-2 hover:bg-gray-800/40 rounded transition">
                <span className="text-xs text-ksp-muted font-mono">{d.month}</span>
                <span className="text-sm font-bold text-white font-mono">{(d.crimes / 1000).toFixed(1)}k</span>
                {d.anomaly > 0 ? (
                  <span className="text-[10px] text-ksp-danger font-bold uppercase animate-pulse">Anomaly</span>
                ) : (
                  <span className="text-[10px] text-ksp-success uppercase">Stable</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Intel Feed Ticker */}
        <div className="glass-panel p-5 rounded-xl flex flex-col h-[390px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <Radio className="h-4 w-4 text-ksp-accent animate-pulse" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Live KSP Intelligence Feed</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs leading-relaxed transition-all hover:bg-gray-800/40 ${
                  alert.type === 'CRITICAL'
                    ? 'bg-ksp-danger/10 border-ksp-danger/30 text-red-200'
                    : alert.type === 'WARNING'
                    ? 'bg-ksp-warning/10 border-ksp-warning/30 text-amber-200'
                    : 'bg-ksp-primary/5 border-ksp-primary/20 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1 font-mono text-[10px] font-semibold opacity-80">
                  <span className={`px-1.5 py-0.5 rounded ${
                    alert.type === 'CRITICAL' ? 'bg-ksp-danger/20 text-ksp-danger' : alert.type === 'WARNING' ? 'bg-ksp-warning/20 text-ksp-warning' : 'bg-ksp-primary/20 text-ksp-primary'
                  }`}>
                    {alert.type}
                  </span>
                  <span>{alert.timestamp}</span>
                </div>
                <p className="font-sans text-gray-200">{alert.message}</p>
                <div className="text-[10px] text-ksp-accent font-mono mt-1 opacity-70">
                  Sector: {alert.district}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District threat analysis */}
      <div className="glass-panel p-5 rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div>
            <h3 className="font-bold text-base text-white">District-wise Risk Analysis Index</h3>
            <p className="text-xs text-ksp-muted">Live priority tracking index updated by range headquarters</p>
          </div>
          <button className="text-xs font-mono font-bold text-ksp-accent hover:text-ksp-primary transition border border-ksp-accent/30 hover:border-ksp-primary/40 px-3 py-1 rounded">
            Download State Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-ksp-muted uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Threat Rating</th>
                <th className="py-3 px-4">Police Stations</th>
                <th className="py-3 px-4">Total Incidents (2026)</th>
                <th className="py-3 px-4">Unresolved Cases</th>
                <th className="py-3 px-4 text-center">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {sortedDistricts.map((district) => (
                <tr key={district.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{district.name}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            district.threatIndex > 85 ? 'bg-ksp-danger' : district.threatIndex > 65 ? 'bg-ksp-warning' : 'bg-ksp-primary'
                          }`}
                          style={{ width: `${district.threatIndex}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{district.threatIndex}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-300">{district.policeStationsCount}</td>
                  <td className="py-3 px-4 font-mono text-gray-300">{district.totalCrimes2026.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-ksp-danger">{district.unresolvedCases.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      district.riskCategory === 'CRITICAL'
                        ? 'bg-ksp-danger/10 text-ksp-danger border border-ksp-danger/20'
                        : district.riskCategory === 'HIGH'
                        ? 'bg-ksp-warning/10 text-ksp-warning border border-ksp-warning/20'
                        : 'bg-ksp-primary/10 text-ksp-accent border border-ksp-primary/20'
                    }`}>
                      {district.riskCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
