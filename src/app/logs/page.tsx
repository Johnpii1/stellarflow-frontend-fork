"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  Database,
  Terminal
} from 'lucide-react';

// --- Types ---
interface LogEntry {
  id: string;
  timestamp: string;
  type: 'transaction' | 'security' | 'system';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  actor: string;
  txHash?: string;
}

// --- Mock Data ---
const MOCK_LOGS: LogEntry[] = [
  { id: '101', timestamp: '2026-04-28 12:40:01', type: 'transaction', severity: 'info', message: 'Price Update: NGN/XLM set to 1450.22', actor: 'VTPass Lagos', txHash: '0xabc...123' },
  { id: '102', timestamp: '2026-04-28 12:35:12', type: 'security', severity: 'critical', message: 'Unauthorized API attempt detected from IP 192.168.1.1', actor: 'System Guard' },
  { id: '103', timestamp: '2026-04-28 12:30:45', type: 'system', severity: 'warning', message: 'Regional Failover: Switching to Frankfurt Secondary', actor: 'Network Orchestrator' },
  { id: '104', timestamp: '2026-04-28 12:20:10', type: 'transaction', severity: 'info', message: 'Price Update: KES/XLM set to 132.45', actor: 'Binance Pan-Africa', txHash: '0xdef...456' },
];

export default function LogsPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Admin / Audit</p>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#161b22] border border-gray-700 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg transition-all text-sm">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">
            <Terminal size={16} />
            Live Console
          </button>
        </div>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Filter logs by message, actor, or hash..." 
            className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="bg-[#0d1117] border border-gray-700 rounded-md py-2 px-4 text-sm focus:outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="info">Info Only</option>
            <option value="warning">Warnings</option>
            <option value="critical">Critical Errors</option>
          </select>
        </div>
      </div>

      {/* --- Logs Table --- */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Event Message</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-mono text-[13px]">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-[#1c2128] transition-colors group">
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      {log.type === 'transaction' && <Database size={14} className="text-blue-400" />}
                      {log.type === 'security' && <ShieldAlert size={14} className="text-red-400" />}
                      {log.type === 'system' && <FileText size={14} className="text-gray-400" />}
                      <span className="capitalize">{log.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SeverityIndicator severity={log.severity} />
                  </td>
                  <td className="px-6 py-4 max-w-md truncate text-gray-200">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {log.actor}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.txHash ? (
                      <button className="text-blue-500 hover:text-blue-400 flex items-center gap-1 justify-end ml-auto">
                        <span className="text-xs uppercase">StellarExpert</span>
                        <ExternalLink size={12} />
                      </button>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1 to 4 of 1,240 entries</span>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-700 rounded-md hover:bg-gray-800 disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-gray-700 rounded-md hover:bg-gray-800">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SeverityIndicator({ severity }: { severity: 'info' | 'warning' | 'critical' }) {
  const styles = {
    info: "text-blue-400 bg-blue-400/10",
    warning: "text-yellow-500 bg-yellow-500/10",
    critical: "text-red-500 bg-red-500/10",
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit border border-transparent ${styles[severity]}`}>
      <div className={`w-1.5 h-1.5 rounded-full fill-current ${severity === 'critical' ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'currentColor' }} />
      <span className="text-[11px] font-bold uppercase">{severity}</span>
    </div>
  );
}
