"""
ingest_postgres.py
==================
Ingest all procurement and OCR CSVs into PostgreSQL.

Connection settings are read exclusively from environment variables:
  PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD

Usage
-----
  # Set environment variables first, then run:
  python src/ingest_postgres.py

  # Optional flags:
  #   --schema-only    Execute schema.sql but skip CSV loading
  #   --skip-schema    Skip schema.sql and only load CSVs
  #   --dry-run        Parse everything but do not touch the database

Do NOT hardcode credentials here. Use environment variables or a .env
file that is listed in .gitignore.
"""

import argparse
import csv
import io
import os
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Path constants  (relative to the project root, i.e. AI-Public-Procurement-Auditor/)
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent   # …/AI-Public-Procurement-Auditor
SCHEMA_SQL   = PROJECT_ROOT / "sql" / "schema.sql"

# Processed TED / World-Bank CSVs
DATA_PROCESSED = PROJECT_ROOT / "data" / "processed"

# OCR-derived invoice CSVs
DATA_OCR = PROJECT_ROOT / "data" / "ocr" / "results"

# ---------------------------------------------------------------------------
# FK-safe load order
# Tables that are missing (suppliers, contracts, tender_contract_link) are
# skipped automatically with a warning rather than a hard failure, because
# those CSVs were not produced by this project's pipeline.
# ---------------------------------------------------------------------------

LOAD_ORDER = [
    # (csv_path,                                         table_name,              pk_col_that_must_be_uuid)
    (DATA_PROCESSED / "buyers.csv",                     "buyers",                None),
    (DATA_PROCESSED / "suppliers.csv",                  "suppliers",             None),
    (DATA_PROCESSED / "tenders.csv",                    "tenders",               None),
    (DATA_PROCESSED / "items.csv",                      "items",                 None),
    (DATA_PROCESSED / "tender_milestones.csv",          "tender_milestones",     None),
    (DATA_PROCESSED / "contracts.csv",                  "contracts",             None),
    (DATA_PROCESSED / "tender_contract_link.csv",       "tender_contract_link",  None),
    (DATA_OCR       / "invoices.csv",                   "invoices",              None),
    (DATA_OCR       / "invoice_items.csv",              "invoice_items",         None),
]

# Columns in each CSV that map directly to DB columns.
# The ingestion will only INSERT these columns (extras are ignored, missing
# schema columns get their DB DEFAULT / NULL).
# "line_number" for invoice_items is NOT in the CSV; it is generated here.

