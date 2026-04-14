# Real Data Cutover v0

## Goal

Replace placeholder example data with generated product data from the legacy CPM pipeline.

## Cutover inputs

Required generated files:
- `data/product-merchants.json`
- `data/product-stats.json`

## Cutover sequence

1. export from legacy CPM DB
2. validate inbox
3. build normalized candidates
4. classify candidates
5. build review queue
6. build product dataset
7. validate product dataset
8. build product stats
9. validate product stats
10. switch product-facing readers to generated product files

## Required checks before switch

- product dataset validation passes
- product stats validation passes
- list page renders
- detail page renders
- stats page renders
- API responses return expected fields

## Rule

Do not switch product-facing readers before generated product files exist and pass validation.
