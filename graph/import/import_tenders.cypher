// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Tenders
// Source: data/processed/tenders.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///tenders.csv' AS row

MERGE (t:Tender {
    tender_id: row.tender_id
})
SET
    t.ocid = row.ocid,
    t.ocds_release_id = row.ocds_release_id,
    t.source_tender_id = row.source_tender_id,
    t.buyer_id = row.buyer_id,
    t.title = row.title,
    t.stage = row.stage,
    t.procurement_method = row.procurement_method,
    t.category = row.category,
    t.contract_type = row.contract_type,
    t.fiscal_year = row.fiscal_year,
    t.payment_mode = row.payment_mode,
    t.external_reference = row.external_reference,
    t.estimated_value =
        CASE
            WHEN row.estimated_value <> ''
            THEN toFloat(row.estimated_value)
            ELSE null
        END,
    t.number_of_tenderers =
        CASE
            WHEN row.number_of_tenderers <> ''
            THEN toInteger(row.number_of_tenderers)
            ELSE null
        END,
    t.duration_days =
        CASE
            WHEN row.duration_days <> ''
            THEN toInteger(row.duration_days)
            ELSE null
        END,
    t.allow_two_stage = row.allow_two_stage,
    t.allow_preferential = row.allow_preferential,
    t.multi_currency = row.multi_currency,
    t.date_published =
        CASE
            WHEN row.date_published <> ''
            THEN datetime(row.date_published)
            ELSE null
        END,
    t.bid_opening_date =
        CASE
            WHEN row.bid_opening_date <> ''
            THEN datetime(row.bid_opening_date)
            ELSE null
        END,
    t.submission_method = row.submission_method,
    t.source_file = row.source_file;