# Research — Series, Plans & Connect

Research artifacts produced 2026-06-22. **Documentation only** — no v2 implementation in this phase.

## Documents

| File | Description |
|------|-------------|
| [flutter-series-plans-connect-routes.md](./flutter-series-plans-connect-routes.md) | Flutter route table, enrollment flows, plan screen variants, legacy paths |
| [mockup-screen-index.md](./mockup-screen-index.md) | Frame-by-frame mockup specs (series_page, plan_design_revamp, Missed_days_flow, community) |
| [api-to-screen-matrix.md](./api-to-screen-matrix.md) | Backend endpoints mapped to screens; v2 api-config correction |
| [series-plans-connect-gap-matrix.md](./series-plans-connect-gap-matrix.md) | Mockup vs Flutter vs v2 gaps with priorities |
| [open-questions.md](./open-questions.md) | **API-resolved** product decisions (all items closed) |

## Updated PRDs

PRDs synced 2026-06-22 for dual plan routes, SERIES routine session, and Shorts P2.

| PRD | Changes |
|-----|---------|
| [features/series.md](../features/series.md) | Mockup redesign, §6a SERIES routine, navigation, open questions resolved |
| [features/plans.md](../features/plans.md) | Dual-route navigation §8, mockup specs, scope tiers |
| [features/connect.md](../features/connect.md) | Connect tab + group profile (P1 API-complete) |
| [features/practice.md](../features/practice.md) | v2 current state, edit-routine, plan track cross-links |

## Mockup sources

Shared design images (chat attachments):

- `series_page` — series detail, about, enrolled states, community profile
- `plan_design_revamp` — plan track, reader bar, Shorts (maps to `PlanDayDTO.videos[]`)
- `Missed_days_flow` — day locking and completion progression

## Recommended implementation order (future phase)

1. P0: Series enroll + `/plans/[id]` preview + fix plan row navigation
2. P1: Plan track UX (carousel, completion, Practice Now)
3. P1: Connect discover + group profile
4. P2: Reader/plan-text, day videos strip (mockup Shorts)
5. P2: Series info route, series unenroll

See gap matrix for full backlog.
