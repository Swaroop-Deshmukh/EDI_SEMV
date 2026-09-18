import os
import sys
import time
import numpy as np
import pandas as pd

# Add project root to sys.path
sys.path.insert(0, os.path.abspath("."))

from src.features.build_features import extract_all_features
from src.ml.train_models import train_isolation_forest
from src.ml.risk_scorer import calculate_composite_risk_scores
from src.ml.explainability import generate_auditor_explanation

def run_pipeline():
    start_time = time.time()
    print("=" * 70)
    print("AI Public Procurement Auditor — Machine Learning Pipeline")
    print("=" * 70)
    
    # 1. Load Data
    tenders_path = "data/processed/tenders.csv"
    buyers_path = "data/processed/buyers.csv"
    
    if not os.path.exists(tenders_path):
        print(f"[-] Error: Tenders dataset not found at {tenders_path}")
        return
        
    print(f"[1/5] Loading processed datasets from {tenders_path}...")
    tenders_df = pd.read_csv(tenders_path, low_memory=False)
    buyers_df = pd.read_csv(buyers_path, low_memory=False) if os.path.exists(buyers_path) else None
    
    print(f"      Loaded {len(tenders_df):,} tenders across {tenders_df['buyer_id'].nunique()} buyers.")
    
    # 2. Feature Engineering
    print("[2/5] Engineering forensic & anomaly features (Timing, Competition, Benford, Contract Splitting)...")
    features_df = extract_all_features(tenders_df)
    print(f"      Engineered {features_df.shape[1]} total features.")
    
    # 3. Train Isolation Forest
    print("[3/5] Training Isolation Forest anomaly detection model...")
    model_bundle, anomaly_scores = train_isolation_forest(
        features_df,
        contamination=0.05,
        n_estimators=200,
        model_save_path="models/isolation_forest.joblib"
    )
    
    # 4. Composite Risk Scoring & XAI
    print("[4/5] Computing calibrated 0-100 composite risk scores & audit explanations...")
    scored_df = calculate_composite_risk_scores(features_df, anomaly_scores)
    
    # Attach buyer name if available
    if buyers_df is not None and "buyer_name" in buyers_df.columns:
        buyer_map = dict(zip(buyers_df["buyer_id"], buyers_df["buyer_name"]))
        scored_df["buyer_name"] = scored_df["buyer_id"].map(buyer_map).fillna("Unknown Buyer")
    else:
        scored_df["buyer_name"] = "Unknown Buyer"
        
    # Generate human-readable auditor explanation
    print("      Generating natural language auditor explanations...")
    scored_df["audit_explanation"] = scored_df.apply(generate_auditor_explanation, axis=1)
    
    # Reorder columns for optimal readability
    primary_cols = [
        "tender_id",
        "ocid",
        "source_tender_id",
        "buyer_id",
        "buyer_name",
        "title",
        "category",
        "procurement_method",
        "fiscal_year",
        "clean_estimated_value",
        "num_tenderers_clean",
        "submission_window_days",
        "risk_score",
        "risk_level",
        "red_flags",
        "audit_explanation",
        "score_ml_component",
        "score_competition_component",
        "score_timing_component",
        "score_forensic_component"
    ]
    
    remaining_cols = [c for c in scored_df.columns if c not in primary_cols]
    final_df = scored_df[primary_cols + remaining_cols]
    
    # 5. Save Output
    os.makedirs("data/scored", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)
    
    out_csv = "data/scored/tenders_scored.csv"
    final_df.to_csv(out_csv, index=False)
    print(f"[5/5] Scored tenders dataset saved to {out_csv} ({len(final_df):,} rows)")
    
    # 6. Generate Summary Audit Report
    report_path = "outputs/ml_audit_report.md"
    generate_audit_report(final_df, report_path, elapsed_sec=time.time() - start_time)
    print(f"[+] Audit validation report written to {report_path}")
    print("=" * 70)
    print(f"Pipeline finished successfully in {time.time() - start_time:.2f} seconds.")
    print("=" * 70)

