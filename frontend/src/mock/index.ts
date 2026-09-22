export * from './auth';
export * from './contracts';
export * from './vendors';
export * from './investigations';
export * from './cases';
export * from './network';
export * from './documents';
export * from './auditLogs';
export * from './notifications';

import { MOCK_CONTRACTS } from './contracts';
import { MOCK_VENDORS } from './vendors';
import { MOCK_CASES } from './cases';
import { MOCK_DOCUMENTS } from './documents';
import { MOCK_INVESTIGATIONS } from './investigations';

export interface GlobalSearchResult {
  id: string;
  type: 'CONTRACT' | 'VENDOR' | 'CASE' | 'DOCUMENT' | 'INVESTIGATION';
  title: string;
  subtitle: string;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  link: string;
}

export function performGlobalSearch(query: string): GlobalSearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: GlobalSearchResult[] = [];

  // Search Contracts
  MOCK_CONTRACTS.forEach(c => {
    if (
      c.id.toLowerCase().includes(q) ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.vendorName.toLowerCase().includes(q)
    ) {
      results.push({
        id: c.id,
        type: 'CONTRACT',
        title: `${c.id} - ${c.contractNumber}`,
        subtitle: `${c.title} • ${c.vendorName} • ₹${(c.contractValue / 100000).toFixed(1)}L`,
        riskScore: c.riskScore,
        riskLevel: c.riskLevel,
        link: `/procurement/contracts/${c.id}`
      });
    }
  });

  // Search Vendors
  MOCK_VENDORS.forEach(v => {
    if (
      v.id.toLowerCase().includes(q) ||
      v.name.toLowerCase().includes(q) ||
      v.panNumber.toLowerCase().includes(q) ||
      v.gstin.toLowerCase().includes(q)
    ) {
      results.push({
        id: v.id,
        type: 'VENDOR',
        title: `${v.name} (${v.id})`,
        subtitle: `PAN: ${v.panNumber} • GST: ${v.gstin} • ${v.totalContractsCount} Contracts`,
        riskScore: v.riskScore,
        riskLevel: v.riskLevel,
        link: `/entities/vendors/${v.id}`
      });
    }
  });

  // Search Cases
  MOCK_CASES.forEach(cs => {
    if (
      cs.id.toLowerCase().includes(q) ||
      cs.caseNumber.toLowerCase().includes(q) ||
      cs.title.toLowerCase().includes(q) ||
      cs.vendorName.toLowerCase().includes(q)
    ) {
      results.push({
        id: cs.id,
        type: 'CASE',
        title: `${cs.caseNumber}: ${cs.title}`,
        subtitle: `Vendor: ${cs.vendorName} • Assigned: ${cs.assignedAuditorName} • Status: ${cs.status}`,
        riskScore: cs.riskScore,
        riskLevel: cs.priority,
        link: `/investigations/cases`
      });
    }
  });

  // Search Documents
  MOCK_DOCUMENTS.forEach(d => {
    if (
      d.id.toLowerCase().includes(q) ||
      d.documentNumber.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.vendorName.toLowerCase().includes(q)
    ) {
      results.push({
        id: d.id,
        type: 'DOCUMENT',
        title: `${d.name} (${d.documentNumber})`,
        subtitle: `${d.type} for Contract ${d.contractNumber} • ${d.vendorName}`,
        link: `/evidence/documents`
      });
    }
  });

  return results.slice(0, 10);
}
