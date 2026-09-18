# World Bank Dataset Investigation & Data Gap Analysis

**Target Document:** `outputs/worldbank_data_gap_analysis.md`  
**Location Analyzed:** `data/raw/worldbank/`  
**Files Inspected:**
1. `data/raw/worldbank/full.jsonl` (39.67 MB)
2. `data/raw/worldbank/metadata_contract_awards_in_investment_project_financing_since_fy_2020_08-25-2026.json` (10.45 KB)

**Execution Date:** 2026-09-12  
**Action Performed:** Read-only structural analysis (no files modified).

---

## Executive Summary & Core Discovery

A critical architectural finding emerges from the inspection of `data/raw/worldbank/`:

1. **`full.jsonl` is NOT a separate World Bank contract awards dataset.**  
   Instead, `full.jsonl` is the **original Open Contracting Data Standard (OCDS) JSON Lines source file from which the TED CSV files (`main.csv`, `tender_milestones.csv`, `tender_documents.csv`, `tender_participationFee.csv`) were originally extracted.**
   - It contains exactly **34,232 lines**, each corresponding 1-to-1 with the 34,232 tenders in `data/raw/ted/main.csv`.
   - The set of 34,232 `ocid` values in `full.jsonl` is **100% identical** to the `ocid` values in TED.
   - It contains only notice-stage procurement data (`initiationType: "tender"`) and contains **no vendor, award, contract, or individual bid records**.

2. **The metadata JSON file describes an external World Bank dataset, but its data file is absent.**  
   `metadata_contract_awards_in_investment_project_financing_since_fy_2020_08-25-2026.json` describes the official World Bank Investment Project Financing (IPF) Contract Awards dataset (288,392 rows, 21 columns including `supplier`, `supplier_id`, `supplier_contract_amount_usd`, `wb_contract_number`). However, the actual contract awards records described by this metadata are **not present in `full.jsonl`**.

3. **Conclusion on Data Gaps:**  
   **`full.jsonl` CANNOT fill the TED data gaps for vendors/suppliers, contracts/awards, or individual bids/participants**, because it is identical in scope, entities, and records to the TED tender notices already processed.

---

## 1. Analysis of Data Gaps

### 1.1 Can it fill the gap for Vendors / Suppliers?
- **Finding:** **NO.**
- **Details:** `full.jsonl` contains zero vendor/supplier entities. There are no fields for supplier legal names, vendor IDs, tax registration numbers, addresses, or beneficial ownership. The standard OCDS `parties` or `awards[].suppliers` blocks are completely absent.

### 1.2 Can it fill the gap for Contracts / Awards?
- **Finding:** **NO.**
- **Details:** `full.jsonl` contains zero contract or award entities. There are no fields for contract numbers, contract signing dates, awarded values, or contract completion milestones. The standard OCDS `awards[]` and `contracts[]` arrays are absent.

### 1.3 Can it fill the gap for Individual Bids / Participants?
- **Finding:** **NO.**
- **Details:** `full.jsonl` only contains a single scalar integer: `tender.numberOfTenderers` (e.g., `7`). It does not contain individual bidder names, bidder IDs, submitted bid prices, technical qualification scores, or disqualified bidder records. Standard OCDS `bids.details[]` is absent.

---

## 2. Structural Inspection of `full.jsonl`

### 2.1 Total Number of Records
- **Total Line Count:** **34,232 records** (1 JSON object per line).
- **Format:** JSON Lines (`.jsonl`), UTF-8 encoded.

### 2.2 Top-Level Fields
Every single record across all 34,232 rows shares the exact same 10 top-level fields:

