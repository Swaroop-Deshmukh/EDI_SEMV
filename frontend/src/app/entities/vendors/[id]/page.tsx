'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, ExternalLink, ShieldAlert, ArrowRight, UserCheck, MapPin } from 'lucide-react';
import { MOCK_VENDORS } from '@/mock/vendors';
import { MOCK_CONTRACTS } from '@/mock/contracts';
import { RiskBadge } from '@/components/common/RiskBadge';
import { NetworkGraph } from '@/components/common/NetworkGraph';

export default function VendorProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const vendor = MOCK_VENDORS.find(v => v.id === id) || MOCK_VENDORS[0];
  const contracts = MOCK_CONTRACTS.filter(c => c.vendorId === vendor.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/entities/vendors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vendors Directory</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                {vendor.id}
              </span>
              <RiskBadge score={vendor.riskScore} level={vendor.riskLevel} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{vendor.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {vendor.registeredAddress}, {vendor.city}, {vendor.state}
            </p>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xs text-slate-400 uppercase">Cumulative Contract Volume</div>
            <div className="text-xl font-bold text-slate-900">
              ₹{(vendor.totalContractValue / 10000000).toFixed(2)} Crores
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Registered Directors & Beneficial Ownership</span>
            </h3>
            <div className="space-y-2">
              {vendor.directors.map(d => (
                <div key={d.din} className="p-2.5 bg-white border border-slate-200 rounded text-xs">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{d.name}</span>
                    <span className="font-mono text-slate-600">{d.sharesPct}% Equity</span>
                  </div>
                  <span className="font-mono text-2xs text-slate-400">DIN: {d.din}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-red-50/60 rounded-lg border border-red-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Forensic Risk Indicators</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-red-900">
              {vendor.riskIndicators.map((ind, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Cross-Entity Syndicate Relationship Graph
          </h3>
          <NetworkGraph initialFocusNodeId="n-v1" height={420} />
        </div>
      </div>
    </div>
  );
}
