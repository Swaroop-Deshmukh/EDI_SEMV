'use client';

import React from 'react';
import Link from 'next/link';
import { FileBarChart, Download, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import { MOCK_CASES } from '@/mock/cases';

export default function CaseReportsPage() {
  const caseItem = MOCK_CASES[0];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              FORMAL AUDIT MEMORANDUM
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Executive Case Investigation Report</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cryptographically signed case summary dossier for submission to Vigilance / Executive Authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => alert('Generating Signed PDF Report...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-2xs space-y-6 max-w-4xl mx-auto">
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
          <div>
            <div className="text-2xs font-bold uppercase tracking-widest text-slate-500">
              STATE PUBLIC PROCUREMENT AUDIT DIRECTORATE
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-1">
              SPECIAL AUDIT INVESTIGATION MEMORANDUM
            </h1>
            <p className="text-2xs font-mono text-slate-500 mt-0.5">
              Case Ref: {caseItem.caseNumber} • Contract: {caseItem.primaryContractNumber}
            </p>
          </div>
          <div className="text-right text-2xs font-mono">
            <div>DATE: 18-FEB-2026</div>
            <div className="text-red-700 font-bold">STATUS: SENIOR REVIEW</div>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <div>
            <h3 className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              1. Executive Summary & Core Finding
            </h3>
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              {caseItem.summary}
            </p>
          </div>

          <div>
            <h3 className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              2. Evidentiary Dossier Summary ({caseItem.evidenceItems.length} Artifacts)
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {caseItem.evidenceItems.map(ev => (
                <li key={ev.id}>
                  <strong>{ev.title} ({ev.referenceId}):</strong> {ev.summary}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              3. Recommended Legal & Administrative Action
            </h3>
            <p className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 font-medium">
              {caseItem.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