COLUMN_MAP = {
    "buyers": [
        "buyer_id", "buyer_name", "department_code", "country",
    ],
    "suppliers": [
        "supplier_id", "supplier_name", "country", "country_code", "source_dataset",
    ],
    "tenders": [
        "tender_id", "ocid", "ocds_release_id", "source_tender_id", "buyer_id",
        "title", "stage", "procurement_method", "category", "contract_type",
        "fiscal_year", "payment_mode", "external_reference", "estimated_value",
        "number_of_tenderers", "duration_days", "allow_two_stage",
        "allow_preferential", "multi_currency", "date_published",
        "bid_opening_date", "submission_method", "source_file",
    ],
    "items": [
        "item_id", "tender_id", "description", "category", "unit_price", "quantity",
    ],
    "tender_milestones": [
        "milestone_id", "tender_id", "code", "type", "title", "due_date",
    ],
    "contracts": [
        "contract_id", "wb_contract_number", "project_id", "project_name",
        "project_global_practice", "procurement_category", "procurement_method",
        "contract_description", "borrower_contract_reference_number",
        "contract_signing_date", "supplier_id", "contract_amount_usd",
        "review_type", "calendar_year", "borrower_country",
        "borrower_country_code", "source_file",
    ],
    "tender_contract_link": [
        "link_id", "tender_id", "contract_id", "confidence_level",
        "match_method", "matched_reference",
    ],
    "invoices": [
        "invoice_id", "record_id", "filename",
        "invoice_number", "invoice_date", "total_amount", "currency",
        "tender_id", "contract_id", "supplier_id",
    ],
    # line_number is injected during ingestion; it is NOT in the CSV
    "invoice_items": [
        "invoice_item_id", "invoice_id", "item_id",
        "description", "quantity", "unit_price", "line_total",
        "line_number",   # <-- added programmatically, NOT from CSV
    ],
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _env(var: str) -> str:
    val = os.environ.get(var, "").strip()
    if not val:
        print(f"[ERROR] Environment variable '{var}' is not set or empty.", file=sys.stderr)
        sys.exit(1)
    return val


def _get_connection():
    """Build and return a psycopg2 connection from environment variables."""
    import psycopg2  # imported here so the module can be imported without psycopg2

    return psycopg2.connect(
        host=_env("PGHOST"),
        port=int(_env("PGPORT")),
        dbname=_env("PGDATABASE"),
        user=_env("PGUSER"),
        password=_env("PGPASSWORD"),
        connect_timeout=10,
    )


def _empty_to_none(value: str):
    """Convert an empty or whitespace-only CSV field to None (SQL NULL)."""
    return None if value.strip() == "" else value.strip()


def _read_csv_rows(path: Path, table: str):
    """
    Read a CSV and return (columns_for_insert, list_of_row_tuples).

    For invoice_items, inject a sequential line_number per invoice_id.
    """
    target_cols = COLUMN_MAP[table]

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        csv_cols = reader.fieldnames or []

        # Columns in COLUMN_MAP that actually exist in the CSV
        # (line_number is the exception — it is generated)
        insertable_from_csv = [c for c in target_cols if c in csv_cols]

        rows_raw = list(reader)

    if table == "invoice_items":
        # Generate line_number: sequential counter per invoice_id
        counters: dict[str, int] = {}
        processed = []
        for row in rows_raw:
            inv_id = row.get("invoice_id", "")
            counters[inv_id] = counters.get(inv_id, 0) + 1
            line_num = counters[inv_id]

            # Build tuple in exact column order
            values = []
            for col in target_cols:
                if col == "line_number":
                    values.append(line_num)
                else:
                    values.append(_empty_to_none(row.get(col, "")))
            processed.append(tuple(values))

        return target_cols, processed

    else:
        final_cols = [c for c in target_cols if c in csv_cols]
        processed = []
        for row in rows_raw:
            values = tuple(_empty_to_none(row.get(col, "")) for col in final_cols)
            processed.append(values)
        return final_cols, processed


def _copy_rows(cur, table: str, columns: list, rows: list):
    """
    Use psycopg2's copy_expert with a StringIO buffer for bulk loading.
    Uses COPY … FROM STDIN WITH (FORMAT CSV, NULL '', HEADER FALSE).
    """
    buf = io.StringIO()
    writer = csv.writer(buf, quoting=csv.QUOTE_MINIMAL)
    for row in rows:
        writer.writerow(["" if v is None else v for v in row])
    buf.seek(0)

    col_list = ", ".join(f'"{c}"' for c in columns)
    sql = (
        f"COPY {table} ({col_list}) "
        f"FROM STDIN WITH (FORMAT CSV, NULL '', HEADER FALSE)"
    )
    cur.copy_expert(sql, buf)


def _execute_schema(conn, schema_path: Path):
    """Execute schema.sql in a single transaction."""
    print(f"[schema] Reading {schema_path}")
    sql = schema_path.read_text(encoding="utf-8")
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()
    print("[schema] Schema applied successfully.")


def _load_table(conn, csv_path: Path, table: str, dry_run: bool = False) -> int:
    """Load one CSV into one table. Returns row count inserted."""
    if not csv_path.exists():
        print(f"[SKIP]  {table}: CSV not found at {csv_path}")
        return 0

    cols, rows = _read_csv_rows(csv_path, table)
    count = len(rows)

    if dry_run:
        print(f"[DRY]   {table}: would insert {count} rows  cols={cols}")
        return count

    with conn.cursor() as cur:
        _copy_rows(cur, table, cols, rows)
    conn.commit()
    print(f"[OK]    {table}: inserted {count} rows  cols={cols}")
    return count


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Ingest procurement CSVs into PostgreSQL."
    )
    parser.add_argument("--schema-only", action="store_true",
                        help="Execute schema.sql only; skip CSV loading.")
    parser.add_argument("--skip-schema", action="store_true",
                        help="Skip schema.sql; only load CSVs.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse everything but do not write to the database.")
    args = parser.parse_args()

    # Validate schema file exists
    if not SCHEMA_SQL.exists():
        print(f"[ERROR] schema.sql not found at {SCHEMA_SQL}", file=sys.stderr)
        sys.exit(1)

    # Dry-run: no DB connection required
    if args.dry_run:
        print("[DRY-RUN MODE] No database writes will occur.\n")
        if not args.skip_schema:
            print(f"[DRY]   Would execute schema: {SCHEMA_SQL}")
        if not args.schema_only:
            total = 0
            for csv_path, table, _ in LOAD_ORDER:
                total += _load_table(None, csv_path, table, dry_run=True)
            print(f"\n[DRY]   Total rows that would be inserted: {total}")
        return

    # Real run — connect
    print("[connect] Connecting to PostgreSQL …")
    conn = _get_connection()
    print(f"[connect] Connected to {_env('PGDATABASE')} on {_env('PGHOST')}:{_env('PGPORT')}")

    try:
        if not args.skip_schema:
            _execute_schema(conn, SCHEMA_SQL)

        if not args.schema_only:
            total = 0
            for csv_path, table, _ in LOAD_ORDER:
                total += _load_table(conn, csv_path, table)
            print(f"\n[done]  Total rows inserted: {total}")

    except Exception as exc:
        conn.rollback()
        print(f"\n[ERROR] {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
