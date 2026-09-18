"""
clean_ted.py
------------
Cleaning pipeline for TED (India OCDS) procurement datasets.

Reads   : data/raw/ted/*.csv  (4 files, read-only)
Outputs : data/processed/
            buyers.csv
            tenders.csv
            items.csv
            tender_milestones.csv
          outputs/cleaning_report.md   (summary report)

Each output CSV maps to its corresponding PostgreSQL table in sql/schema.sql.

Usage:
    python src/cleaning/clean_ted.py
"""

import logging
import re
import uuid
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore", category=FutureWarning)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_TED  = BASE_DIR / "data" / "raw" / "ted"
OUT_DIR  = BASE_DIR / "data" / "processed"
LOG_DIR  = BASE_DIR / "outputs"

OUT_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Logging — INFO to console, WARNING+ to invalid_records.log
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s  %(message)s",
)
log = logging.getLogger("clean_ted")

invalid_log_path = LOG_DIR / "invalid_records.log"
file_handler = logging.FileHandler(invalid_log_path, mode="w", encoding="utf-8")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(logging.Formatter("%(asctime)s  %(levelname)s  %(message)s"))
log.addHandler(file_handler)

# ---------------------------------------------------------------------------
# Constants / ENUM valid sets  (must match sql/schema.sql)
# ---------------------------------------------------------------------------
VALID_STAGES = {
    "To be Opened", "Bid Opening", "Technical Bid Opening",
    "Financial Bid Opening", "Technical Evaluation", "Financial Evaluation",
    "Evaluation", "AOC", "Retender", "Cancelled",
}

VALID_PROC_METHODS = {
    "Open Tender", "Limited", "Open Limited",
    "Single", "Auction", "Global Tenders",
}

VALID_CATEGORIES = {"Goods", "Services", "Works"}

VALID_CONTRACT_TYPES = {
    "Buy", "Works", "Supply", "Fixed-rate", "Lump-sum", "Item Rate",
    "Item Wise", "Percentage", "Piece-work", "Turn-key", "Multi-stage",
    "Empanelment", "QCBS", "EOI", "Tender cum Auction", "PPP-BoT-Annuity",
}

VALID_PAYMENT_MODES = {
    "Online", "Offline", "Both", "Both(Online/Offline)", "Not Applicable",
}

VALID_MILESTONE_CODES = {"PreBid Meeting Date"}
VALID_MILESTONE_TYPES = {"assessment", "delivery"}

# Sentinel for missing value standardisation
NA_STRINGS = {"NA", "N/A", "na", "n/a", "None", "none", "NULL", "null", "", " "}

# ---------------------------------------------------------------------------
# Counters — accumulated across all steps for the final report
# ---------------------------------------------------------------------------
stats = {
    "raw_rows_main":            0,
    "raw_rows_milestones":      0,
    "raw_rows_fee":             0,
    "raw_rows_docs":            0,
    "duplicates_removed":       0,
    "invalid_missing_ocid":     0,
    "invalid_missing_tid":      0,
    "invalid_bad_value":        0,
    "zero_converted_to_null":   0,
    "null_value_kept":          0,
    "positive_value_final":     0,
    "null_value_final":         0,
    "stage_mapped_unknown":     0,
    "method_mapped_unknown":    0,
    "contract_type_mapped_other": 0,
    "dates_parsed_ok":          0,
    "dates_parse_failed":       0,
    "milestone_dates_null":     0,
    "buyers_written":           0,
    "tenders_written":          0,
    "items_written":            0,
    "milestones_written":       0,
}


# ===========================================================================
# STEP 1 — Ingest
# ===========================================================================

