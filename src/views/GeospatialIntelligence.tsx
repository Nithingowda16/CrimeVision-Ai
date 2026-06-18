import React, { useState, useEffect } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { KSP_DISTRICTS, KSP_CASES, type DistrictData } from '../mockData/intelligenceDb';
import { Map, Layers, Radio, Play, Pause, Calendar } from 'lucide-react';

export const GeospatialIntelligence: React.FC = () => {
  const { setSelectedCase, setCurrentModule } = useIntelligence();

  // Map settings
  const [activeLayer, setActiveLayer] = useState<'threat' | 'police' | 'socio' | 'satellite'>('threat');
  const [selectedMapDistrict, setSelectedMapDistrict] = useState<DistrictData | null>(KSP_DISTRICTS[0]);

  // Replay timeline animation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  // Time ticks representing date-ranges
  const timeTicks = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];

  // Periodic replay effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayIndex(prev => (prev + 1) % timeTicks.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Cases that match the active selected timeline date range
  const visibleCases = KSP_CASES.filter((c) => {
    const activeMonth = timeTicks[playIndex];
    return c.reportedDate.startsWith(activeMonth);
  });

  const handleDistrictClick = (district: DistrictData) => {
    setSelectedMapDistrict(district);
  };

  const getDistrictFill = (district: DistrictData) => {
    if (activeLayer === 'satellite') {
      return 'rgba(17, 24, 39, 0.4)';
    }
    if (activeLayer === 'socio') {
      // Modulate by police station count proxy
      const intensity = Math.min(1, district.policeStationsCount / 100);
      return `rgba(6, 182, 212, ${0.1 + intensity * 0.45})`;
    }
    if (activeLayer === 'threat') {
      // Threat index gradient: Blue to Red
      const threat = district.threatIndex;
      if (threat > 85) return 'rgba(239, 68, 68, 0.4)'; // Red
      if (threat > 70) return 'rgba(245, 158, 11, 0.35)'; // Orange
      if (threat > 55) return 'rgba(59, 130, 246, 0.3)'; // Blue
      return 'rgba(16, 185, 129, 0.2)'; // Green
    }
    return 'rgba(59, 130, 246, 0.15)';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Interactive Map Visualizer */}
      <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden relative flex flex-col bg-[#0B1020]/40 border border-gray-800">
        {/* Layer Selector Top Overlay */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setActiveLayer('threat')}
            className={`px-3 py-1.5 text-[10px] font-mono border rounded-lg transition-all flex items-center gap-1.5 ${
              activeLayer === 'threat'
                ? 'bg-ksp-danger/20 border-ksp-danger text-white font-bold'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Radio className="h-3 w-3 text-ksp-danger" /> Threat Layer
          </button>
          <button
            onClick={() => setActiveLayer('socio')}
            className={`px-3 py-1.5 text-[10px] font-mono border rounded-lg transition-all flex items-center gap-1.5 ${
              activeLayer === 'socio'
                ? 'bg-ksp-accent/20 border-ksp-accent text-white font-bold'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Layers className="h-3 w-3 text-ksp-accent" /> Socioeconomic Overlays
          </button>
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-3 py-1.5 text-[10px] font-mono border rounded-lg transition-all flex items-center gap-1.5 ${
              activeLayer === 'satellite'
                ? 'bg-ksp-primary/20 border-ksp-primary text-white font-bold'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Map className="h-3 w-3 text-ksp-primary" /> Grid Vector Map
          </button>
        </div>

        {/* Tactical Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 bg-gray-900/80 border border-gray-800 p-2.5 rounded-lg text-[9px] font-mono space-y-1">
          <div className="text-[10px] font-bold text-gray-200 border-b border-gray-850 pb-1 mb-1">Overlay Intensity</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-red-500 rounded"></span> Critical Risk</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-amber-500 rounded"></span> High Risk</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-blue-500 rounded"></span> Medium Risk</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-emerald-500 rounded"></span> Low Risk</div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 w-full relative flex items-center justify-center bg-grid-pattern bg-opacity-20 p-6">
          <svg
            viewBox="0 0 400 400"
            className={`w-full max-w-[450px] aspect-square transition-all ${activeLayer === 'satellite' ? 'scanline' : ''}`}
          >
            {/* Background glowing circle */}
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(59, 130, 246, 0.03)" strokeWidth={1} strokeDasharray="5,5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(59, 130, 246, 0.02)" strokeWidth={1} />

            {/* Districts of Karnataka Map representation */}
            {KSP_DISTRICTS.map((district) => {
              const isSelected = selectedMapDistrict?.id === district.id;
              const fill = getDistrictFill(district);

              return (
                <g key={district.id} className="cursor-pointer">
                  {/* District Path */}
                  <path
                    d={district.path}
                    fill={fill}
                    stroke={isSelected ? '#3B82F6' : 'rgba(59, 130, 246, 0.2)'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-300 hover:fill-opacity-80"
                    onClick={() => handleDistrictClick(district)}
                  />
                  {/* Name Text */}
                  <text
                    x={district.lat}
                    y={district.lng}
                    fill="rgba(255, 255, 255, 0.65)"
                    fontSize={7}
                    fontFamily="sans-serif"
                    fontWeight="600"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {district.name}
                  </text>
                </g>
              );
            })}

            {/* Render active incident pins from replay */}
            {visibleCases.map((c, i) => {
              // Map district names to coordinates
              const dist = KSP_DISTRICTS.find(d => d.name.includes(c.district));
              const x = dist ? dist.lat + (i * 12 - 12) : 200;
              const y = dist ? dist.lng + (i * 8 - 12) : 200;

              return (
                <g key={c.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedCase(c)}>
                  {/* Radar Pulse circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1}
                    className="radar-ping"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#EF4444"
                    className="animate-pulse"
                  />
                </g>
              );
            })}

            {/* Police Circle centers if Layer is active */}
            {activeLayer === 'socio' && KSP_DISTRICTS.map((district) => (
              <circle
                key={`pc_${district.id}`}
                cx={district.lat}
                cy={district.lng + 10}
                r={district.policeStationsCount / 6}
                fill="rgba(6, 182, 212, 0.05)"
                stroke="rgba(6, 182, 212, 0.25)"
                strokeWidth={1}
                pointerEvents="none"
              />
            ))}
          </svg>
        </div>

        {/* Playback Slider (Wow Factor feature) */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-ksp-primary/10 border border-ksp-primary/30 rounded text-ksp-primary hover:bg-ksp-primary/20 transition"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <span className="font-mono font-bold text-gray-200">Incident Replay Playback</span>
            </div>
            <span className="font-mono text-ksp-accent flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Date Frame: {timeTicks[playIndex]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {timeTicks.map((tick, i) => (
              <button
                key={tick}
                onClick={() => { setIsPlaying(false); setPlayIndex(i); }}
                className={`flex-1 text-[9px] font-mono py-1 rounded transition border ${
                  i === playIndex
                    ? 'bg-ksp-primary text-white border-ksp-primary shadow-neon-blue'
                    : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-700'
                }`}
              >
                {tick.split('-')[1]} (Month)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Geospatial Inspector Side-panel */}
      <div className="glass-panel p-5 rounded-xl flex flex-col overflow-y-auto">
        <div className="pb-3 border-b border-gray-800 mb-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Geospatial Inspector</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Telemetry coordinates and risk parameters</p>
        </div>

        {selectedMapDistrict ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">{selectedMapDistrict.name}</h4>
              <span className="text-[10px] font-mono text-ksp-muted">KSP Jurisdiction Range ID: {selectedMapDistrict.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg">
                <span className="text-[10px] font-mono text-ksp-muted block">Threat Index</span>
                <span className="text-xl font-bold font-mono text-ksp-danger">{selectedMapDistrict.threatIndex}%</span>
              </div>
              <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg">
                <span className="text-[10px] font-mono text-ksp-muted block">Risk Category</span>
                <span className={`text-xs font-bold font-mono block ${
                  selectedMapDistrict.riskCategory === 'CRITICAL' ? 'text-ksp-danger' : 'text-ksp-warning'
                }`}>
                  {selectedMapDistrict.riskCategory}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-gray-800 text-xs">
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Police Stations:</span>
                <span className="text-white font-mono">{selectedMapDistrict.policeStationsCount} Stations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Unresolved Cases:</span>
                <span className="text-ksp-danger font-mono font-bold">{selectedMapDistrict.unresolvedCases} Cases</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ksp-muted font-mono">Total Crimes (2026):</span>
                <span className="text-white font-mono">{selectedMapDistrict.totalCrimes2026.toLocaleString()}</span>
              </div>
            </div>

            {/* Crime Category Breakdown */}
            <div className="space-y-2 pt-3 border-t border-gray-800 text-xs">
              <span className="text-ksp-muted font-mono font-bold uppercase text-[10px] block">Crime Category Vectors</span>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Cyber Crime</span>
                    <span className="text-gray-300">{selectedMapDistrict.cyberCrimes}</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ksp-primary h-full rounded-full" style={{ width: `${(selectedMapDistrict.cyberCrimes / selectedMapDistrict.totalCrimes2026) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Financial Crime</span>
                    <span className="text-gray-300">{selectedMapDistrict.financialCrimes}</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ksp-accent h-full rounded-full" style={{ width: `${(selectedMapDistrict.financialCrimes / selectedMapDistrict.totalCrimes2026) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Violent Crime</span>
                    <span className="text-gray-300">{selectedMapDistrict.violentCrimes}</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ksp-danger h-full rounded-full" style={{ width: `${(selectedMapDistrict.violentCrimes / selectedMapDistrict.totalCrimes2026) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>Property Crime</span>
                    <span className="text-gray-300">{selectedMapDistrict.propertyCrimes}</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ksp-success h-full rounded-full" style={{ width: `${(selectedMapDistrict.propertyCrimes / selectedMapDistrict.totalCrimes2026) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-gray-800 flex gap-2">
              <button
                onClick={() => setCurrentModule('forecasting')}
                className="flex-1 bg-ksp-primary/10 border border-ksp-primary/30 hover:bg-ksp-primary/20 text-ksp-accent font-mono text-[10px] py-1.5 rounded text-center transition"
              >
                Inspect Forecasting
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-ksp-muted">
            <p className="text-xs">Hover or click a district border region on the map layout to inspect data.</p>
          </div>
        )}
      </div>
    </div>
  );
};
