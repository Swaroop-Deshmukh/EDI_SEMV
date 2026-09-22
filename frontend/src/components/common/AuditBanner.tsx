import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const AuditBanner: React.FC = () => {
  return (
    <aside aria-label="Official Audit Notice" className="bg-navy-950 text-slate-300 text-xs px-4 py-1.5 border-b border-navy-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-200 uppercase tracking-wider text-2xs">
          OFFICIAL AUDIT WORKSPACE
        </span>
        <span className="text-slate-400 hidden md:inline">|</span>
        <span className="text-slate-400 hidden md:inline">
          AI anomaly signals and risk scores provide investigative leads to support auditor discretion; they do not constitute definitive legal determinations.
        </span>
      </div>
      <div className="flex items-center gap-3 text-2xs font-mono text-slate-400">
        <span className="hidden sm:inline">SECURE ENCLAVE 2.4</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span className="text-emerald-400 font-sans font-medium">COMPLIANCE ACTIVE</span>
      </div>
    </aside>
  );
};
