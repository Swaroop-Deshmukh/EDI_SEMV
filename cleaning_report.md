# Cleaning Report — TED Dataset
Generated: 2026-09-12 23:10
Source: `data/raw/ted/`

## Records Processed

| File | Raw Rows |
|---|---|
| main.csv | 34,232 |
| tender_milestones.csv | 34,232 |
| tender_participationFee.csv | 34,232 |
| tender_documents.csv | 34,232 |

## Records Removed

| Reason | Count |
|---|---|
| Exact duplicate rows | 0 |
| Missing ocid | 0 |
| Missing source_tender_id | 0 |
| Invalid numeric values | 0 |

## Missing Value Handling

| Field | Action |
|---|---|
| `estimated_value` (raw missing) | Retained as NULL — 5,617 rows |
| `estimated_value` = 0 | Converted to NULL (placeholder sentinel per analysis) — 2,410 rows |
| `estimated_value` (final) | Positive: 26,205 rows, NULL: 8,027 rows (0 zero values) |
| `tender_status` | Dropped (100% "NA" — no information) |
| `submission_method` | Set to NULL (100% "NA") |
| `milestone due_date` | Set to NULL — 68,464 slots |
| `items.unit_price` / `quantity` | NULL — populated by OCR pipeline |

## Invalid Records

| Issue | Count | Log file |
|---|---|---|
| Date parse failures | 0 | `outputs/invalid_records.log` |
| Missing ocid | 0 | `outputs/invalid_records.log` |
| Missing tender_id | 0 | `outputs/invalid_records.log` |
| Bad numeric values | 0 | `outputs/invalid_records.log` |

## Transformations Performed

| Transformation | Detail |
|---|---|
| Column rename | All columns renamed to snake_case per `sql/schema.sql` |
| Null standardization | All NA/N/A/None/empty strings → pandas NA |
| `estimated_value` = 0 → NULL | Converted 2,410 zero values to NULL based on domain & statistical analysis |
| Stage → ENUM | 386 out-of-vocab values mapped to `Unknown` |
| Procurement method → ENUM | 0 values mapped to `Unknown` |
| Contract type → ENUM | 0 values mapped to `Other` |
| Boolean flags | `allow_two_stage`, `allow_preferential`, `multi_currency`: Yes/No → True/False |
| Dates | Parsed to ISO 8601 `YYYY-MM-DDTHH:MM:SS` format |
| `buyer_name` | Strip + title-case for normalisation; original value preserved |
| Source IDs | `ocid`, `ocds_release_id`, `source_tender_id` preserved verbatim |
| UUIDs | New UUIDs assigned for `buyer_id`, `tender_id`, `item_id`, `milestone_id` |
| Milestones | Two flattened slots expanded into separate rows |
| Multi-currency flag | Joined from `tender_participationFee.csv` onto tenders |
| `department_code` | Extracted from second segment of `source_tender_id` (e.g. DOT, PWD) |

## Output Files

| File | Rows | Maps to Table |
|---|---|---|
| `data/processed/buyers.csv` | 101 | `buyers` |
| `data/processed/tenders.csv` | 34,232 | `tenders` |
| `data/processed/items.csv` | 34,232 | `items` |
| `data/processed/tender_milestones.csv` | 68,464 | `tender_milestones` |

> `bids`, `contracts`, `invoices` — not populated: vendor/award data absent in raw TED files.  
> Invalid records detail: `outputs/invalid_records.log`
