export interface MLEvidenceFactor {
  feature: string;
  category: 'Competition' | 'Timing' | 'Pricing' | 'Forensic';
  observedValue: string;
  referenceValue: string;
  deviation: string;
  contributionScore: number; // 0 to 100
  direction: 'RISK_INCREASING' | 'NEUTRAL' | 'RISK_REDUCING';
}

export interface Investigation {
  id: string;
  contractId: string;
  contractNumber: string;
  title: string;
  vendorId: string;
  vendorName: string;
  buyerId: string;
  buyerName: string;
  contractValue: number;
  datePublished: string;
  procurementCategory: 'Works' | 'Goods' | 'Services';
  procurementMethod: string;
  biddersCount: number;
  submissionWindowDays: number;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'UNDER_REVIEW' | 'EVIDENCE_COLLECTED' | 'SENIOR_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  assignedAuditorId: string;
  assignedAuditorName: string;
  lastUpdated: string;
  primaryTrigger: string;
  redFlags: string[];
  mlComponentScores: {
    pricingAnomaly: number;
    vendorBehavior: number;
    transactionPattern: number;
    proceduralTiming: number;
  };
  evidenceFactors: MLEvidenceFactor[];
  aiExplanation: string;
  suggestedAuditorActions: string[];
  relatedCaseId?: string;
}

