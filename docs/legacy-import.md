# Legacy Import Boundary

## Source repository

Legacy source: CryptoPayMap v2

This repository is not the product source of truth.
It is only a candidate data source for migration and reclassification.

## Initial import targets

The first import pass should include only these datasets:

- places
- payment_accepts
- socials
- verifications

## Explicit exclusions for the first pass

Do not import these as first-class product records in phase 1:

- map UI state
- legacy stats cache
- legacy submissions as canonical merchant records
- public media galleries as evidence by default

## Migration principle

Every imported legacy record must become one of:

- classified merchant candidate
- review-required candidate
- rejected candidate

No legacy record should be treated as automatically trusted.

## Expected normalized output

The initial export should produce a normalized candidate dataset with:

- legacy_id
- display_name
- country
- city
- website
- accepted_assets
- payment_processor_fields
- social_links
- verification_status
- notes

## First-pass acceptance mode sources

The exporter should preserve fields useful for classification, especially:

- asset
- chain
- method
- processor
- note
- website
- social links
- verification status

## Review rule

Imported records are candidate inputs, not final published truth.
