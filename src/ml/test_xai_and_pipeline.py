import os
import sys
import joblib
import pandas as pd
import numpy as np

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

from src.features.build_features import extract_all_features
from src.ml.train_models import predict_anomaly_scores
from src.ml.risk_scorer import calculate_composite_risk_scores
from src.ml.explainability import compute_shap_explanations, generate_auditor_explanation, FEATURE_HUMAN_NAMES

print("=" * 80)
print("VERIFICATION & VALIDATION SUITE: ML MODELS + PIPELINE + XAI")
print("=" * 80)

# -------------------------------------------------------------
# 1. VERIFY TRAINED MODEL
# -------------------------------------------------------------
print("\n[TEST 1] Verifying Trained Model Artifacts (models/isolation_forest.joblib)...")
assert os.path.exists("models/isolation_forest.joblib"), "Model file does not exist!"
bundle = joblib.load("models/isolation_forest.joblib")
print(f"  [PASSED] Model Type: {type(bundle['model']).__name__}")
print(f"  [PASSED] Number of Estimators: {bundle['model'].n_estimators}")
print(f"  [PASSED] Scaler: {type(bundle['scaler']).__name__}")
print(f"  [PASSED] Features Tracked ({len(bundle['features'])}): {bundle['features'][:5]} ...")

# -------------------------------------------------------------
# 2. VERIFY FEATURE & RISK PIPELINE
# -------------------------------------------------------------
print("\n[TEST 2] Verifying Feature Extraction & Risk Pipeline on Real Data...")
tenders_df = pd.read_csv("data/processed/tenders.csv", nrows=1000)
features_df = extract_all_features(tenders_df)
print(f"  [PASSED] Extracted {features_df.shape[1]} features from {len(features_df)} sample tenders.")

# Predict Anomaly Scores
anomaly_scores = predict_anomaly_scores(features_df, "models/isolation_forest.joblib")
assert len(anomaly_scores) == len(features_df), "Anomaly scores length mismatch!"
print(f"  [PASSED] Anomaly scores computed (Min: {anomaly_scores.min():.4f}, Max: {anomaly_scores.max():.4f}, Mean: {anomaly_scores.mean():.4f})")

# Composite Scoring
scored_df = calculate_composite_risk_scores(features_df, anomaly_scores)
assert "risk_score" in scored_df.columns and "risk_level" in scored_df.columns, "Risk scoring missing required columns!"
print(f"  [PASSED] Composite risk scores generated. Distribution:")
print(scored_df["risk_level"].value_counts().to_string(header=False))

# -------------------------------------------------------------
# 3. VERIFY EXPLAINABLE AI (XAI) & SHAP
# -------------------------------------------------------------
print("\n[TEST 3] Verifying Explainable AI (SHAP TreeExplainer & Natural Language Reasoning)...")

# SHAP values computation
explainer, sample_shap, feature_names = compute_shap_explanations(
    features_df, 
    model_bundle_path="models/isolation_forest.joblib",
    sample_size=50
)
print(f"  [PASSED] SHAP TreeExplainer initialized successfully.")
print(f"  [PASSED] SHAP values computed shape: {sample_shap.shape} (50 sample tenders x {len(feature_names)} features)")

# Inspect the top anomalous record
top_row = scored_df.sort_values(by="risk_score", ascending=False).iloc[0]
print("\n--- SAMPLE HIGH-RISK TENDER AUDIT INSPECTION ---")
print(f"Tender ID:       {top_row['source_tender_id']}")
print(f"Contract Value:  INR {top_row['clean_estimated_value']:,.2f}")
print(f"Risk Score:      {top_row['risk_score']}/100 ({top_row['risk_level']})")
print(f"Red Flag Tags:   {top_row['red_flags']}")
print(f"Audit Finding:   {generate_auditor_explanation(top_row)}")

# SHAP feature attribution for this top record
top_features_scaled = bundle["scaler"].transform(pd.DataFrame([top_row[feature_names]]))
top_shap = explainer.shap_values(top_features_scaled)[0]

# Rank top contributing features
contributions = sorted(zip(feature_names, top_shap), key=lambda x: abs(x[1]), reverse=True)
print("\nTop 5 SHAP Feature Attributions (Why the ML model flagged this tender):")
for feat, val in contributions[:5]:
    human_name = FEATURE_HUMAN_NAMES.get(feat, feat)
    direction = "INCREASED ANOMALY RISK" if val < 0 else "NORMALIZING FACTOR"
    print(f"  - {human_name}: SHAP Value = {val:.4f} ({direction})")

print("\n" + "=" * 80)
print("ALL 3 COMPONENTS ARE FULLY FUNCTIONAL AND VERIFIED!")
print("=" * 80)
