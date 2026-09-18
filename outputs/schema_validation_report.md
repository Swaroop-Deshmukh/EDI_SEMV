# Schema Validation & Data Compatibility Report

**Target Document:** `outputs/schema_validation_report.md`  
**Schemas Evaluated:**
1. `sql/schema_design.md` (Finalized 9-table schema specification)
2. `sql/schema.sql` (Initial DDL draft)

**Datasets Validated Against:**
1. `data/processed/buyers.csv` (101 rows)
2. `data/processed/tenders.csv` (34,232 rows)
3. `data/processed/items.csv` (34,232 rows)
4. `data/processed/tender_milestones.csv` (68,464 rows)
5. `data/raw/contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.csv` (291,007 rows, 107.84 MB)

**Execution Date:** 2026-09-13  
**Action Performed:** Read-only schema compatibility audit. No database tables created, no data ingested, and no files modified.

---

## Executive Summary: Validation Status Matrix

| Category | Check Area | Status | Key Finding Summary |
|:---:|---|:---:|---|
| **1** | Primary Key Uniqueness | **OK** | 100% unique surrogate UUIDs for `buyers`, `tenders`, `items`, `tender_milestones`. |
| **2** | Foreign-Key Compatibility (TED) | **OK** | 100% referential integrity across all TED relational tables. |
| **3** | WB Contract Number Uniqueness | **CRITICAL** | `WB Contract Number` is **NOT unique per row** (11,971 duplicates due to Joint Venture award shares). A `UNIQUE (wb_contract_number)` constraint will crash ingestion. |
| **4** | Supplier ID Consistency & Nulls | **WARNING** | 6 records in World Bank dataset have `NULL` Supplier IDs; 586 Supplier IDs map to multiple name variants. |
| **5** | TED Identifier Uniqueness | **OK** | `ocid`, `ocds_release_id`, and `source_tender_id` are 100% unique (34,232 / 34,232). |
| **6** | Data Type Compatibility | **OK** | Numeric precisions (`NUMERIC(20,2)`) and text lengths (`VARCHAR`) accommodate all maximum observed values. |
| **7** | Nullable vs NOT NULL Fields | **WARNING** | `Contract Description` (347 nulls), `Borrower Country Code` (9,789 nulls), and `Amount` (6 nulls) must be `NULLABLE` in `contracts`. |
| **8** | Currency & Amount Handling | **OK** | Amounts strictly non-negative; USD (World Bank) and INR (TED) explicitly separated by column naming. |
| **9** | Date Format & Range Handling | **WARNING** | TED uses ISO 8601 (`YYYY-MM-DDTHH:MM:SS`), but World Bank uses `MM/DD/YYYY` which requires explicit parsing during ETL. |
| **10** | `invoice_items.item_id` Nullability | **OK** | Verified that `item_id` in `invoice_items` **must remain NULLABLE** for OCR invoice extraction. |
| **11** | Source-to-Destination Column Coverage | **OK** | 100% of source columns intended for relational storage have matching target destinations. |
| **12** | `schema.sql` vs `schema_design.md` Parity | **CRITICAL** | `schema.sql` lacks `tender_contract_link`, `tender_milestones`, and `invoice_items`, and retains obsolete `bids` and `vendors` tables. |

---

## Detailed Check-by-Check Findings

### 1. Primary Key Uniqueness
- **Status:** **OK**
- **Evaluation:**
  - `buyers.buyer_id`: **101 / 101 unique** (100.0%)
  - `tenders.tender_id`: **34,232 / 34,232 unique** (100.0%)
  - `items.item_id`: **34,232 / 34,232 unique** (100.0%)
  - `tender_milestones.milestone_id`: **68,464 / 68,464 unique** (100.0%)
  - `contracts.contract_id`: Surrogate `UUID PRIMARY KEY` guarantees row-level uniqueness.
  - `tender_contract_link.link_id`: Surrogate `UUID PRIMARY KEY` guarantees link-level uniqueness.

