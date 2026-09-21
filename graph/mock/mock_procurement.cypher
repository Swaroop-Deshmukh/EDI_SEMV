// Mock procurement graph for local Neo4j development.
// This dataset is synthetic and is NOT the real procurement dataset.

// Buyer
CREATE (b:Buyer {
    buyer_id: "B001",
    name: "Mumbai Municipal Corporation"
});

// Tender
CREATE (t:Tender {
    tender_id: "T001",
    title: "Road Maintenance Contract",
    estimated_value: 1000000
});

// Vendors
CREATE (v1:Vendor {
    vendor_id: "V001",
    name: "ABC Infrastructure",
    address: "Mumbai, Maharashtra"
});

CREATE (v2:Vendor {
    vendor_id: "V002",
    name: "XYZ Contractors",
    address: "Pune, Maharashtra"
});

CREATE (v3:Vendor {
    vendor_id: "V003",
    name: "PQR Construction",
    address: "Mumbai, Maharashtra"
});

// Buyer issues tender
MATCH (b:Buyer {buyer_id: "B001"}),
      (t:Tender {tender_id: "T001"})
CREATE (b)-[:ISSUED]->(t);

// Bids
CREATE (bid1:Bid {
    bid_id: "BID001",
    bid_amount: 950000,
    status: "AWARDED"
});

CREATE (bid2:Bid {
    bid_id: "BID002",
    bid_amount: 980000,
    status: "NOT_AWARDED"
});

// Connect bids to tender and vendors
MATCH (t:Tender {tender_id: "T001"}),
      (bid1:Bid {bid_id: "BID001"}),
      (bid2:Bid {bid_id: "BID002"}),
      (v1:Vendor {vendor_id: "V001"}),
      (v2:Vendor {vendor_id: "V002"})
CREATE
    (t)-[:HAS_BID]->(bid1),
    (t)-[:HAS_BID]->(bid2),
    (bid1)-[:SUBMITTED_BY]->(v1),
    (bid2)-[:SUBMITTED_BY]->(v2);

// Contract
CREATE (c:Contract {
    contract_id: "C001",
    contract_value: 950000
});

// Connect tender to contract and contract to winning vendor
MATCH (t:Tender {tender_id: "T001"}),
      (c:Contract {contract_id: "C001"}),
      (v1:Vendor {vendor_id: "V001"})
CREATE
    (t)-[:RESULTED_IN]->(c),
    (c)-[:AWARDED_TO]->(v1);