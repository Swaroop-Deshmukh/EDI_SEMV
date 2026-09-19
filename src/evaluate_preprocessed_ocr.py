"""
evaluate_preprocessed_ocr.py

Evaluates OCR quality of the preprocessed pipeline by comparing
preprocessed_ocr_text against reference_ocr (ground truth from
ocr_results.csv), using the same SequenceMatcher similarity method
as evaluate_ocr.py.

Input files:
    data/ocr/results/ocr_preprocessed_results.csv  -- preprocessed OCR output
    data/ocr/results/ocr_results.csv               -- ground truth (reference_ocr)

Output file:
    data/ocr/results/ocr_preprocessed_evaluation.csv

Columns in output:
    record_id, filename, reference_ocr, preprocessed_ocr_text, similarity_score
"""

import csv
import pathlib
from difflib import SequenceMatcher

# ── Configuration ──────────────────────────────────────────────────────────────
PREPROCESSED_CSV = "data/ocr/results/ocr_preprocessed_results.csv"
REFERENCE_CSV    = "data/ocr/results/ocr_results.csv"
OUTPUT_CSV       = "data/ocr/results/ocr_preprocessed_evaluation.csv"
OUTPUT_DIR       = "data/ocr/results"

ORIGINAL_BASELINE = 0.253   # 25.3% -- baseline from previous OCR evaluation


# ── Similarity function (identical to evaluate_ocr.py) ────────────────────────
def similarity(a: str, b: str) -> float:
    """Return SequenceMatcher ratio between two strings.
    Returns 0.0 if both strings are empty.
    """
    a = (a or "").strip()
    b = (b or "").strip()
    if not a and not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


# ── Load CSV helpers ──────────────────────────────────────────────────────────
def load_csv(path: str, key: str) -> dict:
    """Load a CSV and index rows by record_id -> {key: value, ...}."""
    rows = {}
    with open(path, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = int(row["record_id"])
            rows[rid] = row
    return rows


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    pathlib.Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

    print(f"Loading preprocessed results: {PREPROCESSED_CSV}")
    preprocessed = load_csv(PREPROCESSED_CSV, "preprocessed_ocr_text")

    print(f"Loading reference OCR:        {REFERENCE_CSV}")
    reference = load_csv(REFERENCE_CSV, "reference_ocr")

    # Match on record_id
    common_ids = sorted(set(preprocessed.keys()) & set(reference.keys()))
    print(f"Matched record IDs: {len(common_ids)}\n")

    results = []
    scores  = []

    for rid in common_ids:
        pre_text = preprocessed[rid].get("preprocessed_ocr_text", "")
        ref_text = reference[rid].get("reference_ocr", "")
        filename = preprocessed[rid].get("filename", "")

        score = similarity(pre_text, ref_text)
        scores.append(score)

        results.append({
            "record_id":             rid,
            "filename":              filename,
            "reference_ocr":         ref_text,
            "preprocessed_ocr_text": pre_text,
            "similarity_score":      round(score, 6),
        })

    # ── Statistics ─────────────────────────────────────────────────────────────
    n          = len(scores)
    avg_sim    = sum(scores) / n if n else 0.0
    min_sim    = min(scores) if scores else 0.0
    max_sim    = max(scores) if scores else 0.0
    delta      = avg_sim - ORIGINAL_BASELINE
    direction  = "IMPROVEMENT" if delta >= 0 else "DECREASE"

    # ── Write output CSV ───────────────────────────────────────────────────────
    fieldnames = [
        "record_id", "filename",
        "reference_ocr", "preprocessed_ocr_text", "similarity_score"
    ]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    # ── Report ─────────────────────────────────────────────────────────────────
    print("=" * 58)
    print("  OCR PREPROCESSING EVALUATION REPORT")
    print("=" * 58)
    print(f"  Invoices evaluated       : {n}")
    print(f"  Average similarity       : {avg_sim:.4f}  ({avg_sim*100:.2f}%)")
    print(f"  Minimum similarity       : {min_sim:.4f}  ({min_sim*100:.2f}%)")
    print(f"  Maximum similarity       : {max_sim:.4f}  ({max_sim*100:.2f}%)")
    print(f"  Original OCR baseline    : {ORIGINAL_BASELINE:.4f}  ({ORIGINAL_BASELINE*100:.2f}%)")
    print(f"  Delta vs baseline        : {delta:+.4f}  ({delta*100:+.2f}%)  [{direction}]")
    print("=" * 58)
    print(f"\n[OK] Detailed results saved to: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
