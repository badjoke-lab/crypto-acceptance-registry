# Legacy DB Export v0

## Goal

Export the minimum CPM datasets directly from the legacy database into JSON files accepted by `data/inbox/`.

## Required output files

- `places.json`
- `payment_accepts.json`
- `socials.json`
- `verifications.json`

## Export rule

The export should produce UTF-8 JSON arrays.
Each file should contain only the fields required by the legacy JSON contract.

## Recommended source tables

- `places`
- `payment_accepts`
- `socials`
- `verifications`

## Recommended destination

Write the exported JSON files into `data/inbox/` inside this repository.

## After export

Run, in order:
1. inbox validation
2. normalized candidate export
3. classification
4. review queue build
