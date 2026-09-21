// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Relationships
// ============================================================

// Buyer -> Tender
MATCH (b:Buyer), (t:Tender)
WHERE b.buyer_id = t.buyer_id
MERGE (b)-[:ISSUED]->(t);

// Tender -> Item
MATCH (t:Tender), (i:Item)
WHERE t.tender_id = i.tender_id
MERGE (t)-[:HAS_ITEM]->(i);

// Tender -> Milestone
MATCH (t:Tender), (m:Milestone)
WHERE t.tender_id = m.tender_id
MERGE (t)-[:HAS_MILESTONE]->(m);

// Contract -> Supplier
MATCH (c:Contract), (s:Supplier)
WHERE c.supplier_id = s.supplier_id
MERGE (c)-[:AWARDED_TO]->(s);