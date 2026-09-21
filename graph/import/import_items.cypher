// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Items
// Source: data/processed/items.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///items.csv' AS row

MERGE (i:Item {
    item_id: row.item_id
})
SET
    i.description = row.description,
    i.category = row.category,
    i.unit_price =
        CASE
            WHEN row.unit_price <> ''
            THEN toFloat(row.unit_price)
            ELSE null
        END,
    i.quantity =
        CASE
            WHEN row.quantity <> ''
            THEN toFloat(row.quantity)
            ELSE null
        END;