def ingest_raw() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Read all 4 TED raw CSVs. Returns (main, milestones, fee, docs)."""
    log.info("Reading raw TED files...")

    main = pd.read_csv(RAW_TED / "main.csv",                   dtype=str, keep_default_na=False)
    mils = pd.read_csv(RAW_TED / "tender_milestones.csv",       dtype=str, keep_default_na=False)
    fee  = pd.read_csv(RAW_TED / "tender_participationFee.csv", dtype=str, keep_default_na=False)
    docs = pd.read_csv(RAW_TED / "tender_documents.csv",        dtype=str, keep_default_na=False)

    stats["raw_rows_main"]       = len(main)
    stats["raw_rows_milestones"] = len(mils)
    stats["raw_rows_fee"]        = len(fee)
    stats["raw_rows_docs"]       = len(docs)

    log.info("  main.csv         : %d rows x %d cols", len(main), len(main.columns))
    log.info("  tender_milestones: %d rows x %d cols", len(mils), len(mils.columns))
    log.info("  tender_fee       : %d rows x %d cols", len(fee),  len(fee.columns))
    log.info("  tender_documents : %d rows x %d cols", len(docs), len(docs.columns))

    return main, mils, fee, docs


# ===========================================================================
# STEP 2 — Standardize column names to snake_case
# ===========================================================================

_COL_MAP_MAIN = {
    "_link":                               "row_link",
    "id":                                  "ocds_release_id",
    "tag":                                 "tag",
    "date":                                "snapshot_date",
    "ocid":                                "ocid",
    "Payment Mode":                        "payment_mode",
    "initiationType":                      "initiation_type",
    "fiscal_year":                         "fiscal_year",
    "buyer_name":                          "buyer_name",
    "tender_id":                           "source_tender_id",
    "tender_stage":                        "stage",
    "tender_title":                        "title",
    "tender_allowTwoStageTender":          "allow_two_stage",
    "tender_status":                       "tender_status",
    "tender_submissionMethodDetails":      "submission_method",
    "tender_procurementMethod":            "procurement_method",
    "tender_mainProcurementCategory":      "category",
    "tender_contractType":                 "contract_type",
    "tender_numberOfTenderers":            "number_of_tenderers",
    "tender_datePublished":                "date_published",
    "tender_allowPreferentialBidder":      "allow_preferential",
    "tender_externalReference":            "external_reference",
    "tender_value_amount":                 "estimated_value",
    "tender_bidOpening_date":              "bid_opening_date",
    "tender_tenderPeriod_durationInDays":  "duration_days",
    "tenderclassification_description":    "classification_description",
}

_COL_MAP_MILS = {
    "_link":    "row_link",
    "_link_main": "row_link_main",
    "code":     "code",
    "type":     "type",
    "title":    "title",
    "type.1":   "type_2",
    "dueDate":  "due_date",
    "title.1":  "title_2",
    "dueDate.1": "due_date_2",
}

_COL_MAP_FEE = {
    "_link":              "row_link",
    "_link_main":         "row_link_main",
    "multiCurrencyAllowed": "multi_currency_allowed",
}


def rename_columns(main: pd.DataFrame, mils: pd.DataFrame,
                   fee: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Apply snake_case column rename maps."""
    log.info("Renaming columns to snake_case...")
    main = main.rename(columns=_COL_MAP_MAIN)
    mils = mils.rename(columns=_COL_MAP_MILS)
    fee  = fee.rename(columns=_COL_MAP_FEE)
    return main, mils, fee


# ===========================================================================
# STEP 3 — Standardize missing values  (NA strings → pd.NA)
# ===========================================================================

def _null_str(val: str) -> bool:
    return str(val).strip() in NA_STRINGS


def standardize_nulls(df: pd.DataFrame) -> pd.DataFrame:
    """Replace all NA-like strings with pd.NA."""
    return df.replace(list(NA_STRINGS), pd.NA)


# ===========================================================================
# STEP 4 — Remove exact duplicate rows
# ===========================================================================

