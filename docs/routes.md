# Route Responsibilities v0

## Product-facing routes

### /
Temporary landing page.

### /registry
Searchable merchant record list.

### /registry/[id]
Merchant detail page with classification, confidence, payment context, evidence, and review reasons.

### /stats
Minimal registry stats.

### /checks
Human-check-focused surface for records that require confirmation or correction.

## API routes

### /api/merchants
Returns merchant records.

### /api/merchants/[id]
Returns a single merchant record or 404.

### /api/stats
Returns minimal registry stats.

## Migration note

These routes are v0 scaffolding and may be renamed later.
The route responsibilities are more important than the temporary path names.
