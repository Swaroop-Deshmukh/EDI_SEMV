"""
profile_datasets.py
-------------------
Data profiling script for the AI Public Procurement Auditor project.

Reads raw TED CSV files and the World Bank JSONL dataset (line-by-line).
Does NOT modify raw files.
Outputs: outputs/data_profile.csv

Usage:
    python src/profile_datasets.py
"""

import json
import os
from pathlib import Path

import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_RAW  = BASE_DIR / "data" / "raw"

TED_DIR = DATA_RAW / "ted"
WB_DIR  = DATA_RAW / "worldbank"

TED_FILES = {
    "ted_main":                    TED_DIR / "main.csv",
    "ted_tender_documents":        TED_DIR / "tender_documents.csv",
    "ted_tender_milestones":       TED_DIR / "tender_milestones.csv",
    "ted_tender_participationFee": TED_DIR / "tender_participationFee.csv",
}

WB_JSONL   = WB_DIR / "full.jsonl"
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_CSV = OUTPUT_DIR / "data_profile.csv"

# ---------------------------------------------------------------------------
# Column role mappings — which columns get which extra stats
# ---------------------------------------------------------------------------
ID_COLUMNS = {
    "ted_main":                    ["id", "ocid", "tender_id", "buyer_name"],
    "ted_tender_documents":        ["_link", "_link_main", "id"],
    "ted_tender_milestones":       ["_link", "_link_main"],
    "ted_tender_participationFee": ["_link", "_link_main"],
    "worldbank_full_jsonl":        ["id", "ocid", "tender_id", "buyer_name"],
}

VALUE_COLUMNS = {
    "ted_main":             ["tender_value_amount", "tender_numberOfTenderers",
                             "tender_tenderPeriod_durationInDays"],
    "worldbank_full_jsonl": ["tender_value_amount", "tender_numberOfTenderers",
                             "tender_tenderPeriod_durationInDays"],
}