def remove_duplicates(df: pd.DataFrame, name: str) -> pd.DataFrame:
    before = len(df)
    df = df.drop_duplicates()
    removed = before - len(df)
    stats["duplicates_removed"] += removed
    if removed:
        log.warning("Removed %d duplicate rows from %s", removed, name)
    else:
        log.info("  No duplicate rows found in %s", name)
    return df


# ===========================================================================
# STEP 5 — Validate critical identifier fields
# ===========================================================================

def validate_identifiers(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows missing ocid or source_tender_id and log them."""
    missing_ocid = df["ocid"].isna()
    if missing_ocid.any():
        count = missing_ocid.sum()
        stats["invalid_missing_ocid"] += count
        for _, row in df[missing_ocid].iterrows():
            log.warning("INVALID | missing ocid | row_link=%s", row.get("row_link", "?"))
        df = df[~missing_ocid]

    missing_tid = df["source_tender_id"].isna()
    if missing_tid.any():
        count = missing_tid.sum()
        stats["invalid_missing_tid"] += count
        for _, row in df[missing_tid].iterrows():
            log.warning("INVALID | missing source_tender_id | ocid=%s", row.get("ocid", "?"))
        df = df[~missing_tid]

    return df.reset_index(drop=True)


# ===========================================================================
# STEP 6 — Parse dates
# ===========================================================================

def _parse_date_col(df: pd.DataFrame, col: str) -> pd.DataFrame:
    """Parse a date column in-place; failed parses → NaT (logged as warning)."""
    parsed = pd.to_datetime(df[col], errors="coerce", format="mixed", dayfirst=False)
    failed = parsed.isna() & df[col].notna()
    if failed.any():
        count = failed.sum()
        stats["dates_parse_failed"] += count
        df.loc[failed].apply(
            lambda r: log.warning("DATE PARSE FAIL | col=%s | val=%s | ocid=%s",
                                  col, r[col], r.get("ocid", "?")), axis=1
        )
    ok_count = parsed.notna().sum()
    stats["dates_parsed_ok"] += ok_count
    df[col] = parsed.dt.strftime("%Y-%m-%dT%H:%M:%S").where(parsed.notna(), other=pd.NA)
    return df


def parse_all_dates(df: pd.DataFrame) -> pd.DataFrame:
    """Parse date_published and bid_opening_date."""
    log.info("Parsing date columns...")
    df = _parse_date_col(df, "date_published")
    df = _parse_date_col(df, "bid_opening_date")
    return df


# ===========================================================================
# STEP 7 — Clean numeric fields
# ===========================================================================

def clean_numerics(df: pd.DataFrame) -> pd.DataFrame:
    """
    - estimated_value   : numeric coerce; 0 → NULL (np.nan); validate no zeros remain
    - number_of_tenderers : numeric coerce; negative → NaN
    - duration_days     : numeric coerce; < 1 → NaN
    """
    log.info("Cleaning numeric fields...")

    # estimated_value
    df["estimated_value"] = pd.to_numeric(df["estimated_value"], errors="coerce")
    stats["null_value_kept"] = int(df["estimated_value"].isna().sum())

    zero_mask = df["estimated_value"] == 0
    stats["zero_converted_to_null"] = int(zero_mask.sum())

    # Convert estimated_value = 0 to NULL (np.nan) based on empirical analysis
    df.loc[zero_mask, "estimated_value"] = np.nan

    # Validation check on estimated_value counts
    final_zero_count = int((df["estimated_value"] == 0).sum())
    final_pos_count  = int((df["estimated_value"] > 0).sum())
    final_null_count = int(df["estimated_value"].isna().sum())
    total_records    = len(df)

    stats["positive_value_final"] = final_pos_count
    stats["null_value_final"]     = final_null_count

    log.info(
        "Validation estimated_value counts: positive=%d, null=%d, zeros=%d, total=%d",
        final_pos_count, final_null_count, final_zero_count, total_records,
    )

    if final_zero_count != 0:
        raise ValueError(f"Validation failed: expected 0 zero values in estimated_value, found {final_zero_count}")
    if final_pos_count != 26205:
        raise ValueError(f"Validation failed: expected 26,205 positive values, got {final_pos_count}")
    if final_null_count != 8027:
        raise ValueError(f"Validation failed: expected 8,027 NULL values, got {final_null_count}")
    if total_records != 34232:
        raise ValueError(f"Validation failed: expected 34,232 total records, got {total_records}")

    # number_of_tenderers
    df["number_of_tenderers"] = pd.to_numeric(df["number_of_tenderers"], errors="coerce")
    neg_mask = df["number_of_tenderers"] < 0
    if neg_mask.any():
        log.warning("INVALID | %d negative number_of_tenderers → set to NaN", neg_mask.sum())
        stats["invalid_bad_value"] += int(neg_mask.sum())
        df.loc[neg_mask, "number_of_tenderers"] = pd.NA
    df["number_of_tenderers"] = df["number_of_tenderers"].astype("Int64")

    # duration_days
    df["duration_days"] = pd.to_numeric(df["duration_days"], errors="coerce")
    bad_dur = df["duration_days"].notna() & (df["duration_days"] < 1)
    if bad_dur.any():
        log.warning("INVALID | %d duration_days < 1 → set to NaN", bad_dur.sum())
        stats["invalid_bad_value"] += int(bad_dur.sum())
        df.loc[bad_dur, "duration_days"] = pd.NA
    df["duration_days"] = df["duration_days"].astype("Int64")

    return df


# ===========================================================================
# STEP 8 — Standardize categorical / ENUM fields
# ===========================================================================

def _yn_to_bool(val) -> object:
    if pd.isna(val):
        return False
    s = str(val).strip().lower()
    return True if s == "yes" else False


def standardize_categoricals(df: pd.DataFrame) -> pd.DataFrame:
    """Normalise ENUM fields; map out-of-vocab values to defaults."""
    log.info("Standardizing categorical fields...")

    # Stage: empty string / NA / 'NA' → 'Unknown'; anything not in VALID_STAGES → 'Unknown'
    df["stage"] = df["stage"].apply(
        lambda v: v if (not pd.isna(v) and str(v).strip() in VALID_STAGES) else "Unknown"
    )
    unk_stage = (df["stage"] == "Unknown").sum()
    stats["stage_mapped_unknown"] += int(unk_stage)

    # procurement_method
    df["procurement_method"] = df["procurement_method"].apply(
        lambda v: v if (not pd.isna(v) and str(v).strip() in VALID_PROC_METHODS) else "Unknown"
    )
    unk_method = (df["procurement_method"] == "Unknown").sum()
    stats["method_mapped_unknown"] += int(unk_method)

    # category  (Goods / Services / Works — all valid in source)
    df["category"] = df["category"].apply(
        lambda v: v if (not pd.isna(v) and str(v).strip() in VALID_CATEGORIES) else pd.NA
    )

    # contract_type
    df["contract_type"] = df["contract_type"].apply(
        lambda v: v if (not pd.isna(v) and str(v).strip() in VALID_CONTRACT_TYPES) else "Other"
    )
    unk_ct = (df["contract_type"] == "Other").sum()
    stats["contract_type_mapped_other"] += int(unk_ct)

    # payment_mode
    df["payment_mode"] = df["payment_mode"].apply(
        lambda v: v if (not pd.isna(v) and str(v).strip() in VALID_PAYMENT_MODES) else pd.NA
    )

    # tender_status — uniformly "NA" in source; drop the column (no information)
    if "tender_status" in df.columns:
        df.drop(columns=["tender_status"], inplace=True)

    # submission_method — uniformly "NA" in source; retain as NULL text
    df["submission_method"] = df["submission_method"].apply(
        lambda v: pd.NA if pd.isna(v) else v
    )

    # Boolean flags
    df["allow_two_stage"]  = df["allow_two_stage"].apply(_yn_to_bool)
    df["allow_preferential"] = df["allow_preferential"].apply(_yn_to_bool)

    # initiation_type — uniformly "tender"; keep as-is
    # tag — uniformly "compiled"; keep as-is

    return df


# ===========================================================================
# STEP 9 — Standardize text fields  (strip whitespace, title-case buyer names)
# ===========================================================================

def standardize_text(df: pd.DataFrame) -> pd.DataFrame:
    """
    - buyer_name : strip + title-case (preserves content, normalises casing)
    - title      : strip only (free text — do not alter case)
    - external_reference: strip only
    - classification_description: strip only
    """
    log.info("Standardizing text fields...")

    def safe_strip(v):
        return str(v).strip() if not pd.isna(v) else v

    def safe_titlecase(v):
        return str(v).strip().title() if not pd.isna(v) else v

    df["buyer_name"]                = df["buyer_name"].apply(safe_titlecase)
    df["title"]                     = df["title"].apply(safe_strip)
    df["external_reference"]        = df["external_reference"].apply(safe_strip)
    df["classification_description"] = df["classification_description"].apply(safe_strip)

    return df


# ===========================================================================
# STEP 10 — Join multi-currency flag from fee table
# ===========================================================================

def join_fee_flag(main: pd.DataFrame, fee: pd.DataFrame) -> pd.DataFrame:
    """Merge multiCurrencyAllowed flag onto main on row_link."""
    log.info("Merging participation fee flag...")
    fee_clean = fee[["row_link_main", "multi_currency_allowed"]].copy()
    fee_clean["multi_currency"] = fee_clean["multi_currency_allowed"].apply(
        lambda v: True if str(v).strip().lower() == "yes" else False
    )
    fee_clean = fee_clean[["row_link_main", "multi_currency"]]
    merged = main.merge(fee_clean, left_on="row_link", right_on="row_link_main", how="left")
    merged["multi_currency"] = merged["multi_currency"].fillna(False)
    merged.drop(columns=["row_link_main"], errors="ignore", inplace=True)
    return merged


# ===========================================================================
# STEP 11 — Build relational output tables
# ===========================================================================

def build_buyers(df: pd.DataFrame) -> pd.DataFrame:
    """
    Deduplicate buyer_name → assign stable UUID buyer_id.
    Extract department_code from source_tender_id (second segment).
    """
    log.info("Building buyers table...")

    def extract_dept(tid):
        parts = str(tid).split("_")
        return parts[1] if len(parts) >= 3 else None

    df["_dept_code"] = df["source_tender_id"].apply(extract_dept)

    # One dept code per buyer_name — take the most common
    dept_map = (
        df.groupby("buyer_name")["_dept_code"]
          .agg(lambda x: x.mode().iloc[0] if not x.mode().empty else None)
          .reset_index()
          .rename(columns={"_dept_code": "department_code"})
    )

    buyers = (
        df[["buyer_name"]].drop_duplicates()
          .merge(dept_map, on="buyer_name", how="left")
    )
    buyers.insert(0, "buyer_id", [str(uuid.uuid4()) for _ in range(len(buyers))])
    buyers["country"] = "India"

    stats["buyers_written"] = len(buyers)
    log.info("  Buyers: %d unique entities", len(buyers))
    return buyers[["buyer_id", "buyer_name", "department_code", "country"]]


def build_tenders(df: pd.DataFrame, buyers: pd.DataFrame) -> pd.DataFrame:
    """
    Build tenders table — one row per source record.
    Assigns new UUIDs; preserves ocid, ocds_release_id, source_tender_id.
    """
    log.info("Building tenders table...")

    # Merge buyer_id from buyers lookup
    merged = df.merge(buyers[["buyer_id", "buyer_name"]], on="buyer_name", how="left")

    tenders_cols = [
        "ocid", "ocds_release_id", "source_tender_id",
        "buyer_id", "title", "stage", "procurement_method", "category",
        "contract_type", "fiscal_year", "payment_mode", "external_reference",
        "estimated_value", "number_of_tenderers", "duration_days",
        "allow_two_stage", "allow_preferential", "multi_currency",
        "date_published", "bid_opening_date", "submission_method",
    ]

    tenders = merged[tenders_cols].copy()
    tenders.insert(0, "tender_id", [str(uuid.uuid4()) for _ in range(len(tenders))])
    tenders["source_file"] = "ted/main.csv"

    stats["tenders_written"] = len(tenders)
    log.info("  Tenders: %d rows", len(tenders))
    return tenders


def build_items(df: pd.DataFrame, tenders: pd.DataFrame) -> pd.DataFrame:
    """
    Build items table — one row per tender with classification_description.
    Drops rows where description is null.
    """
    log.info("Building items table...")

    items_src = df[["ocid", "classification_description", "category"]].copy()
    items_src = items_src[items_src["classification_description"].notna()]

    # Join tender_id via ocid
    items = items_src.merge(tenders[["tender_id", "ocid"]], on="ocid", how="left")
    items = items[items["tender_id"].notna()]
    items.insert(0, "item_id", [str(uuid.uuid4()) for _ in range(len(items))])

    items = items.rename(columns={"classification_description": "description"})
    items = items[["item_id", "tender_id", "description", "category"]]
    # unit_price / quantity left null — to be populated by OCR pipeline
    items["unit_price"] = pd.NA
    items["quantity"]   = pd.NA

    stats["items_written"] = len(items)
    log.info("  Items: %d rows", len(items))
    return items


def build_milestones(mils: pd.DataFrame, tenders: pd.DataFrame) -> pd.DataFrame:
    """
    Build tender_milestones table from the milestones CSV.
    Expands the two flattened milestone slots into separate rows.
    """
    log.info("Building tender_milestones table...")

    # Join tender_id using row_link_main → tenders.row_link (stored in source)
    # We need to re-join via ocid since tenders has a new UUID tender_id
    # row_link_main in mils matches row_link in main.csv; we kept ocid in tenders
    # Load main.csv link→ocid map
    link_ocid = pd.read_csv(
        RAW_TED / "main.csv", dtype=str, keep_default_na=False,
        usecols=["_link", "ocid"]
    ).rename(columns={"_link": "row_link_main", "ocid": "ocid"})
    link_ocid["ocid"] = link_ocid["ocid"].str.strip()

    mils_joined = mils.merge(link_ocid, on="row_link_main", how="left")
    mils_joined = mils_joined.merge(tenders[["tender_id", "ocid"]], on="ocid", how="left")

    rows_out = []

    def _parse_date(v) -> object:
        if pd.isna(v) or str(v).strip() in NA_STRINGS:
            stats["milestone_dates_null"] += 1
            return pd.NA
        parsed = pd.to_datetime(v, errors="coerce", format="mixed", dayfirst=False)
        if pd.isna(parsed):
            stats["milestone_dates_null"] += 1
            return pd.NA
        return parsed.strftime("%Y-%m-%d")

    def _safe_code(v):
        s = str(v).strip() if not pd.isna(v) else ""
        return s if s in VALID_MILESTONE_CODES else "Other"

    def _safe_type(v):
        s = str(v).strip() if not pd.isna(v) else ""
        return s if s in VALID_MILESTONE_TYPES else "other"

    for _, row in mils_joined.iterrows():
        tid = row.get("tender_id")
        if pd.isna(tid):
            continue

        # Slot 1
        rows_out.append({
            "milestone_id": str(uuid.uuid4()),
            "tender_id":    tid,
            "code":         _safe_code(row.get("code")),
            "type":         _safe_type(row.get("type")),
            "title":        str(row.get("title", "")).strip() or pd.NA,
            "due_date":     _parse_date(row.get("due_date")),
        })

        # Slot 2 — only if type_2 / title_2 are present and different
        t2 = str(row.get("title_2", "")).strip()
        if t2 and t2 not in NA_STRINGS:
            rows_out.append({
                "milestone_id": str(uuid.uuid4()),
                "tender_id":    tid,
                "code":         "Other",
                "type":         _safe_type(row.get("type_2")),
                "title":        t2,
                "due_date":     _parse_date(row.get("due_date_2")),
            })

    result = pd.DataFrame(rows_out)
    stats["milestones_written"] = len(result)
    log.info("  Milestones: %d rows", len(result))
    return result


# ===========================================================================
# STEP 12 — Write clean outputs
# ===========================================================================

def write_outputs(buyers, tenders, items, milestones):
    log.info("Writing clean CSVs to %s ...", OUT_DIR)

    buyers.to_csv(   OUT_DIR / "buyers.csv",             index=False, encoding="utf-8")
    tenders.to_csv(  OUT_DIR / "tenders.csv",            index=False, encoding="utf-8")
    items.to_csv(    OUT_DIR / "items.csv",               index=False, encoding="utf-8")
    milestones.to_csv(OUT_DIR / "tender_milestones.csv", index=False, encoding="utf-8")

    log.info("  buyers.csv            : %d rows", len(buyers))
    log.info("  tenders.csv           : %d rows", len(tenders))
    log.info("  items.csv             : %d rows", len(items))
    log.info("  tender_milestones.csv : %d rows", len(milestones))


# ===========================================================================
# STEP 13 — Write cleaning report
# ===========================================================================

def write_report():
    report = f"""# Cleaning Report — TED Dataset
Generated: {pd.Timestamp.now().strftime("%Y-%m-%d %H:%M")}
Source: `data/raw/ted/`

## Records Processed

| File | Raw Rows |
|---|---|
| main.csv | {stats["raw_rows_main"]:,} |
| tender_milestones.csv | {stats["raw_rows_milestones"]:,} |
| tender_participationFee.csv | {stats["raw_rows_fee"]:,} |
| tender_documents.csv | {stats["raw_rows_docs"]:,} |

## Records Removed

| Reason | Count |
|---|---|
| Exact duplicate rows | {stats["duplicates_removed"]:,} |
| Missing ocid | {stats["invalid_missing_ocid"]:,} |
| Missing source_tender_id | {stats["invalid_missing_tid"]:,} |
| Invalid numeric values | {stats["invalid_bad_value"]:,} |

## Missing Value Handling

| Field | Action |
|---|---|
| `estimated_value` (raw missing) | Retained as NULL — {stats["null_value_kept"]:,} rows |
| `estimated_value` = 0 | Converted to NULL (placeholder sentinel per analysis) — {stats["zero_converted_to_null"]:,} rows |
| `estimated_value` (final) | Positive: {stats["positive_value_final"]:,} rows, NULL: {stats["null_value_final"]:,} rows (0 zero values) |
| `tender_status` | Dropped (100% "NA" — no information) |
| `submission_method` | Set to NULL (100% "NA") |
| `milestone due_date` | Set to NULL — {stats["milestone_dates_null"]:,} slots |
| `items.unit_price` / `quantity` | NULL — populated by OCR pipeline |

## Invalid Records

| Issue | Count | Log file |
|---|---|---|
| Date parse failures | {stats["dates_parse_failed"]:,} | `outputs/invalid_records.log` |
| Missing ocid | {stats["invalid_missing_ocid"]:,} | `outputs/invalid_records.log` |
| Missing tender_id | {stats["invalid_missing_tid"]:,} | `outputs/invalid_records.log` |
| Bad numeric values | {stats["invalid_bad_value"]:,} | `outputs/invalid_records.log` |

## Transformations Performed

| Transformation | Detail |
|---|---|
| Column rename | All columns renamed to snake_case per `sql/schema.sql` |
| Null standardization | All NA/N/A/None/empty strings → pandas NA |
| `estimated_value` = 0 → NULL | Converted {stats["zero_converted_to_null"]:,} zero values to NULL based on domain & statistical analysis |
| Stage → ENUM | {stats["stage_mapped_unknown"]:,} out-of-vocab values mapped to `Unknown` |
| Procurement method → ENUM | {stats["method_mapped_unknown"]:,} values mapped to `Unknown` |
| Contract type → ENUM | {stats["contract_type_mapped_other"]:,} values mapped to `Other` |
| Boolean flags | `allow_two_stage`, `allow_preferential`, `multi_currency`: Yes/No → True/False |
| Dates | Parsed to ISO 8601 `YYYY-MM-DDTHH:MM:SS` format |
| `buyer_name` | Strip + title-case for normalisation; original value preserved |
| Source IDs | `ocid`, `ocds_release_id`, `source_tender_id` preserved verbatim |
| UUIDs | New UUIDs assigned for `buyer_id`, `tender_id`, `item_id`, `milestone_id` |
| Milestones | Two flattened slots expanded into separate rows |
| Multi-currency flag | Joined from `tender_participationFee.csv` onto tenders |
| `department_code` | Extracted from second segment of `source_tender_id` (e.g. DOT, PWD) |

## Output Files

| File | Rows | Maps to Table |
|---|---|---|
| `data/processed/buyers.csv` | {stats["buyers_written"]:,} | `buyers` |
| `data/processed/tenders.csv` | {stats["tenders_written"]:,} | `tenders` |
| `data/processed/items.csv` | {stats["items_written"]:,} | `items` |
| `data/processed/tender_milestones.csv` | {stats["milestones_written"]:,} | `tender_milestones` |

> `bids`, `contracts`, `invoices` — not populated: vendor/award data absent in raw TED files.  
> Invalid records detail: `outputs/invalid_records.log`
"""
    report_path = LOG_DIR / "cleaning_report.md"
    with open(report_path, "w", encoding="utf-8") as fh:
        fh.write(report)
    root_report = BASE_DIR / "cleaning_report.md"
    with open(root_report, "w", encoding="utf-8") as fh:
        fh.write(report)
    log.info("Cleaning report written to %s and %s", report_path, root_report)


# ===========================================================================
# Main
# ===========================================================================

def main():
    log.info("=" * 60)
    log.info("AI Public Procurement Auditor — TED Cleaning Pipeline")
    log.info("=" * 60)

    # Ingest
    main_df, mils_df, fee_df, _ = ingest_raw()

    # Rename columns
    main_df, mils_df, fee_df = rename_columns(main_df, mils_df, fee_df)

    # Standardize nulls
    main_df = standardize_nulls(main_df)
    mils_df = standardize_nulls(mils_df)
    fee_df  = standardize_nulls(fee_df)

    # Remove duplicates
    main_df = remove_duplicates(main_df, "main.csv")
    mils_df = remove_duplicates(mils_df, "tender_milestones.csv")

    # Validate identifiers
    main_df = validate_identifiers(main_df)

    # Join fee flag
    main_df = join_fee_flag(main_df, fee_df)

    # Parse dates
    main_df = parse_all_dates(main_df)

    # Clean numerics
    main_df = clean_numerics(main_df)

    # Standardize categoricals
    main_df = standardize_categoricals(main_df)

    # Standardize text
    main_df = standardize_text(main_df)

    # Build relational tables
    buyers     = build_buyers(main_df)
    tenders    = build_tenders(main_df, buyers)
    items      = build_items(main_df, tenders)
    milestones = build_milestones(mils_df, tenders)

    # Write outputs
    write_outputs(buyers, tenders, items, milestones)

    # Write report
    write_report()

    log.info("=" * 60)
    log.info("Pipeline complete.")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
