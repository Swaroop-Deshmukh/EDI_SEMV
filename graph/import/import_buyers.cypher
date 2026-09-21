// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Buyers
// Source: data/processed/buyers.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///buyers.csv' AS row

MERGE (b:Buyer {
    buyer_id: row.buyer_id
})
SET
    b.buyer_name = row.buyer_name,
    b.department_code = row.department_code,
    b.country = row.country;