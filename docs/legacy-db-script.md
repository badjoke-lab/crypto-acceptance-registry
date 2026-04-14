# Direct Legacy DB Export Script

## Script

Use:
- `scripts/export/from-legacy-db.ts`

## Purpose

This script connects directly to the legacy CPM database and writes the required inbox JSON files into:
- `data/inbox/places.json`
- `data/inbox/payment_accepts.json`
- `data/inbox/socials.json`
- `data/inbox/verifications.json`

## Requirement

Environment variable:
- `DATABASE_URL`

Dependency requirement:
- `pg`

## Result

After this script runs successfully, the inbox is ready for:
1. inbox validation
2. normalized candidate export
3. classification
4. review queue build
5. product dataset build
