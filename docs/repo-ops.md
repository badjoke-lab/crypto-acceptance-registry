# Repo Ops v0

## Hidden-file note

The current GitHub connector path is not reliably writing hidden dot-path files in this repository.
Until that is resolved, the repository stores copy-ready equivalents here:

- `config/gitignore.sample` -> copy to `.gitignore`
- `config/ci.workflow.yml` -> copy to `.github/workflows/ci.yml`

## Recommended immediate copy targets

1. `config/gitignore.sample` -> `.gitignore`
2. `config/ci.workflow.yml` -> `.github/workflows/ci.yml`

## Current generated-data-first path

The generated-data-first product path is:
- `/generated`
- `/generated/[id]`
- `/generated-stats`
- `/api/generated-merchants`
- `/api/generated-merchants/[id]`
- `/api/generated-stats`

## Current pipeline sequence

1. `scripts/export/from-legacy-db.ts`
2. `scripts/export/validate-inbox.ts`
3. `scripts/export/from-inbox-json.ts`
4. `scripts/classify/run.ts`
5. `scripts/review/build-review-queue.ts`
6. `scripts/product/build-product-dataset.ts`
7. `scripts/product/validate-product-dataset.ts`
8. `scripts/product/build-stats.ts`
9. `scripts/product/validate-product-stats.ts`
