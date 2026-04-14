# Cutover Checklist v0

Use this after real legacy CPM data has been generated.

## Data generation
- [ ] inbox files exist
- [ ] inbox validation passes
- [ ] normalized candidates generated
- [ ] classified candidates generated
- [ ] review queue generated
- [ ] product dataset generated
- [ ] product dataset validation passes
- [ ] product stats generated
- [ ] product stats validation passes
- [ ] cutover report generated

## Generated surfaces
- [ ] `/generated` renders
- [ ] `/generated/[id]` renders
- [ ] `/generated-stats` renders
- [ ] `/generated-checks` renders
- [ ] `/cutover` renders

## Generated APIs
- [ ] `/api/generated-merchants` returns merchants
- [ ] `/api/generated-merchants/[id]` returns a record or 404
- [ ] `/api/generated-stats` returns stats
- [ ] `/api/generated-checks` returns review queue

## Acceptance check
- [ ] merchant counts look plausible
- [ ] evidence coverage looks plausible
- [ ] confidence distribution looks plausible
- [ ] review queue size is operationally acceptable
