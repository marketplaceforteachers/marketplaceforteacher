import React from 'react';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  DollarSign,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AdminAuditLogsProps {
  logs: AuditLog[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base">System Security & Transaction Audit Trail</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable event stream capturing verification approvals, payout disbursements, and moderation incidents.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Admin / Actor</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Target Entity</th>
                <th className="p-3.5">Event Details</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-500">{l.timestamp}</td>
                  <td className="p-3.5 font-bold text-slate-900 font-sans">{l.adminName}</td>
                  <td className="p-3.5 font-sans">
                    <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">{l.targetId}</td>
                  <td className="p-3.5 font-sans text-slate-800">{l.details}</td>
                  <td className="p-3.5 text-slate-400">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
