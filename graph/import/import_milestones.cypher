// ============================================================
// AI Public Procurement Auditor
// Neo4j Import - Tender Milestones
// Source: data/processed/tender_milestones.csv
// ============================================================

LOAD CSV WITH HEADERS FROM 'file:///tender_milestones.csv' AS row

MERGE (m:Milestone {
    milestone_id: row.milestone_id
})
SET
    m.code = row.code,
    m.type = row.type,
    m.title = row.title,
    m.due_date =
        CASE
            WHEN row.due_date <> ''
            THEN date(row.due_date)
            ELSE null
        END;