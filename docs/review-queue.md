# Review Queue v0

## Purpose

The review queue exists to limit manual work to records that cannot be safely auto-promoted.

## Required review fields

- legacy_id
- display_name
- proposed_mode
- confidence
- current_status
- review_reason
- supporting_fields
- evidence_refs

## Allowed review decisions

- approve
- fix
- reject

## Review expectations

Reviewers should not need to read the full original source by default.
The queue should surface extracted fields, evidence references, and the reason the record needs review.

## Minimum reasons for queueing

- conflicting indicators
- missing evidence
- low confidence
- bridge vs processor ambiguity
- unsupported asset/chain structure
