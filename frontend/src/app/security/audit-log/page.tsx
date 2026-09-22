'use client';

import React from 'react';
import { History } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/mock/auditLogs';

export default function AuditLogPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            AUDIT TRAIL
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">System Security & Access Audit Log</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Immutable event stream capturing all authentication, dossier inspection, and escalation events.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Event ID & Time</th>
                <th>Auditor / User</th>
                <th>Action Type</th>
                <th>Resource Target</th>
                <th>Action Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AUDIT_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td>
                    <span className="font-mono font-bold text-xs text-slate-900 block">{log.id}</span>
                    <span className="font-mono text-2xs text-slate-400">{log.timestamp}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-xs text-slate-900 block">{log.userName}</span>
                    <span className="text-2xs text-slate-500">{log.userRole}</span>
                  </td>
                  <td>
                    <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-semibold text-slate-800">{log.resourceId}</td>
                  <td className="text-xs text-slate-600 max-w-xs">{log.details}</td>
                  <td>
                    <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.status}
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
}
