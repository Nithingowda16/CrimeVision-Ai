import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { ShieldCheck, UserCheck, Key, ListFilter, HardDrive } from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  ip: string;
  action: string;
  target: string;
  clearance: 'L1' | 'L2' | 'L3';
  time: string;
}

export const SecurityConfig: React.FC = () => {
  const { userRole, setUserRole } = useIntelligence();

  // Seed logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'aud_1', user: 'DGP Shivaraj', ip: '10.42.1.8', action: 'EXPORT_REPORT', target: 'Statewide Risk Projection Index', clearance: 'L3', time: '20:59:12' },
    { id: 'aud_2', user: 'Insp. Asha Kiran', ip: '10.42.8.21', action: 'QUERY_SUSPECT', target: 'Murali Mohan alias "Tech Murali"', clearance: 'L2', time: '20:58:04' },
    { id: 'aud_3', user: 'Constable Vinay', ip: '10.42.12.102', action: 'READ_CASE', target: 'KSP/2026/LS-4012 (Chikkaballapura)', clearance: 'L1', time: '20:55:40' },
    { id: 'aud_4', user: 'Insp. Rajesh', ip: '10.42.9.14', action: 'MODIFY_TASK', target: 'CASE_2026_001 (Wipro Breach)', clearance: 'L2', time: '20:51:22' },
    { id: 'aud_5', user: 'DGP Shivaraj', ip: '10.42.1.8', action: 'OVERRIDE_RBAC', target: 'Constable Authority Override', clearance: 'L3', time: '20:44:03' }
  ]);

  const handleRoleChange = (role: 'DGP' | 'INSPECTOR' | 'CONSTABLE') => {
    setUserRole(role);
    // Append audit log for role override
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      user: 'KSP System Admin',
      ip: '127.0.0.1',
      action: 'SYSTEM_ROLE_OVERRIDE',
      target: `Switched view credentials to ${role}`,
      clearance: role === 'DGP' ? 'L3' : role === 'INSPECTOR' ? 'L2' : 'L1',
      time: timeStr
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Security Health status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-ksp-success/15 border border-ksp-success/30 rounded-lg text-ksp-success">
            <ShieldCheck className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-ksp-muted uppercase">System Security Status</span>
            <h4 className="text-sm font-bold text-white mt-0.5">COMPLIANT (ZERO-TRUST)</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-ksp-accent/15 border border-ksp-accent/30 rounded-lg text-ksp-accent">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-ksp-muted uppercase">Active Cryptography</span>
            <h4 className="text-sm font-bold text-white mt-0.5">AES-GCM 256 BIT KEY</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-ksp-primary/15 border border-ksp-primary/30 rounded-lg text-ksp-primary">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-ksp-muted uppercase">Rate-Limiter Core</span>
            <h4 className="text-sm font-bold text-white mt-0.5">REDIS GATEWAY SHIELDED</h4>
          </div>
        </div>
      </div>

      {/* Main Governance Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role-Based Access controls */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Access Clearance Console</h3>
            <p className="text-[10px] text-ksp-muted font-mono">Modulate officer authority tags to test query filtering</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* DGP */}
            <button
              onClick={() => handleRoleChange('DGP')}
              className={`w-full p-4 rounded-lg border text-left transition ${
                userRole === 'DGP'
                  ? 'bg-ksp-primary/10 border-ksp-primary text-white shadow-neon-blue'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs font-mono">DGP / Commissioner (L3)</span>
                <UserCheck className={`h-4.5 w-4.5 ${userRole === 'DGP' ? 'text-ksp-primary' : 'text-gray-700'}`} />
              </div>
              <p className="text-[10px] text-gray-300">Unrestricted clearance. Access money trails, global threat forecast charts, and security configuration panels.</p>
            </button>

            {/* Inspector */}
            <button
              onClick={() => handleRoleChange('INSPECTOR')}
              className={`w-full p-4 rounded-lg border text-left transition ${
                userRole === 'INSPECTOR'
                  ? 'bg-ksp-accent/10 border-ksp-accent text-white shadow-neon-cyan'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs font-mono">Inspector (L2)</span>
                <UserCheck className={`h-4.5 w-4.5 ${userRole === 'INSPECTOR' ? 'text-ksp-accent' : 'text-gray-700'}`} />
              </div>
              <p className="text-[10px] text-gray-300">Medium clearance. Access to active investigations, suspect records, and cognitive AI assistants. Restriction on policy simulations.</p>
            </button>

            {/* Constable */}
            <button
              onClick={() => handleRoleChange('CONSTABLE')}
              className={`w-full p-4 rounded-lg border text-left transition ${
                userRole === 'CONSTABLE'
                  ? 'bg-ksp-warning/10 border-ksp-warning text-white'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs font-mono">Patrol Officer (L1)</span>
                <UserCheck className={`h-4.5 w-4.5 ${userRole === 'CONSTABLE' ? 'text-ksp-warning' : 'text-gray-700'}`} />
              </div>
              <p className="text-[10px] text-gray-300">Basic clearance. Search active reports, log notes in cases. Access restricted for network algorithms, SHAP graphs, and money flows.</p>
            </button>
          </div>
        </div>

        {/* Audit Trails log listing */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl space-y-4 flex flex-col h-[390px]">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4.5 w-4.5 text-ksp-accent animate-pulse" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Zero Trust Access Audit Ledger</h3>
            </div>
            <span className="text-[10px] font-mono bg-ksp-primary/15 text-ksp-accent px-2 py-0.5 rounded">
              Immutable Records
            </span>
          </div>

          <div className="flex-grow overflow-y-auto space-y-2.5 pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-gray-950 border border-gray-900 rounded-lg flex flex-col sm:flex-row justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-white">{log.user}</span>
                    <span className="text-[9px] text-ksp-muted font-normal">({log.ip})</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-snug">
                    Action: <span className="text-ksp-accent font-semibold">{log.action}</span> ➔ target: <span className="text-gray-400 font-semibold">{log.target}</span>
                  </p>
                </div>
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 flex-shrink-0 text-right">
                  <span className="text-[10px] text-ksp-muted">{log.time}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    log.clearance === 'L3' ? 'bg-ksp-danger/10 text-ksp-danger' : log.clearance === 'L2' ? 'bg-ksp-accent/10 text-ksp-accent' : 'bg-ksp-warning/10 text-ksp-warning'
                  }`}>
                    {log.clearance} CLEARANCE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
