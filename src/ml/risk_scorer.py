import numpy as np
import pandas as pd

def calculate_composite_risk_scores(
    features_df: pd.DataFrame,
    iso_anomaly_scores: np.ndarray
) -> pd.DataFrame:
    """
    Computes a calibrated 0-100 composite procurement risk score by combining:
      - ML Anomaly Detection (Isolation Forest)
      - Competition & Bid-Rigging Indicators
      - Timing & Procedural Irregularities
      - Contract Splitting & Benford Forensic Deviations
    """
    df = features_df.copy()
    df["ml_anomaly_score"] = iso_anomaly_scores
    
    # -------------------------------------------------------------
    # 1. Component Scores (0 to 100)
    # -------------------------------------------------------------
    
    # ML Component (0 - 100)
    ml_comp = df["ml_anomaly_score"] * 100.0
    
    # Competition Component (0 - 100)
    comp_score = (
        df["is_single_bidder"] * 35.0 +
        df["is_zero_bidder"] * 45.0 +
        df["high_value_single_bidder"] * 25.0 +
        df["method_risk_weight"] * 20.0
    )
    comp_comp = np.clip(comp_score, 0.0, 100.0)
    
    # Timing & Process Component (0 - 100)
    timing_score = (
        df["is_extremely_short_submission"] * 50.0 +
        (df["is_rushed_submission"] & (~df["is_extremely_short_submission"].astype(bool))) * 30.0 +
        df["is_published_weekend"] * 20.0 +
        df["is_abnormally_long_window"] * 15.0
    )
    timing_comp = np.clip(timing_score, 0.0, 100.0)
    
    # Forensic & Splitting Component (0 - 100)
    forensic_score = (
        df["benford_anomaly_score"] * 40.0 +
        df["splitting_risk_score"] * 45.0 +
        (df["buyer_value_zscore"] > 2.0).astype(int) * 20.0 +
        (df["category_value_zscore"] > 2.5).astype(int) * 15.0
    )
    forensic_comp = np.clip(forensic_score, 0.0, 100.0)
    
    # -------------------------------------------------------------
    # 2. Weighted Overall Composite Risk Score (0 - 100)
    # -------------------------------------------------------------
    composite_risk = (
        0.35 * ml_comp +
        0.25 * comp_comp +
        0.20 * timing_comp +
        0.20 * forensic_comp
    )
    
    df["risk_score"] = np.round(np.clip(composite_risk, 0.0, 100.0), 1)
    df["score_ml_component"] = np.round(ml_comp, 1)
    df["score_competition_component"] = np.round(comp_comp, 1)
    df["score_timing_component"] = np.round(timing_comp, 1)
    df["score_forensic_component"] = np.round(forensic_comp, 1)
    
    # -------------------------------------------------------------
    # 3. Risk Level Categorization
    # -------------------------------------------------------------
    def assign_risk_band(score):
        if score >= 75.0:
            return "CRITICAL"
        elif score >= 55.0:
            return "HIGH"
        elif score >= 30.0:
            return "MEDIUM"
        else:
            return "LOW"
            
    df["risk_level"] = df["risk_score"].apply(assign_risk_band)
    
    # -------------------------------------------------------------
    # 4. Red Flag Tags Generation
    # -------------------------------------------------------------
    def generate_red_flags(row):
        flags = []
        if row["is_single_bidder"] == 1:
            flags.append("SINGLE_BIDDER")
        if row["is_zero_bidder"] == 1:
            flags.append("ZERO_BIDDERS")
        if row["high_value_single_bidder"] == 1:
            flags.append("HIGH_VALUE_SINGLE_BIDDER")
        if row["is_extremely_short_submission"] == 1:
            flags.append("SUBMISSION_WINDOW_UNDER_3D")
        elif row["is_rushed_submission"] == 1:
            flags.append("RUSHED_SUBMISSION_WINDOW")
        if row["is_published_weekend"] == 1:
            flags.append("WEEKEND_PUBLICATION")
        if row["near_threshold_flag"] == 1:
            flags.append("NEAR_STATUTORY_THRESHOLD")
        if row["splitting_risk_score"] > 0.5:
            flags.append("POTENTIAL_CONTRACT_SPLITTING")
        if row["benford_anomaly_score"] > 0.6:
            flags.append("BENFORD_LAW_DEVIATION")
        if row["buyer_value_zscore"] > 2.5:
            flags.append("ABNORMAL_HIGH_VALUE_FOR_BUYER")
        if row["is_single_procurement_method"] == 1:
            flags.append("DIRECT_SINGLE_SOURCING")
            
        return "; ".join(flags) if flags else "NONE"
        
    df["red_flags"] = df.apply(generate_red_flags, axis=1)
    
    return df