export const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: 'INV-2026-0142',
    contractId: 'C-1042',
    contractNumber: 'GEM/2026/C/1042-PWBNH',
    title: 'Supply and Installation of High-Capacity Medical Gas Pipelines & Oxygen Flow Controls',
    vendorId: 'V-001',
    vendorName: 'ABC Supplies Pvt Ltd',
    buyerId: 'B-101',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    contractValue: 48500000,
    datePublished: '2026-01-14',
    procurementCategory: 'Goods',
    procurementMethod: 'Single Tender',
    biddersCount: 1,
    submissionWindowDays: 3.0,
    riskScore: 87,
    riskLevel: 'CRITICAL',
    status: 'UNDER_REVIEW',
    assignedAuditorId: 'usr-001',
    assignedAuditorName: 'Rajesh Sharma',
    lastUpdated: '2026-02-18 10:45 AM',
    primaryTrigger: 'High-Value Single Bidder on Compressed 3-Day Window & Threshold Splitting Signature',
    redFlags: [
      'SINGLE_BIDDER_MONOPOLY',
      'CRITICALLY_COMPRESSED_WINDOW_3D',
      'SHARED_DIRECTOR_SYNDICATE',
      'HIGH_VALUE_DIRECT_ALLOCATION',
      'NEAR_APPROVAL_THRESHOLD_EVASION'
    ],
    mlComponentScores: {
      pricingAnomaly: 91,
      vendorBehavior: 78,
      transactionPattern: 84,
      proceduralTiming: 95
    },
    evidenceFactors: [
      {
        feature: 'Bidding Window Duration',
        category: 'Timing',
        observedValue: '3.0 Days',
        referenceValue: '14 - 21 Days',
        deviation: '-82.0% shorter than standard',
        contributionScore: 32,
        direction: 'RISK_INCREASING'
      },
      {
        feature: 'Competing Bidders Count',
        category: 'Competition',
        observedValue: '1 Bidder',
        referenceValue: '>= 3 Bidders',
        deviation: 'Zero market competition',
        contributionScore: 28,
        direction: 'RISK_INCREASING'
      },
      {
        feature: 'Tender Value Deviation for Buyer Department',
        category: 'Pricing',
        observedValue: '₹4.85 Crores',
        referenceValue: '₹92.4 Lakhs (Median)',
        deviation: '+3.8σ above department median',
        contributionScore: 24,
        direction: 'RISK_INCREASING'
      },
      {
        feature: 'Contract Splitting / Temporal Clustering',
        category: 'Forensic',
        observedValue: '3 Related Tenders in 14 Days',
        referenceValue: 'Isolated Tender Cycle',
        deviation: 'Cumulative split value ₹5.83 Cr',
        contributionScore: 16,
        direction: 'RISK_INCREASING'
      }
    ],
    aiExplanation: 'This transaction warrants priority audit review because it combines a high-value outlay (₹4.85 Cr) with zero competitive bidding and a compressed 3-day window published immediately prior to a weekend. Furthermore, graph entity resolution indicates the winning vendor shares corporate directorship with complementary co-bidders (V-002, V-003) across related sub-contracts.',
    suggestedAuditorActions: [
      'Examine technical pre-qualification clauses for tailored restrictive criteria.',
      'Request physical invoice vouchers and bill of quantities (BOQ) delivery challans.',
      'Cross-check DIN records of Sanjay Verma across Apex Infra Solutions.',
      'Escalate to Senior Auditor for formal inquiry under Rule 144 of General Financial Rules.'
    ],
    relatedCaseId: 'CASE-2026-0142'
  },
  {
    id: 'INV-2026-0089',
    contractId: 'C-889',
    contractNumber: 'GEM/2025/C/889-PWBNH',
    title: 'Hospital HVAC Filtration and Emergency Power Auxiliary Overhaul',
    vendorId: 'V-002',
    vendorName: 'Apex Infra Solutions Ltd',
    buyerId: 'B-101',
    buyerName: 'National Health Mission & State Medical Supplies Corp',
    contractValue: 4920000,
    datePublished: '2026-01-20',
    procurementCategory: 'Works',
    procurementMethod: 'Limited Tender',
    biddersCount: 2,
    submissionWindowDays: 4.0,
    riskScore: 78,
    riskLevel: 'HIGH',
    status: 'EVIDENCE_COLLECTED',
    assignedAuditorId: 'usr-001',
    assignedAuditorName: 'Rajesh Sharma',
    lastUpdated: '2026-02-17 04:20 PM',
    primaryTrigger: 'Suspected Bid-Rigging & Statutory Limit Avoidance (₹49.2L vs ₹50L cutoff)',
    redFlags: [
      'NEAR_STATUTORY_THRESHOLD_50L',
      'ROTATIONAL_COMPLEMENTARY_BIDDING',
      'SHORT_SUBMISSION_WINDOW_4D'
    ],
    mlComponentScores: {
      pricingAnomaly: 76,
      vendorBehavior: 82,
      transactionPattern: 79,
      proceduralTiming: 75
    },
    evidenceFactors: [
      {
        feature: 'Statutory Approval Threshold Proximity',
        category: 'Forensic',
        observedValue: '₹49.20 Lakhs',
        referenceValue: '₹50.00 Lakhs (Cutoff)',
        deviation: '1.6% below administrative sanction ceiling',
        contributionScore: 35,
        direction: 'RISK_INCREASING'
      },
      {
        feature: 'Co-Bid Price Variance',
        category: 'Competition',
        observedValue: '1.2% difference between 2 bids',
        referenceValue: '>= 8.5% typical market spread',
        deviation: 'Cover bidding signature',
        contributionScore: 25,
        direction: 'RISK_INCREASING'
      }
    ],
    aiExplanation: 'The tender value sits at ₹49.20 Lakhs—just below the ₹50 Lakh mandatory open e-tendering threshold. The runner-up bid by ABC Supplies Pvt Ltd was submitted 12 minutes prior to deadline with only a 1.2% artificial price gap.',
    suggestedAuditorActions: [
      'Inspect IP submission logs for both bids.',
      'Verify if competitive bidder ABC Supplies has shared beneficial ownership.'
    ],
    relatedCaseId: 'CASE-2026-0142'
  },
  {
    id: 'INV-2026-0220',
    contractId: 'C-2204',
    contractNumber: 'KAAC/2025/RD-2204',
    title: 'Rural Arterial Road Paving and Concrete Embankment Construction - Package 3',
    vendorId: 'V-005',
    vendorName: 'Horizon Buildcon Ltd',
    buyerId: 'B-103',
    buyerName: 'Karbi Anglong Autonomous Council',
    contractValue: 76700000,
    datePublished: '2025-12-01',
    procurementCategory: 'Works',
    procurementMethod: 'Limited Tender',
    biddersCount: 1,
    submissionWindowDays: 3.0,
    riskScore: 71,
    riskLevel: 'HIGH',
    status: 'NEW',
    assignedAuditorId: 'usr-002',
    assignedAuditorName: 'Dr. Sunita Deshmukh',
    lastUpdated: '2026-02-15 02:10 PM',
    primaryTrigger: 'Single-Bidder on High-Value Works with 3-Day Window in Autonomous Council',
    redFlags: [
      'SINGLE_BIDDER_WORKS',
      'WINDOW_UNDER_72_HOURS',
      'LIMITED_TENDER_PROCEDURE_BYPASS'
    ],
    mlComponentScores: {
      pricingAnomaly: 68,
      vendorBehavior: 62,
      transactionPattern: 75,
      proceduralTiming: 80
    },
    evidenceFactors: [
      {
        feature: 'Submission Window',
        category: 'Timing',
        observedValue: '3.0 Days',
        referenceValue: '21 Days for Capital Works',
        deviation: '-85.7% window reduction',
        contributionScore: 40,
        direction: 'RISK_INCREASING'
      }
    ],
    aiExplanation: 'Capital works project valued at ₹7.67 Cr was executed via Limited Tender instead of open public tender with only a 3-day notice period.',
    suggestedAuditorActions: [
      'Review council administrative resolution granting exemption from open tendering.'
    ]
  }
];
