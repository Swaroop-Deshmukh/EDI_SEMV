'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Search, ArrowRight, ShieldCheck, Clock, FileText } from 'lucide-react';
import { useCase } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function CasesPage() {
  const { cases } = useCase();
  const { currentUser, activeRole } = useAuth();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = cases.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.vendorName.toLowerCase().includes(q) ||
        c.primaryContractNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              CASE MANAGEMENT
            </span>
            <span className="text-2xs font-mono text-slate-400">Active Cases: {cases.length}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Investigation Case Dossiers</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Official inquiry case files, evidentiary lockers, chronological audit logs, and senior escalations.
          </p>
        </div>

        <Link
          href="/investigations/create-case"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Case</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Case ID, contract, vendor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="EVIDENCE_COLLECTED">Evidence Collected</option>
            <option value="SENIOR_REVIEW">Senior Review</option>
            <option value="ESCALATED">Escalated to Vigilance</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(cs => (
          <div
            key={cs.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-0.5 rounded">
                  {cs.caseNumber}
                </span>
                <RiskBadge score={cs.riskScore} level={cs.priority} />
                <StatusBadge status={cs.status} />
              </div>
              <div className="text-2xs text-slate-400 font-mono">
                Created: {cs.createdAt} • Updated: {cs.lastUpdatedAt}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-slate-900">{cs.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cs.summary}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-slate-500 pt-1">
                  <span>Vendor: <strong className="text-slate-800">{cs.vendorName}</strong></span>
                  <span>•</span>
                  <span>Primary Contract: <strong className="font-mono text-slate-800">{cs.primaryContractId}</strong></span>
                  <span>•</span>
                  <span>Assigned Auditor: <strong className="text-slate-800">{cs.assignedAuditorName} ({cs.assignedAuditorRole})</strong></span>
                  <span>•</span>
                  <span>Evidence Files: <strong className="text-purple-700 font-mono">{cs.evidenceItems.length} items</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/investigations/${cs.primaryContractId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
                >
                  <span>Open Investigation Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
