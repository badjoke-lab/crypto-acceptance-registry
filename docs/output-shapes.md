# Output Shapes v0

## normalized-candidates.json

Array of normalized candidate merchant records.

Required fields per row:
- legacy_id
- display_name
- country
- city
- website
- verification_status
- accepted_assets
- accepted_chains
- payment_methods
- payment_processors
- payment_notes
- social_links

## classified-candidates.json

Array of classified candidate merchant records.

Additional required fields per row:
- proposed_mode
- confidence
- review_reasons
- evidence_refs

## review-queue.json

Subset of classified candidates that require human review.

Minimum inclusion rules:
- confidence is not high
- or review_reasons is non-empty

## Product-facing list shape

Fields required for merchant list rendering:
- legacy_id
- display_name
- country
- city
- proposed_mode
- confidence
- verification_status
- accepted_assets
- accepted_chains

## Product-facing detail shape

Fields required for merchant detail rendering:
- all list fields
- website
- payment_methods
- payment_processors
- payment_notes
- social_links
- evidence_refs
- review_reasons
