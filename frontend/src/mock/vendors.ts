export interface Vendor {
  id: string;
  name: string;
  panNumber: string;
  gstin: string;
  registrationDate: string;
  directors: { name: string; din: string; sharesPct: number }[];
  registeredAddress: string;
  city: string;
  state: string;
  totalContractsCount: number;
  totalContractValue: number;
  activeInvestigationsCount: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskIndicators: string[];
  relatedVendors: { vendorId: string; vendorName: string; relationship: string }[];
  recentContractIds: string[];
}

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'V-001',
    name: 'ABC Supplies Pvt Ltd',
    panNumber: 'AAACA1042K',
    gstin: '18AAACA1042K1Z5',
    registrationDate: '2021-04-12',
    directors: [
      { name: 'Sanjay Verma', din: '08429112', sharesPct: 60 },
      { name: 'Meenakshi Verma', din: '09114201', sharesPct: 40 }
    ],
    registeredAddress: 'Plot 42, Industrial Area Phase II, VIP Road',
    city: 'Guwahati',
    state: 'Assam',
    totalContractsCount: 14,
    totalContractValue: 124500000,
    activeInvestigationsCount: 2,
    riskScore: 84,
    riskLevel: 'HIGH',
    riskIndicators: [
      'Shared Director DIN with Apex Infra Solutions Ltd',
      'Common registered IP & GST address with Delta Tech Logistics',
      'High win-rate in single-bidder procurement tenders (85%)',
      'Rotational complementary bidding pattern with V-002 & V-003'
    ],
    relatedVendors: [
      { vendorId: 'V-002', vendorName: 'Apex Infra Solutions Ltd', relationship: 'Shared Director (Sanjay Verma)' },
      { vendorId: 'V-003', vendorName: 'Delta Tech Logistics & Trading', relationship: 'Matching Registered Postal Address & IP subnet' }
    ],
    recentContractIds: ['C-1042', 'C-889', 'C-1402']
  },
  {
    id: 'V-002',
    name: 'Apex Infra Solutions Ltd',
    panNumber: 'AABCA9921B',
    gstin: '18AABCA9921B1Z2',
    registrationDate: '2022-01-18',
    directors: [
      { name: 'Sanjay Verma', din: '08429112', sharesPct: 50 },
      { name: 'Pradeep Goel', din: '07119023', sharesPct: 50 }
    ],
    registeredAddress: 'Suite 301, Commerce Tower, G.S. Road',
    city: 'Guwahati',
    state: 'Assam',
    totalContractsCount: 9,
    totalContractValue: 62100000,
    activeInvestigationsCount: 1,
    riskScore: 78,
    riskLevel: 'HIGH',
    riskIndicators: [
      'Shared Director with ABC Supplies Pvt Ltd',
      'Co-bidder in multiple limited tenders without genuine price variance',
      'Frequent contract splitting clusters detected under ₹50L threshold'
    ],
    relatedVendors: [
      { vendorId: 'V-001', vendorName: 'ABC Supplies Pvt Ltd', relationship: 'Common Director (Sanjay Verma)' },
      { vendorId: 'V-003', vendorName: 'Delta Tech Logistics & Trading', relationship: 'Co-bidding syndicate' }
    ],
    recentContractIds: ['C-889', 'C-1402']
  },
  {
    id: 'V-003',
    name: 'Delta Tech Logistics & Trading',
    panNumber: 'AACCD4419E',
    gstin: '18AACCD4419E1Z8',
    registrationDate: '2023-08-01',
    directors: [
      { name: 'Pradeep Goel', din: '07119023', sharesPct: 100 }
    ],
    registeredAddress: 'Plot 42, Industrial Area Phase II, VIP Road',
    city: 'Guwahati',
    state: 'Assam',
    totalContractsCount: 6,
    totalContractValue: 28400000,
    activeInvestigationsCount: 1,
    riskScore: 73,
    riskLevel: 'HIGH',
    riskIndicators: [
      'Co-located with ABC Supplies Pvt Ltd',
      'Bids submitted within minutes of competing vendors in same tender'
    ],
    relatedVendors: [
      { vendorId: 'V-001', vendorName: 'ABC Supplies Pvt Ltd', relationship: 'Identical Physical Address' },
      { vendorId: 'V-002', vendorName: 'Apex Infra Solutions Ltd', relationship: 'Common Director (Pradeep Goel)' }
    ],
    recentContractIds: ['C-1402']
  },
  {
    id: 'V-004',
    name: 'Vanguard Civil Infrastructure LLP',
    panNumber: 'AAEFV8812L',
    gstin: '18AAEFV8812L1ZF',
    registrationDate: '2014-06-19',
    directors: [
      { name: 'Hemen Kalita', din: '03144192', sharesPct: 70 },
      { name: 'Nabanita Bora', din: '04910281', sharesPct: 30 }
    ],
    registeredAddress: 'NH-37 Highway Crossing, Khanapara',
    city: 'Guwahati',
    state: 'Assam',
    totalContractsCount: 38,
    totalContractValue: 984000000,
    activeInvestigationsCount: 0,
    riskScore: 18,
    riskLevel: 'LOW',
    riskIndicators: [
      'Standard compliant vendor with high bidding competition participation'
    ],
    relatedVendors: [],
    recentContractIds: ['C-3091']
  },
  {
    id: 'V-005',
    name: 'Horizon Buildcon Ltd',
    panNumber: 'AAACH7741M',
    gstin: '18AAACH7741M1ZX',
    registrationDate: '2018-09-11',
    directors: [
      { name: 'Tarun Barua', din: '06819230', sharesPct: 100 }
    ],
    registeredAddress: 'Sector 4, Dispur Capital Complex',
    city: 'Guwahati',
    state: 'Assam',
    totalContractsCount: 19,
    totalContractValue: 215000000,
    activeInvestigationsCount: 1,
    riskScore: 69,
    riskLevel: 'HIGH',
    riskIndicators: [
      'Single-bidder win on ₹7.67 Cr road works contract with 3-day window'
    ],
    relatedVendors: [],
    recentContractIds: ['C-2204', 'C-3091']
  }
];
