import React, { useState } from 'react';
import { KSP_TRANSACTIONS, type Transaction } from '../mockData/intelligenceDb';
import { ArrowRight, ShieldAlert, Globe, Building2 } from 'lucide-react';

export const FinancialCrime: React.FC = () => {
  const [txnSearch, setTxnSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(KSP_TRANSACTIONS[0]);

  const filteredTxns = KSP_TRANSACTIONS.filter((t) => {
    return (
      t.senderName.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.receiverName.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txnSearch.toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Transaction flow map & Shell company tree */}
      <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
        {/* Transaction Flow Diagram */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Visual Money Trail</h3>
            <p className="text-[10px] text-ksp-muted font-mono">Simulated multi-hop currency flow of cyber heist CASE CY-0891</p>
          </div>

          <div className="p-5 bg-gray-950/40 border border-gray-900 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            {/* Hop 1 */}
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-center flex-1 w-full max-w-[150px]">
              <span className="text-[9px] text-ksp-muted block">HDFC Origin</span>
              <span className="font-bold text-white block truncate">Murali Mohan</span>
              <span className="text-[10px] text-ksp-primary font-bold mt-1 block">₹15,00,000</span>
            </div>

            <ArrowRight className="h-5 w-5 text-ksp-muted hidden sm:block" />

            {/* Hop 2 (Shell Company) */}
            <div className="p-3 bg-ksp-primary/10 border border-ksp-primary/40 rounded-lg text-center flex-1 w-full max-w-[170px] relative glow-border">
              <span className="text-[9px] text-ksp-accent block">Axis (Shell Account)</span>
              <span className="font-bold text-white block truncate">Ocean Tech Ltd</span>
              <span className="text-[10px] text-ksp-accent font-bold mt-1 block">₹4,80,000,00</span>
            </div>

            <ArrowRight className="h-5 w-5 text-ksp-muted hidden sm:block" />

            {/* Hop 3 (Crypto conversion) */}
            <div className="p-3 bg-ksp-danger/10 border border-ksp-danger/40 rounded-lg text-center flex-1 w-full max-w-[150px]">
              <span className="text-[9px] text-ksp-danger block">Monero Address</span>
              <span className="font-bold text-white block truncate">Binance Crypto Mixer</span>
              <span className="text-[10px] text-ksp-danger font-bold mt-1 block">TRC20 Network</span>
            </div>
          </div>
        </div>

        {/* Beneficial Ownership Structure (i2 style) */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Beneficial Ownership Layering</h3>
            <p className="text-[10px] text-ksp-muted font-mono">Shell company hierarchy and proxy controllers mapping</p>
          </div>

          <div className="relative p-6 bg-gray-950/20 border border-gray-900 rounded-lg flex flex-col items-center gap-6">
            {/* Top owner (foreign company) */}
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-3 w-64">
              <Globe className="h-5 w-5 text-ksp-accent" />
              <div className="text-xs">
                <span className="font-bold text-white block">Horizon Trading Ltd (Dubai)</span>
                <span className="text-[10px] text-ksp-muted block">Direct parent funding (100% shares)</span>
              </div>
            </div>

            {/* Connector line */}
            <div className="w-0.5 h-6 bg-gray-800"></div>

            {/* Middle Shell company */}
            <div className="p-3 bg-ksp-primary/10 border border-ksp-primary/30 rounded-lg flex items-center gap-3 w-72">
              <Building2 className="h-5 w-5 text-ksp-primary" />
              <div className="text-xs">
                <span className="font-bold text-white block">Ocean Tech Solutions Pvt Ltd</span>
                <span className="text-[10px] text-ksp-accent block">Mangaluru registered shell office</span>
              </div>
            </div>

            {/* Connector line splits */}
            <div className="w-0.5 h-6 bg-gray-800"></div>

            {/* Bottom ultimate beneficiaries */}
            <div className="flex gap-4 flex-wrap justify-center w-full">
              <div className="p-2.5 bg-gray-900 border border-gray-850 rounded text-center w-40">
                <span className="text-[10px] text-white block font-bold">Aditi Rao</span>
                <span className="text-[8px] text-ksp-muted block">Primary Signatory (51%)</span>
              </div>
              <div className="p-2.5 bg-gray-900 border border-gray-850 rounded text-center w-40">
                <span className="text-[10px] text-white block font-bold">Murali Mohan</span>
                <span className="text-[8px] text-ksp-muted block">Beneficial Controller (49%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger & Flags Inspector */}
      <div className="glass-panel p-5 rounded-xl flex flex-col h-full overflow-hidden">
        <div className="pb-3 border-b border-gray-800 mb-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Financial Audit Logs</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Flagged transactional ledgers</p>
        </div>

        {/* Search txn */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search account / sender..."
            value={txnSearch}
            onChange={(e) => setTxnSearch(e.target.value)}
            className="w-full bg-gray-950 text-xs border border-gray-850 rounded px-3 py-2 outline-none text-gray-300 focus:border-ksp-primary"
          />
        </div>

        {/* Logs list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredTxns.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTxn(t)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedTxn?.id === t.id
                  ? 'bg-ksp-accent/10 border-ksp-accent text-white'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1 font-mono text-[9px]">
                <span className="text-ksp-accent font-bold">{t.id}</span>
                <span className="text-gray-300 font-bold">₹{t.amount.toLocaleString()}</span>
              </div>
              <p className="font-bold text-gray-200 line-clamp-1">{t.senderName} ➔ {t.receiverName}</p>
              <div className="text-[10px] text-ksp-muted font-mono mt-1.5 pt-1.5 border-t border-gray-900/60 flex justify-between">
                <span>Date: {t.date}</span>
                <span className="text-ksp-danger font-semibold">Risk: {t.riskScore}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Txn Flags inspector */}
        {selectedTxn && (
          <div className="mt-4 pt-4 border-t border-gray-800 text-xs space-y-2">
            <span className="text-[10px] font-mono text-ksp-muted uppercase font-bold tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-ksp-warning" /> Forensic Red Flags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedTxn.flags.map((flag, idx) => (
                <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-ksp-danger/10 border border-ksp-danger/30 text-red-200 rounded">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
