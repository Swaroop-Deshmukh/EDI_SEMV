# Dataset Relationships — AI Public Procurement Auditor

Generated: 2026-09-12

---

## Overview

There are **5 raw files** across 2 sources:

| File | Source | Format | Rows |
|---|---|---|---|
| `ted/main.csv` | TED / India OCDS | CSV | 34,232 |
| `ted/tender_documents.csv` | TED / India OCDS | CSV | 34,232 |
| `ted/tender_milestones.csv` | TED / India OCDS | CSV | 34,232 |
| `ted/tender_participationFee.csv` | TED / India OCDS | CSV | 34,232 |
| `worldbank/full.jsonl` | World Bank OCDS export | JSONL | 34,232 |
| `worldbank/metadata_...json` | World Bank catalog | JSON | (metadata only) |

---

## Relationship 1: TED Sub-tables to TED main.csv

**Type:** One-to-one (each sub-table has exactly one row per main row)  
**Join key:** `_link_main` (sub-table) = `_link` (main.csv)

```
main.csv (_link: id-0.N)
   |
   |-- tender_documents.csv     (_link_main = id-0.N)   [1:1]
   |-- tender_milestones.csv    (_link_main = id-0.N)   [1:1]
   |-- tender_participationFee.csv (_link_main = id-0.N) [1:1]
```

**Key notes:**
- All 3 sub-tables have **exactly 34,232 rows** — one per main row — making these effectively wide-table extensions.
- `_link` format: `id-0.N` in main.csv and `id-0.N.tender.<subtype>.0` in sub-tables.
- The sub-tables are OCDS flattening artifacts: nested arrays (documents, milestones, participationFee) were exploded 1:1 because each tender had exactly one element per list.
- No compound FK needed: `_link_main` matches `_link` in main.csv directly.
- **Alternative join key:** `ocid` or `tender_id` can also link records, but `_link` is the most direct positional FK.

### Effective Merged Schema (after join)

Joining all 4 TED files on `_link` / `_link_main` yields a **flat wide table** with:
- 34,232 rows
- ~38 columns (26 from main + `code`, `type`, `title`, `type.1`, `dueDate`, `dueDate.1`, `title.1` from milestones + `multiCurrencyAllowed` from fee)
- `tender_documents.id` is uniformly "NA" — drop it

---

## Relationship 2: World Bank `full.jsonl` vs TED `main.csv`

**Type:** Structural equivalence (same data, different format)  
**Join key:** `ocid` or `id`

| Metric | Value |
|---|---|
| WB ocid count | 34,232 |
| TED ocid count | 34,232 |
| Overlapping ocids | **34,232 (100%)** |
| Overlapping ids | **34,232 (100%)** |

**Finding:** The World Bank `full.jsonl` and the 4 TED CSV files represent **the same dataset**:
- `full.jsonl` is the **nested OCDS JSON** form
- The 4 TED CSVs are the **flattened CSV** form of the same data
- Both sources were produced from the same OCDS release package (same `id`, `ocid`, `date = 2022-09-29`)

**Implication for ingestion:**
- Do **not** join these as separate sources — they will duplicate every row
- Choose **one form** as the ingestion target:
  - TED CSVs → easier to ingest into PostgreSQL directly
  - `full.jsonl` → preserves nesting, better for document stores or pandas nested parsing
- Recommended: **Use TED CSVs as primary**, use `full.jsonl` as backup/validation or for fields not present in CSVs

---

## Relationship 3: WB Metadata JSON vs `full.jsonl`

**Type:** Catalog metadata (non-data file)  
**Join key:** None — the metadata file describes the schema of the broader WB contract awards database (288,392 rows globally), not the `full.jsonl` content

**What it provides:**
- Column name and description glossary for the canonical WB contract awards columns (supplier, supplier_id, supplier_contract_amount_usd, review_type, etc.)
- Useful as a **data dictionary reference** when designing the PostgreSQL schema
- The `full.jsonl` does **not** contain `supplier`, `supplier_id`, or `review_type` — those fields belong to the award phase, which is not present in the current data

---

## Entity-Relationship Diagram (Logical)

```
+---------------------------+
|       main.csv            |
|  PK: _link (id-0.N)       |
|  NK: ocid, tender_id      |
|  buyer_name               |
|  tender_value_amount      |
|  tender_procurementMethod |
|  ...26 columns            |
+---------------------------+
         |  1:1
    +----|----+-------+
    |         |       |
    v         v       v
+----------+ +----------+ +-------------------+
|tender_   | |tender_   | |tender_            |
|documents | |milestones| |participationFee   |
|FK:       | |FK:       | |FK: _link_main     |
|_link_main| |_link_main| |multiCurrencyAllowed|
+----------+ +----------+ +-------------------+

                  (same 34,232 records, different format)
                           |
                           v
+----------------------------+
|  worldbank/full.jsonl      |
|  PK: id (same as main.csv) |
|  NK: ocid (100% match)     |
|  (nested OCDS structure)   |
+----------------------------+

+----------------------------+
| metadata_...json           |
| (catalog/dictionary only)  |
| not joined to any table    |
+----------------------------+
```

---

## Join Strategy Summary

| Join | Key | Type | Use |
|---|---|---|---|
| main.csv + tender_milestones | `_link` = `_link_main` | 1:1 LEFT JOIN | Get milestone dates |
| main.csv + tender_participationFee | `_link` = `_link_main` | 1:1 LEFT JOIN | Get currency flag |
| main.csv + tender_documents | `_link` = `_link_main` | 1:1 LEFT JOIN | Confirm doc presence |
| TED main + WB full.jsonl | `ocid` or `id` | 1:1 (same data) | **Do NOT join** — same records |
| Any file + metadata JSON | N/A | Lookup only | Use as schema dictionary |

---

## Can World Bank Data Be Joined With TED?

**No — they should not be joined.** They are the same 34,232 records in two formats.

**However**, if the project later ingests the **full World Bank contract awards CSV** (288,392 global records), it could be joined on:
- `borrower_contract_reference_number` ↔ `tender_externalReference` (soft match, not guaranteed)
- `fiscal_year` + `procurement_method` + `procurement_category` (approximate match for enrichment)
- Country filter (India) to narrow scope

That richer WB dataset would add `supplier`, `supplier_id`, `supplier_contract_amount_usd`, `review_type`, `project_id` — fields **not present** in the current files — making it a valuable enrichment source for the ML and anomaly detection modules.

---

## Recommended Ingestion Architecture (PostgreSQL)

```
procurement.tenders          <- main.csv (primary table)
procurement.milestones       <- tender_milestones.csv (FK: tender_id or _link)
procurement.participation_fee <- tender_participationFee.csv (FK: tender_id or _link)
procurement.documents        <- tender_documents.csv (optional, minimal value)
```

Use `ocid` or `tender_id` as the clean FK across all tables (instead of `_link`) since `_link` is a positional artifact.
