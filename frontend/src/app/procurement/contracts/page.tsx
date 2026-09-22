'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Download } from 'lucide-react';
import { MOCK_CONTRACTS } from '@/mock/contracts';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function ContractsListPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              CONTRACT REPOSITORY
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Awarded Public Procurement Contracts</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Official repository of contract agreements, milestone allocations, and awarded vendor links.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting contract registry...')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Contracts</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CONTRACTS.map(c => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2">
                <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <RiskBadge score={c.riskScore} level={c.riskLevel} />
                  <StatusBadge status={c.status} size="sm" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{c.title}</h3>
              <p className="text-2xs font-mono text-slate-400 mt-0.5">{c.contractNumber}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-2xs bg-slate-50 p-2.5 rounded border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Vendor:</span>
                  <span className="font-semibold text-slate-800">{c.vendorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contract Amount:</span>
                  <span className="font-mono font-bold text-slate-900">₹{(c.contractValue / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Procuring Entity:</span>
                  <span className="font-medium text-slate-700 truncate block">{c.buyerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Competing Bidders:</span>
                  <span className="font-mono font-semibold text-slate-800">{c.biddersCount} Bidder(s)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/procurement/contracts/${c.id}`}
                className="text-2xs font-semibold text-slate-600 hover:text-navy-900"
              >
                View Contract Details
              </Link>
              <Link
                href={`/investigations/${c.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
