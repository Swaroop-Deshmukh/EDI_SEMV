'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileText, ArrowRight, Building2, Calendar, DollarSign, ShieldAlert } from 'lucide-react';
import { MOCK_CONTRACTS } from '@/mock/contracts';
import { MOCK_VENDORS } from '@/mock/vendors';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function ContractDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
  const vendor = MOCK_VENDORS.find(v => v.id === contract.vendorId) || MOCK_VENDORS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/procurement/contracts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Contracts Registry</span>
        </Link>

        <Link
          href={`/investigations/${contract.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md shadow-xs"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Open in Investigation Workspace</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                {contract.id}
              </span>
              <RiskBadge score={contract.riskScore} level={contract.riskLevel} />
              <StatusBadge status={contract.status} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{contract.title}</h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{contract.contractNumber}</p>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xs text-slate-400 uppercase">Sanctioned Value</div>
            <div className="text-xl font-bold text-slate-900">₹{(contract.contractValue / 100000).toFixed(2)} Lakhs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-2xs text-slate-500 uppercase font-semibold block">Awarded Vendor</span>
            <Link
              href={`/entities/vendors/${vendor.id}`}
              className="text-sm font-bold text-navy-900 hover:underline block"
            >
              {vendor.name}
            </Link>
            <span className="text-2xs font-mono text-slate-500 block">PAN: {vendor.panNumber}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-2xs text-slate-500 uppercase font-semibold block">Procuring Entity</span>
            <span className="text-sm font-bold text-slate-900 block">{contract.buyerName}</span>
            <span className="text-2xs text-slate-500 block">{contract.department}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-2xs text-slate-500 uppercase font-semibold block">Procedure Type</span>
            <span className="text-sm font-bold text-slate-900 block">{contract.procurementMethod}</span>
            <span className="text-2xs text-slate-500 block">{contract.procurementCategory} Category</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Registered Bidding Participants ({contract.biddersList.length})
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left gov-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Submitted Bid (INR)</th>
                  <th>Variance from L1</th>
                  <th>Award Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contract.biddersList.map(b => (
                  <tr key={b.vendorId} className="hover:bg-slate-50/80">
                    <td className="font-semibold text-xs text-slate-900">{b.vendorName}</td>
                    <td className="font-mono text-xs font-bold text-slate-900">₹{(b.bidAmount / 100000).toFixed(2)}L</td>
                    <td className="text-2xs text-slate-600 font-mono">
                      {b.isWinningBid ? '0.0% (L1 Benchmark)' : '+1.2% (Suspected Cover Bid)'}
                    </td>
                    <td>
                      {b.isWinningBid ? (
                        <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AWARDED (L1)
                        </span>
                      ) : (
                        <span className="text-2xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Disqualified / Cover
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
