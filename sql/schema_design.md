# Final PostgreSQL Schema Design — AI Public Procurement Auditor

**Document Path:** `sql/schema_design.md`  
**Module:** Data Engineering Module  
**Data Sources:**
1. Cleaned TED (India OCDS subset) — `data/processed/` (`buyers.csv`, `tenders.csv`, `items.csv`, `tender_milestones.csv`)
2. World Bank Contract Awards — `data/raw/contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.csv`
3. Cross-Dataset Linkage Engine — `outputs/ted_worldbank_linkage_analysis.md`
4. Post-Award Invoice OCR Pipeline — (Downstream schema stubs)

**Design Principles:**
- **Logical Separation:** TED tender notices and World Bank contract awards are stored in distinct, normalized entity tables.
- **Explicit Bridge Table:** Cross-dataset linkages are managed via `tender_contract_link` restricted to confirmed `HIGH` and `MEDIUM` confidence matches.
- **Traceability:** Original source identifiers (`ocid`, `source_tender_id`, `ocds_release_id`, `wb_contract_number`, `supplier_id`, `project_id`) are preserved intact as unique indexed keys.
- **Data Fidelity:** Missing `estimated_value` records remain `NULL` (never coerced to `0`).
- **Foundational Integrity:** Excludes speculative ML features, fraud labels, or risk scores at the foundational relational tier.
- **OCR Readiness:** Full forward-compatibility for line-item invoice data extraction.

---

## 1. Relational Architecture & Entity-Relationship Overview

```
 [buyers] 1 ──── N [tenders] 1 ──── N [items]
                      │                  ▲
                      ├─ 1:N ────────┐   │ (optional 1:N)
                      │              │   │
                      ▼              ▼   │
             [tender_milestones]  [tender_contract_link] (HIGH / MEDIUM only)
                                         ▲
                                         │ (M:N bridge)
                                         ▼
   [suppliers] 1 ────────────────── N [contracts]
        │                                │
        ├─────── 1:N (optional) ─────────┤
        ▼                                ▼
   [invoices] 1 ─────────────────── N [invoice_items]
```

---

## 2. Comprehensive Table Specifications

