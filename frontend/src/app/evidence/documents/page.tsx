'use client';

import React, { useState } from 'react';
import { FileCheck, Search, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MOCK_DOCUMENTS } from '@/mock/documents';

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState(MOCK_DOCUMENTS[0]);

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            OCR & EVIDENCE LOCKER
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Procurement Documents & OCR Extraction</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Digitized invoice vouchers, tender notices, technical evaluation minutes, and automated OCR discrepancy checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {MOCK_DOCUMENTS.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 bg-white border rounded-lg shadow-2xs cursor-pointer transition-all ${
                selectedDoc.id === doc.id
                  ? 'border-navy-900 ring-1 ring-navy-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {doc.type}
                </span>
                <span className="text-2xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  OCR {doc.ocrConfidence}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
              <p className="text-2xs font-mono text-slate-500 mt-0.5">{doc.documentNumber}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedDoc.name}</h3>
              <p className="text-2xs font-mono text-slate-400">Doc No: {selectedDoc.documentNumber}</p>
            </div>
            <span className="text-2xs font-mono font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
              Confidence: {selectedDoc.ocrConfidence}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-md border border-slate-100">
            <div>
              <span className="text-2xs text-slate-400 block">Billed Vendor</span>
              <span className="font-bold text-slate-900">{selectedDoc.extractedMetadata.billedVendorName}</span>
            </div>
            <div>
              <span className="text-2xs text-slate-400 block">GSTIN</span>
              <span className="font-mono font-bold text-slate-900">{selectedDoc.extractedMetadata.billedGSTIN}</span>
            </div>
            <div>
              <span className="text-2xs text-slate-400 block">Extracted Amount</span>
              <span className="font-mono font-bold text-slate-900">₹{(selectedDoc.extractedMetadata.invoiceAmount / 100000).toFixed(2)} Lakhs</span>
            </div>
            <div>
              <span className="text-2xs text-slate-400 block">Payment Terms</span>
              <span className="font-medium text-slate-800">{selectedDoc.extractedMetadata.paymentTerms}</span>
            </div>
          </div>

          {selectedDoc.extractedMetadata.flaggedIrregularities.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-900 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>OCR Extracted Irregularities:</span>
              </span>
              <ul className="list-disc list-inside text-2xs space-y-0.5">
                {selectedDoc.extractedMetadata.flaggedIrregularities.map((irr, idx) => (
                  <li key={idx}>{irr}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Raw Extracted Text Stream
            </h4>
            <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-2xs rounded-md overflow-x-auto whitespace-pre-wrap max-h-56">
              {selectedDoc.extractedMetadata.rawTextExcerpt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
