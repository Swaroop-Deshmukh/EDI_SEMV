export type UserRole = 'Auditor' | 'Senior Auditor' | 'Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  department: string;
  avatarUrl?: string;
  assignedCasesCount: number;
}

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@audit.gov.in',
    role: 'Auditor',
    employeeId: 'AUD-8842',
    department: 'Directorate of Public Procurement Audits',
    assignedCasesCount: 5,
  },
  {
    id: 'usr-002',
    name: 'Dr. Sunita Deshmukh',
    email: 'sunita.deshmukh@audit.gov.in',
    role: 'Senior Auditor',
    employeeId: 'SAUD-1092',
    department: 'Central Vigilance & Forensic Cell',
    assignedCasesCount: 12,
  },
  {
    id: 'usr-003',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@gov.in',
    role: 'Administrator',
    employeeId: 'ADM-0041',
    department: 'System Security & Governance Admin',
    assignedCasesCount: 0,
  }
];

export const CURRENT_USER: User = MOCK_USERS[0];
