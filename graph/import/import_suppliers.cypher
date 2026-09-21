// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Suppliers
// Source: data/processed/suppliers.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///suppliers.csv' AS row

MERGE (s:Supplier {
    supplier_id: row.supplier_id
})
SET
    s.supplier_name = row.supplier_name,
    s.country = row.country,
    s.country_code = row.country_code,
    s.source_dataset = row.source_dataset;