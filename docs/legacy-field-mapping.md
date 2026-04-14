# Legacy Field Mapping v0

## Purpose

Map legacy CPM fields into the normalized candidate model.

## places.json -> normalized candidate

- `id` -> `legacy_id`
- `name` -> `display_name`
- `country` -> `country`
- `city` -> `city`
- `website` -> `website`
- `about` -> candidate notes input
- `paymentNote` -> candidate notes input

## payment_accepts.json -> normalized candidate

Grouped by `place_id`.

- `asset` -> `accepted_assets`
- `chain` -> `accepted_chains`
- `method` -> `payment_methods`
- `processor` -> `payment_processors`
- `note` -> `payment_notes`

## socials.json -> normalized candidate

Grouped by `place_id`.

- `platform` -> `social_links[].platform`
- `url` -> `social_links[].url`
- `handle` -> `social_links[].handle`

## verifications.json -> normalized candidate

Grouped by `place_id`.

- `status` -> `verification_status`
- `last_checked` -> future review/evidence timing reference
- `last_verified` -> future review/evidence timing reference

## Notes

This mapping is intentionally narrow.
Only fields needed for the first classification pipeline are carried forward.
