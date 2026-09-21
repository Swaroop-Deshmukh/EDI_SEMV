// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Contracts
// Source: data/processed/contracts.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///contracts.csv' AS row

MERGE (c:Contract {
    contract_id: row.contract_id
})
SET
    c.wb_contract_number = row.wb_contract_number,
    c.project_id = row.project_id,
    c.project_name = row.project_name,
    c.project_global_practice = row.project_global_practice,
    c.procurement_category = row.procurement_category,
    c.procurement_method = row.procurement_method,
    c.contract_description = row.contract_description,
    c.borrower_contract_reference_number = row.borrower_contract_reference_number,
    c.contract_signing_date = row.contract_signing_date,
    c.supplier_id = row.supplier_id,
    c.contract_amount_usd = row.contract_amount_usd,
    c.review_type = row.review_type,
    c.calendar_year = row.calendar_year,
    c.borrower_country = row.borrower_country,
    c.borrower_country_code = row.borrower_country_code;