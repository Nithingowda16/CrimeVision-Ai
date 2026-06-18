import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Brain, Cpu, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

const forecastData = [
  { name: 'Jan', Historical: 1400, Forecast: null },
  { name: 'Feb', Historical: 1480, Forecast: null },
  { name: 'Mar', Historical: 1590, Forecast: null },
  { name: 'Apr', Historical: 1530, Forecast: null },
  { name: 'May', Historical: 1610, Forecast: 1610 }, // bridge point
  { name: 'Jun', Historical: null, Forecast: 1720, Upper: 1850, Lower: 1590 },
  { name: 'Jul', Historical: null, Forecast: 1850, Upper: 2010, Lower: 1690 },
  { name: 'Aug', Historical: null, Forecast: 1910, Upper: 2120, Lower: 1700 },
  { name: 'Sep', Historical: null, Forecast: 1810, Upper: 2050, Lower: 1570 }
];

const featureImportance = [
  { factor: 'Digital token transaction spikes', importance: 88, category: 'Socioeconomic' },
  { factor: 'Corporate park employee density', importance: 74, category: 'Geographic' },
  { factor: 'Preceding sand mining bans', importance: 62, category: 'Policy' },
  { factor: 'Baseline cyber report logs', importance: 55, category: 'Historical' },
  { factor: 'Atmospheric temperature index', importance: 31, category: 'Environmental' }
];

