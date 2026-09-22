export type CaseStatus = 
  | 'NEW' 
  | 'UNDER_REVIEW' 
  | 'EVIDENCE_COLLECTED' 
  | 'SENIOR_REVIEW' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED';

export interface CaseEvidenceItem {
  id: string;
  type: 'CONTRACT' | 'INVOICE' | 'ML_ANALYSIS' | 'NETWORK_GRAPH' | 'AUDITOR_NOTE' | 'TENDER_NOTICE';
  title: string;
  referenceId: string;
  addedBy: string;
  addedAt: string;
  summary: string;
  isVerified: boolean;
}

export interface CaseNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  content: string;
  isConfidential: boolean;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  type: 'CREATION' | 'EVIDENCE' | 'STATUS_CHANGE' | 'ESCALATION' | 'REVIEW' | 'NOTE' | 'REPORT';
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  primaryContractId: string;
  primaryContractNumber: string;
  vendorId: string;
  vendorName: string;
  buyerName: string;
  riskScore: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: CaseStatus;
  assignedAuditorId: string;
  assignedAuditorName: string;
  assignedAuditorRole: string;
  createdAt: string;
  lastUpdatedAt: string;
  summary: string;
  evidenceItems: CaseEvidenceItem[];
  notes: CaseNote[];
  timeline: CaseTimelineEvent[];
  recommendedAction: string;
  finalFindings?: string;
}

export const MOCK_CASES: InvestigationCase[] = [
  {
    id: 'CASE-2026-0142',
    caseNumber: 'CASE-2026-0142',
    title: 'Inquiry into Collusive Bidding & Threshold Evasion in Medical Gas Supply Packages',
    primaryContractId: 'C-1042',
    primaryContractNumber: 'GEM/2026/C/1042-PWBNH',
    vendorId: 'V-001',
    vendorName: 'ABC Supplies Pvt Ltd',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    riskScore: 87,
    priority: 'CRITICAL',
    status: 'SENIOR_REVIEW',
    assignedAuditorId: 'usr-001',
    assignedAuditorName: 'Rajesh Sharma',
    assignedAuditorRole: 'Auditor',
    createdAt: '2026-02-10 09:30 AM',
    lastUpdatedAt: '2026-02-18 11:45 AM',
    summary: 'Auditor inquiry into contract C-1042 (₹4.85 Cr) and related sub-contracts C-889 & C-1402. Identified common directorship (DIN: 08429112) linking winning vendor with competing bidders, accompanied by a 3-day bidding window.',
    evidenceItems: [
      {
        id: 'EV-01',
        type: 'CONTRACT',
        title: 'Contract Agreement C-1042',
        referenceId: 'C-1042',
        addedBy: 'Rajesh Sharma',
        addedAt: '2026-02-10 10:15 AM',
        summary: 'Original single-source award copy signed on 2026-02-02 for ₹4,85,00,000.',
        isVerified: true
      },
      {
        id: 'EV-02',
        type: 'INVOICE',
        title: 'Advance Advance Payment Invoice INV-8841',
        referenceId: 'INV-8841',
        addedBy: 'Rajesh Sharma',
        addedAt: '2026-02-11 02:40 PM',
        summary: 'OCR extraction confirms 40% mobilization advance billed within 48 hours of contract award without bank guarantee verification.',
        isVerified: true
      },
      {
        id: 'EV-03',
        type: 'ML_ANALYSIS',
        title: 'ML Anomaly & SHAP Risk Profile',
        referenceId: 'ML-C1042',
        addedBy: 'System AI Auditor',
        addedAt: '2026-02-10 09:30 AM',
        summary: 'Risk Score 87/100 driven by Single Bidder + Compressed 3-Day Window + +3.8σ Price Deviation.',
        isVerified: true
      },
      {
        id: 'EV-04',
        type: 'NETWORK_GRAPH',
        title: 'Directorship & Co-Location Syndicate Graph',
        referenceId: 'NET-V001',
        addedBy: 'Rajesh Sharma',
        addedAt: '2026-02-14 11:20 AM',
        summary: 'MCA Registry cross-reference confirms Sanjay Verma holds 60% equity in V-001 and 50% equity in V-002.',
        isVerified: true
      },
      {
        id: 'EV-05',
        type: 'CONTRACT',
        title: 'Linked Complementary Contract C-889',
        referenceId: 'C-889',
        addedBy: 'Rajesh Sharma',
        addedAt: '2026-02-16 04:05 PM',
        summary: '₹49.20 Lakhs contract won by Apex Infra with ABC Supplies as cover bidder.',
        isVerified: true
      }
    ],
    notes: [
      {
        id: 'NOTE-01',
        authorName: 'Rajesh Sharma',
        authorRole: 'Auditor',
        timestamp: '2026-02-10 10:48 AM',
        content: 'Initiated formal inquiry following automated ML alert. Reviewed tender publication logs; published on Friday evening before holiday weekend.',
        isConfidential: false
      },
      {
        id: 'NOTE-02',
        authorName: 'Rajesh Sharma',
        authorRole: 'Auditor',
        timestamp: '2026-02-14 11:35 AM',
        content: 'Verified DIN 08429112 against Ministry of Corporate Affairs database. Direct conflict of interest and cartel formation suspected between V-001 and V-002.',
        isConfidential: false
      },
      {
        id: 'NOTE-03',
        authorName: 'Dr. Sunita Deshmukh',
        authorRole: 'Senior Auditor',
        timestamp: '2026-02-18 11:45 AM',
        content: 'Case received for senior review. Evidence package is comprehensive. Recommended for formal referral to State Vigilance Commission and freeze on remaining milestone disbursements.',
        isConfidential: true
      }
    ],
    timeline: [
      {
        id: 'TL-01',
        timestamp: '2026-02-10 09:30 AM',
        title: 'Case Created',
        description: 'Investigation case generated from critical anomaly detection on Contract C-1042.',
        actorName: 'Rajesh Sharma',
        actorRole: 'Auditor',
        type: 'CREATION'
      },
      {
        id: 'TL-02',
        timestamp: '2026-02-10 10:48 AM',
        title: 'ML Evidence Reviewed',
        description: 'Auditor confirmed high anomaly score (87/100) and SHAP feature contributions.',
        actorName: 'Rajesh Sharma',
        actorRole: 'Auditor',
        type: 'EVIDENCE'
      },
      {
        id: 'TL-03',
        timestamp: '2026-02-14 11:20 AM',
        title: 'Vendor Network Investigated',
        description: 'Director overlap discovered linking ABC Supplies Pvt Ltd and Apex Infra Solutions Ltd.',
        actorName: 'Rajesh Sharma',
        actorRole: 'Auditor',
        type: 'EVIDENCE'
      },
      {
        id: 'TL-04',
        timestamp: '2026-02-16 04:15 PM',
        title: 'Supporting Evidence Locked',
        description: '5 verified evidence items assembled into case dossier.',
        actorName: 'Rajesh Sharma',
        actorRole: 'Auditor',
        type: 'EVIDENCE'
      },
      {
        id: 'TL-05',
        timestamp: '2026-02-18 11:30 AM',
        title: 'Escalated for Senior Review',
        description: 'Case dossier submitted to Dr. Sunita Deshmukh (Senior Auditor) for executive approval.',
        actorName: 'Rajesh Sharma',
        actorRole: 'Auditor',
        type: 'ESCALATION'
      }
    ],
    recommendedAction: 'Freeze milestone release payments on C-1042 and initiate comprehensive audit inquiry into all FY 2025-26 awards under National Health Mission.'
  }
];
