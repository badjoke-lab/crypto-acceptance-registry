# Product Stats v0

## Purpose

`product-stats.json` is the product-facing aggregate derived from `product-merchants.json`.

## Required aggregates

- total merchant count
- mode breakdown
- confidence breakdown
- country breakdown
- processor breakdown

## Source

Built from:
- `data/product-merchants.json`

## Builder

Use:
- `scripts/product/build-stats.ts`

## Rule

Product-facing stats surfaces should prefer generated stats over ad-hoc recomputation once real product data is connected.
