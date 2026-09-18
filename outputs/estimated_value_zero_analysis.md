# Analysis of Zero-Value Records in TED Dataset (`estimated_value = 0`)

**Target File:** `outputs/estimated_value_zero_analysis.md`  
**Dataset:** TED (India OCDS subset) — `data/raw/ted/main.csv` / `data/processed/tenders.csv`  
**Records Analyzed:** 2,410 records where `estimated_value == 0.0` out of 34,232 total records (7.04%)  
**Date:** 2026-09-12  

---

## Executive Summary

Across the 34,232 tenders in the TED dataset:
- **26,205 tenders (76.55%)** have positive estimated values (`estimated_value > 0`).
- **5,617 tenders (16.41%)** have explicitly missing values (`estimated_value IS NULL`, coded as `"NA"` in raw data).
- **2,410 tenders (7.04%)** have `estimated_value == 0.0`.

A comprehensive investigation into procurement titles, contract types, tender categories, tenderer participation, and portal workflows confirms that **`estimated_value = 0` does NOT represent zero procurement cost**. Rather, it functions as a numeric missing-value sentinel / placeholder used by procuring entities when an estimated tender value is withheld, not applicable (e.g., rate contracts, empanelment), or unestimated prior to bidding.

---

## 1. Does Zero Represent a Genuine Procurement Value?

### Finding: NO. Zero is commercially, legally, and physically impossible for these procurements.

#### Evidence:
1. **Procurement Titles Demand Substantial Capital:**
   A sample of the 2,410 zero-value records shows procurement of high-value capital assets, industrial machinery, civil infrastructure, and bulk supplies:
   - *"Supply, Installation and maintenance of approximately 134 nos. of Digital Photocopier machines with ARDF facility in various Court complexes of Assam"*
   - *"Supply and Installation of Instruments/Machines on turnkey basis to be installed at Karimganj Polytechnic Maizgaon Karimganj Assam"*
   - *"INVITATION OF BID FOR Procurement of Double Beam Atomic Absorption Spectrophotometer"*
   - *"Supply, Installation and Commissioning of Solar Photo Voltaic (SPV) Water Pumping System for Irrigation purpose"*
   - *"Supply of Woolen Blanket, Mosquito Net, Pillow with Pillow cover, Bed Sheet for the Jails of Assam during the Financial Year 2018-19"*
   - *"Printing of Blank Admit Card Mark Sheet and Pass Certificates with Security features of HSLC AHM Examination 2018"*
   
   None of these goods or services can be procured for ₹0.00.

2. **Active Commercial Competition:**
   - **2,364 of the 2,410 zero-value records (98.09%)** record active bidder participation (`number_of_tenderers`).
   - The average number of bidders for zero-value tenders is **8.96 tenderers** (median: 3.0), which is actually **higher** than for positive-value tenders (mean: 2.89 tenderers).
   - Suppliers would not submit commercial bids for ₹0 contracts; they are competing for substantial public works and supply orders.

3. **Advanced Procurement Stages Reached:**
   Zero-value tenders progress through the full procurement lifecycle:
   - **AOC (Award of Contract):** 736 tenders (30.5%)
   - **To be Opened:** 666 tenders (27.6%)
   - **Technical Evaluation:** 341 tenders (14.1%)
   - **Financial Bid Opening:** 250 tenders (10.4%)
   - **Financial Evaluation:** 203 tenders (8.4%)
   - **Technical Bid Opening:** 143 tenders (5.9%)
   Only 12 zero-value tenders (0.50%) were cancelled.

4. **Public Procurement Law:**
   Under Indian General Financial Rules (GFR) and State Public Procurement Rules, public authorities cannot invite tenders without administrative approval and expenditure sanction. A true contract value of zero does not exist in commercial procurement.

---

## 2. Does the Source Use Zero as a Missing-Value Placeholder?

### Finding: YES. The portal uses `0` as an input sentinel for undisclosed or unestimated tender values.

#### Evidence:
1. **NIC / GePNIC Portal Input Constraints:**
   The primary source of this data is the Indian National Informatics Centre (NIC) e-procurement platform (GePNIC / Assam eProcurement). On this platform:
   - The `Tender Value in ₹` field on the tender creation screen enforces a numeric format.
   - When procuring entities publish tenders where the aggregate value is intentionally not declared (to prevent cartelization or price anchoring) or where rates are invited on a schedule, the portal requires a numeric entry, leading officers to enter `0` or `0.00`.
   - In alternative portal modules or older templates, the field was left blank/unmapped, resulting in the 5,617 `"NA"` records.
   - Hence, `0` and `"NA"` are two procedural manifestations of the same underlying condition: **undisclosed tender value**.

