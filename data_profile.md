# Data Profile — AI Public Procurement Auditor

Generated: 2026-09-12  
Raw data location: `data/raw/`

---

## 1. TED Dataset (4 files)

Source: Tenders Electronic Daily (India OCDS export)  
Format: CSV  
OCDS-compliant structure, flattened from JSON  

---

### 1.1 `main.csv`

| Attribute | Value |
|---|---|
| File size | ~13.8 MB |
| Row count | **34,232** |
| Columns | 26 |

#### Columns

| Column | Role | Notes |
|---|---|---|
| `_link` | Internal row key | Format: `id-0.N` — used as FK in sub-tables |
| `id` | **Primary ID** | OCDS release ID, format: `ocds-kjhdrl-<tender_id>-<date>` |
| `ocid` | **Natural PK** | OCDS contract identifier, format: `ocds-kjhdrl-<tender_id>` |
| `tag` | OCDS tag | Compiled, etc. |
| `date` | Release date | All = `2022-09-29` (snapshot date) |
| `Payment Mode` | Payment method | Values: Online, Offline, Both, Both(Online/Offline), Not Applicable |
| `initiationType` | Init type | All = `tender` |
| `fiscal_year` | Fiscal year | Range: 2016-2017 to 2021-2022 |
| `buyer_name` | **Buyer/Procuring Entity** | 0 nulls; ~101 unique buyers |
| `tender_id` | **Tender ID** | 0 nulls; format: `YYYY_DEPT_N_N` |
| `tender_stage` | Tender stage | e.g., To be Opened, active, awarded |
| `tender_title` | Tender description | Free text |
| `tender_allowTwoStageTender` | Procedural flag | Yes/No |
| `tender_status` | Status | e.g., NA, active, cancelled |
| `tender_submissionMethodDetails` | Submission details | Mostly NA |
| `tender_procurementMethod` | **Procurement method** | Open Tender, Limited, Open Limited, Single, Auction, Global Tenders |
| `tender_mainProcurementCategory` | **Category** | Goods, Services, Works |
| `tender_contractType` | Contract type | Buy, etc. |
| `tender_numberOfTenderers` | Bidder count | 8 nulls; anomaly signal |
| `tender_datePublished` | **Publish date** | Range: 2016-04-10 to 2022-03-31, 0 nulls |
| `tender_allowPreferentialBidder` | Flag | Yes/No |
| `tender_externalReference` | Dept reference no. | Free text |
| `tender_value_amount` | **Contract value (INR)** | 4.6% null; min=0, max=20,000,000,000, median=~9.2M |
| `tender_bidOpening_date` | Bid opening date | 0 nulls |
| `tender_tenderPeriod_durationInDays` | Tender period | Duration in days |
| `tenderclassification_description` | **Item/Category** | Goods/service description |

#### Key Observations

- `ocid` is the best natural key (0 nulls, matches WB dataset 100%)
- `tender_value_amount` has 4.6% nulls (1,580 records) — requires imputation or exclusion strategy
- `tender_numberOfTenderers = 0 or 1` is a strong anomaly signal (no competition)
- `tender_procurementMethod = 'Single'` is a red flag for directed awards
- Date range spans FY2016 to FY2022 (6 fiscal years)
- `buyer_name` has ~101 unique procuring entities

---

### 1.2 `tender_documents.csv`

| Attribute | Value |
|---|---|
| File size | ~1.4 MB |
| Row count | **34,232** |
| Columns | 3 |

| Column | Role |
|---|---|
| `_link` | Row key: `id-0.N.tender.documents.0` |
| `_link_main` | **FK pointing to main.csv `_link`** |
| `id` | Document ID — all values = "NA" (no real document IDs) |

Note: This table only confirms a document was attached per tender. No actionable document metadata available.

---

### 1.3 `tender_milestones.csv`

| Attribute | Value |
|---|---|
| File size | ~4.6 MB |
| Row count | **34,232** |
| Columns | 9 |

| Column | Role | Notes |
|---|---|---|
| `_link` | Row key | |
| `_link_main` | **FK to main.csv `_link`** | |
| `code` | Milestone type | e.g., PreBid Meeting Date |
| `type` | Category | assessment, etc. |
| `title` | Milestone label | e.g., Price Bid Opening Date |
| `type.1` | Second milestone type | Flattened pair |
| `dueDate` | Milestone due date | Many = "NA" |
| `title.1` | Second milestone label | |
| `dueDate.1` | Second milestone date | |

Note: Two milestone slots per row (flattened). dueDate = "NA" is common. Useful for timeline anomaly detection (e.g., unrealistically short bid windows).

---

### 1.4 `tender_participationFee.csv`

| Attribute | Value |
|---|---|
| File size | ~1.7 MB |
| Row count | **34,232** |
| Columns | 3 |

| Column | Role |
|---|---|
| `_link` | Row key |
| `_link_main` | **FK to main.csv `_link`** |
| `multiCurrencyAllowed` | Flag: Yes / No |

Note: Minimal signal alone; useful as feature for international procurement detection.

---

## 2. World Bank Dataset (2 files)

Source: World Bank Contract Awards in Investment Project Financing (Since FY2020)  
Format: JSONL (nested OCDS-like) + metadata JSON