| Field Name | Type | Sample Value | Description |
|---|---|---|---|
| `id` | String | `"ocds-kjhdrl-2016_AP_1389_1-2022-09-29"` | Unique OCDS compiled release identifier |
| `tag` | Array of String | `["compiled"]` | OCDS release lifecycle tag |
| `date` | String (Date) | `"2022-09-29"` | OCDS snapshot compilation date |
| `ocid` | String | `"ocds-kjhdrl-2016_AP_1389_1"` | Globally unique Open Contracting identifier |
| `buyer` | Object (Dict) | `{"name": "Assam Police"}` | Procuring entity details |
| `tender` | Object (Dict) | `{...}` | Comprehensive tender notice details |
| `fiscal_year` | String | `"2016-2017"` | Financial year of procurement initiation |
| `Payment Mode` | String | `"Offline"` | Tender fee payment mode (`Offline`, `Online`, `Both`) |
| `initiationType` | String | `"tender"` | OCDS initiation type (always `"tender"`) |
| `tenderclassification` | Object (Dict) | `{"description": "Electronics Equipment"}` | High-level procurement item classification |

---

### 2.3 Nested Fields Relevant to Procurement

#### A. Inside `buyer` (Object):
- `buyer.name` (String): Cleaned title-case name of procuring entity (e.g., `"Assam Police"`, `"Public Works Roads Department"`).

#### B. Inside `tender` (Object):
- `tender.id` (String): Source e-procurement portal reference (e.g., `"2016_AP_1389_1"`).
- `tender.title` (String): Tender work title and procurement scope.
- `tender.stage` (String): Current procurement status (`"AOC"`, `"To be Opened"`, `"Technical Evaluation"`).
- `tender.status` (String): Always `"NA"` in all records.
- `tender.procurementMethod` (String): Procurement method (`"Open Tender"`, `"Limited"`, `"Single"`).
- `tender.mainProcurementCategory` (String): Main category (`"Goods"`, `"Services"`, `"Works"`).
- `tender.contractType` (String): Contract mechanism (`"Works"`, `"Supply"`, `"Item Rate"`, `"Turn-key"`).
- `tender.externalReference` (String): Department tender reference / file number.
- `tender.datePublished` (String): Timestamp when tender was published (`"DD-MM-YYYY HH:MM"`).
- `tender.bidOpening.date` (String): Scheduled date and time for opening bids.
- `tender.tenderPeriod.durationInDays` (Integer): Bid validity duration in calendar days (e.g., `180`).
- `tender.numberOfTenderers` (Integer): Total count of bidders who submitted bids (e.g., `5`).
- `tender.value.amount` (Numeric): Estimated cost of tender in INR (contains `0`, positive numbers, or `"NA"`).
- `tender.allowTwoStageTender` (String): `"Yes"` or `"No"`.
- `tender.allowPreferentialBidder` (String): `"Yes"` or `"No"`.
- `tender.submissionMethodDetails` (String): Always `"NA"`.
- `tender.documents` (List of Dicts): List of document stubs: `[{"id": "NA"}]`.
- `tender.milestones` (List of Dicts): Two milestone slots flattened: `[{"code": "...", "type": "...", "title": "...", "dueDate": "NA", "type.1": "...", "title.1": "...", "dueDate.1": "NA"}]`.
- `tender.participationFee` (List of Dicts): List with currency flag: `[{"multiCurrencyAllowed": "No"}]`.

#### C. Inside `tenderclassification` (Object):
- `tenderclassification.description` (String): Line-item scope description (e.g., `"Electronics Equipment"`, `"Civil Works - Bridges"`).

---

### 2.4 Detailed Attribute Breakdown

- **Vendor / Supplier Identifiers and Names:** **None.** (0 occurrences across 34,232 records).
- **Buyer / Procuring Entity Fields:** `buyer.name` (101 unique buyer entities in Assam).
- **Contract / Award Identifiers:** **None.**
- **Contract / Award Values:** **None.** (Only `tender.value.amount`, which represents pre-tender estimates).
- **Award Dates:** **None.**
- **Bidder / Participant Information:** Only the aggregate integer `tender.numberOfTenderers`.
- **Bid Amounts:** **None.**
- **Tender / Procurement Identifiers:** `ocid` (OCDS identifier), `id` (release ID), `tender.id` (portal tender ID), `tender.externalReference` (NIT reference number).
- **Country:** Not explicitly stated as a top-level field (implicitly India/Assam; mapped to `'IN'`).
- **Procurement Category:** `tender.mainProcurementCategory` (`"Goods"`, `"Services"`, `"Works"`).