def generate_audit_report(df: pd.DataFrame, report_path: str, elapsed_sec: float):
    total = len(df)
    risk_counts = df["risk_level"].value_counts().to_dict()
    
    crit_count = risk_counts.get("CRITICAL", 0)
    high_count = risk_counts.get("HIGH", 0)
    med_count = risk_counts.get("MEDIUM", 0)
    low_count = risk_counts.get("LOW", 0)
    
    crit_val = df[df["risk_level"] == "CRITICAL"]["clean_estimated_value"].sum()
    high_val = df[df["risk_level"] == "HIGH"]["clean_estimated_value"].sum()
    total_val = df["clean_estimated_value"].sum()
    
    # Top flagged tenders
    top_tenders = df.sort_values(by="risk_score", ascending=False).head(10)
    
    # Top risky buyers
    buyer_risk = df.groupby("buyer_name").agg(
        total_tenders=("tender_id", "count"),
        high_critical_count=("risk_level", lambda s: (s.isin(["HIGH", "CRITICAL"])).sum()),
        avg_risk_score=("risk_score", "mean"),
        total_value=("clean_estimated_value", "sum")
    ).reset_index()
    buyer_risk["risk_ratio"] = (buyer_risk["high_critical_count"] / buyer_risk["total_tenders"]) * 100.0
    top_buyers = buyer_risk[buyer_risk["total_tenders"] >= 50].sort_values(by="risk_ratio", ascending=False).head(10)
    
    # Red flag distribution
    all_flags = []
    for f in df["red_flags"].dropna():
        if f != "NONE":
            all_flags.extend([item.strip() for item in f.split(";")])
    flag_series = pd.Series(all_flags).value_counts().head(10)
    
    lines = [
        "# AI Public Procurement Auditor — ML Pipeline Audit Report",
        "",
        f"**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S')}  ",
        f"**Total Records Analyzed:** {total:,}  ",
        f"**Total Contract Volume Analyzed:** ₹{total_val:,.2f}  ",
        f"**Execution Runtime:** {elapsed_sec:.2f} seconds  ",
        "",
        "---",
        "",
        "## 1. Executive Summary & Risk Distribution",
        "",
        "| Risk Level | Score Range | Tender Count | % of Tenders | Total Value at Risk (INR) | % of Total Value |",
        "|---|---|---|---|---|---|",
        f"| **CRITICAL** | 75.0 – 100.0 | {crit_count:,} | {crit_count/total*100:.1f}% | ₹{crit_val:,.2f} | {crit_val/max(total_val,1)*100:.1f}% |",
        f"| **HIGH** | 55.0 – 74.9 | {high_count:,} | {high_count/total*100:.1f}% | ₹{high_val:,.2f} | {high_val/max(total_val,1)*100:.1f}% |",
        f"| **MEDIUM** | 30.0 – 54.9 | {med_count:,} | {med_count/total*100:.1f}% | ₹{df[df['risk_level']=='MEDIUM']['clean_estimated_value'].sum():,.2f} | {df[df['risk_level']=='MEDIUM']['clean_estimated_value'].sum()/max(total_val,1)*100:.1f}% |",
        f"| **LOW** | 0.0 – 29.9 | {low_count:,} | {low_count/total*100:.1f}% | ₹{df[df['risk_level']=='LOW']['clean_estimated_value'].sum():,.2f} | {df[df['risk_level']=='LOW']['clean_estimated_value'].sum()/max(total_val,1)*100:.1f}% |",
        "",
        "---",
        "",
        "## 2. Top Red Flag Indicators Detected",
        "",
        "| Red Flag Indicator | Occurrences | % of Total Tenders | Description |",
        "|---|---|---|---|"
    ]
    
    for flag_name, count in flag_series.items():
        lines.append(f"| `{flag_name}` | {count:,} | {count/total*100:.1f}% | Forensic anomaly pattern |")
        
    lines.extend([
        "",
        "---",
        "",
        "## 3. Top 10 Highest Risk Tenders Requiring Immediate Audit",
        "",
        "| Rank | Tender ID / OCID | Buyer Department | Estimated Value (INR) | Bidders | Window (Days) | Risk Score | Primary Audit Finding |",
        "|---|---|---|---|---|---|---|---|"
    ])
    
    for idx, (_, row) in enumerate(top_tenders.iterrows(), 1):
        lines.append(
            f"| {idx} | `{row['source_tender_id']}` | {row['buyer_name'][:30]} | ₹{row['clean_estimated_value']:,.0f} | {int(row['num_tenderers_clean'])} | {row['submission_window_days']:.1f} | **{row['risk_score']}** ({row['risk_level']}) | {row['audit_explanation'][:100]}... |"
        )
        
    lines.extend([
        "",
        "---",
        "",
        "## 4. Top Procuring Entities with Highest Anomaly Rates (Min 50 Tenders)",
        "",
        "| Procuring Department | Total Tenders | High/Critical Count | Anomaly Rate (%) | Total Spend (INR) |",
        "|---|---|---|---|---|"
    ])
    
    for _, row in top_buyers.iterrows():
        lines.append(
            f"| {row['buyer_name'][:40]} | {row['total_tenders']:,} | {row['high_critical_count']:,} | **{row['risk_ratio']:.1f}%** | ₹{row['total_value']:,.0f} |"
        )
        
    lines.extend([
        "",
        "---",
        "",
        "## 5. Model & Architecture Specifications",
        "",
        "- **Model Architecture**: Unsupervised Isolation Forest (`n_estimators=200`, `contamination=0.05`) combined with Rule-Based Forensic Heuristics & Benford's Law Deviations.",
        "- **Output Datasets**: `data/scored/tenders_scored.csv` (34,232 scored rows with SHAP/audit rationales).",
        "- **Trained Model Artifacts**: `models/isolation_forest.joblib`."
    ])
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

if __name__ == "__main__":
    run_pipeline()