---

### 2.1 `full.jsonl`

| Attribute | Value |
|---|---|
| File size | ~41.6 MB |
| Row count | **34,232** |
| Format | JSON Lines (1 record per line) |

#### Top-level fields

| Field | Role | Notes |
|---|---|---|
| `id` | **Primary ID** | Identical to TED `id` |
| `ocid` | **Natural PK** | Identical to TED `ocid` — 100% overlap |
| `tag` | Release tag | ['compiled'] |
| `date` | Snapshot date | All = 2022-09-29 |
| `buyer.name` | **Buyer/Procuring Entity** | Nested |
| `fiscal_year` | Fiscal year | 2016-2017 to 2021-2022 |
| `Payment Mode` | Payment method | Online, Offline, Both, Both(Online/Offline), Not Applicable |
| `initiationType` | Init type | All = tender |
| `tenderclassification.description` | Item/Category | |

#### Nested `tender` sub-fields

| Field | Role | Notes |
|---|---|---|
| `tender.id` | Tender ID | 0 nulls |
| `tender.title` | Description | |
| `tender.stage` | Stage | |
| `tender.status` | Status | |
| `tender.value.amount` | **Contract value (INR)** | Min=0, max=20B; same distribution as TED |
| `tender.procurementMethod` | Method | Same 6 categories as TED |
| `tender.mainProcurementCategory` | Category | Goods, Services, Works |
| `tender.contractType` | Type | |
| `tender.numberOfTenderers` | Bidder count | Anomaly signal |
| `tender.datePublished` | Publish date | |
| `tender.bidOpening.date` | Bid opening date | |
| `tender.tenderPeriod.durationInDays` | Duration in days | |
| `tender.externalReference` | Dept reference | |
| `tender.allowTwoStageTender` | Flag | |
| `tender.allowPreferentialBidder` | Flag | |
| `tender.submissionMethodDetails` | Submission info | |
| `tender.documents` | List of doc objects | `id` = "NA" uniformly |
| `tender.milestones` | List of milestone dicts | Same fields as milestones CSV |
| `tender.participationFee` | List | multiCurrencyAllowed flag |

Key finding: `full.jsonl` is the un-flattened source of the 4 TED CSVs. All 34,232 ocid values match TED exactly.

---

### 2.2 `metadata_contract_awards_...json`

| Attribute | Value |
|---|---|
| File size | ~11 KB |
| Format | JSON (single metadata object) |
| Purpose | Dataset catalog metadata only — not ingested as data |

| Field | Value |
|---|---|
| Title | Contract Awards in Investment Project Financing (Since FY 2020) |
| Row count (catalog) | 288,392 (full global WB dataset, not just this file) |
| Institutions | IBRD, IDA |
| License | CC BY 4.0 |
| Data as of | 2026-08-25 |

#### Canonical WB Column Schema (from metadata)

| Column | Type | Role |
|---|---|---|
| `as_of_date` | DATE | Snapshot date |
| `wb_contract_number` | STRING | WB Contract ID |
| `borrower_contract_reference_number` | STRING | Borrower reference |
| `borrower_country` | STRING | Buyer country |
| `supplier` | STRING | **Vendor/Supplier name** |
| `supplier_id` | STRING | WB Supplier ID |
| `supplier_country` | STRING | Supplier nationality |
| `supplier_contract_amount_usd` | NUMBER | **Award value in USD** |
| `contract_description` | STRING | Contract description |
| `contract_signing_date` | DATE | Award/signing date |
| `fiscal_year` | NUMBER | WB fiscal year |
| `procurement_category` | STRING | Category |
| `procurement_method` | STRING | Award method |
| `project_id` | STRING | WB Project ID (Pxxxxxxx) |
| `project_name` | STRING | Project name |
| `project_global_practice` | STRING | Sector |
| `region` | STRING | WB administrative region |
| `review_type` | STRING | Prior / Post review |

Note: The `full.jsonl` file in this project is an India-filtered OCDS export (34,232 records), not a direct dump of the WB contract awards schema. The metadata JSON describes the broader WB contract awards database.

---

## 3. Anomaly Detection — Useful Signal Fields

| Signal | Source Field(s) | File |
|---|---|---|
| Single bidder / no competition | `tender_numberOfTenderers <= 1` | TED main |
| Directed/single-source award | `tender_procurementMethod = 'Single'` | TED main |
| Zero or inflated contract value | `tender_value_amount = 0` or extreme outlier | TED main |
| Extremely short bid window | `tender_tenderPeriod_durationInDays` very low | TED main |
| Unreported bid opening dates | `dueDate = 'NA'` in milestones | TED milestones |
| Preferential bidder allowed | `tender_allowPreferentialBidder = 'Yes'` | TED main |
| Offline-only payment | `Payment Mode = 'Offline'` | Both |
| Repeated buyer-entity patterns | `buyer_name` frequency | TED main |
| Non-competitive method | `tender_procurementMethod = 'Limited'` | TED main |
| Supplier concentration | Supplier frequency across contracts | WB metadata schema |
| Cross-border awards | `supplier_country != borrower_country` | WB metadata schema |
| Post-review vs prior-review split | `review_type` | WB metadata schema |
