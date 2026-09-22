'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Download,
  RotateCcw,
  CheckSquare,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { MOCK_INVESTIGATIONS, Investigation } from '@/mock/investigations';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function InvestigationQueuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'value' | 'date'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredItems = useMemo(() => {
    return MOCK_INVESTIGATIONS.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.contractId.toLowerCase().includes(q) ||
          item.contractNumber.toLowerCase().includes(q) ||
          item.vendorName.toLowerCase().includes(q) ||
          item.buyerName.toLowerCase().includes(q) ||
          item.primaryTrigger.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Risk filter
      if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && item.procurementCategory !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'risk') {
        valA = a.riskScore;
        valB = b.riskScore;
      } else if (sortBy === 'value') {
        valA = a.contractValue;
        valB = b.contractValue;
      } else if (sortBy === 'date') {
        valA = new Date(a.datePublished).getTime();
        valB = new Date(b.datePublished).getTime();
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [searchQuery, selectedRisk, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRisk('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSortBy('risk');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              CASE TRIAGE WORKSPACE
            </span>
            <span className="text-2xs font-mono text-slate-400">Total Flagged: 382 Records</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Procurement Investigation Queue</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Prioritized investigative queue ranked by multi-dimensional anomaly scores and statutory red flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Mock: Exporting Investigation Queue CSV Dossier...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Queue CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search contract, vendor name, buyer, or trigger..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 focus:border-navy-900 text-slate-900"
            />
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 text-slate-800 bg-white"
            >
              <option value="ALL">All Risk Bands</option>
              <option value="CRITICAL">Critical (75.0 - 100.0)</option>
              <option value="HIGH">High (55.0 - 74.9)</option>
              <option value="MEDIUM">Medium (30.0 - 54.9)</option>
              <option value="LOW">Low (0.0 - 29.9)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 text-slate-800 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Goods">Goods</option>
              <option value="Works">Works</option>
              <option value="Services">Services</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 text-slate-800 bg-white"
            >
              <option value="ALL">All Case Statuses</option>
              <option value="NEW">New Alerts</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="EVIDENCE_COLLECTED">Evidence Assembled</option>
              <option value="SENIOR_REVIEW">Senior Review Required</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges and Reset Button */}
        <div className="flex items-center justify-between text-2xs pt-2 border-t border-slate-100">
          <div className="text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredItems.length}</span> matching investigation transactions.
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-navy-900 transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Investigation Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Contract ID / Ref</th>
                <th>Procuring Department & Vendor</th>
                <th>Contract Value</th>
                <th onClick={() => { setSortBy('risk'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }} className="cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th>Primary Investigative Trigger</th>
                <th>Assigned Auditor</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-xs">
                    No procurement records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <Link
                        href={`/investigations/${item.contractId}`}
                        className="font-mono font-bold text-xs text-navy-900 hover:underline block"
                      >
                        {item.contractId}
                      </Link>
                      <span className="text-2xs font-mono text-slate-400 block">{item.contractNumber}</span>
                      <span className="inline-block mt-0.5 text-2xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.procurementCategory} • {item.procurementMethod}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/entities/vendors/${item.vendorId}`}
                        className="text-xs font-semibold text-slate-900 hover:text-navy-900 hover:underline block truncate max-w-[200px]"
                      >
                        {item.vendorName}
                      </Link>
                      <span className="text-2xs text-slate-500 block truncate max-w-[200px]">
                        {item.buyerName}
                      </span>
                    </td>
                    <td>
                      <div className="font-mono font-semibold text-xs text-slate-900">
                        ₹{(item.contractValue / 100000).toFixed(1)} Lakhs
                      </div>
                      <div className="text-2xs text-slate-400 font-mono">
                        {item.biddersCount} bidder(s) • {item.submissionWindowDays}d window
                      </div>
                    </td>
                    <td>
                      <RiskBadge score={item.riskScore} level={item.riskLevel} />
                    </td>
                    <td>
                      <div className="text-2xs text-slate-800 font-medium max-w-[220px] line-clamp-2">
                        {item.primaryTrigger}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.redFlags.slice(0, 2).map(flag => (
                          <span key={flag} className="text-2xs font-mono px-1 py-0.2 rounded bg-red-50 text-red-700 border border-red-200">
                            {flag}
                          </span>
                        ))}
                        {item.redFlags.length > 2 && (
                          <span className="text-2xs font-mono text-slate-400">+{item.redFlags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-slate-800">{item.assignedAuditorName}</div>
                      <div className="text-2xs text-slate-400 font-mono">{item.lastUpdated}</div>
                    </td>
                    <td>
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td>
                      <Link
                        href={`/investigations/${item.contractId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded transition-colors shadow-2xs whitespace-nowrap"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <span>Showing 1 to {filteredItems.length} of {filteredItems.length} entries</span>
          <span>Data updated: Live local triage stream</span>
        </div>
      </div>
    </div>
  );
}