DATE_COLUMNS = {
    "ted_main":             ["date", "tender_datePublished", "tender_bidOpening_date"],
    "worldbank_full_jsonl": ["date", "tender_datePublished", "tender_bidOpening_date"],
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _missing_pct(series: pd.Series) -> float:
    """Percentage of null / empty / literal-NA values."""
    null_count = (
        series.isna().sum()
        + (series.astype(str) == "").sum()
        + (series.astype(str) == "NA").sum()
    )
    return round(100.0 * null_count / len(series), 2) if len(series) else 0.0


def _numeric_stats(df: pd.DataFrame, col: str) -> dict:
    s = pd.to_numeric(df[col], errors="coerce").dropna()
    if s.empty:
        return {"value_min": None, "value_max": None}
    return {"value_min": round(float(s.min()), 4), "value_max": round(float(s.max()), 4)}


def _date_stats(df: pd.DataFrame, col: str) -> dict:
    s = pd.to_datetime(df[col], errors="coerce", dayfirst=False, format="mixed").dropna()
    if s.empty:
        return {"date_min": None, "date_max": None}
    return {"date_min": str(s.min().date()), "date_max": str(s.max().date())}


# ---------------------------------------------------------------------------
# Column-level profiler
# ---------------------------------------------------------------------------

def profile_column(dataset_name: str, df: pd.DataFrame, col: str) -> dict:
    series = df[col]
    row = {
        "dataset":      dataset_name,
        "column":       col,
        "dtype":        str(series.dtype),
        "row_count":    len(series),
        "null_pct":     _missing_pct(series),
        "unique_count": None,
        "value_min":    None,
        "value_max":    None,
        "date_min":     None,
        "date_max":     None,
    }
    if col in ID_COLUMNS.get(dataset_name, []):
        row["unique_count"] = int(series.nunique())
    if col in VALUE_COLUMNS.get(dataset_name, []):
        row.update(_numeric_stats(df, col))
    if col in DATE_COLUMNS.get(dataset_name, []):
        row.update(_date_stats(df, col))
    return row


def profile_dataframe(dataset_name: str, df: pd.DataFrame) -> list:
    print(f"  Profiling [{dataset_name}] - {len(df):,} rows x {len(df.columns)} cols")
    return [profile_column(dataset_name, df, col) for col in df.columns]


def dataset_summary(dataset_name: str, df: pd.DataFrame) -> dict:
    dup_count = int(df.duplicated().sum())
    return {
        "dataset":      dataset_name,
        "column":       "__SUMMARY__",
        "dtype":        "—",
        "row_count":    len(df),
        "null_pct":     round(100.0 * df.isna().sum().sum() / df.size, 2) if df.size else 0.0,
        "unique_count": len(df.columns),
        "value_min":    None,
        "value_max":    None,
        "date_min":     None,
        "date_max":     f"duplicate_rows={dup_count}",
    }


# ---------------------------------------------------------------------------
# TED CSV profiler
# ---------------------------------------------------------------------------

def profile_ted_csv(dataset_name: str, filepath: Path) -> list:
    print(f"\n[TED] Reading: {filepath.name}")
    df = pd.read_csv(filepath, dtype=str, keep_default_na=False)
    return [dataset_summary(dataset_name, df)] + profile_dataframe(dataset_name, df)


# ---------------------------------------------------------------------------
# World Bank JSONL profiler  (line-by-line — avoids loading 40 MB at once)
# ---------------------------------------------------------------------------

def _flatten_wb_record(rec: dict) -> dict:
    """Flatten one WB JSONL record into a flat dict."""
    tender = rec.get("tender", {}) if isinstance(rec.get("tender"), dict) else {}
    buyer  = rec.get("buyer",  {}) if isinstance(rec.get("buyer"),  dict) else {}
    tclass = rec.get("tenderclassification", {}) if isinstance(rec.get("tenderclassification"), dict) else {}

    return {
        # Top-level fields
        "id":                             rec.get("id"),
        "ocid":                           rec.get("ocid"),
        "tag":                            str(rec.get("tag", "")),
        "date":                           rec.get("date"),
        "buyer_name":                     buyer.get("name"),
        "fiscal_year":                    rec.get("fiscal_year"),
        "Payment Mode":                   rec.get("Payment Mode"),
        "initiationType":                 rec.get("initiationType"),
        "tenderclassification_description": tclass.get("description"),
        # Tender fields
        "tender_id":                      tender.get("id"),
        "tender_stage":                   tender.get("stage"),
        "tender_title":                   tender.get("title"),
        "tender_status":                  tender.get("status"),
        "tender_value_amount":            (tender.get("value", {}) or {}).get("amount"),
        "tender_procurementMethod":       tender.get("procurementMethod"),
        "tender_mainProcurementCategory": tender.get("mainProcurementCategory"),
        "tender_contractType":            tender.get("contractType"),
        "tender_numberOfTenderers":       tender.get("numberOfTenderers"),
        "tender_datePublished":           tender.get("datePublished"),
        "tender_bidOpening_date":         (tender.get("bidOpening", {}) or {}).get("date"),
        "tender_tenderPeriod_durationInDays": (tender.get("tenderPeriod", {}) or {}).get("durationInDays"),
        "tender_externalReference":       tender.get("externalReference"),
        "tender_allowTwoStageTender":     tender.get("allowTwoStageTender"),
        "tender_allowPreferentialBidder": tender.get("allowPreferentialBidder"),
        "tender_submissionMethodDetails": tender.get("submissionMethodDetails"),
    }


def profile_wb_jsonl(filepath: Path) -> list:
    print(f"\n[World Bank] Reading line-by-line: {filepath.name}")
    dataset_name = "worldbank_full_jsonl"

    records = []
    with open(filepath, "r", encoding="utf-8") as fh:
        for lineno, line in enumerate(fh, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                records.append(_flatten_wb_record(json.loads(line)))
            except json.JSONDecodeError as exc:
                print(f"  Warning: skipped line {lineno} — {exc}")

    print(f"  Parsed {len(records):,} records from JSONL")
    df = pd.DataFrame(records)
    # Standardise NA-like strings so _missing_pct catches them
    df = df.replace({"None": pd.NA, "nan": pd.NA, "NaN": pd.NA})

    return [dataset_summary(dataset_name, df)] + profile_dataframe(dataset_name, df)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_rows = []

    print("=" * 60)
    print("AI Public Procurement Auditor — Data Profiler")
    print("=" * 60)

    for dataset_name, filepath in TED_FILES.items():
        if not filepath.exists():
            print(f"  [WARN] Not found: {filepath}")
            continue
        all_rows.extend(profile_ted_csv(dataset_name, filepath))

    if WB_JSONL.exists():
        all_rows.extend(profile_wb_jsonl(WB_JSONL))
    else:
        print(f"  [WARN] Not found: {WB_JSONL}")

    profile_df = pd.DataFrame(all_rows)
    profile_df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")

    print("\n" + "=" * 60)
    print(f"Profile saved  : {OUTPUT_CSV}")
    print(f"Rows in report : {len(profile_df):,}")
    print("=" * 60)

    summary = profile_df[profile_df["column"] == "__SUMMARY__"][
        ["dataset", "row_count", "unique_count", "null_pct", "date_max"]
    ].rename(columns={
        "unique_count": "col_count",
        "null_pct":     "overall_null_pct_%",
        "date_max":     "note",
    })
    print("\nDataset-level Summary:")
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
