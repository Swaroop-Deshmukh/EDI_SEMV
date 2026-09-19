import numpy as np
import pandas as pd
from src.features.benford import compute_benford_features
from src.features.contract_splitting import compute_contract_splitting_features

def extract_all_features(
    tenders_df: pd.DataFrame,
    milestones_df: pd.DataFrame = None,
    items_df: pd.DataFrame = None
) -> pd.DataFrame:
    """
    Builds the full forensic feature matrix for all procurement tenders.
    Combines competition, timing, value deviation, Benford law, and contract splitting metrics.
    """
    df = tenders_df.copy()
    
    # -------------------------------------------------------------
    # 1. Timing & Calendar Features
    # -------------------------------------------------------------
    df["dt_published"] = pd.to_datetime(df["date_published"], errors="coerce")
    df["dt_bid_opening"] = pd.to_datetime(df["bid_opening_date"], errors="coerce")
    
    # Submission window in days
    df["submission_window_days"] = (df["dt_bid_opening"] - df["dt_published"]).dt.total_seconds() / 86400.0
    # Clean abnormal/negative windows
    df["submission_window_days"] = df["submission_window_days"].fillna(df["duration_days"]).fillna(14.0)
    
    df["is_rushed_submission"] = (df["submission_window_days"] < 7.0).astype(int)
    df["is_extremely_short_submission"] = (df["submission_window_days"] < 3.0).astype(int)
    df["is_abnormally_long_window"] = (df["submission_window_days"] > 180.0).astype(int)
    
    df["published_dayofweek"] = df["dt_published"].dt.dayofweek.fillna(0).astype(int)
    df["is_published_weekend"] = (df["published_dayofweek"] >= 5).astype(int)
    
    # Duration in days
    df["duration_days_clean"] = pd.to_numeric(df["duration_days"], errors="coerce").fillna(30.0)
    
    # -------------------------------------------------------------
    # 2. Value & Price Distribution Features
    # -------------------------------------------------------------
    est_val = pd.to_numeric(df["estimated_value"], errors="coerce").fillna(0.0)
    df["clean_estimated_value"] = est_val
    df["log_estimated_value"] = np.log10(np.maximum(est_val, 0) + 1.0)
    df["is_value_zero"] = (est_val == 0.0).astype(int)
    df["is_high_value"] = (est_val >= 10_000_000).astype(int) # >= 1 Crore
    df["is_very_high_value"] = (est_val >= 50_000_000).astype(int) # >= 5 Crores
    
    # Buyer-level value statistics & Z-Score
    buyer_stats = df[df["clean_estimated_value"] > 0].groupby("buyer_id")["log_estimated_value"].agg(["median", "std"]).reset_index()
    buyer_stats.columns = ["buyer_id", "buyer_log_val_median", "buyer_log_val_std"]
    buyer_stats["buyer_log_val_std"] = buyer_stats["buyer_log_val_std"].fillna(0.5)
    
    df = df.merge(buyer_stats, on="buyer_id", how="left")
    df["buyer_log_val_median"] = df["buyer_log_val_median"].fillna(df["log_estimated_value"].median())
    df["buyer_log_val_std"] = df["buyer_log_val_std"].fillna(1.0).replace(0, 1.0)
    
    df["buyer_value_zscore"] = (df["log_estimated_value"] - df["buyer_log_val_median"]) / df["buyer_log_val_std"]
    df["buyer_value_zscore"] = np.clip(df["buyer_value_zscore"].fillna(0.0), -3.0, 5.0)
    
    # Category-level value statistics
    cat_stats = df[df["clean_estimated_value"] > 0].groupby("category")["log_estimated_value"].agg(["median", "std"]).reset_index()
    cat_stats.columns = ["category", "cat_log_val_median", "cat_log_val_std"]
    cat_stats["cat_log_val_std"] = cat_stats["cat_log_val_std"].fillna(0.5)
    
    df = df.merge(cat_stats, on="category", how="left")
    df["cat_log_val_median"] = df["cat_log_val_median"].fillna(df["log_estimated_value"].median())
    df["cat_log_val_std"] = df["cat_log_val_std"].fillna(1.0).replace(0, 1.0)
    
    df["category_value_zscore"] = (df["log_estimated_value"] - df["cat_log_val_median"]) / df["cat_log_val_std"]
    df["category_value_zscore"] = np.clip(df["category_value_zscore"].fillna(0.0), -3.0, 5.0)
    
    # -------------------------------------------------------------
    # 3. Competition & Bidding Risk Features
    # -------------------------------------------------------------
    tenderers = pd.to_numeric(df["number_of_tenderers"], errors="coerce").fillna(3.0)
    df["num_tenderers_clean"] = tenderers
    df["is_single_bidder"] = (tenderers == 1).astype(int)
    df["is_zero_bidder"] = (tenderers == 0).astype(int)
    df["is_low_competition"] = (tenderers <= 2).astype(int)
    
    # High value single bidder red flag (classic bid rigging / favoritism indicator)
    df["high_value_single_bidder"] = (df["is_single_bidder"] & df["is_high_value"]).astype(int)
    
    # Ratio: competition vs log value
    df["bidder_intensity_ratio"] = (df["num_tenderers_clean"] + 1.0) / (df["log_estimated_value"] + 1.0)
    
    # -------------------------------------------------------------
    # 4. Procurement Method & Process Risk
    # -------------------------------------------------------------
    method = df["procurement_method"].astype(str).str.lower()
    df["is_single_procurement_method"] = method.str.contains("single").astype(int)
    df["is_limited_procurement_method"] = method.str.contains("limited").astype(int)
    df["is_open_tender"] = method.str.contains("open").astype(int)
    
    # Method risk score
    def get_method_risk(m):
        m = str(m).lower()
        if "single" in m:
            return 0.8
        elif "limited" in m:
            return 0.5
        elif "auction" in m:
            return 0.3
        elif "open" in m:
            return 0.1
        return 0.2
        
    df["method_risk_weight"] = df["procurement_method"].apply(get_method_risk)
    
    # Procedural flags
    df["allow_preferential_flag"] = df["allow_preferential"].fillna(False).astype(int)
    df["allow_two_stage_flag"] = df["allow_two_stage"].fillna(False).astype(int)
    
    # -------------------------------------------------------------
    # 5. Benford's Law Forensic Features
    # -------------------------------------------------------------
    benford_df = compute_benford_features(df, value_col="clean_estimated_value", buyer_col="buyer_id")
    for col in benford_df.columns:
        df[col] = benford_df[col]
        
    # -------------------------------------------------------------
    # 6. Contract Splitting & Threshold Evasion
    # -------------------------------------------------------------
    split_df = compute_contract_splitting_features(
        df,
        buyer_col="buyer_id",
        date_col="date_published",
        val_col="clean_estimated_value",
        cat_col="category",
        window_days=14
    )
    for col in split_df.columns:
        df[col] = split_df[col]
        
    # Clean up temp columns
    drop_temp = ["dt_published", "dt_bid_opening", "buyer_log_val_median", "buyer_log_val_std", "cat_log_val_median", "cat_log_val_std"]
    df = df.drop(columns=[c for c in drop_temp if c in df.columns])
    
    return df
