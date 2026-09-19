import numpy as np
import pandas as pd
import shap
import joblib

FEATURE_HUMAN_NAMES = {
    "log_estimated_value": "Contract Estimated Value",
    "submission_window_days": "Bidding Window Duration",
    "duration_days_clean": "Contract Execution Period",
    "buyer_value_zscore": "Tender Value Deviation from Buyer Department Median",
    "category_value_zscore": "Tender Value Deviation from Category Median",
    "num_tenderers_clean": "Number of Competing Tenderers",
    "bidder_intensity_ratio": "Competition-to-Contract Value Ratio",
    "method_risk_weight": "Procurement Method Procedural Risk",
    "benford_anomaly_score": "Benford's Law Digit Frequency Anomaly",
    "splitting_risk_score": "Contract Splitting / Threshold Avoidance Probability",
    "is_single_bidder": "Single Bidder Participation",
    "is_rushed_submission": "Rushed Submission Window (< 7 Days)",
    "is_extremely_short_submission": "Critically Compressed Window (< 3 Days)",
    "high_value_single_bidder": "Single Bidder on High-Value Tender (>= ₹1 Cr)",
    "is_published_weekend": "Tender Published on Weekend / Non-Working Day",
    "near_threshold_flag": "Value Sits Immediately Below Statutory Approval Cutoff",
    "buyer_same_cat_recent_count": "Multiple Same-Category Tenders by Buyer in Rolling Window"
}

def generate_auditor_explanation(row: pd.Series) -> str:
    """
    Generates a concise, plain-English explanation for government auditors.
    """
    reasons = []
    
    # 1. Competition explanation
    if row.get("is_zero_bidder", 0) == 1:
        reasons.append("Zero bidders participated despite tender release")
    elif row.get("is_single_bidder", 0) == 1:
        if row.get("clean_estimated_value", 0) >= 10_000_000:
            reasons.append(f"Single-bidder monopoly on a high-value contract (₹{row.get('clean_estimated_value', 0):,.0f})")
        else:
            reasons.append("Single-bidder submission with no competitive bidding")
            
    # 2. Timing explanation
    if row.get("is_extremely_short_submission", 0) == 1:
        reasons.append(f"Critically short submission window of {row.get('submission_window_days', 0):.1f} days (statutory standard is 14-21 days)")
    elif row.get("is_rushed_submission", 0) == 1:
        reasons.append(f"Rushed submission window of {row.get('submission_window_days', 0):.1f} days")
        
    if row.get("is_published_weekend", 0) == 1:
        reasons.append("Published on a weekend/off-hours, potentially reducing public visibility")
        
    # 3. Contract splitting
    if row.get("splitting_risk_score", 0) > 0.5:
        reasons.append(f"Potential contract splitting: value (₹{row.get('clean_estimated_value', 0):,.0f}) is just below regulatory threshold with {int(row.get('buyer_same_cat_recent_count', 0))} similar tenders in 14-day window")
        
    # 4. Benford's law
    if row.get("benford_anomaly_score", 0) > 0.6:
        reasons.append(f"First-digit value profile ({int(row.get('first_digit', 0)) if pd.notna(row.get('first_digit')) else 'N/A'}) deviates significantly from Benford's Law distribution for this buyer department")
        
    # 5. Price deviation
    if row.get("buyer_value_zscore", 0) > 2.5:
        reasons.append(f"Value is {row.get('buyer_value_zscore', 0):.1f} standard deviations higher than normal for this procuring entity")
        
    if not reasons:
        return "Standard compliant tender with no critical procedural or statistical deviations detected."
        
    return "; ".join(reasons) + "."

def compute_shap_explanations(
    features_df: pd.DataFrame,
    model_bundle_path: str = "models/isolation_forest.joblib",
    sample_size: int = 200
):
    """
    Computes SHAP values for the Isolation Forest model using TreeExplainer.
    Returns shap values and base values.
    """
    bundle = joblib.load(model_bundle_path)
    model = bundle["model"]
    scaler = bundle["scaler"]
    feature_names = bundle["features"]
    
    X = features_df[feature_names].copy().fillna(0.0)
    X_scaled = scaler.transform(X)
    
    # Use TreeExplainer on Isolation Forest
    explainer = shap.TreeExplainer(model)
    
    # For performance across large datasets, compute on a representative sample or top high-risk rows
    if len(X_scaled) > sample_size:
        sample_indices = np.random.RandomState(42).choice(len(X_scaled), sample_size, replace=False)
        shap_values = explainer.shap_values(X_scaled[sample_indices])
    else:
        shap_values = explainer.shap_values(X_scaled)
        
    return explainer, shap_values, feature_names
