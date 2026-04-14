# Data Model v0

## Core entity: merchant_record

A merchant record represents a merchant or place-level acceptance claim.

### Required fields
- id
- name
- country
- acceptance_mode
- confidence
- last_checked_at
- status

### Recommended fields
- city
- region
- website
- assets
- chains
- processor_name
- bridge_name
- payment_notes
- source_type

## Acceptance mode semantics

### direct
The merchant appears to accept crypto directly, including direct wallet, QR, invoice, or on-site direct payment flow.

### processor
The merchant appears to accept crypto through a payment processor or merchant-facing crypto checkout provider.

### bridge
The merchant appears reachable through an indirect bridge such as card, wallet conversion, cash-equivalent conversion, or similar path.

### unknown
The current evidence is insufficient to determine the acceptance pathway.

## Evidence model

Each merchant record can have one or more evidence items.

Evidence item fields:
- evidence_id
- merchant_id
- url_or_source
- evidence_type
- snippet
- captured_at
- reliability

## Review model

Review queue item fields:
- merchant_id
- proposed_mode
- current_mode
- confidence
- review_reason
- decision
- reviewed_at
