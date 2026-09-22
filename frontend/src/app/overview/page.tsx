'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  FileSpreadsheet,
  Building2,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  History,
  Search,
  PlusCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { MOCK_INVESTIGATIONS } from '@/mock/investigations';
import { MOCK_CASES } from '@/mock/cases';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/context/AuthContext';

export default function OverviewPage() {
  const { currentUser, activeRole } = useAuth();

  const highRiskTenders = MOCK_INVESTIGATIONS.filter(
    i => i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH'
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Summary Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              EXECUTIVE AUDIT DASHBOARD
            </span>
            <span className="text-2xs font-mono text-slate-400">
              Session ID: AUD-2026-SES-982
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Welcome, {currentUser.name} ({activeRole})
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Procurement monitoring active across <span className="font-semibold text-slate-800">34,232 transactions</span> (₹1.02 Trillion volume).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/investigations/create-case"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Investigation Case</span>
          </Link>
          <Link
            href="/investigations/queue"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <span>Open Triage Queue (382)</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider">Total Contracts</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">34,232</div>
          <div className="text-2xs text-slate-500 mt-1 font-mono">₹1.02 Trillion Volume</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider">Procuring Depts</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">101</div>
          <div className="text-2xs text-slate-500 mt-1">Active Buying Entities</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-red-700">Critical / High Risk</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold font-mono text-red-700">382</div>
          <div className="text-2xs text-red-600 font-mono">₹74.19 Cr at Risk</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider">Active Inquiries</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">18</div>
          <div className="text-2xs text-slate-500 mt-1">Formal Case Files</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider">Senior Review</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl font-bold font-mono text-orange-700">3</div>
          <div className="text-2xs text-slate-500 mt-1">Pending Sign-off</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider">Evidence Files</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">142</div>
          <div className="text-2xs text-emerald-600 mt-1 font-medium">100% Chain Custody</div>
        </div>
      </div>

      {/* Risk Distribution Summary Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Procurement Risk Spectrum Breakdown
            </h3>
            <p className="text-2xs text-slate-500">
              Calibrated composite scores across Isolation Forest anomalies, Benford violations & competition red flags
            </p>
          </div>
          <span className="text-2xs font-mono text-slate-400">Total Analyzed: 34,232 Records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-red-800 uppercase">Critical Anomaly</span>
              <span className="text-xs font-mono font-bold text-red-700">2 (0.01%)</span>
            </div>
            <div className="w-full bg-red-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-red-600 h-full w-[1%]" />
            </div>
            <p className="text-2xs text-red-700 mt-1.5 font-mono">Score: 75.0 – 100.0 • ₹3.22 Cr</p>
          </div>

          <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-orange-800 uppercase">High Risk Lead</span>
              <span className="text-xs font-mono font-bold text-orange-700">380 (1.11%)</span>
            </div>
            <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-orange-500 h-full w-[5%]" />
            </div>
            <p className="text-2xs text-orange-700 mt-1.5 font-mono">Score: 55.0 – 74.9 • ₹70.97 Cr</p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-amber-800 uppercase">Medium (Review)</span>
              <span className="text-xs font-mono font-bold text-amber-700">8,809 (25.7%)</span>
            </div>
            <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full w-[26%]" />
            </div>
            <p className="text-2xs text-amber-700 mt-1.5 font-mono">Score: 30.0 – 54.9 • ₹499 Cr</p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-emerald-800 uppercase">Low / Standard</span>
              <span className="text-xs font-mono font-bold text-emerald-700">25,041 (73.2%)</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[73%]" />
            </div>
            <p className="text-2xs text-emerald-700 mt-1.5 font-mono">Score: 0.0 – 29.9 • ₹448 Cr</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Investigation Triage Queue & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Investigation Triage Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Priority Investigation Triage Queue
              </h3>
            </div>
            <Link
              href="/investigations/queue"
              className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-1"
            >
              <span>View All 382 Flagged Records</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left gov-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Vendor & Buyer</th>
                  <th>Risk Score</th>
                  <th>Primary Trigger</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {highRiskTenders.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <Link
                        href={`/investigations/${item.contractId}`}
                        className="font-mono font-bold text-xs text-navy-900 hover:underline"
                      >
                        {item.contractId}
                      </Link>
                      <span className="block text-2xs font-mono text-slate-400">{item.contractNumber}</span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">
                        {item.vendorName}
                      </div>
                      <div className="text-2xs text-slate-500 truncate max-w-[160px]">
                        {item.buyerName}
                      </div>
                    </td>
                    <td>
                      <RiskBadge score={item.riskScore} level={item.riskLevel} />
                    </td>
                    <td>
                      <p className="text-2xs text-slate-700 max-w-[180px] line-clamp-2">
                        {item.primaryTrigger}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td>
                      <Link
                        href={`/investigations/${item.contractId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded transition-colors"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Audit Actions & Case Timeline */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recent Audit Timeline
              </h3>
            </div>
            <Link
              href="/security/audit-log"
              className="text-2xs text-slate-500 hover:text-navy-900 font-medium"
            >
              Audit Log
            </Link>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
            {MOCK_CASES[0].timeline.map((event, idx) => (
              <div key={event.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-navy-900 mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-xs truncate">{event.title}</span>
                    <span className="text-2xs font-mono text-slate-400">{event.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-2xs text-slate-600 mt-0.5 leading-relaxed">{event.description}</p>
                  <span className="text-2xs text-slate-400 font-medium">{event.actorName} ({event.actorRole})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-2xs">
            <span className="text-slate-500">Case Dossier: CASE-2026-0142</span>
            <Link
              href="/investigations/cases"
              className="font-semibold text-navy-900 hover:underline flex items-center gap-1"
            >
              <span>Manage Cases</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