---

## 3. Linkage Analysis with TED Dataset

### 3.1 Fields that Potentially Link to TED
Because `full.jsonl` is the direct JSONL counterpart to TED, the following fields have **100% exact 1-to-1 linkage**:

| `full.jsonl` Field | Target TED Cleaned Field (`tenders.csv`) | Linkage Type | Match Rate |
|---|---|---|:---:|
| `ocid` | `tenders.ocid` | Direct String Match | **100% (34,232 / 34,232)** |
| `id` | `tenders.ocds_release_id` | Direct String Match | **100% (34,232 / 34,232)** |
| `tender.id` | `tenders.source_tender_id` | Direct String Match | **100% (34,232 / 34,232)** |
| `buyer.name` | `buyers.buyer_name` | Normalized String Match | **100% (101 / 101 buyers)** |

### 3.2 Fields that Cannot be Linked to TED
- Within `full.jsonl`, **no additional or unlinked fields exist**, because every field in `full.jsonl` was already unpacked into the raw TED CSV files (`main.csv`, `tender_milestones.csv`, `tender_participationFee.csv`, `tender_documents.csv`) and cleaned into `data/processed/`.
- With respect to the schema described in `metadata_contract_awards*.json` (which contains fields such as `supplier`, `supplier_id`, `wb_contract_number`, `supplier_contract_amount_usd`, `borrower_contract_reference_number`), **none of those fields exist in `full.jsonl`**, making it impossible to perform a contract-award join using `full.jsonl`.

---

## 4. Entity Availability & Recommendation Matrix

| Entity | Available? | Relevant Fields in `full.jsonl` | Can Link to TED? | Recommended Use |
|---|:---:|---|:---:|---|
| **Vendors / Suppliers** | **NO** | *None* | No | Must be acquired from external sources: actual World Bank Contract Awards CSV/API or extracted from OCR invoices. |
| **Contracts / Awards** | **NO** | *None* | No | Must be acquired from the external World Bank Contract Awards dataset (matching `metadata_contract_awards*.json`) or Assam contract award registries. |
| **Individual Bids / Participants** | **NO** | Only scalar `tender.numberOfTenderers` (integer count) | No | Individual bidders and bid prices cannot be extracted from this file; requires portal bid-submission logs or BOQ financial evaluation records. |
| **Buyers / Procuring Entities** | **YES** | `buyer.name` | **YES** (100%) | Already extracted and standardized into `data/processed/buyers.csv`. |
| **Tenders** | **YES** | `id`, `ocid`, `tender.*`, `fiscal_year` | **YES** (100%) | Already cleaned and standardized into `data/processed/tenders.csv`. |
| **Items / Classifications** | **YES** | `tenderclassification.description`, `tender.mainProcurementCategory` | **YES** (100%) | Already extracted into `data/processed/items.csv`. |
| **Tender Milestones** | **YES** | `tender.milestones` | **YES** (100%) | Already unpivoted into `data/processed/tender_milestones.csv`. |
| **Participation Information** | **YES** | `tender.participationFee`, `Payment Mode`, `numberOfTenderers` | **YES** (100%) | Already inlined into `data/processed/tenders.csv`. |
| **Invoices** | **NO** | *None* | No | Target for the post-award OCR invoice pipeline. |

---

## Summary of Actionable Next Steps

1. **Do not attempt to join `full.jsonl` with `data/processed/tenders.csv`**: They are redundant representations of the exact same 34,232 tender records.
2. **Source the actual World Bank Contract Awards file**: To acquire vendor profiles and contract awards, obtain the data file described by `metadata_contract_awards_in_investment_project_financing_since_fy_2020_08-25-2026.json` (which contains 288,392 rows across `supplier`, `supplier_contract_amount_usd`, `wb_contract_number`).
3. **Maintain frozen TED pipeline**: Keep the verified relational schema in `data/processed/` intact.
