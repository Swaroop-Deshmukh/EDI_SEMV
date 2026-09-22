'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileSpreadsheet, Search, ArrowRight, Download } from 'lucide-react';
import { MOCK_INVESTIGATIONS } from '@/mock/investigations';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_INVESTIGATIONS.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.contractId.toLowerCase().includes(q) ||
      item.vendorName.toLowerCase().includes(q) ||
      item.buyerName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              PROCUREMENT MASTER
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Procurement Transactions Log</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Full transaction records across 34,232 processed tenders with real-time risk classification.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full transactions log...')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export All Data (CSV)</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by tender ID, vendor, or procuring dept..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-900"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Transaction / Tender ID</th>
                <th>Procuring Entity</th>
                <th>Awarded Vendor</th>
                <th>Value (INR)</th>
                <th>Method & Category</th>
                <th>Risk Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td>
                    <Link
                      href={`/procurement/contracts/${t.contractId}`}
                      className="font-mono font-bold text-xs text-navy-900 hover:underline block"
                    >
                      {t.contractId}
                    </Link>
                    <span className="text-2xs font-mono text-slate-400">{t.contractNumber}</span>
                  </td>
                  <td className="text-xs font-medium text-slate-800 max-w-[200px] truncate">{t.buyerName}</td>
                  <td className="text-xs text-slate-900 font-semibold max-w-[180px] truncate">{t.vendorName}</td>
                  <td className="font-mono text-xs font-semibold text-slate-900">
                    ₹{(t.contractValue / 100000).toFixed(1)} Lakhs
                  </td>
                  <td>
                    <span className="text-2xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {t.procurementCategory} • {t.procurementMethod}
                    </span>
                  </td>
                  <td>
                    <RiskBadge score={t.riskScore} level={t.riskLevel} />
                  </td>
                  <td>
                    <Link
                      href={`/investigations/${t.contractId}`}
                      className="inline-flex items-center gap-1 text-2xs font-bold text-navy-900 hover:underline"
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
    </div>
  );
}
