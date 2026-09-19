-- =============================================================
-- schema.sql
-- AI Public Procurement Auditor — PostgreSQL Database Schema
-- =============================================================
-- Source datasets : TED (India OCDS export) + World Bank JSONL
-- Row counts      : 34,232 tenders across FY2016–FY2022
-- Author          : Data Engineering Module
-- Notes:
--   • No data is inserted here.
--   • UUIDs are used as primary keys throughout (gen_random_uuid()).
--   • ocid / tender_id / ocds_release_id are retained as UNIQUE
--     text columns for traceability back to the raw OCDS source.
--   • All ENUMs are defined as PostgreSQL custom types for safety.
--   • Indexes are created after table definitions.
-- =============================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =============================================================
-- ENUM TYPES
-- =============================================================

CREATE TYPE procurement_method_enum AS ENUM (
    'Open Tender',
    'Limited',
    'Open Limited',
    'Single',
    'Auction',
    'Global Tenders',
    'Unknown'
);

CREATE TYPE procurement_category_enum AS ENUM (
    'Goods',
    'Services',
    'Works'
);

CREATE TYPE contract_type_enum AS ENUM (
    'Buy',
    'Works',
    'Supply',
    'Fixed-rate',
    'Lump-sum',
    'Item Rate',
    'Item Wise',
    'Percentage',
    'Piece-work',
    'Turn-key',
    'Multi-stage',
    'Empanelment',
    'QCBS',
    'EOI',
    'Tender cum Auction',
    'PPP-BoT-Annuity',
    'Other'
);

CREATE TYPE tender_stage_enum AS ENUM (
    'To be Opened',
    'Bid Opening',
    'Technical Bid Opening',
    'Financial Bid Opening',
    'Technical Evaluation',
    'Financial Evaluation',
    'Evaluation',
    'AOC',
    'Retender',
    'Cancelled',
    'Unknown'
);

CREATE TYPE payment_mode_enum AS ENUM (
    'Online',
    'Offline',
    'Both',
    'Both(Online/Offline)',
    'Not Applicable'
);

CREATE TYPE milestone_code_enum AS ENUM (
    'PreBid Meeting Date',
    'Other'
);

CREATE TYPE milestone_type_enum AS ENUM (
    'assessment',
    'delivery',
    'other'
);

CREATE TYPE invoice_status_enum AS ENUM (
    'pending',
    'processed',
    'verified',
    'rejected'
);


-- =============================================================
-- TABLE: buyers
-- Procuring entities / government departments
-- Source: tender.buyer_name (TED main.csv / WB full.jsonl)
-- =============================================================

CREATE TABLE buyers (
    buyer_id        UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_name      TEXT            NOT NULL,
    -- Additional enrichment fields (populated during cleaning)
    department_code TEXT,               -- extracted from tender_id prefix (e.g. DOT, PWD)
    country         TEXT            DEFAULT 'India',
    created_at      TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_buyers_name UNIQUE (buyer_name)
);

COMMENT ON TABLE  buyers                IS 'Procuring entities / government departments.';
COMMENT ON COLUMN buyers.department_code IS 'Extracted department code from tender_id (e.g. DOT, PWD, SWD).';


-- =============================================================
-- TABLE: tenders
-- Central fact table. One row per OCDS release / procurement notice.
-- Source: TED main.csv, WB full.jsonl
-- =============================================================

CREATE TABLE tenders (
    tender_id           UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),

    -- OCDS traceability keys (unique, retained from source)
    ocid                TEXT                    NOT NULL,
    ocds_release_id     TEXT                    NOT NULL,   -- full id field: ocds-kjhdrl-...-date
    source_tender_id    TEXT                    NOT NULL,   -- raw tender_id: YYYY_DEPT_N_N

    -- Buyer reference
    buyer_id            UUID                    NOT NULL
                            REFERENCES buyers(buyer_id) ON DELETE RESTRICT,

    -- Tender descriptors
    title               TEXT,
    stage               tender_stage_enum       DEFAULT 'Unknown',
    procurement_method  procurement_method_enum DEFAULT 'Unknown',
    category            procurement_category_enum,
    contract_type       contract_type_enum      DEFAULT 'Other',
    fiscal_year         TEXT,                               -- e.g. '2016-2017'
    payment_mode        payment_mode_enum,
    external_reference  TEXT,                              -- dept-level reference no.

    -- Numeric / financial
    estimated_value     NUMERIC(20, 2),                    -- tender_value_amount (INR)
    number_of_tenderers INTEGER CHECK (number_of_tenderers >= 0),
    duration_days       INTEGER CHECK (duration_days > 0), -- tender period in days

    -- Flags
    allow_two_stage     BOOLEAN                DEFAULT FALSE,
    allow_preferential  BOOLEAN                DEFAULT FALSE,
    multi_currency      BOOLEAN                DEFAULT FALSE, -- from participationFee

    -- Dates
    date_published      TIMESTAMPTZ,
    bid_opening_date    TIMESTAMPTZ,

    -- Metadata
    submission_method   TEXT,
    source_file         TEXT,                              -- which raw file this came from
    created_at          TIMESTAMPTZ            DEFAULT NOW(),

    CONSTRAINT uq_tenders_ocid         UNIQUE (ocid),
    CONSTRAINT uq_tenders_release_id   UNIQUE (ocds_release_id),
    CONSTRAINT uq_tenders_source_id    UNIQUE (source_tender_id)
);

