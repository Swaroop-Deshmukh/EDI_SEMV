import React from 'react';
import { CaseStatus } from '@/mock/cases';

interface StatusBadgeProps {
  status: CaseStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const config: Record<string, { label: string; bg: string; text: string; border: string }> = {
    NEW: { label: 'New Alert', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    UNDER_REVIEW: { label: 'Under Review', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    EVIDENCE_COLLECTED: { label: 'Evidence Assembled', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    SENIOR_REVIEW: { label: 'Senior Review Required', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    ESCALATED: { label: 'Escalated to Vigilance', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    RESOLVED: { label: 'Resolved / Audited', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    CLOSED: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    AWARDED: { label: 'Awarded', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    ACTIVE: { label: 'Active', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    UNDER_AUDIT: { label: 'Under Audit', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };

  const item = config[normalized] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  const sizeCls = size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${item.bg} ${item.text} ${item.border} ${sizeCls}`}
    >
      {item.label}
    </span>
  );
};
