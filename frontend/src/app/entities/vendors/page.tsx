'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { MOCK_VENDORS } from '@/mock/vendors';
import { RiskBadge } from '@/components/common/RiskBadge';

export default function VendorsDirectoryPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_VENDORS.filter(v => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.panNumber.toLowerCase().includes(q) ||
      v.gstin.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            ENTITY INTELLIGENCE
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Vendors Intelligence Directory</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Vendor registry profiles, directorship cross-references, contract history, and cartel flags.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vendor name, PAN, GSTIN, city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(v => (
          <div
            key={v.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2">
                <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                  {v.id}
                </span>
                <RiskBadge score={v.riskScore} level={v.riskLevel} />
              </div>

              <h3 className="text-sm font-bold text-slate-900">{v.name}</h3>
              <p className="text-2xs font-mono text-slate-500 mt-0.5">
                PAN: {v.panNumber} • GST: {v.gstin}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-2xs bg-slate-50 p-2.5 rounded border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Total Contracts:</span>
                  <span className="font-semibold text-slate-800">{v.totalContractsCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Awarded Volume:</span>
                  <span className="font-mono font-bold text-slate-900">₹{(v.totalContractValue / 10000000).toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Active Inquiries:</span>
                  <span className="font-mono font-bold text-red-700">{v.activeInvestigationsCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registered City:</span>
                  <span className="font-medium text-slate-800">{v.city}, {v.state}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/entities/vendors/${v.id}`}
                className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-1"
              >
                <span>Inspect Vendor Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
