'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldAlert, ArrowLeft, Building2, Calendar, DollarSign, FileText, Clock,
  Layers, Share2, FileCheck, CheckCircle2, AlertTriangle, MessageSquare, Plus,
  ExternalLink, Briefcase, TrendingUp, Download
} from 'lucide-react';
import { MOCK_INVESTIGATIONS, Investigation } from '@/mock/investigations';
import { MOCK_CONTRACTS } from '@/mock/contracts';
import { MOCK_VENDORS } from '@/mock/vendors';
import { MOCK_DOCUMENTS } from '@/mock/documents';
import { RiskBadge } from '@/components/common/RiskBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { NetworkGraph } from '@/components/common/NetworkGraph';
import { EvidencePanel } from '@/components/common/EvidencePanel';
import { Timeline } from '@/components/common/Timeline';
import { Modal } from '@/components/common/Modal';
import { useCase } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';

export default function InvestigationWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { cases, createCase, updateCaseStatus, addNote, addEvidence } = useCase();
  const { currentUser, activeRole } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const investigation =
    MOCK_INVESTIGATIONS.find(i => i.contractId === id || i.id === id) || MOCK_INVESTIGATIONS[0];

  const contract =
    MOCK_CONTRACTS.find(c => c.id === investigation.contractId) || MOCK_CONTRACTS[0];

  const vendor =
    MOCK_VENDORS.find(v => v.id === investigation.vendorId) || MOCK_VENDORS[0];

  const existingCase = cases.find(c => c.primaryContractId === contract.id);

  const [activeTab, setActiveTab] = useState('overview');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [evidenceType, setEvidenceType] = useState('CONTRACT');

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    if (!existingCase) {
      const newCase = createCase({
        primaryContractId: contract.id,
        primaryContractNumber: contract.contractNumber,
        title: 'Inquiry into ' + contract.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        buyerName: contract.buyerName,
        riskScore: investigation.riskScore,
        summary: investigation.aiExplanation
      });
      addNote(newCase.id, noteText);
    } else {
      addNote(existingCase.id, noteText);
    }

    setNoteText('');
    setIsNoteModalOpen(false);
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim()) return;

    const evidenceData = {
      type: evidenceType as any,
      title: evidenceTitle,
      referenceId: `${evidenceType.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      summary: evidenceSummary || 'Verified by auditor in investigation workspace.',
      isVerified: true
    };

    if (!existingCase) {
      const newCase = createCase({
        primaryContractId: contract.id,
        primaryContractNumber: contract.contractNumber,
        title: 'Inquiry into ' + contract.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        buyerName: contract.buyerName,
        riskScore: investigation.riskScore,
        summary: investigation.aiExplanation
      });
      addEvidence(newCase.id, evidenceData);
    } else {
      addEvidence(existingCase.id, evidenceData);
    }

    setEvidenceTitle('');
    setEvidenceSummary('');
    setIsEvidenceModalOpen(false);
  };

  const handleEscalateSubmit = () => {
    if (existingCase) {
      updateCaseStatus(existingCase.id, 'SENIOR_REVIEW', 'Case escalated to Senior Auditor for formal inquiry approval.');
    } else {
      const newCase = createCase({
        primaryContractId: contract.id,
        primaryContractNumber: contract.contractNumber,
        title: 'Inquiry into ' + contract.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        buyerName: contract.buyerName,
        riskScore: investigation.riskScore,
        summary: investigation.aiExplanation
      });
      updateCaseStatus(newCase.id, 'SENIOR_REVIEW', 'Case escalated to Senior Auditor for formal inquiry approval.');
    }
    setIsEscalateModalOpen(false);
    setActiveTab('case');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/investigations/queue"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Investigation Queue</span>
        </Link>
        <div className="flex items-center gap-2">
          {existingCase && (
            <span className="text-2xs font-mono font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded border border-purple-200">
              CASE: {existingCase.caseNumber}
            </span>
          )}
          <span className="text-2xs font-mono text-slate-400">
            RECORD REF: {investigation.id}
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                {contract.id}
              </span>
              <span className="font-mono text-xs text-slate-500">
                {contract.contractNumber}
              </span>
              <RiskBadge score={investigation.riskScore} level={investigation.riskLevel} />
              <StatusBadge status={existingCase ? existingCase.status : investigation.status} />
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {contract.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Vendor:</span>
                <Link
                  href={`/entities/vendors/${vendor.id}`}
                  className="font-semibold text-slate-900 hover:text-navy-900 hover:underline"
                >
                  {vendor.name} ({vendor.id})
                </Link>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Procuring Dept:</span>
                <span className="font-medium text-slate-800">{contract.buyerName}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Value:</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{(contract.contractValue / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Note</span>
            </button>
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Evidence</span>
            </button>
            <button
              onClick={() => setIsEscalateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Escalate / Review</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 border-t border-slate-200 mt-5 pt-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Triggers', icon: FileText },
            { id: 'ml', label: 'ML Risk Evidence & XAI', icon: TrendingUp },
            { id: 'network', label: 'Syndicate Network Graph', icon: Share2 },
            { id: 'documents', label: 'Supporting Documents & OCR', icon: FileCheck },
            { id: 'related', label: 'Related Split Contracts', icon: Layers },
            { id: 'case', label: 'Case Locker & Timeline', icon: Briefcase, badge: existingCase?.evidenceItems.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-100 text-navy-900 border border-slate-300 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-navy-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-2xs font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-red-50/70 border border-red-200 rounded-lg p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Why Was This Transaction Flagged?</span>
              </div>
              <p className="text-xs text-red-900 font-semibold mb-2">
                {investigation.primaryTrigger}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded border border-red-100">
                {investigation.aiExplanation}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {investigation.redFlags.map(flag => (
                  <span
                    key={flag}
                    className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Contract Procedural & Bidding Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Procurement Method</span>
                  <span className="font-semibold text-slate-900">{contract.procurementMethod}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Category</span>
                  <span className="font-semibold text-slate-900">{contract.procurementCategory}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Competing Bidders</span>
                  <span className="font-mono font-bold text-red-700">{contract.biddersCount} Bidder</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Notice Window</span>
                  <span className="font-mono font-bold text-red-700">{contract.submissionWindowDays} Days</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Date Published</span>
                  <span className="font-mono text-slate-800">{contract.datePublished}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-2xs text-slate-500 uppercase block">Award Date</span>
                  <span className="font-mono text-slate-800">{contract.awardDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-navy-900" />
                <span>Recommended Auditor Next Steps</span>
              </h3>
              <ul className="space-y-2">
                {investigation.suggestedAuditorActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Awarded Vendor Profile
                </h3>
                <Link
                  href={`/entities/vendors/${vendor.id}`}
                  className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-0.5"
                >
                  <span>Full Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="text-xs space-y-1.5">
                <p className="font-bold text-slate-900">{vendor.name}</p>
                <p className="text-2xs font-mono text-slate-500">PAN: {vendor.panNumber} • GST: {vendor.gstin}</p>
                <p className="text-2xs text-slate-600">{vendor.registeredAddress}, {vendor.city}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
                  <span>Total Contracts: <strong>{vendor.totalContractsCount}</strong></span>
                  <span>Value: <strong>₹{(vendor.totalContractValue / 10000000).toFixed(2)} Cr</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ml' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Machine Learning Anomaly Score Decomposition
              </h3>
              <p className="text-2xs text-slate-500">
                Isolation Forest and multidimensional heuristic component weights for this transaction
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>Pricing & Value Anomaly</span>
                  <span className="font-mono text-red-700">{investigation.mlComponentScores.pricingAnomaly}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: `${investigation.mlComponentScores.pricingAnomaly}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>Vendor Bidding Behavior</span>
                  <span className="font-mono text-orange-700">{investigation.mlComponentScores.vendorBehavior}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${investigation.mlComponentScores.vendorBehavior}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>Transaction Clustering</span>
                  <span className="font-mono text-amber-700">{investigation.mlComponentScores.transactionPattern}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${investigation.mlComponentScores.transactionPattern}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>Procedural & Timing Bypass</span>
                  <span className="font-mono text-red-700">{investigation.mlComponentScores.proceduralTiming}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: `${investigation.mlComponentScores.proceduralTiming}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                SHAP Feature Attribution & Forensic Deviations
              </h3>
              <span className="text-2xs font-mono text-slate-500">Model: IsolationForest-v2.joblib</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left gov-table">
                <thead>
                  <tr>
                    <th>Feature Dimension</th>
                    <th>Category</th>
                    <th>Observed Value</th>
                    <th>Reference Standard</th>
                    <th>Statistical Deviation</th>
                    <th>SHAP Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investigation.evidenceFactors.map((factor, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="font-semibold text-xs text-slate-900">{factor.feature}</td>
                      <td>
                        <span className="text-2xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {factor.category}
                        </span>
                      </td>
                      <td className="font-mono text-xs font-bold text-red-700">{factor.observedValue}</td>
                      <td className="font-mono text-xs text-slate-600">{factor.referenceValue}</td>
                      <td className="text-2xs text-slate-700 font-medium">{factor.deviation}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-red-700">
                            +{factor.contributionScore}%
                          </span>
                          <span className="text-2xs text-red-600 font-medium">Increased Anomaly</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Syndicate Entity Graph & Directorship Resolution
            </h3>
            <p className="text-2xs text-slate-500 mt-0.5">
              Visualizes cross-vendor relationships, co-bidding patterns, common directors, and shared registered locations for Contract {contract.id}.
            </p>
          </div>
          <NetworkGraph initialFocusNodeId="n-c1" height={560} />
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_DOCUMENTS.map(doc => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {doc.type}
                    </span>
                    <span className="text-2xs font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                      OCR {doc.ocrConfidence}%
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{doc.name}</h4>
                  <p className="text-2xs text-slate-500 font-mono mt-0.5">Doc No: {doc.documentNumber}</p>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-100 text-2xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Billed Amount:</span>
                      <span className="font-mono font-bold text-slate-800">₹{(doc.extractedMetadata.invoiceAmount / 100000).toFixed(2)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Terms:</span>
                      <span className="text-slate-800">{doc.extractedMetadata.paymentTerms}</span>
                    </div>
                  </div>

                  {doc.extractedMetadata.flaggedIrregularities.length > 0 && (
                    <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded text-2xs text-red-800">
                      <span className="font-bold block mb-0.5">OCR Anomaly Detected:</span>
                      {doc.extractedMetadata.flaggedIrregularities[0]}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/evidence/documents"
                    className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect OCR View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'related' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Temporal Split Contracts & Sub-threshold Packages
            </h3>
            <p className="text-2xs text-slate-500">
              Tenders awarded by the same procuring entity within a 14-day rolling window suspected of threshold evasion
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left gov-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Title</th>
                  <th>Awarded Vendor</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CONTRACTS.filter(c => c.id !== contract.id).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="font-mono font-bold text-xs text-navy-900">{c.id}</td>
                    <td className="text-xs font-medium text-slate-900 max-w-xs truncate">{c.title}</td>
                    <td className="text-xs text-slate-700">{c.vendorName}</td>
                    <td className="font-mono text-xs font-semibold text-slate-900">₹{(c.contractValue / 100000).toFixed(1)}L</td>
                    <td>
                      <RiskBadge score={c.riskScore} level={c.riskLevel} />
                    </td>
                    <td>
                      <Link
                        href={`/investigations/${c.id}`}
                        className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-1"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'case' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EvidencePanel
              evidenceList={existingCase ? existingCase.evidenceItems : []}
              onAddEvidenceClick={() => setIsEvidenceModalOpen(true)}
            />

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Auditor Case Notes ({existingCase ? existingCase.notes.length : 0})
                </h4>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="text-2xs font-semibold text-navy-900 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add New Note
                </button>
              </div>

              <div className="space-y-3">
                {existingCase?.notes.map(note => (
                  <div key={note.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {note.authorName} ({note.authorRole})
                      </span>
                      <span className="font-mono">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Investigation Chronology
            </h4>
            <Timeline events={existingCase ? existingCase.timeline : []} />
          </div>
        </div>
      )}

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Auditor Case Note"
        subtitle={`Appends an authenticated entry into Case Dossier for Contract ${contract.id}`}
      >
        <form onSubmit={handleAddNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Note Findings & Observations
            </label>
            <textarea
              rows={4}
              required
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Record your audit observations, witness inquiries, or evidentiary conclusions..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 focus:border-navy-900 text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Add Evidence to Case Locker"
        subtitle={`Preserve evidentiary artifacts for Contract ${contract.id}`}
      >
        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Evidence Type</label>
            <select
              value={evidenceType}
              onChange={e => setEvidenceType(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
            >
              <option value="CONTRACT">Contract / NIT Document</option>
              <option value="INVOICE">Invoice / Delivery Challan OCR</option>
              <option value="ML_ANALYSIS">ML Anomaly Risk Profile</option>
              <option value="NETWORK_GRAPH">Network Syndicate Graph</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Evidence Title</label>
            <input
              type="text"
              required
              value={evidenceTitle}
              onChange={e => setEvidenceTitle(e.target.value)}
              placeholder="e.g. MCA Director Registry Certificate for DIN 08429112"
              className="w-full p-2 text-xs border border-slate-300 rounded-md text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Evidentiary Summary</label>
            <textarea
              rows={3}
              value={evidenceSummary}
              onChange={e => setEvidenceSummary(e.target.value)}
              placeholder="Explain how this evidence substantiates the audit finding..."
              className="w-full p-2 text-xs border border-slate-300 rounded-md text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEvidenceModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md"
            >
              Add to Locker
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        title="Escalate Case for Senior Review"
        subtitle="Refer this case dossier to Dr. Sunita Deshmukh (Senior Auditor)"
      >
        <div className="space-y-4">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-xs text-orange-900">
            <p className="font-semibold mb-1">Formal Escalation Confirmation:</p>
            <p>
              Submitting this case will transfer the dossier to the Senior Review queue for executive audit approval and potential vigilance referral.
            </p>
          </div>

          <div className="text-xs space-y-2">
            <p className="font-medium text-slate-700">Dossier Summary to be Transferred:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Contract: {contract.id} (₹{(contract.contractValue / 100000).toFixed(1)}L)</li>
              <li>Risk Score: {investigation.riskScore}/100 ({investigation.riskLevel})</li>
              <li>Evidence Items Attached: {existingCase ? existingCase.evidenceItems.length : 1}</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsEscalateModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleEscalateSubmit}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs"
            >
              Confirm Escalation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
