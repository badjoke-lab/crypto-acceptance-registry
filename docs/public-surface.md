# Public Surface v0

## Public-ready routes

Primary public-facing routes:
- `/public`
- `/public/[id]`
- `/public-stats`
- `/public-checks`
- `/public-cutover`

## Public-ready APIs

Primary public-facing APIs:
- `/api/public-merchants`
- `/api/public-merchants/[id]`
- `/api/public-stats`
- `/api/public-checks`
- `/api/public-cutover`

## Meaning

- `public` = ready baseline only
- `checks` = pending backlog only
- `cutover` = readiness snapshot for ready vs pending split

## Current data contract

- `public` routes are backed by `product-merchants.json`
- `public-stats` is backed by `product-stats.json`
- `public-checks` is backed by `review-queue.json`
- `public-cutover` is backed by `cutover-report.json`
