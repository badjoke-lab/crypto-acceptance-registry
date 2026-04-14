# Product Definition

## Core value

This product exists to answer one question:

**How does a merchant actually accept crypto right now?**

The registry must show merchant-level acceptance truth with explicit classification and evidence.

## Scope

The product tracks merchant acceptance records and related acceptance pathways.

Primary record types for the first build:
- merchant/place
- acceptance evidence
- classification metadata

## Non-goals for the first build

- broad world-map-first browsing
- speculative listings without evidence
- processor/card marketing directory without merchant linkage

## Required fields per merchant record

- display name
- country
- city or region when available
- acceptance mode
- supported assets/chains when known
- evidence references
- last_checked_at
- confidence
- status

## Initial acceptance modes

- direct
- processor
- bridge
- unknown
