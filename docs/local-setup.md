# Local Setup v0

## Required runtime

- Node.js
- TypeScript execution support
- PostgreSQL client dependency for direct legacy export

## Required dependencies

At minimum, the repo will need:
- `next`
- `react`
- `react-dom`
- `typescript`
- `tsx`
- `pg`

## Environment

Required for direct legacy DB export:
- `DATABASE_URL`

## Pipeline execution targets

- validate inbox
- normalize legacy inbox data
- classify candidates
- build review queue
- build product dataset

## Current note

The repository currently contains the code scaffolding for these steps.
Dependency installation and final script wiring can be completed after the product dataset path is fully switched over.
