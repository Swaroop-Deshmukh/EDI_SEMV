"""
ocr_preprocessing.py

Preprocesses 100 invoice images from the RVL-CDIP dataset and runs
Tesseract OCR on each preprocessed image.

Pipeline per image:
    1. Convert to grayscale
    2. Upscale (2x) for better OCR accuracy
    3. Improve contrast via CLAHE
    4. Reduce noise (Non-local Means Denoising)
    5. Apply adaptive thresholding (Otsu binarisation)
    6. Run Tesseract OCR

Output: data/ocr/results/ocr_preprocessed_results.csv
Columns: record_id, filename, preprocessed_ocr_text
"""

import os
import sys
import csv
import pathlib
import numpy as np
import cv2
import pytesseract
import datasets
from PIL import Image

# Configuration
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
DATASET_PATH   = "data/ocr/rvl_cdip_invoice"
OUTPUT_DIR     = "data/ocr/results"
OUTPUT_CSV     = os.path.join(OUTPUT_DIR, "ocr_preprocessed_results.csv")
MAX_RECORDS    = 100

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def preprocess(pil_image):
    """Apply full preprocessing pipeline to a PIL image."""
    # 1. Grayscale
    img_array = np.array(pil_image.convert("RGB"))
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)

    # 2. Upscale 2x
    h, w = gray.shape
    upscaled = cv2.resize(gray, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)

    # 3. Contrast enhancement via CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrasted = clahe.apply(upscaled)

    # 4. Noise reduction
    denoised = cv2.fastNlMeansDenoising(
        contrasted, h=10, templateWindowSize=7, searchWindowSize=21
    )

    # 5. Otsu thresholding
    _, binary = cv2.threshold(
        denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    return binary


def run_ocr(binary_img):
    """Run Tesseract OCR on a pre-processed binary image array."""
    pil_bin = Image.fromarray(binary_img)
    config = "--psm 6 --oem 3"
    text = pytesseract.image_to_string(pil_bin, lang="eng", config=config)
    return text.strip()


def main():
    if not os.path.isfile(TESSERACT_PATH):
        sys.exit(f"[ERROR] Tesseract not found at: {TESSERACT_PATH}")

    pathlib.Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

    print(f"Loading dataset from: {DATASET_PATH}")
    ds = datasets.Dataset.load_from_disk(DATASET_PATH)

    total = min(len(ds), MAX_RECORDS)
    print(f"Processing {total} invoice images...\n")

    results = []
    for idx in range(total):
        record   = ds[idx]
        filename = record["filename"]
        pil_img  = record["image"]

        binary   = preprocess(pil_img)
        ocr_text = run_ocr(binary)

        results.append({
            "record_id":             idx,
            "filename":              filename,
            "preprocessed_ocr_text": ocr_text,
        })

        if (idx + 1) % 10 == 0:
            print(f"  [{idx + 1:3d}/{total}] {filename}  -- {len(ocr_text)} chars")

    fieldnames = ["record_id", "filename", "preprocessed_ocr_text"]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"\n[OK] Processed {len(results)} invoices.")
    print(f"[OK] Results saved to: {OUTPUT_CSV}")

    print("\n-- First 2 OCR results --")
    for r in results[:2]:
        preview = r["preprocessed_ocr_text"][:400].replace("\n", " ")
        print(f"\nrecord_id : {r['record_id']}")
        print(f"filename  : {r['filename']}")
        print(f"ocr_text  : {preview}...")


if __name__ == "__main__":
    main()
