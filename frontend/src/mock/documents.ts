export interface DocumentEvidence {
  id: string;
  documentNumber: string;
  name: string;
  type: 'INVOICE' | 'TENDER_NOTICE' | 'TECHNICAL_EVALUATION' | 'BOQ_SCHEDULE' | 'BANK_GUARANTEE';
  contractId: string;
  contractNumber: string;
  vendorId: string;
  vendorName: string;
  uploadDate: string;
  fileSizeBytes: number;
  ocrStatus: 'PROCESSED' | 'FLAGGED_ANOMALY' | 'PENDING';
  ocrConfidence: number; // 0 - 100
  extractedMetadata: {
    billedVendorName: string;
    billedGSTIN: string;
    invoiceAmount: number;
    invoiceDate: string;
    paymentTerms: string;
    lineItemsCount: number;
    flaggedIrregularities: string[];
    rawTextExcerpt: string;
  };
  previewUrl?: string;
}

export const MOCK_DOCUMENTS: DocumentEvidence[] = [
  {
    id: 'DOC-8841',
    documentNumber: 'INV/2026/02/8841',
    name: 'Invoice_8841_Mobilization_Advance.pdf',
    type: 'INVOICE',
    contractId: 'C-1042',
    contractNumber: 'GEM/2026/C/1042-PWBNH',
    vendorId: 'V-001',
    vendorName: 'ABC Supplies Pvt Ltd',
    uploadDate: '2026-02-04',
    fileSizeBytes: 2450000,
    ocrStatus: 'FLAGGED_ANOMALY',
    ocrConfidence: 96.4,
    extractedMetadata: {
      billedVendorName: 'ABC Supplies Pvt Ltd',
      billedGSTIN: '18AAACA1042K1Z5',
      invoiceAmount: 19400000, // ₹1.94 Cr (40% advance)
      invoiceDate: '2026-02-04',
      paymentTerms: '100% Immediate Mobilization Advance',
      lineItemsCount: 4,
      flaggedIrregularities: [
        'Advance claim exceeds standard 10% GFR limit without bank guarantee notation',
        'Invoice issued within 48 hours of single-source tender sanction'
      ],
      rawTextExcerpt: 'TAX INVOICE - ABC SUPPLIES PVT LTD\nGSTIN: 18AAACA1042K1Z5\nBill To: Mission Director, National Health Mission, Assam\nRef Contract: GEM/2026/C/1042-PWBNH\nItem 1: High-Capacity Medical Gas Pipeline Infrastructure - Mobilization Advance (40%)\nTotal Payable: INR 1,94,00,000.00 (Rupees One Crore Ninety Four Lakhs Only)\nAuthorized Signatory: Sanjay Verma (Director)'
    }
  },
  {
    id: 'DOC-1042-TN',
    documentNumber: 'TN/2026/NHM-0142',
    name: 'Tender_Notice_NIT_Gas_Pipeline.pdf',
    type: 'TENDER_NOTICE',
    contractId: 'C-1042',
    contractNumber: 'GEM/2026/C/1042-PWBNH',
    vendorId: 'V-001',
    vendorName: 'ABC Supplies Pvt Ltd',
    uploadDate: '2026-01-14',
    fileSizeBytes: 1280000,
    ocrStatus: 'FLAGGED_ANOMALY',
    ocrConfidence: 98.1,
    extractedMetadata: {
      billedVendorName: 'State Medical Supplies Corp',
      billedGSTIN: 'N/A (Procuring Entity)',
      invoiceAmount: 48500000,
      invoiceDate: '2026-01-14',
      paymentTerms: 'Public Tender NIT',
      lineItemsCount: 1,
      flaggedIrregularities: [
        'Notice published on Friday 18:30 with opening scheduled Monday 10:00 (under 72 hours)',
        'Mandatory proprietary brand specification clause included in Section 4'
      ],
      rawTextExcerpt: 'NOTICE INVITING TENDER - NIT No. NHM/2026/MED-GAS/0142\nPublish Date: 14-Jan-2026 18:30:00\nBid Submission End Date: 17-Jan-2026 10:00:00\nEligibility Criteria: Vendor must have prior supply certificate of Model OxGen-V4 exclusively within State territory.\nEstimated Cost: INR 4,85,00,000'
    }
  },
  {
    id: 'DOC-889-EV',
    documentNumber: 'TE/2026/HVAC-889',
    name: 'Technical_Evaluation_Summary_C889.pdf',
    type: 'TECHNICAL_EVALUATION',
    contractId: 'C-889',
    contractNumber: 'GEM/2025/C/889-PWBNH',
    vendorId: 'V-002',
    vendorName: 'Apex Infra Solutions Ltd',
    uploadDate: '2026-01-26',
    fileSizeBytes: 980000,
    ocrStatus: 'PROCESSED',
    ocrConfidence: 94.8,
    extractedMetadata: {
      billedVendorName: 'Apex Infra Solutions Ltd / ABC Supplies Pvt Ltd',
      billedGSTIN: '18AABCA9921B1Z2',
      invoiceAmount: 4920000,
      invoiceDate: '2026-01-26',
      paymentTerms: 'Milestone Delivery',
      lineItemsCount: 2,
      flaggedIrregularities: [
        'Both submitted bid technical proposals have matching PDF author metadata and typography'
      ],
      rawTextExcerpt: 'MINUTES OF TECHNICAL COMMITTEE EVALUATION\nParticipating Bidders:\n1. Apex Infra Solutions Ltd - INR 49,20,000 (L1 - Qualified)\n2. ABC Supplies Pvt Ltd - INR 49,80,000 (L2 - Qualified)\nCommittee Recommendation: Award contract to L1 bidder.'
    }
  }
];
