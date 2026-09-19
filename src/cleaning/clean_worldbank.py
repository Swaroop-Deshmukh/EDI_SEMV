"""
clean_worldbank.py
------------------
Cleaning and extraction pipeline for World Bank IPF Contract Awards dataset.

Reads   : data/raw/contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.csv
Outputs : data/processed/suppliers.csv
          data/processed/contracts.csv

Target schema aligns with sql/schema.sql:
  - suppliers: supplier_id (PK), supplier_name, country, country_code, source_dataset
  - contracts: contract_id (UUID PK), wb_contract_number, project_id, project_name,
               project_global_practice, procurement_category, procurement_method,
               contract_description, borrower_contract_reference_number,
               contract_signing_date, supplier_id (FK), contract_amount_usd,
               review_type, calendar_year, borrower_country, borrower_country_code

Rules:
  - WB Contract Number is NOT unique. Every source row is assigned a distinct UUID contract_id.
  - Multi-supplier / JV awards sharing the same WB Contract Number are fully preserved.
  - Contract signing dates are parsed and formatted as YYYY-MM-DD.
  - NULLs are strictly preserved; no synthetic values are invented.
  - Source CSV is strictly read-only.
"""

import argparse
import sys
import time
import uuid
from pathlib import Path

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Path resolution helpers
# ---------------------------------------------------------------------------

def resolve_paths(custom_input=None, custom_out=None):
    """
    Resolve input and output paths dynamically whether executed from
    the project root or workspace root.
    """
    raw_filename = "contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.csv"

    if custom_input:
        input_path = Path(custom_input).resolve()
    else:
        candidates = [
            Path("data/raw") / raw_filename,
            Path("AI-Public-Procurement-Auditor/data/raw") / raw_filename,
            Path(__file__).resolve().parent.parent.parent / "data" / "raw" / raw_filename,
        ]
        input_path = None
        for cand in candidates:
            if cand.exists():
                input_path = cand.resolve()
                break
        if input_path is None:
            raise FileNotFoundError(
                f"Could not locate raw World Bank dataset '{raw_filename}' in expected paths."
            )

    if custom_out:
        out_dir = Path(custom_out).resolve()
    else:
        out_candidates = [
            Path("AI-Public-Procurement-Auditor/data/processed"),
            Path("data/processed"),
            Path(__file__).resolve().parent.parent.parent / "data" / "processed",
        ]
        out_dir = None
        for cand in out_candidates:
            if cand.exists() or cand.parent.exists():
                out_dir = cand.resolve()
                break
        if out_dir is None:
            out_dir = Path("data/processed").resolve()

    out_dir.mkdir(parents=True, exist_ok=True)
    return input_path, out_dir


# ---------------------------------------------------------------------------
# Main cleaning logic
# ---------------------------------------------------------------------------

