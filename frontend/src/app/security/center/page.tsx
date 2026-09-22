'use client';

import React from 'react';
import { ShieldCheck, Lock, Key, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SecurityCenterPage() {
  const { currentUser, activeRole } = useAuth();

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            SECURITY ENCLAVE
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Security & Authorization Center</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Session security metrics, role-based access tokens, cryptographic audit logging status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">Active Session Token</span>
          <span className="font-mono text-xs font-bold text-slate-900 mt-1 block">JWT-SEC-8842-EXP24H</span>
          <span className="text-2xs text-emerald-600 font-semibold mt-2 block">● Verified TLS 1.3</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">User Role / Clearance</span>
          <span className="text-xs font-bold text-slate-900 mt-1 block">{activeRole}</span>
          <span className="text-2xs text-slate-500 mt-2 block">{currentUser.department}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">Audit Log Integrity</span>
          <span className="text-xs font-bold text-slate-900 mt-1 block">SHA-256 Verified</span>
          <span className="text-2xs text-emerald-600 font-semibold mt-2 block">● Immutable Ledger</span>
        </div>
      </div>
    </div>
  );
}
