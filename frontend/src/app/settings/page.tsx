'use client';

import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  const [threshold, setThreshold] = useState('5000000');
  const [minWindow, setMinWindow] = useState('7');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            CONFIGURATION
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Audit Rule & Threshold Settings</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Configure statutory cutoff parameters and alert triggering sensitivity.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Mandatory Open E-Tendering Ceiling (INR)
          </label>
          <input
            type="text"
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-md text-slate-900 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Minimum Acceptable Notice Period (Days)
          </label>
          <input
            type="text"
            value={minWindow}
            onChange={e => setMinWindow(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-md text-slate-900 font-mono"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => alert('Settings saved locally!')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
