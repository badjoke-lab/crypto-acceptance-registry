# Review Ops v0

## Generated review surface

The generated review surface is:
- `/generated-checks`
- `/api/generated-checks`

## Source file

Generated review queue source:
- `data/review-queue.json`

## Review focus

Each row should expose enough information to decide:
- approve current classification
- fix classification
- reject as unusable

## Current generated path

1. `classified-candidates.json`
2. `review-queue.json`
3. generated review surfaces

## Rule

The generated review surface is the preferred cutover target once real classified data exists.
