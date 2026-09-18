# Final Validation Report — Cleaned TED Dataset

**Target File:** `outputs/final_validation_report.md`  
**Datasets Validated:**
- `data/processed/tenders.csv` (34,232 rows)
- `data/processed/buyers.csv` (101 rows)
- `data/processed/items.csv` (34,232 rows)
- `data/processed/tender_milestones.csv` (68,464 rows)

**Execution Date:** 2026-09-12  
**Dataset Integrity Status:** Complete & Verified  

---

## Detailed Check Results

### Check 1: Total Records
- **Requirement:** Total records = 34,232
- **Observed Count:** 34,232 rows in `tenders.csv`, 34,232 rows in `items.csv`, 101 unique procuring entities in `buyers.csv`, 68,464 rows in `tender_milestones.csv`.
- **Finding:** Exactly matches target record count (34,232 tenders processed from `data/raw/ted/main.csv`).
- **Result:** **PASS**

---

### Check 2: Duplicate Records
- **Requirement:** No exact duplicate records across any processed relational table.
- **Audit Findings:**
  - `data/processed/tenders.csv`: **0 duplicate rows** (0.0%)
  - `data/processed/buyers.csv`: **0 duplicate rows** (0.0%)
  - `data/processed/items.csv`: **0 duplicate rows** (0.0%)
  - `data/processed/tender_milestones.csv`: **0 duplicate rows** (0.0%)
- **Result:** **PASS**

---

### Check 3: Missing `ocid` / `source_tender_id`
- **Requirement:** `ocid` and `source_tender_id` must be 100% populated without NULLs or blank strings.
- **Audit Findings:**
  - Missing or blank `ocid`: **0** (100% populated, 34,232/34,232)
  - Missing or blank `source_tender_id`: **0** (100% populated, 34,232/34,232)
- **Result:** **PASS**

---

### Check 4: `estimated_value = 0` Count
- **Requirement:** Cleaned `estimated_value` column must contain exactly 0 zero values (all 2,410 zero sentinels converted to NULL).
- **Audit Findings:**
  - Records where `estimated_value == 0.0`: **0**
- **Result:** **PASS**

---

### Check 5: `estimated_value` NULL Count
- **Requirement:** Total NULL values in `estimated_value` must equal 8,027 (5,617 originally missing + 2,410 converted zeros).
- **Audit Findings:**
  - Positive values (`estimated_value > 0`): **26,205** (76.55%)
  - NULL values (`estimated_value IS NULL`): **8,027** (23.45%)
  - Zero values (`estimated_value == 0`): **0** (0.00%)
  - Total records evaluated: **34,232** (100.00%)
- **Result:** **PASS**

---

### Check 6: Negative Procurement Values
- **Requirement:** No negative numbers in any procurement financial or count fields.
- **Audit Findings:**
  - Negative values in `estimated_value`: **0** (Minimum positive value: ₹1.00)
  - Negative values in `number_of_tenderers`: **0** (Minimum: 0)
  - Negative values in `duration_days`: **0** (Minimum: 1)
- **Result:** **PASS**

---

### Check 7: Invalid Dates
- **Requirement:** All date fields must conform to ISO 8601 format (`YYYY-MM-DDTHH:MM:SS`) with valid calendar dates.
- **Audit Findings:**
  - `date_published`: **0 invalid dates** (34,232 valid ISO 8601 timestamps)
  - `bid_opening_date`: **0 invalid dates** (34,232 valid ISO 8601 timestamps)
  - `tender_milestones.due_date`: **0 invalid dates** (all unpopulated raw slots set cleanly to NULL)
- **Result:** **PASS**

---

### Check 8: Duplicate Tender IDs
- **Requirement:** Primary key `tender_id` and unique source identifier `source_tender_id` must have 0 duplicate values.
- **Audit Findings:**
  - Duplicate `tender_id` (UUID): **0** (34,232 unique UUIDs)
  - Duplicate `source_tender_id`: **0** (34,232 unique source tender IDs)
- **Result:** **PASS**

---

### Check 9: Duplicate Contract IDs (if present)
- **Requirement:** Verify if `contract_id` is present, and ensure no duplicates if present.
- **Audit Findings:**
  - `contract_id` is **not present** in `tenders.csv`, `buyers.csv`, `items.csv`, or `tender_milestones.csv`.
  - TED source data consists exclusively of tender notices (NIT stage).
  - Contracts and contract IDs belong to the `contracts` table and will be populated downstream via the World Bank dataset and contract awards module.
  - No contract ID collisions exist.