### 2.1 Table: `buyers`
- **Description:** Procuring government departments, public utilities, and state nodal agencies.
- **Source:** `data/processed/buyers.csv` (101 entities)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `buyer_id` | `UUID` | **YES** | None | **NO** | `buyers.csv` (`buyer_id`) | Primary surrogate key (UUID) |
| `buyer_name` | `VARCHAR(255)` | No | None | **NO** | `buyers.csv` (`buyer_name`) | Standardized title-cased department name |
| `department_code` | `VARCHAR(50)` | No | None | **NO** | `buyers.csv` (`department_code`) | Department identifier code (e.g. `ASPIR`, `PWD`) |
| `country` | `VARCHAR(10)` | No | None | **NO** | `buyers.csv` (`country`) | Country of authority (`IN`) |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp (`CURRENT_TIMESTAMP`) |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.2 Table: `tenders`
- **Description:** Central fact table representing public tender notices (NIT stage).
- **Source:** `data/processed/tenders.csv` (34,232 records)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `tender_id` | `UUID` | **YES** | None | **NO** | `tenders.csv` (`tender_id`) | Primary surrogate key (UUID) |
| `ocid` | `VARCHAR(100)` | No | None | **NO** | `tenders.csv` (`ocid`) | Unique OCDS release ID (indexed) |
| `ocds_release_id` | `VARCHAR(100)` | No | None | **NO** | `tenders.csv` (`ocds_release_id`) | Unique compiled release identifier with timestamp |
| `source_tender_id` | `VARCHAR(100)` | No | None | **NO** | `tenders.csv` (`source_tender_id`) | Original e-procurement portal reference ID |
| `buyer_id` | `UUID` | No | `buyers(buyer_id)` | **NO** | `tenders.csv` (`buyer_id`) | Foreign key to procuring authority |
| `title` | `TEXT` | No | None | **NO** | `tenders.csv` (`title`) | Tender title and scope description |
| `stage` | `VARCHAR(50)` | No | None | **NO** | `tenders.csv` (`stage`) | Current tender stage (`AOC`, `Evaluation`, etc.) |
| `procurement_method` | `VARCHAR(50)` | No | None | **NO** | `tenders.csv` (`procurement_method`) | Bidding method (`Open Tender`, `Limited`, etc.) |
| `category` | `VARCHAR(50)` | No | None | **NO** | `tenders.csv` (`category`) | Procurement category (`Goods`, `Services`, `Works`) |
| `contract_type` | `VARCHAR(50)` | No | None | **NO** | `tenders.csv` (`contract_type`) | Contract type (`Works`, `Supply`, `Item Rate`, etc.) |
| `fiscal_year` | `VARCHAR(20)` | No | None | **NO** | `tenders.csv` (`fiscal_year`) | Fiscal year of announcement (e.g. `2016-2017`) |
| `payment_mode` | `VARCHAR(50)` | No | None | **NO** | `tenders.csv` (`payment_mode`) | Fee payment mode (`Offline`, `Online`, `Both`) |
| `external_reference` | `TEXT` | No | None | **NO** | `tenders.csv` (`external_reference`) | Department file number or NIT reference |
| `estimated_value` | `NUMERIC(20, 2)` | No | None | **YES** | `tenders.csv` (`estimated_value`) | Estimated cost in INR; NULL if unstated/placeholder |
| `number_of_tenderers` | `INTEGER` | No | None | **YES** | `tenders.csv` (`number_of_tenderers`) | Total participating bidder count; NULL if not opened |
| `duration_days` | `INTEGER` | No | None | **NO** | `tenders.csv` (`duration_days`) | Execution or validity duration in calendar days |
| `allow_two_stage` | `BOOLEAN` | No | None | **NO** | `tenders.csv` (`allow_two_stage`) | Flag: two-stage bidding allowed |
| `allow_preferential` | `BOOLEAN` | No | None | **NO** | `tenders.csv` (`allow_preferential`) | Flag: MSE/local preferential bidder allowed |
| `multi_currency` | `BOOLEAN` | No | None | **NO** | `tenders.csv` (`multi_currency`) | Flag: multi-currency bidding allowed |
| `date_published` | `TIMESTAMPTZ` | No | None | **NO** | `tenders.csv` (`date_published`) | Notice publication timestamp |
| `bid_opening_date` | `TIMESTAMPTZ` | No | None | **NO** | `tenders.csv` (`bid_opening_date`) | Scheduled bid opening timestamp |
| `submission_method` | `TEXT` | No | None | **YES** | `tenders.csv` (`submission_method`) | Bid submission details (NULL in raw TED) |
| `source_file` | `VARCHAR(100)` | No | None | **NO** | `tenders.csv` (`source_file`) | Provenance file tracker (`ted/main.csv`) |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp (`CURRENT_TIMESTAMP`) |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.3 Table: `items`
- **Description:** Line-item classifications and scope per tender.
- **Source:** `data/processed/items.csv` (34,232 records)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `item_id` | `UUID` | **YES** | None | **NO** | `items.csv` (`item_id`) | Primary surrogate key (UUID) |
| `tender_id` | `UUID` | No | `tenders(tender_id)` | **NO** | `items.csv` (`tender_id`) | Foreign key linking item to parent tender |
| `description` | `TEXT` | No | None | **NO** | `items.csv` (`description`) | Line-item scope description |
| `category` | `VARCHAR(100)` | No | None | **NO** | `items.csv` (`category`) | Classification name (e.g. `Civil Works`) |
| `unit_price` | `NUMERIC(20, 2)` | No | None | **YES** | `items.csv` (`unit_price`) | Unit rate in INR (NULL; populated via OCR) |
| `quantity` | `NUMERIC(15, 3)` | No | None | **YES** | `items.csv` (`quantity`) | Physical quantity (NULL; populated via OCR) |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.4 Table: `tender_milestones`
- **Description:** Scheduled assessment and timeline milestones linked to tenders.
- **Source:** `data/processed/tender_milestones.csv` (68,464 records)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `milestone_id` | `UUID` | **YES** | None | **NO** | `tender_milestones.csv` (`milestone_id`) | Primary surrogate key (UUID) |
| `tender_id` | `UUID` | No | `tenders(tender_id)` | **NO** | `tender_milestones.csv` (`tender_id`) | Foreign key linking milestone to parent tender |
| `code` | `VARCHAR(100)` | No | None | **NO** | `tender_milestones.csv` (`code`) | Milestone code (`PreBid Meeting Date`) |
| `type` | `VARCHAR(50)` | No | None | **NO** | `tender_milestones.csv` (`type`) | OCDS milestone type (`assessment`) |
| `title` | `VARCHAR(255)` | No | None | **NO** | `tender_milestones.csv` (`title`) | Display title of milestone |
| `due_date` | `TIMESTAMPTZ` | No | None | **YES** | `tender_milestones.csv` (`due_date`) | Scheduled deadline timestamp (NULL in raw TED) |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.5 Table: `suppliers`
- **Description:** Master vendor and contractor registry populated from World Bank contract awards.
- **Source:** `contract_awards...csv` (Deduplicated on `Supplier ID`)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `supplier_id` | `VARCHAR(50)` | **YES** | None | **NO** | WB CSV (`Supplier ID`) | World Bank master supplier identifier (e.g. `'1065844'`) |
| `supplier_name` | `VARCHAR(255)` | No | None | **NO** | WB CSV (`Supplier`) | Official legal name of contractor / vendor |
| `country` | `VARCHAR(100)` | No | None | **YES** | WB CSV (`Supplier Country / Economy`) | Registered country of supplier |
| `country_code` | `VARCHAR(10)` | No | None | **YES** | WB CSV (`Supplier Country / Economy Code`) | ISO / World Bank country code |
| `source_dataset` | `VARCHAR(50)` | No | None | **NO** | System Defined | Data provenance (`'World Bank IPF'`) |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.6 Table: `contracts`
- **Description:** Formal contract awards financed under World Bank operations.
- **Source:** `contract_awards...csv` (Filtered to India / Assam operations)

