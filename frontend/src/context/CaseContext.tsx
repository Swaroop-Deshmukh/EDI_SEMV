'use client';

import React, { createContext, useContext, useState } from 'react';
import { InvestigationCase, CaseStatus, CaseEvidenceItem, CaseNote, CaseTimelineEvent, MOCK_CASES } from '@/mock/cases';
import { useAuth } from './AuthContext';

interface CaseContextType {
  cases: InvestigationCase[];
  getCaseById: (id: string) => InvestigationCase | undefined;
  getCaseByContractId: (contractId: string) => InvestigationCase | undefined;
  createCase: (newCase: Partial<InvestigationCase>) => InvestigationCase;
  updateCaseStatus: (caseId: string, status: CaseStatus, note?: string) => void;
  addNote: (caseId: string, content: string, isConfidential?: boolean) => void;
  addEvidence: (caseId: string, evidence: Omit<CaseEvidenceItem, 'id' | 'addedBy' | 'addedAt'>) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InvestigationCase[]>(MOCK_CASES);
  const { currentUser } = useAuth();

  const getCaseById = (id: string) => {
    return cases.find(c => c.id === id || c.caseNumber === id);
  };

  const getCaseByContractId = (contractId: string) => {
    return cases.find(c => c.primaryContractId === contractId);
  };

  const createCase = (data: Partial<InvestigationCase>): InvestigationCase => {
    const caseId = `CASE-2026-${String(cases.length + 143).padStart(4, '0')}`;
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

    const created: InvestigationCase = {
      id: caseId,
      caseNumber: caseId,
      title: data.title || `Investigation regarding Contract ${data.primaryContractId}`,
      primaryContractId: data.primaryContractId || 'C-UNKNOWN',
      primaryContractNumber: data.primaryContractNumber || 'GEM/2026/C-UNKNOWN',
      vendorId: data.vendorId || 'V-UNKNOWN',
      vendorName: data.vendorName || 'Unknown Vendor',
      buyerName: data.buyerName || 'Department of Public Works',
      riskScore: data.riskScore || 75,
      priority: (data.riskScore && data.riskScore >= 75) ? 'CRITICAL' : 'HIGH',
      status: 'NEW',
      assignedAuditorId: currentUser.id,
      assignedAuditorName: currentUser.name,
      assignedAuditorRole: currentUser.role,
      createdAt: nowStr,
      lastUpdatedAt: nowStr,
      summary: data.summary || 'Formal inquiry initiated by auditor based on detected procurement anomalies.',
      evidenceItems: data.evidenceItems || [],
      notes: [
        {
          id: `NOTE-${Date.now()}`,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          timestamp: nowStr,
          content: 'Case initiated in investigation workspace.',
          isConfidential: false
        }
      ],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: nowStr,
          title: 'Case Created',
          description: `Case dossier initiated for Contract ${data.primaryContractId} by ${currentUser.name}.`,
          actorName: currentUser.name,
          actorRole: currentUser.role,
          type: 'CREATION'
        }
      ],
      recommendedAction: data.recommendedAction || 'Collect supporting vouchers and verify competitive bid submissions.'
    };

    setCases(prev => [created, ...prev]);
    return created;
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus, noteContent?: string) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId && c.caseNumber !== caseId) return c;

        const updatedTimeline: CaseTimelineEvent[] = [
          ...c.timeline,
          {
            id: `TL-${Date.now()}`,
            timestamp: nowStr,
            title: `Status Changed to ${status.replace(/_/g, ' ')}`,
            description: noteContent || `Status updated by ${currentUser.name} (${currentUser.role}).`,
            actorName: currentUser.name,
            actorRole: currentUser.role,
            type: status === 'SENIOR_REVIEW' || status === 'ESCALATED' ? 'ESCALATION' : 'STATUS_CHANGE'
          }
        ];

        const updatedNotes: CaseNote[] = noteContent
          ? [
              ...c.notes,
              {
                id: `NOTE-${Date.now()}`,
                authorName: currentUser.name,
                authorRole: currentUser.role,
                timestamp: nowStr,
                content: noteContent,
                isConfidential: status === 'SENIOR_REVIEW'
              }
            ]
          : c.notes;

        return {
          ...c,
          status,
          lastUpdatedAt: nowStr,
          timeline: updatedTimeline,
          notes: updatedNotes
        };
      })
    );
  };

  const addNote = (caseId: string, content: string, isConfidential: boolean = false) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    const newNote: CaseNote = {
      id: `NOTE-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: nowStr,
      content,
      isConfidential
    };

    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId && c.caseNumber !== caseId) return c;
        return {
          ...c,
          lastUpdatedAt: nowStr,
          notes: [...c.notes, newNote],
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: nowStr,
              title: 'Auditor Note Added',
              description: `Note added by ${currentUser.name}.`,
              actorName: currentUser.name,
              actorRole: currentUser.role,
              type: 'NOTE'
            }
          ]
        };
      })
    );
  };

  const addEvidence = (caseId: string, evidenceData: Omit<CaseEvidenceItem, 'id' | 'addedBy' | 'addedAt'>) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    const newEvidence: CaseEvidenceItem = {
      ...evidenceData,
      id: `EV-${Date.now()}`,
      addedBy: currentUser.name,
      addedAt: nowStr
    };

    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId && c.caseNumber !== caseId) return c;
        return {
          ...c,
          lastUpdatedAt: nowStr,
          evidenceItems: [...c.evidenceItems, newEvidence],
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: nowStr,
              title: 'Evidence Item Added',
              description: `Added "${evidenceData.title}" to Case Evidence Locker.`,
              actorName: currentUser.name,
              actorRole: currentUser.role,
              type: 'EVIDENCE'
            }
          ]
        };
      })
    );
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        getCaseById,
        getCaseByContractId,
        createCase,
        updateCaseStatus,
        addNote,
        addEvidence
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) throw new Error('useCase must be used within a CaseProvider');
  return context;
};