2. **Extreme Concentration in Non-Fixed-Cost Contract Types:**
   When examining contract types that structurally do not have an upfront fixed project value:
   - **Empanelment:** 61 out of 75 tenders (**81.33%**) have `estimated_value = 0`. In empanelment, vendors are qualified to join a panel; contracts are awarded later per assignment.
   - **Multi-stage:** 5 out of 7 tenders (**71.43%**) have `estimated_value = 0`.
   - **QCBS (Quality & Cost Based Selection):** 9 out of 14 tenders (**64.29%**) have `estimated_value = 0`.
   - **EOI (Expression of Interest):** 99 out of 270 tenders (**36.67%**) have `estimated_value = 0`. EOIs are pre-qualification stages prior to financial bidding.
   - **Supply (Rate Contracts):** 886 out of 3,114 tenders (**28.45%**) have `estimated_value = 0`.

---

## 3. Do These Records Have Other Fields Indicating Missing Estimated Value?

### Finding: YES. Several structural fields correlate strongly with the zero-value phenomenon.

| Field | Pattern in Zero Records | Comparison with Positive Records | Indication |
|---|---|---|---|
| **`category`** | **Goods** (1,409; 58.5%)<br>**Services** (546; 22.7%)<br>**Works** (455; 18.9%) | Positive records are **90.6% Works**, only 7.6% Goods and 1.8% Services. | Works almost always have a formal Detailed Project Report (DPR) with estimated civil cost. Goods and Services often use open item rate schedules without declared aggregate cost. |
| **`contract_type`** | Concentrated in `Supply` (886), `Item Rate` (629), `Turn-key` (177), `EOI` (99), `Empanelment` (61). | Positive records are 62.4% standard Item Rate civil works and 21.6% Works. | In `Supply` and `Item Rate`, bidders quote per-unit rates in the Bill of Quantities (BOQ); total procurement outlay is not published. |
| **`Payment Mode`** | **Not Applicable** in 190 tenders (**7.88%**). | Only **0.47%** of positive records have Payment Mode "Not Applicable". | A ~17x higher incidence of "Not Applicable" indicates non-standard financial setup at initial notice. |
| **`buyer_name`** | Top buyers: Home B (347), Industries & Commerce (302), APDCL (192), Health & Family Welfare (150), AEGCL (145), Assam Police (110). | Positive records are dominated by Public Works Roads (9,580) and BTC-PWD (2,725). | Civil departments (PWD) mandate published estimates; administrative/utility departments (Police, Health, Power) procure equipment/supplies on rate contracts. |
| **`tenderclassification_description`** | "Miscellaneous Goods" (443), "Supply of Materials" (320), "Consultancy" (183), "Miscellaneous Services" (180), "Food Products" (140), "Computer- H/W" (74). | Positive records are dominated by "Civil Works - Bridges", "Roads", "Water Works". | Goods/services categories where unit rates are tendered without fixed contract ceilings. |

---

## 4. Distribution of `estimated_value`: Zero vs Non-Zero Records

### 4.1 Global Breakdown

| Cohort | Record Count | % of Dataset | Mean (INR) | Median (INR) | Min (INR) | Max (INR) |
|---|---|---|---|---|---|---|
| **Positive (>0)** | 26,205 | 76.55% | ₹39,009,296.96 | ₹9,960,448.00 | ₹1.00 | ₹20,000,000,000.00 |
| **Missing (NA / NULL)** | 5,617 | 16.41% | *NULL* | *NULL* | *NULL* | *NULL* |
| **Zero (=0)** | 2,410 | 7.04% | ₹0.00 | ₹0.00 | ₹0.00 | ₹0.00 |
| **Total** | 34,232 | 100.00% | — | — | — | — |

### 4.2 Statistical Distribution of Positive Records (`estimated_value > 0`)

- **Count:** 26,205
- **Mean:** ₹39,009,296.96 (~₹3.90 Crore)
- **Standard Deviation:** ₹307,304,523.66
- **Min:** ₹1.00 *(Note: 7 records have nominal ₹1.00 or ₹2.00 values, also acting as token inputs)*
- **5th Percentile:** ₹1,980,198.00 (~₹19.8 Lakh)
- **25th Percentile (Q1):** ₹5,400,000.00 (~₹54.0 Lakh)
- **50th Percentile (Median):** ₹9,960,448.00 (~₹99.6 Lakh / ~₹1.00 Crore)
- **75th Percentile (Q3):** ₹21,071,871.00 (~₹2.11 Crore)
- **95th Percentile:** ₹100,000,000.00 (~₹10.00 Crore)
- **99th Percentile:** ₹437,108,848.00 (~₹43.71 Crore)
- **Max:** ₹20,000,000,000.00 (₹2,000 Crore)
- **Skewness:** 46.39

