export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 
    | 'LOGIN'
    | 'LOGOUT'
    | 'VIEW_TRANSACTION'
    | 'VIEW_VENDOR'
    | 'VIEW_DOCUMENT'
    | 'CREATE_CASE'
    | 'UPDATE_CASE'
    | 'ADD_NOTE'
    | 'ADD_EVIDENCE'
    | 'ESCALATE_CASE'
    | 'EXPORT_REPORT'
    | 'CHANGE_USER_ROLE';
  resourceType: 'TRANSACTION' | 'CONTRACT' | 'VENDOR' | 'CASE' | 'DOCUMENT' | 'USER' | 'REPORT' | 'AUTH';
  resourceId: string;
  details: string;
  ipAddress: string;
  terminalId: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-9941',
    userId: 'usr-002',
    userName: 'Dr. Sunita Deshmukh',
    userRole: 'Senior Auditor',
    action: 'ESCALATE_CASE',
    resourceType: 'CASE',
    resourceId: 'CASE-2026-0142',
    details: 'Initiated formal senior review dossier for State Vigilance referral',
    ipAddress: '10.14.82.114',
    terminalId: 'SEC-WS-09',
    timestamp: '2026-02-18 11:45:12 AM',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9940',
    userId: 'usr-001',
    userName: 'Rajesh Sharma',
    userRole: 'Auditor',
    action: 'ADD_EVIDENCE',
    resourceType: 'CASE',
    resourceId: 'CASE-2026-0142',
    details: 'Added MCA Directorship Graph EV-04 into Case Evidence Locker',
    ipAddress: '10.14.82.98',
    terminalId: 'AUD-WS-02',
    timestamp: '2026-02-18 11:20:05 AM',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9939',
    userId: 'usr-001',
    userName: 'Rajesh Sharma',
    userRole: 'Auditor',
    action: 'VIEW_DOCUMENT',
    resourceType: 'DOCUMENT',
    resourceId: 'DOC-8841',
    details: 'Inspected OCR metadata and PDF preview of Invoice_8841_Mobilization_Advance.pdf',
    ipAddress: '10.14.82.98',
    terminalId: 'AUD-WS-02',
    timestamp: '2026-02-18 10:15:32 AM',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9938',
    userId: 'usr-001',
    userName: 'Rajesh Sharma',
    userRole: 'Auditor',
    action: 'VIEW_TRANSACTION',
    resourceType: 'TRANSACTION',
    resourceId: 'C-1042',
    details: 'Opened Investigation Workspace for Contract C-1042 (ABC Supplies Pvt Ltd)',
    ipAddress: '10.14.82.98',
    terminalId: 'AUD-WS-02',
    timestamp: '2026-02-18 09:42:19 AM',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-9937',
    userId: 'usr-001',
    userName: 'Rajesh Sharma',
    userRole: 'Auditor',
    action: 'LOGIN',
    resourceType: 'AUTH',
    resourceId: 'SESSION-8842',
    details: 'Authenticated via Government SSO Portal / 2FA Token',
    ipAddress: '10.14.82.98',
    terminalId: 'AUD-WS-02',
    timestamp: '2026-02-18 09:30:00 AM',
    status: 'SUCCESS'
  }
];