def clean_worldbank(input_path: Path, out_dir: Path):
    print("=" * 78)
    print("       WORLD BANK CONTRACT AWARDS CLEANING & EXTRACTION PIPELINE")
    print("=" * 78)
    print(f"Input file : {input_path}")
    print(f"Output dir : {out_dir}\n")

    t0 = time.time()

    # 1. Load Raw CSV
    print("[1/5] Loading raw World Bank dataset ...")
    raw_df = pd.read_csv(
        input_path,
        dtype={
            "WB Contract Number": str,
            "Supplier ID": str,
            "Project ID": str,
            "Borrower Country / Economy Code": str,
            "Supplier Country / Economy Code": str,
        },
        low_memory=False,
    )
    total_raw_rows = len(raw_df)
    print(f"      Loaded {total_raw_rows:,} raw records in {time.time() - t0:.2f}s\n")

    # 2. Extract and clean Suppliers
    print("[2/5] Deriving suppliers dataset ...")
    t_sup = time.time()

    # Filter records with a non-empty Supplier ID
    has_supplier_id = raw_df["Supplier ID"].notna() & (raw_df["Supplier ID"].astype(str).str.strip() != "")
    suppliers_raw = raw_df[has_supplier_id].copy()
    suppliers_raw["Supplier ID"] = suppliers_raw["Supplier ID"].astype(str).str.strip()

    # Group by Supplier ID, taking first non-null value for each attribute
    suppliers_grouped = suppliers_raw.groupby("Supplier ID", as_index=False).agg({
        "Supplier": "first",
        "Supplier Country / Economy": "first",
        "Supplier Country / Economy Code": "first",
    })

    # Assemble suppliers DataFrame matching sql/schema.sql
    suppliers_df = pd.DataFrame({
        "supplier_id": suppliers_grouped["Supplier ID"],
        "supplier_name": suppliers_grouped["Supplier"],
        "country": suppliers_grouped["Supplier Country / Economy"],
        "country_code": suppliers_grouped["Supplier Country / Economy Code"],
        "source_dataset": "worldbank",
    })

    suppliers_out_path = out_dir / "suppliers.csv"
    suppliers_df.to_csv(suppliers_out_path, index=False, encoding="utf-8")
    print(f"      Generated {len(suppliers_df):,} unique suppliers -> {suppliers_out_path}")
    print(f"      Supplier extraction completed in {time.time() - t_sup:.2f}s\n")

    # 3. Extract and clean Contracts
    print("[3/5] Deriving contracts dataset ...")
    t_con = time.time()

    # Generate unique UUIDs for every source row
    print("      Generating UUID contract IDs ...")
    contract_ids = [str(uuid.uuid4()) for _ in range(total_raw_rows)]

    # Parse Contract Signing Date to YYYY-MM-DD
    print("      Parsing contract signing dates ...")
    signing_dates = pd.to_datetime(raw_df["Contract Signing Date"], format="%m/%d/%Y", errors="coerce")
    if signing_dates.isna().any():
        fallback_mask = signing_dates.isna() & raw_df["Contract Signing Date"].notna()
        signing_dates[fallback_mask] = pd.to_datetime(raw_df.loc[fallback_mask, "Contract Signing Date"], errors="coerce")
    formatted_dates = signing_dates.dt.strftime("%Y-%m-%d")

    # Clean calendar year (convert to nullable integer string)
    cal_year = pd.to_numeric(raw_df["Contract signed - Calendar year"], errors="coerce").astype("Int64")

    # Clean contract amount (numeric with 2 decimals, preserving nulls)
    raw_amount = pd.to_numeric(raw_df["Supplier Contract Amount (USD)"], errors="coerce").round(2)

    # Clean supplier_id (preserve nulls, strip whitespace)
    clean_supplier_id = raw_df["Supplier ID"].apply(
        lambda x: str(x).strip() if pd.notna(x) and str(x).strip() != "" else None
    )

    # Clean string identifiers
    wb_contract_number = raw_df["WB Contract Number"].astype(str).str.strip()
    project_id = raw_df["Project ID"].astype(str).str.strip()
    project_name = raw_df["Project Name"].astype(str).str.strip()
    procurement_cat = raw_df["Procurement Category"].astype(str).str.strip()
    procurement_meth = raw_df["Procurement Method"].astype(str).str.strip()
    borrower_country = raw_df["Borrower Country / Economy"].astype(str).str.strip()

    # Assemble contracts DataFrame matching target schema
    contracts_df = pd.DataFrame({
        "contract_id": contract_ids,
        "wb_contract_number": wb_contract_number,
        "project_id": project_id,
        "project_name": project_name,
        "project_global_practice": raw_df["Project Global Practice"],
        "procurement_category": procurement_cat,
        "procurement_method": procurement_meth,
        "contract_description": raw_df["Contract Description"],
        "borrower_contract_reference_number": raw_df["Borrower Contract Reference Number"],
        "contract_signing_date": formatted_dates,
        "supplier_id": clean_supplier_id,
        "contract_amount_usd": raw_amount,
        "review_type": raw_df["Review type"],
        "calendar_year": cal_year,
        "borrower_country": borrower_country,
        "borrower_country_code": raw_df["Borrower Country / Economy Code"],
    })

    contracts_out_path = out_dir / "contracts.csv"
    contracts_df.to_csv(contracts_out_path, index=False, encoding="utf-8")
    print(f"      Generated {len(contracts_df):,} contract rows -> {contracts_out_path}")
    print(f"      Contract extraction completed in {time.time() - t_con:.2f}s\n")

    # 4. Compute Metrics
    print("[4/5] Computing summary metrics & statistics ...")
    unique_wb_contracts = contracts_df["wb_contract_number"].nunique()
    total_contracts = len(contracts_df)
    duplicate_rows = total_contracts - unique_wb_contracts

    wb_counts = contracts_df["wb_contract_number"].value_counts()
    multi_contract_nums = (wb_counts > 1).sum()
    max_repeats = wb_counts.max()
    max_repeated_num = wb_counts.idxmax()

    # 5. Print Summary Report
    print("\n" + "=" * 78)
    print("                        SUMMARY METRICS REPORT")
    print("=" * 78)

    print("\n--- DATASET ROW COUNTS ---")
    print(f"  Raw Source Records               : {total_raw_rows:,}")
    print(f"  Generated Suppliers (Unique IDs) : {len(suppliers_df):,}")
    print(f"  Generated Contracts (Source Rows): {len(contracts_df):,}")

    print("\n--- WB CONTRACT NUMBER CARDINALITY ---")
    print(f"  Unique WB Contract Numbers       : {unique_wb_contracts:,}")
    print(f"  Duplicate Contract Rows          : {duplicate_rows:,} (multi-supplier / JV awards)")
    print(f"  Contract Numbers with >1 Row     : {multi_contract_nums:,}")
    print(f"  Highest Duplicate Frequency      : {max_repeats} rows (WB Contract #{max_repeated_num})")

    print("\n--- SUPPLIERS NULL COUNTS (Total: {:,}) ---".format(len(suppliers_df)))
    for col in suppliers_df.columns:
        null_count = suppliers_df[col].isna().sum()
        pct = (null_count / len(suppliers_df)) * 100
        print(f"  {col:<20}: {null_count:>8,} nulls ({pct:6.2f}%)")

    print("\n--- CONTRACTS NULL COUNTS (Total: {:,}) ---".format(len(contracts_df)))
    for col in contracts_df.columns:
        null_count = contracts_df[col].isna().sum()
        pct = (null_count / len(contracts_df)) * 100
        print(f"  {col:<35}: {null_count:>8,} nulls ({pct:6.2f}%)")

    print("\n" + "=" * 78)
    print(f"Pipeline completed successfully in {time.time() - t0:.2f} seconds.")
    print("=" * 78 + "\n")

    return suppliers_out_path, contracts_out_path


