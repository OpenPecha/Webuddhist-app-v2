# Analytics — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P2 |
| **Flutter baseline** | `lib/core/analytics/*` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Defines event and screen-view analytics parity. Flutter wires a route observer into
GoRouter (`analyticsServiceProvider.routeObserver`) to track navigation; v2 must
reproduce screen tracking and key events with the same analytics destination.

## 2. Flutter reference map

| Element | Flutter source |
|---------|----------------|
| Analytics providers | `core/analytics/analytics_providers.dart` |
| Route observer | injected into `app_router.dart` (`observers: [...routeObserver]`) |

## 3. Functional requirements

- **FR-1:** Track screen views on navigation (Expo Router screen change listener).
- **FR-2:** Reproduce the same named events Flutter emits (enumerate from
  `core/analytics`). Keep event names/properties identical for continuity.
- **FR-3:** Respect auth/guest distinction in user identification.
- **FR-4:** No PII beyond what Flutter already sends.

## 4. v2 approach (proposed)

- Use Expo Router's navigation state listener to emit `screen_view`.
- Wrap the analytics SDK behind a small `src/lib/analytics.ts` facade so event names
  are centralized.

## 5. Acceptance criteria

- [ ] Screen views fire on every navigation, matching Flutter route names.
- [ ] Event catalog matches Flutter (names + properties documented here).
- [ ] User identity attached for authenticated users; anonymous for guests.

## 6. Open questions

- Which analytics provider does Flutter use (Firebase / Amplitude / Segment)? Confirm
  from `core/analytics` and reuse the same destination.
- Full event catalog needs extraction from Flutter source.

## 7. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Screen tracking | yes | no | |
| Event tracking | yes | no | catalog TBD |
| Provider parity | yes | no | destination TBD |