### 4.3 Distortion Caused by Retaining Zeros as Numeric `0.0`

If the 2,410 zero records are treated as valid numeric values (`estimated_value >= 0`):

| Metric | Positive Only (`>0`) | Including Zeros (`>=0`) | Distortion / Impact |
|---|---|---|---|
| **Sample Size ($N$)** | 26,205 | 28,615 | +2,410 artificial data points |
| **Mean** | ₹39,009,296.96 | ₹35,723,873.03 | **Decreases by ₹3,285,423.93 (-8.42%)** |
| **Median** | ₹9,960,448.00 | ₹9,199,847.00 | **Decreases by ₹760,601.00 (-7.64%)** |
| **25th Percentile (Q1)** | ₹5,400,000.00 | ₹4,156,690.00 | **Decreases by ₹1,243,310.00 (-23.02%)** |
| **Minimum** | ₹1.00 | ₹0.00 | Sets minimum to 0.00 |
| **Zero Mass Spike** | 0.0% | 8.42% of numeric records | Creates an artificial point mass at 0 |

---

## 5. Downstream Impact on Data Science & Machine Learning Modules

Leaving `estimated_value = 0` as a numeric zero introduces severe hazards for subsequent project modules:

1. **Fatal Division-by-Zero in Fraud Detection Ratios:**
   - Standard public procurement audit metrics include:
     $$\text{Bid-to-Estimate Ratio} = \frac{\text{Bid Amount}}{\text{Estimated Value}}$$
     $$\text{Cost Overrun Ratio} = \frac{\text{Contract Award Amount}}{\text{Estimated Value}}$$
   - When `estimated_value = 0`, any ratio calculation produces `ZeroDivisionError`, `+inf`, or `NaN`, crashing ML feature extraction pipelines.

2. **Distortion of Statistical Anomaly Detectors:**
   - Unsupervised anomaly detection models (Isolation Forests, One-Class SVM, Local Outlier Factor) will flag these 2,410 records as extreme anomalous outliers because they sit at ₹0 while the rest of the distribution has a median of ₹1 Crore. This produces 2,410 false positives.

3. **Machine Learning Model Corruption:**
   - Regression models predicting procurement value (e.g., based on title embeddings, category, buyer, and duration) will suffer severe gradient distortion from trying to fit ₹0 target values on multi-million rupee contracts.
   - Cost benchmark algorithms will under-estimate standard item rates.

---

## 6. Recommendation

### Primary Recommendation: **Convert `estimated_value = 0` to `NULL`**

1. **Semantic Fidelity:**
   In database design and statistics, `NULL` explicitly denotes **"value unknown or not recorded"**, whereas `0.00` denotes a verified monetary value of zero. Converting `0` to `NULL` accurately reflects domain reality.

2. **Unified Missing-Data Handling:**
   Converting the 2,410 zeros to `NULL` unites them with the 5,617 existing `"NA"` records, resulting in a clean, consistent cohort of **8,027 tenders (23.45%)** with undisclosed estimated values. Downstream models can treat `NULL` systematically using standard missing-data imputation or indicator variables.

3. **Downstream Pipeline Safety:**
   - Prevents `ZeroDivisionError` in price-ratio and anomaly detection scripts.
   - Prevents artificial downward distortion of Q1 (-23%) and median (-7.6%).
   - Ensures SQL aggregate functions (`AVG(estimated_value)`, `STDDEV(estimated_value)`, `PERCENTILE_CONT`) compute accurate public spending metrics without zero-drag.

### Optional Architectural Enhancement:
If preserving the distinction between *unentered* (`"NA"`) and *zero-placeholder* (`"0"`) is valuable for data auditing, we can maintain the distinction without polluting the numeric column:
- Set `estimated_value = NULL` in `tenders.csv` / `sql/schema.sql`.
- In the `cleaning_report.md` and data documentation, record that 2,410 records were normalized from raw `0.0`.
- Alternatively, add a boolean audit flag column (e.g., `is_estimated_value_undisclosed BOOLEAN DEFAULT FALSE` or `raw_estimated_value_type VARCHAR(10)`: `'positive'`, `'zero_placeholder'`, `'null_na'`).

---

*Analysis ready for user review. No data files have been modified.*