# ---------------------------------------------------------------------------
# Verification helper
# ---------------------------------------------------------------------------

def verify_outputs(suppliers_path: Path, contracts_path: Path):
    print("=" * 78)
    print("                   VERIFYING GENERATED OUTPUT CSVs")
    print("=" * 78)

    # Verify suppliers.csv
    print(f"\n[Verifying] {suppliers_path} ...")
    assert suppliers_path.exists(), f"Missing file: {suppliers_path}"
    sup_df = pd.read_csv(suppliers_path, dtype=str)
    print(f"  -> Rows: {len(sup_df):,}, Columns: {list(sup_df.columns)}")
    expected_sup_cols = ["supplier_id", "supplier_name", "country", "country_code", "source_dataset"]
    assert list(sup_df.columns) == expected_sup_cols, f"Mismatch in suppliers columns: {sup_df.columns}"
    assert sup_df["supplier_id"].nunique() == len(sup_df), "Duplicate supplier_id found in suppliers.csv!"
    assert (sup_df["source_dataset"] == "worldbank").all(), "Invalid source_dataset values found!"
    print("  -> PASS: suppliers.csv schema, uniqueness, and column checks passed.")

    # Verify contracts.csv
    print(f"\n[Verifying] {contracts_path} ...")
    assert contracts_path.exists(), f"Missing file: {contracts_path}"
    con_df = pd.read_csv(contracts_path, dtype=str)
    print(f"  -> Rows: {len(con_df):,}, Columns: {list(con_df.columns)}")
    expected_con_cols = [
        "contract_id", "wb_contract_number", "project_id", "project_name",
        "project_global_practice", "procurement_category", "procurement_method",
        "contract_description", "borrower_contract_reference_number",
        "contract_signing_date", "supplier_id", "contract_amount_usd",
        "review_type", "calendar_year", "borrower_country", "borrower_country_code",
    ]
    assert list(con_df.columns) == expected_con_cols, f"Mismatch in contracts columns: {con_df.columns}"
    assert con_df["contract_id"].nunique() == len(con_df), "Duplicate contract_id UUID found!"

    # Verify date format YYYY-MM-DD
    sample_dates = con_df["contract_signing_date"].dropna().head(1000)
    invalid_dates = sample_dates[~sample_dates.str.match(r"^\d{4}-\d{2}-\d{2}$")]
    assert len(invalid_dates) == 0, f"Found non YYYY-MM-DD dates: {invalid_dates.head()}"
    print("  -> PASS: contracts.csv schema, UUID uniqueness, and date formatting passed.")

    print("\n" + "=" * 78)
    print("           ALL OUTPUT VERIFICATIONS PASSED SUCCESSFULLY!")
    print("=" * 78 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clean and extract World Bank contracts and suppliers.")
    parser.add_argument("--input", "-i", type=str, default=None, help="Path to raw World Bank CSV.")
    parser.add_argument("--out-dir", "-o", type=str, default=None, help="Output directory for CSVs.")
    args = parser.parse_args()

    input_p, out_p = resolve_paths(args.input, args.out_dir)
    sup_p, con_p = clean_worldbank(input_p, out_p)
    verify_outputs(sup_p, con_p)