---

### 2. Foreign-Key Compatibility (TED Relational Tables)
- **Status:** **OK**
- **Evaluation:**
  - `tenders.buyer_id` $\rightarrow$ `buyers.buyer_id`: **100.0% valid** (34,232 / 34,232). Zero orphan records.
  - `items.tender_id` $\rightarrow$ `tenders.tender_id`: **100.0% valid** (34,232 / 34,232). Zero orphan records.
  - `tender_milestones.tender_id` $\rightarrow$ `tenders.tender_id`: **100.0% valid** (68,464 / 68,464). Zero orphan records.

---

### 3. World Bank Contract Number Uniqueness
- **Status:** **CRITICAL**
- **Issue:**
  - `wb_contract_number` is **NOT UNIQUE** across rows in `contract_awards...csv`.
  - Exactly **11,971 duplicate rows** exist for `WB Contract Number` across the 291,007 records.
  - Individual contract numbers have up to **42 separate rows** (e.g. contract `1814624` has 42 rows, contract `1703700` has 28 rows, contract `1738575` has 25 rows).
- **Domain Root Cause:**
  - Official World Bank procurement rules split multi-vendor **Joint Venture (JV)** contracts equally across participating JV members. Each member is assigned a row under the same `WB Contract Number` with their respective `Supplier ID` and contract share.
- **Impact on DDL:**
  - In `sql/schema.sql` (Line 308): `CONSTRAINT uq_contracts_wb_number UNIQUE (wb_contract_number)` **WILL CRASH UPON INGESTION**.
- **Required Remediation:**
  - Remove the solitary `UNIQUE (wb_contract_number)` constraint.
  - Retain `contract_id UUID PRIMARY KEY` as the unique row identifier.
  - Add a non-unique B-tree index on `wb_contract_number`, or define a composite unique constraint: `UNIQUE (wb_contract_number, supplier_id)`.

---

### 4. Supplier ID Uniqueness and Consistency
- **Status:** **WARNING**
- **Findings:**
  - **Deduplication Required:** `Supplier ID` has 105,112 repeated rows in the raw CSV because successful vendors win multiple contracts. Extracting distinct `Supplier ID` values produces **185,894 unique suppliers** for the parent `suppliers` table.
  - **Null Supplier IDs:** Exactly **6 records** in the World Bank dataset have `Supplier ID = NaN` (with supplier names such as *"Individual Consultant"* or *"To be Determined"*).
    - If `suppliers.supplier_id` is defined as `PRIMARY KEY` (which implicitly enforces `NOT NULL`), inserting a NULL ID will trigger a database exception.
    - *Remediation:* ETL ingestion must assign a synthetic fallback key (e.g. `'UNKNOWN_SUPPLIER_' || row_id`) or filter out records with unassigned vendors.
  - **Name Divergence:** 586 `Supplier ID`s map to more than one string representation of `Supplier` name (e.g. *"ABC LTD"* vs *"ABC LIMITED"*).
    - *Remediation:* ETL must apply canonical deduplication (e.g. selecting the most frequent or most recent name).

---

### 5. TED Identifier Uniqueness
- **Status:** **OK**
- **Evaluation:**
  - `tenders.ocid`: **34,232 / 34,232 unique** (100.0%)
  - `tenders.ocds_release_id`: **34,232 / 34,232 unique** (100.0%)
  - `tenders.source_tender_id`: **34,232 / 34,232 unique** (100.0%)
  - All three original OCDS/portal identifiers can safely maintain `UNIQUE` constraints and indexes.

---