- **Result:** **PASS**

---

### Check 10: Invalid ENUM Values
- **Requirement:** Categorical values must conform strictly to the PostgreSQL ENUM definitions specified in `sql/schema.sql`.
- **Audit Findings:**
  - **`stage`** (`procurement_stage_enum`): **0 invalid values** (100% conform to valid enum set; out-of-vocab stages mapped to `'Unknown'`).
  - **`procurement_method`** (`procurement_method_enum`): **0 invalid values** (100% conform to Open Tender, Limited, Single, etc.).
  - **`category`** (`procurement_category_enum`): **0 invalid values** (Goods, Services, Works).
  - **`contract_type`** (`contract_type_enum`): **0 invalid values** (100% conform to Buy, Supply, Works, Turn-key, Item Rate, etc.).
  - **`payment_mode`** (`payment_mode_enum`): **0 invalid values** (Online, Offline, Both, Both(Online/Offline), Not Applicable).
- **Result:** **PASS**

---

### Check 11: Important ID Fields Containing Empty Strings
- **Requirement:** Key identifier and foreign key fields must not contain empty strings (`""`), whitespace-only strings, or malformed values.
- **Audit Findings:**
  - `tenders.tender_id`: **0 empty strings**
  - `tenders.ocid`: **0 empty strings**
  - `tenders.ocds_release_id`: **0 empty strings**
  - `tenders.source_tender_id`: **0 empty strings**
  - `tenders.buyer_id`: **0 empty strings**
  - `buyers.buyer_id`: **0 empty strings**
  - `buyers.buyer_name`: **0 empty strings**
  - `buyers.department_code`: **0 empty strings**
  - `items.item_id`: **0 empty strings**
  - `items.tender_id`: **0 empty strings**
  - `tender_milestones.milestone_id`: **0 empty strings**
  - `tender_milestones.tender_id`: **0 empty strings**
- **Result:** **PASS**

---

### Check 12: Numeric Fields Containing Non-Numeric Values
- **Requirement:** Numeric columns must contain exclusively valid numbers (`float`/`int`) or standardized NULLs; no unparsed string artifacts.
- **Audit Findings:**
  - Non-numeric values in `tenders.estimated_value`: **0**
  - Non-numeric values in `tenders.number_of_tenderers`: **0**
  - Non-numeric values in `tenders.duration_days`: **0**
  - Non-numeric values in `items.unit_price`: **0** (all NULL, ready for OCR)
  - Non-numeric values in `items.quantity`: **0** (all NULL, ready for OCR)
- **Result:** **PASS**

---

## Validation Summary Matrix

| # | Validation Check Description | Expected | Observed | Status |
|:---:|---|:---:|:---:|:---:|
| **1** | Total Records in `tenders.csv` | 34,232 | 34,232 | **PASS** |
| **2** | Duplicate Records (all tables) | 0 | 0 | **PASS** |
| **3** | Missing `ocid` / `source_tender_id` | 0 | 0 | **PASS** |
| **4** | `estimated_value = 0` Count | 0 | 0 | **PASS** |
| **5** | `estimated_value` NULL Count | 8,027 | 8,027 | **PASS** |
| **6** | Negative Procurement Values | 0 | 0 | **PASS** |
| **7** | Invalid Dates (ISO 8601 standard) | 0 | 0 | **PASS** |
| **8** | Duplicate Tender IDs (`tender_id` / `source_tender_id`) | 0 | 0 | **PASS** |
| **9** | Duplicate Contract IDs | N/A (Not in TED) | 0 | **PASS** |
| **10** | Invalid ENUM Values (per PostgreSQL schema) | 0 | 0 | **PASS** |
| **11** | Important ID Fields Containing Empty Strings | 0 | 0 | **PASS** |
| **12** | Numeric Fields Containing Non-Numeric Artifacts | 0 | 0 | **PASS** |

---

### Overall Dataset Status: **12 / 12 CHECKS PASSED (100%)**
The cleaned TED procurement dataset conforms to PostgreSQL relational constraints, preserves source auditability, contains zero corrupted values, and is ready for database loading and ML feature pipelines.