export const CrimeForecasting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'xgboost' | 'prophet' | 'randomforest'>('xgboost');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-ksp-primary/5 rounded-full blur-3xl"></div>
        <div>
          <h2 className="text-xl font-bold text-white">Crime Forecasting & Anomaly Engine</h2>
          <p className="text-xs text-ksp-muted">Predictive risk evaluation executing XGBoost, FB Prophet, and Random Forest estimators</p>
        </div>
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => setSelectedModel('xgboost')}
            className={`px-3 py-1.5 border rounded-lg transition ${
              selectedModel === 'xgboost' ? 'bg-ksp-primary/20 border-ksp-primary text-white font-bold' : 'bg-gray-950 border-gray-800 text-gray-400'
            }`}
          >
            XGBoost (v2.4)
          </button>
          <button
            onClick={() => setSelectedModel('prophet')}
            className={`px-3 py-1.5 border rounded-lg transition ${
              selectedModel === 'prophet' ? 'bg-ksp-accent/20 border-ksp-accent text-white font-bold' : 'bg-gray-950 border-gray-800 text-gray-400'
            }`}
          >
            FB Prophet (v1.0)
          </button>
          <button
            onClick={() => setSelectedModel('randomforest')}
            className={`px-3 py-1.5 border rounded-lg transition ${
              selectedModel === 'randomforest' ? 'bg-ksp-success/20 border-ksp-success text-white font-bold' : 'bg-gray-950 border-gray-800 text-gray-400'
            }`}
          >
            RandomForest
          </button>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Graph */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-white">4-Month Threat Forecasting Vector</h3>
              <p className="text-[10px] text-ksp-muted font-mono">XGBoost prediction curve with 95% Confidence Interval (Upper/Lower bounds)</p>
            </div>
            <span className="text-xs font-mono bg-ksp-success/10 border border-ksp-success/20 text-ksp-success px-2 py-0.5 rounded">
              MAPE: 4.81%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.05)" />
                <XAxis dataKey="name" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} domain={[1200, 2200]} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(59,130,246,0.3)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="Historical" stroke="#3B82F6" strokeWidth={2.5} activeDot={{ r: 6 }} name="Historical Incidents" />
                <Line type="monotone" dataKey="Forecast" stroke="#10B981" strokeWidth={2.5} strokeDasharray="5 5" name="AI Predicted" />
                <Line type="monotone" dataKey="Upper" stroke="#EF4444" strokeWidth={1} strokeDasharray="3 3" name="95% Upper Limit" />
                <Line type="monotone" dataKey="Lower" stroke="#06B6D4" strokeWidth={1} strokeDasharray="3 3" name="95% Lower Limit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable AI: Feature Importance */}
        <div className="glass-panel p-5 rounded-xl flex flex-col space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white">SHAP / Feature Importance Weights</h3>
            <p className="text-[10px] text-ksp-muted">Why the model projects a rise in cyber and sand-smuggling vectors</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#4B5563" fontSize={10} domain={[0, 100]} />
                <YAxis type="category" dataKey="factor" stroke="#4B5563" fontSize={9} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(59,130,246,0.3)' }} />
                <Bar dataKey="importance" fill="#06B6D4" radius={[0, 4, 4, 0]}>
                  {featureImportance.map((_, index) => (
                    <span key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actionable recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ML Recommendations */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
            <Brain className="h-4.5 w-4.5 text-ksp-accent animate-pulse" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Automated Resource Deployment Guidelines</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-ksp-danger mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white font-mono block">Bengaluru Cyber Squad Re-allocation</span>
                <p className="text-gray-300 mt-1">Model projects a 14.2% spike in IT corridor bank-frauds. Shift 6 cyber agents from Shivamogga to Koramangala Zone.</p>
              </div>
            </div>

            <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-ksp-warning mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white font-mono block">Kolar Range Border Intercept Checkpoint</span>
                <p className="text-gray-300 mt-1">High probability (89%) of overnight sand smuggling movements between 02:00 AM and 05:00 AM. Setup mobile checkpoint at NH7 border.</p>
              </div>
            </div>

            <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-ksp-success mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white font-mono block">Recidivism Watch for "Tech Murali"</span>
                <p className="text-gray-300 mt-1">Escalation indicator suggests Murali Mohan shares bank channels with absconding nodes. Establish phone intercept protocol immediately.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly Detection Log */}
        <div className="glass-panel p-5 rounded-xl space-y-4 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-ksp-danger animate-pulse" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Isolation Forest Anomaly Records</h3>
            </div>
            <span className="text-[10px] font-mono bg-ksp-danger/10 text-ksp-danger px-2 py-0.5 rounded">
              Active Monitoring
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-60 pr-1 text-xs">
            <div className="p-2.5 bg-ksp-danger/15 border border-ksp-danger/30 rounded flex justify-between items-center font-mono">
              <div>
                <span className="font-bold text-red-200">ANOMALY INDEX SPIKE: 94%</span>
                <p className="text-[10px] text-gray-300 mt-0.5">Rapid transaction flow HDFC ➔ Axis ➔ Crypto Mixer (₹4.8 Crore)</p>
              </div>
              <span className="text-[10px] text-ksp-danger">Critical</span>
            </div>

            <div className="p-2.5 bg-gray-950 border border-gray-900 rounded flex justify-between items-center font-mono">
              <div>
                <span className="font-bold text-gray-200">DEVICE PING SHIFT</span>
                <p className="text-[10px] text-gray-400 mt-0.5">"Tech Murali" secondary IMEI registered ping near border limits (Tumakuru)</p>
              </div>
              <span className="text-[10px] text-ksp-warning">Warning</span>
            </div>

            <div className="p-2.5 bg-gray-950 border border-gray-900 rounded flex justify-between items-center font-mono">
              <div>
                <span className="font-bold text-gray-200">SIM ACQUISITION PATTERN</span>
                <p className="text-[10px] text-gray-400 mt-0.5">8 SIM registrations within 1 hour under single name in rural Kolar</p>
              </div>
              <span className="text-[10px] text-ksp-warning">Warning</span>
            </div>
          </div>

          <button className="w-full bg-gray-900 hover:bg-gray-850 text-gray-300 border border-gray-800 py-2 rounded text-xs font-mono font-bold mt-2 transition">
            Request Model Retraining Logs
          </button>
        </div>
      </div>
    </div>
  );
};