### 6. Data Type Compatibility
- **Status:** **OK**
- **Evaluation:**
  - `estimated_value` (`NUMERIC(20, 2)`): Accommodates max INR value ₹20,000,000,000.00 (11 digits before decimal). Fits with 7 digits of precision headroom.
  - `contract_amount_usd` (`NUMERIC(20, 2)`): Accommodates max USD amount $553,067,459.92 (9 digits before decimal). Fits cleanly.
  - Integer Fields (`number_of_tenderers`, `duration_days`, `calendar_year`, `line_number`): All within standard PostgreSQL 4-byte `INTEGER` ranges (max: 2,147,483,647).
  - String Lengths:
    - `procurement_method`: Max observed 35 chars $\rightarrow$ Fits in `VARCHAR(100)`
    - `category`: Max observed 23 chars $\rightarrow$ Fits in `VARCHAR(50)`
    - `project_id`: Max observed 7 chars (`Pxxxxxxx`) $\rightarrow$ Fits in `VARCHAR(20)`
    - `supplier_name`: Max observed 120 chars $\rightarrow$ Fits in `VARCHAR(255)`
    - `project_name`: Max observed 132 chars $\rightarrow$ Fits in `VARCHAR(255)`

---

### 7. Nullable vs NOT NULL Fields
- **Status:** **WARNING**
- **Findings:**
  - **Verified Clean Columns (OK):**
    - `tenders.estimated_value`: 8,027 NULLs $\rightarrow$ Schema specifies `NULLABLE`. (OK)
    - `tenders.number_of_tenderers`: 2,573 NULLs $\rightarrow$ Schema specifies `NULLABLE`. (OK)
    - `tenders.submission_method`: 34,232 NULLs $\rightarrow$ Schema specifies `NULLABLE`. (OK)
    - `tender_milestones.due_date`: 68,464 NULLs $\rightarrow$ Schema specifies `NULLABLE`. (OK)
    - `items.unit_price` / `quantity`: 34,232 NULLs $\rightarrow$ Schema specifies `NULLABLE`. (OK)
  - **Potential Ingestion Traps in `contracts` (Action Required):**
    - `Contract Description`: **347 records are NULL** in World Bank data. Schema specification in `schema_design.md` marked this `NOT NULL`. Must be set to **`NULLABLE`**.
    - `Borrower Country / Economy Code`: **9,789 records are NULL** (multi-country or regional projects). Schema specification marked this `NOT NULL`. Must be set to **`NULLABLE`**.
    - `Supplier Contract Amount (USD)`: **6 records are NULL**. Schema specification marked this `NOT NULL`. Must be set to **`NULLABLE`**.
    - `Borrower Contract Reference Number`: **1 record is NULL**. Correctly marked `NULLABLE`. (OK)

---

### 8. Currency and Amount Handling
- **Status:** **OK**
- **Evaluation:**
  - **Strict Logical Separation:** TED values represent Indian Rupees (`INR`), while World Bank values represent US Dollars (`USD`).
  - Schema defines `contracts.contract_amount_usd` explicitly containing the `_usd` suffix, preventing any semantic ambiguity or accidental addition of INR and USD values.
  - Zero Negative Amounts: Zero negative numbers exist across all financial fields in both datasets.

---

### 9. Date Format & Range Handling
- **Status:** **WARNING**
- **Evaluation:**
  - **TED Timestamps:** Format is standard ISO 8601 (`YYYY-MM-DDTHH:MM:SS`). Natively parses into PostgreSQL `TIMESTAMPTZ`. (OK)
  - **World Bank Dates:** Format is US slash-delimited `MM/DD/YYYY` (e.g. `'09/08/2026'`).
    - Attempting a direct text cast `::DATE` in PostgreSQL environments expecting `DD/MM/YYYY` or `YYYY-MM-DD` may cause day/month inversion or parsing errors.
    - *Remediation:* ETL script must explicitly parse dates using `TO_DATE(val, 'MM/DD/YYYY')` or Python `pd.to_datetime()`.
  - Date Ranges:
    - TED: 2016-04-30 to 2022-09-29.
    - World Bank: 2019-07-01 to 2026-09-08.
    - All dates are within valid calendar boundaries.

---

