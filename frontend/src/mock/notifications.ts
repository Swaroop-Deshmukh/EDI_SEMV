export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'CRITICAL_RISK' | 'CASE_ASSIGNMENT' | 'SENIOR_REVIEW_REQUEST' | 'EVIDENCE_ADDED' | 'REPORT_READY';
  timestamp: string;
  isRead: boolean;
  targetLink: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Critical Risk Anomaly Flagged',
    description: 'Tender C-1042 (₹4.85 Cr) flagged with Risk Score 87 (Single Bidder + 3-Day Window).',
    type: 'CRITICAL_RISK',
    timestamp: '15 mins ago',
    isRead: false,
    targetLink: '/investigations/C-1042'
  },
  {
    id: 'NOTIF-02',
    title: 'Senior Review Action Requested',
    description: 'CASE-2026-0142 submitted for Senior Auditor evaluation and sign-off.',
    type: 'SENIOR_REVIEW_REQUEST',
    timestamp: '1 hour ago',
    isRead: false,
    targetLink: '/investigations/cases'
  },
  {
    id: 'NOTIF-03',
    title: 'OCR Ingestion Flagged Discrepancy',
    description: 'Advance claim in Invoice INV-8841 exceeds statutory ceiling for Contract C-1042.',
    type: 'EVIDENCE_ADDED',
    timestamp: '3 hours ago',
    isRead: true,
    targetLink: '/evidence/documents'
  },
  {
    id: 'NOTIF-04',
    title: 'Case Assigned to Your Queue',
    description: 'Investigation case CASE-2026-0142 has been assigned to Rajesh Sharma.',
    type: 'CASE_ASSIGNMENT',
    timestamp: 'Yesterday',
    isRead: true,
    targetLink: '/investigations/cases'
  }
];
