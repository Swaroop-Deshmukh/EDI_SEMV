import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler

MODEL_FEATURES = [
    "log_estimated_value",
    "submission_window_days",
    "duration_days_clean",
    "buyer_value_zscore",
    "category_value_zscore",
    "num_tenderers_clean",
    "bidder_intensity_ratio",
    "method_risk_weight",
    "benford_anomaly_score",
    "splitting_risk_score",
    "is_single_bidder",
    "is_rushed_submission",
    "is_extremely_short_submission",
    "high_value_single_bidder",
    "is_published_weekend",
    "near_threshold_flag",
    "buyer_same_cat_recent_count"
]

def train_isolation_forest(
    features_df: pd.DataFrame,
    contamination: float = 0.05,
    n_estimators: int = 200,
    model_save_path: str = "models/isolation_forest.joblib"
):
    """
    Trains an Isolation Forest anomaly detector on the engineered feature matrix.
    Saves scaler and model to disk.
    Returns:
      - trained model dict {model, scaler, feature_names}
      - anomaly_scores array (0 to 1, where 1 is highest anomaly)
    """
    X = features_df[MODEL_FEATURES].copy().fillna(0.0)
    
    scaler = RobustScaler()
    X_scaled = scaler.fit_transform(X)
    
    iso_forest = IsolationForest(
        n_estimators=n_estimators,
        contamination=contamination,
        max_samples="auto",
        random_state=42,
        n_jobs=-1
    )
    
    iso_forest.fit(X_scaled)
    
    # Raw decision function: negative values indicate outliers
    raw_scores = iso_forest.decision_function(X_scaled)
    
    # Invert and normalize to [0, 1] range (1 = extreme outlier, 0 = normal)
    # Min-max normalization on inverted scores
    inv_scores = -raw_scores
    min_s, max_s = inv_scores.min(), inv_scores.max()
    norm_scores = (inv_scores - min_s) / (max_s - min_s + 1e-8)
    
    # Save model bundle
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    bundle = {
        "model": iso_forest,
        "scaler": scaler,
        "features": MODEL_FEATURES,
        "min_score": float(min_s),
        "max_score": float(max_s)
    }
    joblib.dump(bundle, model_save_path)
    print(f"[+] Isolation Forest trained and saved to {model_save_path}")
    
    return bundle, norm_scores

def predict_anomaly_scores(features_df: pd.DataFrame, model_bundle_path: str = "models/isolation_forest.joblib") -> np.ndarray:
    """
    Loads saved model bundle and predicts normalized [0, 1] anomaly scores.
    """
    bundle = joblib.load(model_bundle_path)
    X = features_df[bundle["features"]].copy().fillna(0.0)
    X_scaled = bundle["scaler"].transform(X)
    
    raw = bundle["model"].decision_function(X_scaled)
    inv = -raw
    min_s, max_s = bundle["min_score"], bundle["max_score"]
    norm = np.clip((inv - min_s) / (max_s - min_s + 1e-8), 0.0, 1.0)
    return norm
