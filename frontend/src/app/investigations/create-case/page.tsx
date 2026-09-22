'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useCase } from '@/context/CaseContext';
import { MOCK_CONTRACTS } from '@/mock/contracts';

export default function CreateCasePage() {
  const router = useRouter();
  const { createCase } = useCase();

  const [contractId, setContractId] = useState('C-1042');
  const [caseTitle, setCaseTitle] = useState('Inquiry into Single-Bidder Medical Gas Pipeline Allocation');
  const [summary, setSummary] = useState('Formal investigation opened due to single-bidder monopoly on compressed 3-day notice window and common director linkage with competing vendors.');
  const [recommendedAction, setRecommendedAction] = useState('Freeze remaining payment vouchers and refer to State Vigilance Commission.');

  const selectedContract = MOCK_CONTRACTS.find(c => c.id === contractId) || MOCK_CONTRACTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createCase({
      primaryContractId: selectedContract.id,
      primaryContractNumber: selectedContract.contractNumber,
      title: caseTitle,
      vendorId: selectedContract.vendorId,
      vendorName: selectedContract.vendorName,
      buyerName: selectedContract.buyerName,
      riskScore: selectedContract.riskScore,
      summary,
      recommendedAction
    });

    router.push(`/investigations/${selectedContract.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/investigations/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Cases</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              CASE DOSSIER INITIATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Initiate Formal Investigation Case</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Creates a trackable audit case file, assigns evidence locker permissions, and registers chronological logs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Target Procurement Contract
            </label>
            <select
              value={contractId}
              onChange={e => {
                setContractId(e.target.value);
                const c = MOCK_CONTRACTS.find(item => item.id === e.target.value);
                if (c) {
                  setCaseTitle(`Inquiry regarding Contract ${c.id}: ${c.title}`);
                }
              }}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900"
            >
              {MOCK_CONTRACTS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.contractNumber} ({c.vendorName} • ₹{(c.contractValue/100000).toFixed(1)}L • Risk {c.riskScore})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Formal Case Title
            </label>
            <input
              type="text"
              required
              value={caseTitle}
              onChange={e => setCaseTitle(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-md text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Executive Investigation Summary & Justification
            </label>
            <textarea
              rows={4}
              required
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Explain why this transaction is being elevated into a formal audit case..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-md text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Recommended Initial Auditor Actions
            </label>
            <input
              type="text"
              value={recommendedAction}
              onChange={e => setRecommendedAction(e.target.value)}
              placeholder="e.g. Request original bid opening registers..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-md text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-2xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Target Transaction Snapshot:</span>
            <div className="flex justify-between">
              <span>Procuring Entity:</span>
              <span className="font-medium text-slate-900">{selectedContract.buyerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Awarded Vendor:</span>
              <span className="font-medium text-slate-900">{selectedContract.vendorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Anomaly Score:</span>
              <span className="font-mono font-bold text-red-700">{selectedContract.riskScore}/100 ({selectedContract.riskLevel})</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/investigations/cases"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create & Open Case Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
