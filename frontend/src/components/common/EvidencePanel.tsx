'use client';

import React from 'react';
import { CaseEvidenceItem } from '@/mock/cases';
import { FileText, ShieldCheck, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

interface EvidencePanelProps {
  evidenceList: CaseEvidenceItem[];
  onAddEvidenceClick?: () => void;
  readOnly?: boolean;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceList,
  onAddEvidenceClick,
  readOnly = false,
}) => {
  const getTypeBadge = (type: CaseEvidenceItem['type']) => {
    switch (type) {
      case 'CONTRACT':
        return <span className="text-2xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded border border-blue-200">CONTRACT</span>;
      case 'INVOICE':
        return <span className="text-2xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-200">INVOICE OCR</span>;
      case 'ML_ANALYSIS':
        return <span className="text-2xs bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded border border-purple-200">ML / SHAP</span>;
      case 'NETWORK_GRAPH':
        return <span className="text-2xs bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded border border-amber-200">NETWORK GRAPH</span>;
      default:
        return <span className="text-2xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">{type}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Case Evidence Locker</h4>
          <p className="text-xs text-slate-500">
            {evidenceList.length} verified item(s) preserved in chain of custody.
          </p>
        </div>
        {!readOnly && onAddEvidenceClick && (
          <button
            onClick={onAddEvidenceClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Evidence
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {evidenceList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getTypeBadge(item.type)}
                  <span className="font-mono text-2xs text-slate-500 font-semibold">{item.referenceId}</span>
                </div>
                {item.isVerified && (
                  <span className="inline-flex items-center gap-1 text-2xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <h5 className="text-xs font-semibold text-slate-900 mb-1">{item.title}</h5>
              <p className="text-2xs text-slate-600 leading-relaxed line-clamp-3 mb-2">
                {item.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
              <span>Added by {item.addedBy}</span>
              <span>{item.addedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
