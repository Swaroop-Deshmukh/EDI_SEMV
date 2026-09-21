# Procurement Graph Analytics

## Purpose

This module provides the Neo4j graph database and network-analysis
component of the AI Public Procurement Auditor project.

The graph models relationships between real processed procurement entities
and provides a foundation for procurement risk and network analysis.

## Current Real Graph

The current Neo4j graph is built from the processed procurement datasets.

```text
Buyer
  |
  | ISSUED
  v
Tender


Contract
  |
  | AWARDED_TO
  v
Supplier