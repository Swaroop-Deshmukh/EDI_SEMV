# AI Public Procurement Auditor — ML Pipeline Audit Report

**Generated:** 2026-09-18 14:01:42  
**Total Records Analyzed:** 34,232  
**Total Contract Volume Analyzed:** ₹1,022,238,626,887.00  
**Execution Runtime:** 13.66 seconds  

---

## 1. Executive Summary & Risk Distribution

| Risk Level | Score Range | Tender Count | % of Tenders | Total Value at Risk (INR) | % of Total Value |
|---|---|---|---|---|---|
| **CRITICAL** | 75.0 – 100.0 | 2 | 0.0% | ₹3,217,693,000.00 | 0.3% |
| **HIGH** | 55.0 – 74.9 | 380 | 1.1% | ₹70,971,457,554.00 | 6.9% |
| **MEDIUM** | 30.0 – 54.9 | 8,809 | 25.7% | ₹499,089,204,131.00 | 48.8% |
| **LOW** | 0.0 – 29.9 | 25,041 | 73.2% | ₹448,960,272,202.00 | 43.9% |

---

## 2. Top Red Flag Indicators Detected

| Red Flag Indicator | Occurrences | % of Total Tenders | Description |
|---|---|---|---|
| `SUBMISSION_WINDOW_UNDER_3D` | 10,335 | 30.2% | Forensic anomaly pattern |
| `WEEKEND_PUBLICATION` | 6,541 | 19.1% | Forensic anomaly pattern |
| `SINGLE_BIDDER` | 4,532 | 13.2% | Forensic anomaly pattern |
| `NEAR_STATUTORY_THRESHOLD` | 3,742 | 10.9% | Forensic anomaly pattern |
| `POTENTIAL_CONTRACT_SPLITTING` | 3,685 | 10.8% | Forensic anomaly pattern |
| `ZERO_BIDDERS` | 3,644 | 10.6% | Forensic anomaly pattern |
| `HIGH_VALUE_SINGLE_BIDDER` | 1,786 | 5.2% | Forensic anomaly pattern |
| `RUSHED_SUBMISSION_WINDOW` | 1,319 | 3.9% | Forensic anomaly pattern |
| `ABNORMAL_HIGH_VALUE_FOR_BUYER` | 504 | 1.5% | Forensic anomaly pattern |
| `BENFORD_LAW_DEVIATION` | 201 | 0.6% | Forensic anomaly pattern |

---

## 3. Top 10 Highest Risk Tenders Requiring Immediate Audit

| Rank | Tender ID / OCID | Buyer Department | Estimated Value (INR) | Bidders | Window (Days) | Risk Score | Primary Audit Finding |
|---|---|---|---|---|---|---|---|
| 1 | `2020_NHM_17330_1` | National Health Mission | ₹3,000,000,000 | 1 | 3.1 | **78.6** (CRITICAL) | Single-bidder monopoly on a high-value contract (₹3,000,000,000); Rushed submission window of 3.1 da... |
| 2 | `2019_ID_14136_1` | Irrigation Department | ₹217,693,000 | 1 | -30.0 | **76.6** (CRITICAL) | Single-bidder monopoly on a high-value contract (₹217,693,000); Critically short submission window o... |
| 3 | `2018_PWBNH_9862_1` | Public Works Building And Nh D | ₹91,500,000 | 1 | -218.8 | **74.7** (HIGH) | Single-bidder monopoly on a high-value contract (₹91,500,000); Critically short submission window of... |
| 4 | `2018_GMC_4952_54` | Guwahati Municipal Corporation | ₹25,317,000 | 1 | -316.0 | **73.5** (HIGH) | Single-bidder monopoly on a high-value contract (₹25,317,000); Critically short submission window of... |
| 5 | `2018_PWD_9258_1` | Public Works Roads Department | ₹12,770,000 | 1 | -58.2 | **73.2** (HIGH) | Single-bidder monopoly on a high-value contract (₹12,770,000); Critically short submission window of... |
| 6 | `2020_CD_17932_1` | Cooperation Department | ₹20,000,000 | 1 | -165.0 | **72.2** (HIGH) | Single-bidder monopoly on a high-value contract (₹20,000,000); Critically short submission window of... |
| 7 | `2020_PWD_15857_1` | Public Works Roads Department | ₹16,252,000 | 1 | -282.0 | **72.0** (HIGH) | Single-bidder monopoly on a high-value contract (₹16,252,000); Critically short submission window of... |
| 8 | `2018_WPTBC_7490_3` | Welfare Of Plain Tribes And Ba | ₹76,719,030 | 1 | -111.0 | **70.9** (HIGH) | Single-bidder monopoly on a high-value contract (₹76,719,030); Critically short submission window of... |
| 9 | `2018_PWD_9854_12` | Public Works Roads Department | ₹15,000,000 | 1 | -158.0 | **70.8** (HIGH) | Single-bidder monopoly on a high-value contract (₹15,000,000); Critically short submission window of... |
| 10 | `2018_PWBNH_10271_1` | Public Works Building And Nh D | ₹519,398,532 | 1 | 263.1 | **70.7** (HIGH) | Single-bidder monopoly on a high-value contract (₹519,398,532); Potential contract splitting: value ... |

---

## 4. Top Procuring Entities with Highest Anomaly Rates (Min 50 Tenders)

| Procuring Department | Total Tenders | High/Critical Count | Anomaly Rate (%) | Total Spend (INR) |
|---|---|---|---|---|
| Finance Department - World Bank Tenders | 53 | 3 | **5.7%** | ₹933,755,000 |
| Guwahati Smart City Ltd. | 55 | 2 | **3.6%** | ₹17,315,462,144 |
| Cooperation Department | 236 | 8 | **3.4%** | ₹4,647,949,362 |
| Directorate Of Sports And Youth Welfare  | 103 | 3 | **2.9%** | ₹675,074,511 |
| Public Works Building And Nh Department | 2,357 | 61 | **2.6%** | ₹230,474,691,141 |
| Urban Development Department | 462 | 11 | **2.4%** | ₹28,319,185,846 |
| Health And Family Welfare Department | 718 | 16 | **2.2%** | ₹12,101,308,338 |
| Public Health Engineering Department | 610 | 13 | **2.1%** | ₹11,875,641,088 |
| Karbi Anglong Autonomous Council | 260 | 5 | **1.9%** | ₹19,480,776,315 |
| Guwahati Municipal Corporation | 878 | 15 | **1.7%** | ₹9,650,940,574 |

---

## 5. Model & Architecture Specifications

- **Model Architecture**: Unsupervised Isolation Forest (`n_estimators=200`, `contamination=0.05`) combined with Rule-Based Forensic Heuristics & Benford's Law Deviations.
- **Output Datasets**: `data/scored/tenders_scored.csv` (34,232 scored rows with SHAP/audit rationales).
- **Trained Model Artifacts**: `models/isolation_forest.joblib`.