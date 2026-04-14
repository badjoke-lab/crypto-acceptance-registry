# Runbook v0

## Goal

Turn legacy CPM exports into a reviewable classified dataset.

## Required input files

Place these files into `data/inbox/`:
- `places.json`
- `payment_accepts.json`
- `socials.json`
- `verifications.json`

## Execution order

1. export normalized candidates
2. classify normalized candidates
3. build review queue
4. inspect outputs
5. connect outputs to product-facing pages

## Expected output files

Generated under `data/`:
- `normalized-candidates.json`
- `classified-candidates.json`
- `review-queue.json`

## Current script entry points

- `scripts/export/from-inbox-json.ts`
- `scripts/classify/run.ts`
- `scripts/review/build-review-queue.ts`

## Early testing rule

Missing inbox files are allowed during early setup. They are treated as empty arrays.

## Publish rule

Do not treat `normalized-candidates.json` as product-facing truth.
Only `classified-candidates.json` plus review handling can feed product-facing records.
