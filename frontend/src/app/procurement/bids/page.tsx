'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ArrowRight, Search } from 'lucide-react';
import { MOCK_CONTRACTS } from '@/mock/contracts';

export default function BidsPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            BID SURVEILLANCE
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Bid Evaluation & Tender Submissions</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Surveillance of bid submission timestamps, price variances, cover bids, and co-bidding patterns.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Tender Reference</th>
                <th>Winning Bidder (L1)</th>
                <th>Cover / Co-Bidders</th>
                <th>Bid Price Spread</th>
                <th>Notice Period</th>
                <th>Surveillance Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CONTRACTS.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td>
                    <Link
                      href={`/investigations/${c.id}`}
                      className="font-mono font-bold text-xs text-navy-900 hover:underline block"
                    >
                      {c.id}
                    </Link>
                    <span className="text-2xs text-slate-400 font-mono">{c.contractNumber}</span>
                  </td>
                  <td className="font-semibold text-xs text-slate-900">{c.vendorName}</td>
                  <td className="text-xs text-slate-600">
                    {c.biddersList.length > 1
                      ? c.biddersList.filter(b => !b.isWinningBid).map(b => b.vendorName).join(', ')
                      : 'None (Sole Participant)'}
                  </td>
                  <td className="font-mono text-xs font-bold text-slate-800">
                    {c.biddersList.length > 1 ? '1.2% Spread' : 'N/A (Sole Bid)'}
                  </td>
                  <td className="font-mono text-xs font-bold text-red-700">
                    {c.submissionWindowDays} Days
                  </td>
                  <td>
                    <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      {c.biddersCount === 1 ? 'SINGLE_BIDDER_MONOPOLY' : 'SUSPECTED_ROTATION'}
                    </span>
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