### 10. `invoice_items.item_id` Nullability Analysis
- **Status:** **OK (Confirmed Essential)**
- **Technical Justification:**
  - In `sql/schema_design.md`, `invoice_items.item_id` is defined as `UUID NULLABLE`.
  - **Validation Result:** Making `item_id` nullable is **strictly necessary**:
    1. **Granularity Asymmetry:** The TED dataset stores exactly 1 macro-classification record per tender in `items.csv` (34,232 items for 34,232 tenders). In contrast, commercial invoices typically contain 10–100 specific product line items.
    2. **Unmatched Line Items:** OCR pipelines frequently extract items (shipping, inspection fees, spare parts, taxes) that were not declared as distinct line items at tender NIT stage.
    3. **OCR Uncertainty:** When OCR confidence for item description matching is below threshold, the record must still be preserved with `item_id = NULL`.
    4. Enforcing `NOT NULL` on `invoice_items.item_id` would break the entire downstream invoice ingestion pipeline.

---

### 11. Source-to-Destination Column Coverage
- **Status:** **OK**
- **Evaluation:**
  - Every source column in the 4 cleaned TED CSV files has an exact, validated destination column in the corresponding schema tables.
  - All 21 columns in the World Bank Contract Awards CSV have defined destination mappings (`wb_contract_number`, `project_id`, `project_name`, `project_global_practice`, `procurement_category`, `procurement_method`, `contract_description`, `borrower_contract_reference_number`, `contract_signing_date`, `supplier_id`, `contract_amount_usd`, `review_type`, `calendar_year`, `borrower_country`, `borrower_country_code`, and supplier dimension fields).

---

### 12. Architectural Discrepancy: `schema.sql` vs `schema_design.md`
- **Status:** **CRITICAL**
- **Issue:**
  - [`sql/schema_design.md`](file:///c:/Users/GRISHMA/OneDrive/Desktop/TY/SEM%205/EDI/AI-Public-Procurement-Auditor/sql/schema_design.md) accurately specifies the **finalized 9-table schema**.
  - However, the existing [`sql/schema.sql`](file:///c:/Users/GRISHMA/OneDrive/Desktop/TY/SEM%205/EDI/AI-Public-Procurement-Auditor/sql/schema.sql) is an earlier draft with several major incompatibilities:
    1. It includes an unbacked `bids` table with artificial bidder slots.
    2. It includes a `vendors` table rather than the verified `suppliers` dimension.
    3. It contains `CONSTRAINT uq_contracts_wb_number UNIQUE (wb_contract_number)`, which will fail on JV contracts.
    4. It is **missing `tender_contract_link`** (essential for cross-dataset linkage).
    5. It is **missing `tender_milestones`** (68,464 rows).
    6. It is **missing `invoice_items`**.
- **Remediation Plan:**
  - When authorized by the user to update DDL, `sql/schema.sql` must be synchronized to match `sql/schema_design.md` exactly.

---

## Actionable Recommendations Summary

| Priority | Area | Required Action |
|:---:|---|---|
| **CRITICAL** | `contracts.wb_contract_number` | Drop solitary `UNIQUE` constraint on `wb_contract_number` to allow Joint Venture member rows. Use `contract_id` as primary key. |
| **CRITICAL** | `sql/schema.sql` DDL Sync | Regenerate `schema.sql` to implement the finalized 9 tables and drop deprecated draft tables (`bids`, `vendors`). |
| **WARNING** | `contracts` Nullable Columns | Ensure `contract_description`, `borrower_country_code`, and `contract_amount_usd` are `NULLABLE` to accommodate raw World Bank nulls. |
| **WARNING** | Supplier Ingestion Handling | Handle the 6 NULL `Supplier ID` records in the World Bank CSV during ETL prior to inserting into `suppliers`. |
| **WARNING** | Date Parsing | Use explicit `MM/DD/YYYY` format string during World Bank date ingestion. |
| **OK** | Invoice Design | Maintain `invoice_items.item_id` as strictly `NULLABLE`. |
