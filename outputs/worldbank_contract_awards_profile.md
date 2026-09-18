# World Bank Contract Awards Data File & Gap Profile

**Target Document:** `outputs/worldbank_contract_awards_profile.md`  
**Target Search Path:** `data/raw/worldbank_contract_awards/`  
**Date of Investigation:** 2026-09-12  
**Action Performed:** Read-only inspection and filesystem audit (no files modified).

---

## 1. Investigation Findings & File Status

### 1.1 Status of Target Directory: `data/raw/worldbank_contract_awards/`
- **Result:** **DOES NOT EXIST.**  
  The directory `data/raw/worldbank_contract_awards/` is not present in the workspace.

### 1.2 Inspection of Newly Added File in `data/raw/`
A new file was downloaded and placed directly into `data/raw/`:
- **File Path:** `data/raw/metadata_contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.json`
- **File Size:** **10,957 bytes (10.7 KB / 0.01 MB)**
- **File Type:** JSON Schema / Metadata Descriptor (Not tabular data).
- **Dataset Title:** *"Contract Awards in Investment Project Financing (Since FY 2020)"*
- **Reported Rows in Metadata:** **291,007 rows** (updated as of snapshot date 2026-09-12).
- **Reported Columns in Metadata:** **21 columns**.

> [!WARNING]
> **Data File Missing — Metadata Downloaded Instead of Dataset:**  
> The file present is the **metadata schema definition**, not the actual data file. When exporting from the World Bank Finances portal, the **"Metadata (JSON)"** option was selected rather than the **"CSV"** or **"JSON"** data export option. A dataset of 291,007 records with 21 columns is typically **~65 MB to 100 MB** as a CSV file.

---

## 2. Structural Profile (from Official Schema Definition)

### 2.1 File & Record Metrics
1. **Filename:** `metadata_contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.json`
2. **File Size:** 10,957 bytes (~0.01 MB)
3. **Reported Row Count:** **291,007 rows** (per metadata field `row_count`)
4. **Column Count:** **21 columns** (per metadata field `column_count`)

### 2.2 Complete List of the 21 Schema Columns

| Position | Column Name | Data Type | Business Name | Field Description |
|:---:|---|---|---|---|
| **1** | `as_of_date` | `DATE` | As of Date | Date when the snapshot was generated |
| **2** | `fiscal_year` | `NUMBER` | Fiscal Year | World Bank fiscal year (July 1 - June 30) |
| **3** | `region` | `STRING` | Region | World Bank administrative region (e.g. South Asia) |
| **4** | `borrower_country` | `STRING` | Borrower Country / Economy | Country to which loan/credit was issued (e.g. India) |
| **5** | `borrower_country_code` | `STRING` | Borrower Country Code | World Bank country code (e.g. `IN`) |
| **6** | `project_id` | `STRING` | Project ID | World Bank Project ID (`Pxxxxxxx`) |
| **7** | `project_name` | `STRING` | Project Name | Short descriptive project title |
| **8** | `project_global_practice` | `STRING` | Project Global Practice | Major sector (e.g. Transport, Governance, Water) |
| **9** | `procurement_category` | `STRING` | Procurement Category | Works, Goods, Consulting Services, Non-Consulting Services |
| **10** | `procurement_method` | `STRING` | Procurement Method | Selection method (e.g. RFB, QCBS, Direct Selection) |
| **11** | `wb_contract_number` | `STRING` | WB Contract Number | Internal World Bank contract identifier |
| **12** | `contract_description` | `STRING` | Contract Description | Contract scope as appearing in signed agreement |
| **13** | `borrower_contract_reference_number` | `STRING` | Borrower Contract Ref Number | Contract reference number assigned by local borrower |
| **14** | `contract_signing_date` | `DATE` | Contract Signing Date | Date when contract was executed |
| **15** | `supplier_id` | `STRING` | Supplier ID | World Bank canonical supplier identifier |
| **16** | `supplier` | `STRING` | Supplier | Legal name of awarded contractor/vendor |
| **17** | `supplier_country` | `STRING` | Supplier Country / Economy | Country of supplier registration |
| **18** | `supplier_country_code` | `STRING` | Supplier Country Code | Country code of supplier registration |
| **19** | `supplier_contract_amount_usd` | `NUMBER` | Supplier Contract Amount (USD) | Total contract value committed in US Dollars |
| **20** | `review_type` | `STRING` | Review Type | World Bank procurement review type (Prior or Post) |
| **21** | `contract_signed___calendar_year` | `NUMBER` | Contract Signed Calendar Year | Calendar year derived from signing date |

---

### 2.3 Status of Record-Level Metrics (Items 5 to 14)

