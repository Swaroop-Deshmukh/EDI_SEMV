'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, ArrowRight } from 'lucide-react';

export default function BuyersPage() {
  const buyers = [
    { name: 'Health And Family Welfare Department', total: 718, highCount: 16, rate: '2.2%', spend: '₹121 Cr' },
    { name: 'Public Works Building And Nh Department', total: 2357, highCount: 61, rate: '2.6%', spend: '₹2,304 Cr' },
    { name: 'Guwahati Municipal Corporation', total: 878, highCount: 15, rate: '1.7%', spend: '₹96 Cr' },
    { name: 'Karbi Anglong Autonomous Council', total: 260, highCount: 5, rate: '1.9%', spend: '₹194 Cr' },
    { name: 'Urban Development Department', total: 462, highCount: 11, rate: '2.4%', spend: '₹283 Cr' },
    { name: 'Guwahati Smart City Ltd.', total: 55, highCount: 2, rate: '3.6%', spend: '₹173 Cr' }
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            BUYING ENTITY AUDIT
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Procuring Departments & Buying Entities</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Anomaly rates and risk distribution profiles across 101 procuring public authorities.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Procuring Department</th>
                <th>Total Tenders</th>
                <th>Flagged High-Risk Cases</th>
                <th>Anomaly Rate</th>
                <th>Total Volume (INR)</th>
                <th>Surveillance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {buyers.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="font-semibold text-xs text-slate-900">{b.name}</td>
                  <td className="font-mono text-xs text-slate-800">{b.total}</td>
                  <td className="font-mono text-xs font-bold text-red-700">{b.highCount}</td>
                  <td className="font-mono text-xs font-bold text-red-700">{b.rate}</td>
                  <td className="font-mono text-xs font-semibold text-slate-900">{b.spend}</td>
                  <td>
                    <Link
                      href="/investigations/queue"
                      className="inline-flex items-center gap-1 text-2xs font-bold text-navy-900 hover:underline"
                    >
                      <span>Filter Department Queue</span>
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
