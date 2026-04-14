# Legacy JSON Contract v0

## Purpose

This contract defines the minimum JSON shapes accepted from legacy CPM exports.

## places.json

Array of place-like rows.

Minimum supported fields:
- id
- name
- country
- city
- website
- about
- paymentNote

## payment_accepts.json

Array of payment accept rows.

Minimum supported fields:
- place_id
- asset
- chain
- method
- processor
- note

## socials.json

Array of social rows.

Minimum supported fields:
- place_id
- platform
- url
- handle

## verifications.json

Array of verification rows.

Minimum supported fields:
- place_id
- status
- last_checked
- last_verified

## Import rule

Missing files are allowed during early testing, but the importer should treat them as empty arrays.