| Column Name | PostgreSQL Type | PK | FK | Nullable | Source File & Column | Description |
|---|---|:---:|:---:|:---:|---|---|
| `contract_id` | `UUID` | **YES** | None | **NO** | System Generated | Primary surrogate key (UUID) |
| `wb_contract_number` | `VARCHAR(50)` | No | None | **NO** | WB CSV (`WB Contract Number`) | Unique World Bank internal contract number (indexed) |
| `project_id` | `VARCHAR(20)` | No | None | **NO** | WB CSV (`Project ID`) | World Bank project identifier (`Pxxxxxxx`) |
| `project_name` | `VARCHAR(255)` | No | None | **NO** | WB CSV (`Project Name`) | Full project title (e.g. *Assam Inland Water Transport*) |
| `project_global_practice` | `VARCHAR(100)` | No | None | **YES** | WB CSV (`Project Global Practice`) | Major sector (e.g. `Transport`, `Water`, `Governance`) |
| `procurement_category` | `VARCHAR(50)` | No | None | **NO** | WB CSV (`Procurement Category`) | Category (`Goods`, `Works`, `Consultant Services`) |
| `procurement_method` | `VARCHAR(100)` | No | None | **NO** | WB CSV (`Procurement Method`) | Selection method (e.g. `QCBS`, `RFB`, `RFQ`) |
| `contract_description` | `TEXT` | No | None | **NO** | WB CSV (`Contract Description`) | Contract scope as stated in signed agreement |
| `borrower_contract_reference_number` | `VARCHAR(255)` | No | None | **YES** | WB CSV (`Borrower Contract Reference Number`) | Reference code assigned by local borrowing agency |
| `contract_signing_date` | `DATE` | No | None | **YES** | WB CSV (`Contract Signing Date`) | Execution date of contract |
| `supplier_id` | `VARCHAR(50)` | No | `suppliers(supplier_id)` | **NO** | WB CSV (`Supplier ID`) | Foreign key to awarded supplier |
| `contract_amount_usd` | `NUMERIC(20, 2)` | No | None | **NO** | WB CSV (`Supplier Contract Amount (USD)`) | Total committed contract amount in USD |
| `review_type` | `VARCHAR(20)` | No | None | **YES** | WB CSV (`Review type`) | Procurement review type (`Prior` / `Post`) |
| `calendar_year` | `INTEGER` | No | None | **YES** | WB CSV (`Contract signed - Calendar year`) | Year derived from signing date |
| `borrower_country` | `VARCHAR(100)` | No | None | **NO** | WB CSV (`Borrower Country / Economy`) | Borrower nation (`India`) |
| `borrower_country_code` | `VARCHAR(10)` | No | None | **NO** | WB CSV (`Borrower Country / Economy Code`) | Borrower country code (`IN`) |
| `source_file` | `VARCHAR(150)` | No | None | **NO** | System Defined | Raw filename tracker |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | System Generated | Record modification timestamp |

