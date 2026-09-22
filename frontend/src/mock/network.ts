export interface GraphNode {
  id: string;
  label: string;
  type: 'VENDOR' | 'CONTRACT' | 'BUYER' | 'DIRECTOR' | 'ADDRESS';
  entityId: string;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  properties: Record<string, string | number>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'AWARDED_TO' | 'BIDS_ON' | 'DIRECTOR_OF' | 'LOCATED_AT' | 'COVER_BIDDER_WITH';
  properties?: Record<string, string | number>;
}

export const MOCK_NETWORK_GRAPH: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    {
      id: 'n-v1',
      label: 'ABC Supplies Pvt Ltd',
      type: 'VENDOR',
      entityId: 'V-001',
      riskScore: 84,
      riskLevel: 'HIGH',
      properties: { PAN: 'AAACA1042K', Contracts: 14, TotalValue: '₹12.45 Cr' },
      x: 350,
      y: 220
    },
    {
      id: 'n-v2',
      label: 'Apex Infra Solutions Ltd',
      type: 'VENDOR',
      entityId: 'V-002',
      riskScore: 78,
      riskLevel: 'HIGH',
      properties: { PAN: 'AABCA9921B', Contracts: 9, TotalValue: '₹6.21 Cr' },
      x: 550,
      y: 120
    },
    {
      id: 'n-v3',
      label: 'Delta Tech Logistics & Trading',
      type: 'VENDOR',
      entityId: 'V-003',
      riskScore: 73,
      riskLevel: 'HIGH',
      properties: { PAN: 'AACCD4419E', Contracts: 6, TotalValue: '₹2.84 Cr' },
      x: 550,
      y: 320
    },
    {
      id: 'n-c1',
      label: 'Contract C-1042 (₹4.85 Cr)',
      type: 'CONTRACT',
      entityId: 'C-1042',
      riskScore: 87,
      riskLevel: 'CRITICAL',
      properties: { Value: '₹4,85,00,000', Method: 'Single Tender', Bidders: 1 },
      x: 180,
      y: 140
    },
    {
      id: 'n-c2',
      label: 'Contract C-889 (₹49.2 L)',
      type: 'CONTRACT',
      entityId: 'C-889',
      riskScore: 78,
      riskLevel: 'HIGH',
      properties: { Value: '₹49,20,000', Method: 'Limited Tender', Bidders: 2 },
      x: 350,
      y: 60
    },
    {
      id: 'n-c3',
      label: 'Contract C-1402 (₹49.0 L)',
      type: 'CONTRACT',
      entityId: 'C-1402',
      riskScore: 74,
      riskLevel: 'HIGH',
      properties: { Value: '₹49,00,000', Method: 'Limited Tender', Bidders: 2 },
      x: 350,
      y: 380
    },
    {
      id: 'n-b1',
      label: 'National Health Mission',
      type: 'BUYER',
      entityId: 'B-101',
      properties: { Department: 'Health & Family Welfare', ActiveAwards: '₹580 Cr' },
      x: 80,
      y: 220
    },
    {
      id: 'n-dir1',
      label: 'Sanjay Verma (Director)',
      type: 'DIRECTOR',
      entityId: 'DIN-08429112',
      properties: { DIN: '08429112', Role: 'Managing Director' },
      x: 450,
      y: 170
    },
    {
      id: 'n-addr1',
      label: 'Plot 42 VIP Road Guwahati',
      type: 'ADDRESS',
      entityId: 'ADDR-VIP-42',
      properties: { Type: 'Common Registered Office' },
      x: 450,
      y: 270
    }
  ],
  edges: [
    { id: 'e-1', source: 'n-c1', target: 'n-b1', label: 'PROCURED_BY', type: 'AWARDED_TO' },
    { id: 'e-2', source: 'n-c1', target: 'n-v1', label: 'AWARDED_TO (100%)', type: 'AWARDED_TO' },
    { id: 'e-3', source: 'n-c2', target: 'n-v2', label: 'AWARDED_TO', type: 'AWARDED_TO' },
    { id: 'e-4', source: 'n-c2', target: 'n-v1', label: 'COVER_BID (-1.2%)', type: 'BIDS_ON' },
    { id: 'e-5', source: 'n-c3', target: 'n-v3', label: 'AWARDED_TO', type: 'AWARDED_TO' },
    { id: 'e-6', source: 'n-c3', target: 'n-v2', label: 'COVER_BID (-1.0%)', type: 'BIDS_ON' },
    { id: 'e-7', source: 'n-v1', target: 'n-dir1', label: 'DIRECTOR (60%)', type: 'DIRECTOR_OF' },
    { id: 'e-8', source: 'n-v2', target: 'n-dir1', label: 'DIRECTOR (50%)', type: 'DIRECTOR_OF' },
    { id: 'e-9', source: 'n-v1', target: 'n-addr1', label: 'LOCATED_AT', type: 'LOCATED_AT' },
    { id: 'e-10', source: 'n-v3', target: 'n-addr1', label: 'LOCATED_AT', type: 'LOCATED_AT' }
  ]
};
