import numpy as np
import pandas as pd

BENFORD_FIRST_DIGIT_PROBS = {
    1: 0.30103,
    2: 0.17609,
    3: 0.12494,
    4: 0.09691,
    5: 0.07918,
    6: 0.06695,
    7: 0.05799,
    8: 0.05115,
    9: 0.04576
}

def extract_first_digit(val):
    if pd.isna(val) or val <= 0:
        return np.nan
    s = f"{val:.10f}".replace(".", "").lstrip("0")
    if s:
        return int(s[0])
    return np.nan

def is_suspicious_round_number(val):
    """
    Checks if a number is suspiciously round (e.g., exact multiple of 100k or 1M)
    which frequently indicates artificial or non-itemized budgetary estimations.
    """
    if pd.isna(val) or val < 100000:
        return 0
    if val % 1000000 == 0:
        return 1
    if val % 100000 == 0:
        return 1
    return 0

def compute_benford_features(df: pd.DataFrame, value_col: str = "estimated_value", buyer_col: str = "buyer_id") -> pd.DataFrame:
    """
    Computes Benford's Law anomaly metrics and round-number indicators.
    Returns DataFrame with new columns:
      - first_digit
      - is_round_number
      - digit_benford_dev: Absolute deviation of this digit frequency from theoretical
      - buyer_benford_mad: Mean Absolute Deviation of the buyer's overall first-digit distribution
      - benford_anomaly_score: Normalized 0-1 anomaly score
    """
    res = df.copy()
    
    # 1. First digit
    res["first_digit"] = res[value_col].apply(extract_first_digit)
    res["is_round_number"] = res[value_col].apply(is_suspicious_round_number)
    
    # 2. Overall first digit frequency
    valid_digits = res["first_digit"].dropna()
    total_valid = len(valid_digits)
    if total_valid > 0:
        overall_counts = valid_digits.value_counts(normalize=True).to_dict()
    else:
        overall_counts = {}
        
    res["digit_benford_dev"] = res["first_digit"].map(
        lambda d: abs(overall_counts.get(d, 0.0) - BENFORD_FIRST_DIGIT_PROBS.get(d, 0.0)) if pd.notna(d) and d in BENFORD_FIRST_DIGIT_PROBS else 0.0
    )
    
    # 3. Buyer-level Benford MAD (Mean Absolute Deviation)
    buyer_mad_dict = {}
    if buyer_col in res.columns:
        grouped = res.groupby(buyer_col)
        for b_id, group in grouped:
            digits = group["first_digit"].dropna()
            if len(digits) >= 15: # Sufficient sample size for Benford analysis
                buyer_counts = digits.value_counts(normalize=True).to_dict()
                mad = np.mean([
                    abs(buyer_counts.get(d, 0.0) - BENFORD_FIRST_DIGIT_PROBS[d])
                    for d in range(1, 10)
                ])
                buyer_mad_dict[b_id] = float(mad)
            else:
                buyer_mad_dict[b_id] = 0.0
                
    res["buyer_benford_mad"] = res[buyer_col].map(buyer_mad_dict).fillna(0.0)
    
    # 4. Normalized Benford Anomaly Score (0 to 1)
    # MAD >= 0.015 is considered non-conforming according to forensic accounting literature (Nigrini 2012)
    mad_scaled = np.clip(res["buyer_benford_mad"] / 0.03, 0.0, 1.0)
    dev_scaled = np.clip(res["digit_benford_dev"] / 0.15, 0.0, 1.0)
    round_scaled = res["is_round_number"] * 0.5
    
    res["benford_anomaly_score"] = np.clip(0.4 * mad_scaled + 0.3 * dev_scaled + 0.3 * round_scaled, 0.0, 1.0)
    
    return res[["first_digit", "is_round_number", "digit_benford_dev", "buyer_benford_mad", "benford_anomaly_score"]]
