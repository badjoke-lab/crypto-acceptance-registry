# Product Dataset v0

## Purpose

`product-merchants.json` is the product-facing dataset derived from classified candidates.

## Source chain

- legacy CPM DB export
- inbox JSON files
- normalized candidates
- classified candidates
- review queue
- product dataset

## Product dataset requirements

Each row should contain all fields needed by:
- registry list
- registry detail
- merchants API
- stats API

## Product dataset file

Current target path:
- `data/product-merchants.json`

## Rule

Product-facing routes should move from example data to `product-merchants.json` as soon as real classified output exists.
