# Classification Pipeline v0

## Objective

Transform normalized legacy candidates into reviewable acceptance records.

## Pipeline stages

1. export
2. normalize
3. classify
4. score
5. review_queue
6. publishable_dataset

## Stage outputs

### export
Merged candidate fields from legacy sources.

### normalize
Clean field names, collapse duplicates inside a candidate, normalize text values.

### classify
Assign one of:
- direct
- processor
- bridge
- unknown

### score
Assign confidence:
- high
- medium
- low

### review_queue
Emit records that need human confirmation or correction.

### publishable_dataset
Emit records ready for product-facing use.

## Hard requirements

- deterministic re-runs
- stable candidate identity
- review reasons attached to non-high-confidence records
- no automatic trust of legacy records