Because the physical data rows (the 291,007 contract award lines) are not present in this metadata JSON file, row-level empirical distributions cannot be computed directly from the local disk:

| Metric | Target Value / Status | Note |
|---|:---:|---|
| **5. Missing % for each column** | *Requires Data CSV* | Column definitions exist; empirical null rates require data rows. |
| **6. Duplicate `wb_contract_number`** | *Requires Data CSV* | Joint ventures split contract amounts across partners under same `wb_contract_number`. |
| **7. Unique `supplier` count** | *Requires Data CSV* | Anticipated ~40,000–60,000 unique global suppliers. |
| **8. Unique `supplier_id` count** | *Requires Data CSV* | World Bank master vendor IDs. |
| **9. Unique `project_id` count** | *Requires Data CSV* | Anticipated ~2,500–4,000 active World Bank projects. |
| **10. Number of records for India** | *Requires Data CSV* | Substantial subset (India is historically the largest WB borrower). |
| **11. Records for Assam** | *Requires Data CSV* | Filterable via `project_name` / `borrower_contract_reference_number` (e.g. ASPIRe project). |
| **12. Min/Max `contract_signing_date`** | *Requires Data CSV* | Metadata confirms scope covers FY 2020 to present (July 2019 – September 2026). |
| **13. Missing `supplier` count** | *Requires Data CSV* | Mandatory field in World Bank STEP reporting system. |
| **14. Missing `supplier_contract_amount_usd`** | *Requires Data CSV* | Mandatory financial commitment field in STEP. |

---

## 3. Linkage Analysis: World Bank Contract Awards $\longleftrightarrow$ TED Dataset

An analysis was conducted to determine whether the schema defined in this dataset provides a legitimate direct linkage to [`data/processed/tenders.csv`](file:///c:/Users/GRISHMA/OneDrive/Desktop/TY/SEM%205/EDI/AI-Public-Procurement-Auditor/data/processed/tenders.csv).

### 3.1 Field-by-Field Linkage Evaluation

| World Bank Field | Corresponding Field in `tenders.csv` | Feasibility of Direct Link | Technical Evaluation |
|---|---|:---:|---|
| **`borrower_contract_reference_number`** | `source_tender_id` or `external_reference` | **POTENTIAL (Partial)** | When a state government in India implements a World Bank-funded project (e.g. Assam State Public Finance Institutional Reforms — *ASPIRe Project* or *Assam Inland Water Transport*), the local procurement officers enter their state tender reference into the World Bank STEP portal as the `borrower_contract_reference_number`. For World Bank-financed Assam tenders in TED, this is the **primary candidate for joining tenders to awarded contracts**. |
| **`contract_description`** | `title` | **HEURISTIC (NLP / Fuzzy Match)** | Contract description and tender title often describe the exact same scope of work (e.g., *"Hiring of Independent Verification Agency for ASPIRe"*). Can be joined via semantic similarity embeddings or TF-IDF string matching. |
| **`borrower_country` / `borrower_country_code`** | `country` | **COARSE FILTER ONLY** | Filters down to `borrower_country = 'India'` (`IN`), but cannot serve as a unique relational join key. |
| **`project_name` / `project_id`** | *None in TED* | **INDIRECT FILTER** | TED notices do not store World Bank Project IDs (`Pxxxxxxx`). However, text matching on `title` for terms like `"ASPIRe"` or `"World Bank"` links tenders to specific projects. |
| **`wb_contract_number`** | *None in TED* | **NO DIRECT LINK** | Internal World Bank identifier; never present on state e-procurement tender notices (NIT). |
| **`supplier` / `supplier_id`** | *None in TED* | **ENRICHMENT ONLY** | TED has 0 vendor data. This field is the target enrichment payload that fills the TED data gap for awarded vendors. |
| **`ocid` / `ocds_release_id`** | `ocid` / `ocds_release_id` | **NO DIRECT LINK** | The World Bank IPF Contract Awards tabular dataset is published in World Bank institutional format, not OCDS format; it does not include `ocid`. |

---

## 4. How to Obtain the Actual Contract Awards Data File

To enable the row-level profiling (Items 5–14) and execute the actual vendor/contract joins:

1. Visit the World Bank Finances portal for this dataset:  
   **URL:** [World Bank Contract Awards in IPF Operations (Since FY 2020)](https://financesone.worldbank.org/contract-awards-in-investment-project-financing-(since-fy-2020)/DS00030)
2. Click the **Export** button at the top right.
3. Select **CSV** (or **CSV for Excel**). *Do not select "Metadata (JSON)"*.
4. Save the resulting file (approximately ~70 MB) to:  
   `data/raw/worldbank_contract_awards/contract_awards.csv`
