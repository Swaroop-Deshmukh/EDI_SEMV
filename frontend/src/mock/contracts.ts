export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  vendorId: string;
  vendorName: string;
  buyerId: string;
  buyerName: string;
  department: string;
  contractValue: number;
  currency: string;
  datePublished: string;
  awardDate: string;
  bidOpeningDate: string;
  submissionWindowDays: number;
  procurementCategory: 'Works' | 'Goods' | 'Services';
  procurementMethod: 'Open Tender' | 'Single Tender' | 'Limited Tender' | 'Two-Stage Tender';
  status: 'Awarded' | 'Active' | 'Under Audit' | 'Completed' | 'Terminated';
  biddersCount: number;
  biddersList: { vendorId: string; vendorName: string; bidAmount: number; isWinningBid: boolean }[];
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  relatedInvestigationId?: string;
  relatedCaseId?: string;
  relatedContractIds: string[];
}

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'C-1042',
    contractNumber: 'GEM/2026/C/1042-PWBNH',
    title: 'Supply and Installation of High-Capacity Medical Gas Pipelines & Oxygen Flow Controls',
    vendorId: 'V-001',
    vendorName: 'ABC Supplies Pvt Ltd',
    buyerId: 'B-101',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    department: 'Health and Family Welfare Department',
    contractValue: 48500000, // ₹4.85 Cr
    currency: 'INR',
    datePublished: '2026-01-14',
    awardDate: '2026-02-02',
    bidOpeningDate: '2026-01-17',
    submissionWindowDays: 3.0,
    procurementCategory: 'Goods',
    procurementMethod: 'Single Tender',
    status: 'Under Audit',
    biddersCount: 1,
    biddersList: [
      { vendorId: 'V-001', vendorName: 'ABC Supplies Pvt Ltd', bidAmount: 48500000, isWinningBid: true }
    ],
    riskScore: 87,
    riskLevel: 'CRITICAL',
    relatedInvestigationId: 'INV-2026-0142',
    relatedCaseId: 'CASE-2026-0142',
    relatedContractIds: ['C-889', 'C-1402'],
  },
  {
    id: 'C-889',
    contractNumber: 'GEM/2025/C/889-PWBNH',
    title: 'Hospital HVAC Filtration and Emergency Power Auxiliary Overhaul',
    vendorId: 'V-002',
    vendorName: 'Apex Infra Solutions Ltd',
    buyerId: 'B-101',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    department: 'Health and Family Welfare Department',
    contractValue: 4920000, // ₹49.2 Lakhs (Near 50L statutory threshold)
    currency: 'INR',
    datePublished: '2026-01-20',
    awardDate: '2026-02-05',
    bidOpeningDate: '2026-01-24',
    submissionWindowDays: 4.0,
    procurementCategory: 'Works',
    procurementMethod: 'Limited Tender',
    status: 'Under Audit',
    biddersCount: 2,
    biddersList: [
      { vendorId: 'V-002', vendorName: 'Apex Infra Solutions Ltd', bidAmount: 4920000, isWinningBid: true },
      { vendorId: 'V-001', vendorName: 'ABC Supplies Pvt Ltd', bidAmount: 4980000, isWinningBid: false }
    ],
    riskScore: 78,
    riskLevel: 'HIGH',
    relatedInvestigationId: 'INV-2026-0089',
    relatedCaseId: 'CASE-2026-0142',
    relatedContractIds: ['C-1042', 'C-1402'],
  },
  {
    id: 'C-1402',
    contractNumber: 'PWD/2026/R-1402',
    title: 'Procurement of Specialized Diagnostic Monitoring Consumables (Batch IV)',
    vendorId: 'V-003',
    vendorName: 'Delta Tech Logistics & Trading',
    buyerId: 'B-101',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    department: 'Health and Family Welfare Department',
    contractValue: 4900000, // ₹49.0 Lakhs (Contract splitting suspected)
    currency: 'INR',
    datePublished: '2026-01-22',
    awardDate: '2026-02-08',
    bidOpeningDate: '2026-01-26',
    submissionWindowDays: 4.0,
    procurementCategory: 'Goods',
    procurementMethod: 'Limited Tender',
    status: 'Under Audit',
    biddersCount: 2,
    biddersList: [
      { vendorId: 'V-003', vendorName: 'Delta Tech Logistics & Trading', bidAmount: 4900000, isWinningBid: true },
      { vendorId: 'V-002', vendorName: 'Apex Infra Solutions Ltd', bidAmount: 4950000, isWinningBid: false }
    ],
    riskScore: 74,
    riskLevel: 'HIGH',
    relatedInvestigationId: 'INV-2026-0142',
    relatedCaseId: 'CASE-2026-0142',
    relatedContractIds: ['C-1042', 'C-889'],
  },
  {
    id: 'C-3091',
    contractNumber: 'GMC/2026/W-3091',
    title: 'Stormwater Drainage Channel Reconstruction & Culvert Widening Sector 9',
    vendorId: 'V-004',
    vendorName: 'Vanguard Civil Infrastructure LLP',
    buyerId: 'B-102',
    buyerName: 'Guwahati Municipal Corporation',
    department: 'Urban Development & Public Works',
    contractValue: 125000000, // ₹12.5 Cr
    currency: 'INR',
    datePublished: '2025-11-05',
    awardDate: '2025-12-15',
    bidOpeningDate: '2025-11-28',
    submissionWindowDays: 23.0,
    procurementCategory: 'Works',
    procurementMethod: 'Open Tender',
    status: 'Active',
    biddersCount: 5,
    biddersList: [
      { vendorId: 'V-004', vendorName: 'Vanguard Civil Infrastructure LLP', bidAmount: 125000000, isWinningBid: true },
      { vendorId: 'V-005', vendorName: 'Horizon Buildcon Ltd', bidAmount: 129000000, isWinningBid: false },
      { vendorId: 'V-006', vendorName: 'Metro Earthmovers', bidAmount: 134000000, isWinningBid: false }
    ],
    riskScore: 22,
    riskLevel: 'LOW',
    relatedContractIds: [],
  },
  {
    id: 'C-2204',
    contractNumber: 'KAAC/2025/RD-2204',
    title: 'Rural Arterial Road Paving and Concrete Embankment Construction - Package 3',
    vendorId: 'V-005',
    vendorName: 'Horizon Buildcon Ltd',
    buyerId: 'B-103',
    buyerName: 'Karbi Anglong Autonomous Council',
    department: 'Public Works Roads Department',
    contractValue: 76700000, // ₹7.67 Cr
    currency: 'INR',
    datePublished: '2025-12-01',
    awardDate: '2026-01-10',
    bidOpeningDate: '2025-12-04',
    submissionWindowDays: 3.0,
    procurementCategory: 'Works',
    procurementMethod: 'Limited Tender',
    status: 'Under Audit',
    biddersCount: 1,
    biddersList: [
      { vendorId: 'V-005', vendorName: 'Horizon Buildcon Ltd', bidAmount: 76700000, isWinningBid: true }
    ],
    riskScore: 71,
    riskLevel: 'HIGH',
    relatedInvestigationId: 'INV-2026-0220',
    relatedContractIds: [],
  }
];