---

### 2.7 Table: `tender_contract_link`
- **Description:** Explicit bridge table managing verified cross-dataset linkages between TED tenders and World Bank contract awards.
- **Source:** Output of deterministic linkage engine (`outputs/ted_worldbank_linkage_analysis.md`)
- **Constraint:** Strictly stores **HIGH** and **MEDIUM** confidence matches. Low-confidence heuristic matches are discarded.

| Column Name | PostgreSQL Type | PK | FK | Nullable | Description |
|---|---|:---:|:---:|:---:|---|
| `link_id` | `UUID` | **YES** | None | **NO** | Primary surrogate key (UUID) |
| `tender_id` | `UUID` | No | `tenders(tender_id)` | **NO** | Foreign key to linked TED tender notice |
| `contract_id` | `UUID` | No | `contracts(contract_id)` | **NO** | Foreign key to linked World Bank contract award |
| `confidence_level` | `VARCHAR(10)` | No | None | **NO** | Match certainty: `HIGH` (exact/normalized ref) or `MEDIUM` (STEP ID substring) |
| `match_method` | `VARCHAR(50)` | No | None | **NO** | Algorithm applied (`EXACT_REFERENCE`, `NORMALIZED_REFERENCE`, `STEP_ID_SUBSTRING`) |
| `matched_reference` | `VARCHAR(255)` | No | None | **NO** | The shared identifier token that established the link |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | Link record insertion timestamp |

> **Unique Constraint:** `UNIQUE (tender_id, contract_id)` prevents duplicate links.

---

### 2.8 Table: `invoices`
- **Description:** Financial invoice headers extracted from post-award billing documents via OCR.
- **Source:** Future Invoice OCR Extraction Pipeline

