'use client';

import React from 'react';
import { NetworkGraph } from '@/components/common/NetworkGraph';

export default function NetworkPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            GRAPH ANALYTICS
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Forensic Relationship & Syndicate Explorer</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Interactive knowledge graph mapping procurement cartels, shared directorship DINs, co-located registered addresses, and rotational cover bidding.
        </p>
      </div>

      <NetworkGraph height={640} />
    </div>
  );
}
