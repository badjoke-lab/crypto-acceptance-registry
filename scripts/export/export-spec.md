# Legacy Export Spec v0

## Goal

Produce a normalized candidate dataset from the legacy CPM data source.

## Required source groups

1. places
2. payment_accepts
3. socials
4. verifications

## Required merged candidate fields

- legacy_id
- name
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

## Output requirements

- deterministic field naming
- UTF-8 text output
- stable row identity by legacy_id
- downstream-friendly shape for classification

## Non-goals

- direct publish output
- confidence assignment
- evidence scoring
- final classification
