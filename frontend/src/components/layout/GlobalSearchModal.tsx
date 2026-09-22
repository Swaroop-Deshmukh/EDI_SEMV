'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Building2, Briefcase, FileCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { performGlobalSearch, GlobalSearchResult } from '@/mock';
import Link from 'next/link';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const res = performGlobalSearch(query);
    setResults(res);
  }, [query]);

  if (!isOpen) return null;

  const getResultIcon = (type: GlobalSearchResult['type']) => {
    switch (type) {
      case 'CONTRACT':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'VENDOR':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'CASE':
        return <Briefcase className="w-4 h-4 text-red-600" />;
      case 'DOCUMENT':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-100"
        role="dialog"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search contracts (e.g. C-1042), vendors (ABC Supplies), cases, or PAN/GSTIN..."
            className="w-full text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-2xs font-mono bg-slate-200 text-slate-600 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-slate-100 max-h-[460px]">
          {query.trim().length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="text-xs text-slate-500">
                Type a contract number, vendor name, director DIN, or case identifier to search across the entire audit database.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['C-1042', 'ABC Supplies', 'CASE-2026-0142', 'Apex Infra', 'DOC-8841'].map(suggest => (
                  <button
                    key={suggest}
                    onClick={() => setQuery(suggest)}
                    className="text-2xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No matching procurement entities found for <span className="font-semibold text-slate-700">"{query}"</span>.
            </div>
          ) : (
            results.map(res => (
              <Link
                key={res.id + res.type}
                href={res.link}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 p-1.5 bg-slate-100 rounded group-hover:bg-white group-hover:shadow-2xs transition-all">
                    {getResultIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-navy-900 transition-colors truncate">
                        {res.title}
                      </span>
                      <span className="text-2xs font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                        {res.type}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-0.5 truncate">{res.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {res.riskScore !== undefined && res.riskScore >= 70 && (
                    <span className="text-2xs font-bold font-mono px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                      Risk {res.riskScore}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-navy-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <span>Search scope: Tenders, Contracts, Vendors, Cases, OCR Documents</span>
          <div className="flex items-center gap-1">
            <span>Press</span>
            <CornerDownLeft className="w-3 h-3 text-slate-400 inline" />
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  );
};