COMMENT ON TABLE  tenders                  IS 'Central procurement notice / tender fact table. One row per OCDS release.';
COMMENT ON COLUMN tenders.ocid             IS 'OCDS contract identifier — stable across releases.';
COMMENT ON COLUMN tenders.ocds_release_id  IS 'Full OCDS release id including snapshot date.';
COMMENT ON COLUMN tenders.source_tender_id IS 'Raw tender_id from source dataset (e.g. 2016_DOT_946_1).';
COMMENT ON COLUMN tenders.estimated_value  IS 'Estimated contract value in INR from tender_value_amount.';
COMMENT ON COLUMN tenders.number_of_tenderers IS 'Number of bids received. 0 or 1 is an anomaly signal.';


-- =============================================================
-- TABLE: items
-- Procurement classification / line-item categories
-- Source: tenderclassification_description (TED main.csv)
-- One row per tender (1:1 in current dataset; 1:N ready)
-- =============================================================

CREATE TABLE items (
    item_id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID    NOT NULL
                        REFERENCES tenders(tender_id) ON DELETE CASCADE,
    description     TEXT    NOT NULL,   -- tenderclassification_description
    category        TEXT,               -- mainProcurementCategory (Goods/Services/Works)
    unit_price      NUMERIC(20, 2),     -- populated from contracts / OCR
    quantity        NUMERIC(15, 4),     -- populated from contracts / OCR
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE  items             IS 'Procurement line-item classification per tender.';
COMMENT ON COLUMN items.unit_price  IS 'Populated during contract award / OCR invoice processing.';
COMMENT ON COLUMN items.quantity    IS 'Populated during contract award / OCR invoice processing.';


-- =============================================================
-- TABLE: tender_milestones
-- Key dates associated with a tender (pre-bid, bid opening, etc.)
-- Source: TED tender_milestones.csv / WB full.jsonl tender.milestones
-- =============================================================

CREATE TABLE tender_milestones (
    milestone_id    UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID                NOT NULL
                        REFERENCES tenders(tender_id) ON DELETE CASCADE,
    code            milestone_code_enum DEFAULT 'Other',
    type            milestone_type_enum DEFAULT 'other',
    title           TEXT,
    due_date        DATE,               -- NULL when source = 'NA'
    created_at      TIMESTAMPTZ         DEFAULT NOW()
);

COMMENT ON TABLE  tender_milestones          IS 'Key procurement dates / milestones per tender.';
COMMENT ON COLUMN tender_milestones.due_date IS 'NULL when source data contains NA.';


-- =============================================================
-- TABLE: suppliers
-- Master vendor and contractor registry populated from World Bank
-- contract awards.
-- Source: contract_awards...csv (Deduplicated on Supplier ID)
-- =============================================================

CREATE TABLE suppliers (
    supplier_id     VARCHAR(50)     PRIMARY KEY,            -- WB master supplier ID (e.g. '1065844')
    supplier_name   VARCHAR(255),                           -- Official legal name
    country         VARCHAR(100),                           -- Registered country
    country_code    VARCHAR(10),                            -- ISO / WB country code
    source_dataset  VARCHAR(50)     NOT NULL DEFAULT 'World Bank IPF',
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE  suppliers              IS 'Master vendor / contractor registry from World Bank contract awards.';
COMMENT ON COLUMN suppliers.supplier_id  IS 'World Bank master supplier identifier (e.g. 1065844).';
COMMENT ON COLUMN suppliers.source_dataset IS 'Data provenance tag (World Bank IPF).';


-- =============================================================
-- TABLE: contracts
-- Formal contract awards financed under World Bank operations.
-- Source: contract_awards...csv (Filtered to India / Assam operations)
-- =============================================================

CREATE TABLE contracts (
    contract_id                         UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- World Bank identifiers
    wb_contract_number                  VARCHAR(50)     NOT NULL,   -- WB internal contract number (indexed)
    project_id                          VARCHAR(20)     NOT NULL,   -- World Bank project ID (Pxxxxxxx)
    project_name                        VARCHAR(255)    NOT NULL,
    project_global_practice             VARCHAR(100),               -- e.g. Transport, Water, Governance

    -- Procurement metadata
    procurement_category                VARCHAR(50)     NOT NULL,   -- Goods / Works / Consultant Services
    procurement_method                  VARCHAR(100)    NOT NULL,   -- e.g. QCBS, RFB, RFQ
    contract_description                TEXT,
    borrower_contract_reference_number  VARCHAR(255),               -- borrower-assigned reference

    -- Award details
    contract_signing_date               DATE,
    supplier_id                         VARCHAR(50)
                                            REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    contract_amount_usd                 NUMERIC(20, 2),             -- total committed amount in USD
    review_type                         VARCHAR(20),                -- Prior / Post

    -- Geography / provenance
    calendar_year                       INTEGER,
    borrower_country                    VARCHAR(100)    NOT NULL,
    borrower_country_code               VARCHAR(10),
    source_file                         VARCHAR(150)    NOT NULL DEFAULT 'contract_awards_in_investment_project_financing_since_fy_2020_09-12-2026.csv',

    -- Metadata
    created_at                          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at                          TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE  contracts                             IS 'Formal World Bank-financed contract awards. One row per WB contract number.';
COMMENT ON COLUMN contracts.wb_contract_number          IS 'World Bank internal contract number (indexed, not unique — rare duplicates exist).';
COMMENT ON COLUMN contracts.supplier_id                 IS 'FK to suppliers table; identifies the awarded contractor.';
COMMENT ON COLUMN contracts.borrower_contract_reference_number IS 'Reference code assigned by local borrowing agency; used for cross-dataset matching.';


-- =============================================================
-- TABLE: tender_contract_link
-- Explicit bridge table for verified cross-dataset linkages
-- between TED tenders and World Bank contract awards.
-- Only HIGH and MEDIUM confidence matches are stored.
-- Source: Deterministic linkage engine output.
-- =============================================================

CREATE TABLE tender_contract_link (
    link_id             UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id           UUID            NOT NULL
                            REFERENCES tenders(tender_id) ON DELETE RESTRICT,
    contract_id         UUID            NOT NULL
                            REFERENCES contracts(contract_id) ON DELETE RESTRICT,
    confidence_level    VARCHAR(10)     NOT NULL,   -- HIGH or MEDIUM
    match_method        VARCHAR(50)     NOT NULL,   -- EXACT_REFERENCE / NORMALIZED_REFERENCE / STEP_ID_SUBSTRING
    matched_reference   VARCHAR(255)    NOT NULL,   -- shared token that established the link
    created_at          TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_tender_contract_link UNIQUE (tender_id, contract_id)
);

COMMENT ON TABLE  tender_contract_link                  IS 'Bridge table for verified TED ↔ WB cross-dataset linkages. HIGH and MEDIUM confidence only.';
COMMENT ON COLUMN tender_contract_link.confidence_level IS 'Match certainty: HIGH (exact/normalized ref) or MEDIUM (STEP ID substring).';
COMMENT ON COLUMN tender_contract_link.match_method     IS 'Algorithm applied: EXACT_REFERENCE, NORMALIZED_REFERENCE, or STEP_ID_SUBSTRING.';
COMMENT ON COLUMN tender_contract_link.matched_reference IS 'The shared identifier token that established the link.';


-- =============================================================
-- TABLE: invoices
-- OCR-extracted invoice headers linked to contracts.
-- Forward-declared for the OCR pipeline module.
-- =============================================================

CREATE TABLE invoices (
    invoice_id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id           INTEGER,                                                    -- benchmark invoice record identifier (0-99)
    contract_id         UUID
                            REFERENCES contracts(contract_id) ON DELETE RESTRICT,   -- nullable until resolved
    supplier_id         VARCHAR(50)
                            REFERENCES suppliers(supplier_id) ON DELETE SET NULL,   -- nullable until resolved
    tender_id           UUID
                            REFERENCES tenders(tender_id) ON DELETE SET NULL,       -- nullable until resolved

    -- Invoice metadata (from OCR)
    invoice_number      VARCHAR(100),
    invoice_date        DATE,
    total_amount        NUMERIC(20, 2),
    currency            VARCHAR(10)         DEFAULT 'INR',

    -- OCR processing metadata
    ocr_confidence      NUMERIC(5, 4)
                            CHECK (ocr_confidence BETWEEN 0 AND 1),
    filename            VARCHAR(255)        NOT NULL,   -- path/name of scanned invoice file

    -- Metadata
    created_at          TIMESTAMPTZ         DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         DEFAULT NOW()
);

COMMENT ON TABLE  invoices                 IS 'OCR-extracted invoice headers. Forward-declared for OCR pipeline.';
COMMENT ON COLUMN invoices.record_id       IS 'Benchmark invoice record identifier from OCR evaluation dataset.';
COMMENT ON COLUMN invoices.filename        IS 'Filename of the scanned invoice PDF/image.';
COMMENT ON COLUMN invoices.ocr_confidence  IS 'OCR extraction confidence score between 0 and 1.';


-- =============================================================
-- TABLE: invoice_items
-- Line-item details extracted from invoice tables via OCR.
-- Forward-declared for the OCR pipeline module.
-- =============================================================

CREATE TABLE invoice_items (
    invoice_item_id     UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id          UUID            NOT NULL
                            REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    item_id             UUID
                            REFERENCES items(item_id) ON DELETE SET NULL,   -- nullable: matched to tender item
    line_number         INTEGER         NOT NULL,   -- sequential position on invoice
    description         TEXT            NOT NULL,   -- OCR-extracted item description
    quantity            NUMERIC(15, 3),             -- physical quantity billed
    unit_price          NUMERIC(20, 2),             -- billed unit rate
    line_total          NUMERIC(20, 2),             -- line total as extracted from invoice
    ocr_confidence      NUMERIC(5, 4)
                            CHECK (ocr_confidence BETWEEN 0 AND 1),
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE  invoice_items                 IS 'OCR-extracted invoice line items. Forward-declared for OCR pipeline.';
COMMENT ON COLUMN invoice_items.item_id         IS 'Nullable FK to tender items; populated when line-item matches a known procurement item.';
COMMENT ON COLUMN invoice_items.line_total      IS 'Line-item total as extracted from invoice.';
COMMENT ON COLUMN invoice_items.ocr_confidence  IS 'OCR extraction confidence for this specific line item.';


-- =============================================================
-- INDEXES
-- =============================================================

-- buyers
CREATE INDEX idx_buyers_name            ON buyers   (buyer_name);

-- tenders  (FK + frequent filter columns)
CREATE INDEX idx_tenders_buyer_id       ON tenders  (buyer_id);
CREATE INDEX idx_tenders_ocid           ON tenders  (ocid);
CREATE INDEX idx_tenders_source_id      ON tenders  (source_tender_id);
CREATE INDEX idx_tenders_ext_ref        ON tenders  (external_reference);  -- cross-dataset matching
CREATE INDEX idx_tenders_fiscal_year    ON tenders  (fiscal_year);
CREATE INDEX idx_tenders_proc_method    ON tenders  (procurement_method);
CREATE INDEX idx_tenders_date_published ON tenders  (date_published);
CREATE INDEX idx_tenders_num_tenderers  ON tenders  (number_of_tenderers);  -- anomaly detection

-- items
CREATE INDEX idx_items_tender_id        ON items    (tender_id);

-- tender_milestones
CREATE INDEX idx_milestones_tender_id   ON tender_milestones (tender_id);

-- suppliers
CREATE INDEX idx_suppliers_name         ON suppliers (supplier_name);
CREATE INDEX idx_suppliers_country      ON suppliers (country_code);

-- contracts
CREATE INDEX idx_contracts_wb_number        ON contracts (wb_contract_number);
CREATE INDEX idx_contracts_supplier_id      ON contracts (supplier_id);
CREATE INDEX idx_contracts_borrower_ref     ON contracts (borrower_contract_reference_number);
CREATE INDEX idx_contracts_project_id       ON contracts (project_id);

-- tender_contract_link
CREATE INDEX idx_tcl_tender_id          ON tender_contract_link (tender_id);
CREATE INDEX idx_tcl_contract_id        ON tender_contract_link (contract_id);

-- invoices
CREATE INDEX idx_invoices_contract_id   ON invoices (contract_id);
CREATE INDEX idx_invoices_supplier_id   ON invoices (supplier_id);
CREATE INDEX idx_invoices_tender_id     ON invoices (tender_id);

-- invoice_items
CREATE INDEX idx_inv_items_invoice_id   ON invoice_items (invoice_id);
CREATE INDEX idx_inv_items_item_id      ON invoice_items (item_id);


-- =============================================================
-- END OF SCHEMA
-- =============================================================
