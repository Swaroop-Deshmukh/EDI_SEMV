import numpy as np
import pandas as pd

COMMON_THRESHOLDS_INR = [
    500_000,       # 5 Lakhs (Direct purchase / quotation threshold)
    1_000_000,     # 10 Lakhs
    2_500_000,     # 25 Lakhs (Limited tender vs open tender cutoff)
    5_000_000,     # 50 Lakhs
    10_000_000,    # 1 Crore
    50_000_000,    # 5 Crores
    100_000_000,   # 10 Crores
]

def check_near_threshold(val: float, tolerance: float = 0.10) -> tuple[int, float]:
    """
    Checks if a value is situated just below (within 10% below) a statutory threshold.
    Returns (is_near_flag, distance_ratio).
    """
    if pd.isna(val) or val <= 0:
        return 0, 0.0
        
    for threshold in COMMON_THRESHOLDS_INR:
        lower_bound = threshold * (1.0 - tolerance)
        upper_bound = threshold * 0.999
        if lower_bound <= val <= upper_bound:
            dist = (threshold - val) / threshold
            return 1, dist
    return 0, 0.0

def compute_contract_splitting_features(
    df: pd.DataFrame,
    buyer_col: str = "buyer_id",
    date_col: str = "date_published",
    val_col: str = "estimated_value",
    cat_col: str = "category",
    window_days: int = 14
) -> pd.DataFrame:
    """
    Detects contract splitting (smurfing) patterns:
    - near_threshold_flag: value is just under a statutory cutoff (e.g. 4.9L vs 5L)
    - buyer_same_cat_recent_count: number of other tenders by same buyer in same category within window_days
    - buyer_same_cat_recent_sum: cumulative value of tenders by same buyer in window_days
    - splitting_risk_score: Composite probability score (0-1) of intentional contract splitting.
    """
    res = df.copy()
    
    # 1. Near threshold flag
    threshold_results = res[val_col].apply(check_near_threshold)
    res["near_threshold_flag"] = [r[0] for r in threshold_results]
    res["threshold_distance_ratio"] = [r[1] for r in threshold_results]
    
    # Ensure date parsing
    res["_dt"] = pd.to_datetime(res[date_col], errors="coerce")
    
    # Sort for time-window calculations
    res = res.sort_values(by=[buyer_col, cat_col, "_dt"]).reset_index(drop=True)
    
    # Calculate rolling counts and sums per buyer and category
    grouped = res.groupby([buyer_col, cat_col])
    
    recent_counts = []
    recent_sums = []
    
    for _, group in grouped:
        times = group["_dt"].values
        values = group[val_col].fillna(0).values
        n = len(group)
        
        # Window calculation
        for i in range(n):
            curr_time = times[i]
            if pd.isna(curr_time):
                recent_counts.append(0)
                recent_sums.append(0.0)
                continue
                
            # Count how many other tenders in [curr_time - window, curr_time + window]
            time_diffs = np.abs((times - curr_time) / np.timedelta64(1, "D"))
            mask = (time_diffs <= window_days) & (np.arange(n) != i)
            recent_counts.append(int(np.sum(mask)))
            recent_sums.append(float(np.sum(values[mask])))
            
    res["buyer_same_cat_recent_count"] = recent_counts
    res["buyer_same_cat_recent_sum"] = recent_sums
    
    # Compute Splitting Risk Score (0 to 1)
    # High score when: near threshold AND multiple similar tenders within time window
    has_burst = np.clip(res["buyer_same_cat_recent_count"] / 3.0, 0.0, 1.0)
    is_threshold = res["near_threshold_flag"].astype(float)
    
    # If near threshold and burst activity occurs:
    res["splitting_risk_score"] = np.clip(
        0.5 * is_threshold + 0.3 * has_burst + 0.2 * (is_threshold * has_burst),
        0.0,
        1.0
    )
    
    # Return matched original index order
    output_cols = [
        "near_threshold_flag",
        "threshold_distance_ratio",
        "buyer_same_cat_recent_count",
        "buyer_same_cat_recent_sum",
        "splitting_risk_score"
    ]
    return res[output_cols]