| Column Name | PostgreSQL Type | PK | FK | Nullable | Description |
|---|---|:---:|:---:|:---:|---|
| `invoice_id` | `UUID` | **YES** | None | **NO** | Primary surrogate key (UUID) |
| `contract_id` | `UUID` | No | `contracts(contract_id)` | **YES** | Foreign key to contract award (if resolved) |
| `supplier_id` | `VARCHAR(50)` | No | `suppliers(supplier_id)` | **YES** | Foreign key to billing vendor (if resolved) |
| `tender_id` | `UUID` | No | `tenders(tender_id)` | **YES** | Foreign key to tender notice (if resolved) |
| `invoice_number` | `VARCHAR(100)` | No | None | **NO** | Invoice number extracted from document |
| `invoice_date` | `DATE` | No | None | **YES** | Billing date extracted from invoice |
| `total_amount` | `NUMERIC(20, 2)` | No | None | **NO** | Total billed amount |
| `currency` | `VARCHAR(10)` | No | None | **NO** | Billed currency (default `'INR'`) |
| `ocr_confidence` | `NUMERIC(5, 4)` | No | None | **YES** | Mean confidence score of OCR engine (0.0000 to 1.0000) |
| `source_file` | `VARCHAR(255)` | No | None | **NO** | Filepath of scanned PDF / image source |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | OCR record ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | Record modification timestamp |

---

### 2.9 Table: `invoice_items`
- **Description:** Line-item details and billed goods/services extracted from invoice tables.
- **Source:** Future Invoice OCR Extraction Pipeline

| Column Name | PostgreSQL Type | PK | FK | Nullable | Description |
|---|---|:---:|:---:|:---:|---|
| `invoice_item_id` | `UUID` | **YES** | None | **NO** | Primary surrogate key (UUID) |
| `invoice_id` | `UUID` | No | `invoices(invoice_id)` | **NO** | Foreign key to parent invoice (`ON DELETE CASCADE`) |
| `item_id` | `UUID` | No | `items(item_id)` | **YES** | Foreign key to tender line-item (if matched) |
| `line_number` | `INTEGER` | No | None | **NO** | Sequential item position on invoice |
| `description` | `TEXT` | No | None | **NO** | Item description text extracted by OCR |
| `quantity` | `NUMERIC(15, 3)` | No | None | **YES** | Physical quantity billed |
| `unit_price` | `NUMERIC(20, 2)` | No | None | **YES** | Billed unit rate |
| `total_price` | `NUMERIC(20, 2)` | No | None | **NO** | Line-item total amount (`quantity * unit_price`) |
| `ocr_confidence` | `NUMERIC(5, 4)` | No | None | **YES** | OCR extraction confidence for this line |
| `created_at` | `TIMESTAMPTZ` | No | None | **NO** | OCR record ingestion timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | None | **NO** | Record modification timestamp |

---

## 3. Database Indexes for Query & Audit Performance

| Table | Index Name | Columns | Purpose |
|---|---|---|---|
| `tenders` | `idx_tenders_buyer_id` | `buyer_id` | Foreign key joins to `buyers` |
| `tenders` | `idx_tenders_ocid` | `ocid` | OCDS lookup & deduplication |
| `tenders` | `idx_tenders_source_id` | `source_tender_id` | State portal cross-reference |
| `tenders` | `idx_tenders_ext_ref` | `external_reference` | Fast cross-dataset matching against WB STEP refs |
| `items` | `idx_items_tender_id` | `tender_id` | Foreign key joins to `tenders` |
| `tender_milestones` | `idx_milestones_tender_id` | `tender_id` | Foreign key joins to `tenders` |
| `contracts` | `idx_contracts_wb_num` | `wb_contract_number` | Unique lookup for World Bank contracts |
| `contracts` | `idx_contracts_supplier_id`| `supplier_id` | Foreign key joins to `suppliers` |
| `contracts` | `idx_contracts_borrower_ref` | `borrower_contract_reference_number` | Cross-dataset matching against tenders |
| `tender_contract_link` | `idx_tcl_tender_id` | `tender_id` | Fast join from tenders to linked contracts |
| `tender_contract_link` | `idx_tcl_contract_id` | `contract_id` | Fast join from contracts to linked tenders |
| `invoices` | `idx_invoices_contract_id`| `contract_id` | Joins from invoices to contracts |
| `invoices` | `idx_invoices_supplier_id`| `supplier_id` | Vendor billing aggregations |
| `invoice_items` | `idx_inv_items_invoice_id`| `invoice_id` | Parent invoice lookups |
