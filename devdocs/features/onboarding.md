# Onboarding — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/onboarding` |
| **v2 target** | TBD (`src/app/onboarding.tsx`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

First-run onboarding collects user preferences and (optionally) enrolls the user in a
starter plan, gated by per-user completion. It runs after first login and is skipped for
guests. Tightly coupled with auth (`foundation/01-auth-guest-onboarding`).

## 2. Flutter reference map

| Element | Flutter source | Route |
|---------|----------------|-------|
| Onboarding wrapper | `features/onboarding/presentation/screens/onboarding_wrapper.dart` | `/onboarding` |
| Datasource providers | `features/onboarding/presentation/providers/onboarding_datasource_providers.dart` | — |
| Repository | `onboardingRepositoryProvider` (used by route guard) | — |

Route guard logic (from `route_guard.dart` / `go_router.dart`): authenticated users with
incomplete onboarding are redirected to `/onboarding`; on completion → `/home`; guests
on `/onboarding` are sent to `/home`.

## 3. User stories

- As a **new authenticated user**, I complete onboarding once.
- As a **returning user**, I never see onboarding again.
- As a **guest**, I skip onboarding entirely.

## 4. Functional requirements

- **FR-1:** Multi-step onboarding flow collecting preferences (steps tracked via
  `onboarding_step`; data via `onboarding_data` / `onboarding_preferences`).
- **FR-2:** Per-user completion stored as `onboarding_completed_<userId>` (+ device
  fallback `onboarding_completed`).
- **FR-3:** Redirect rules enforced by the nav guard (see auth PRD §8).
- **FR-4:** Optional starter-plan enrollment on completion (Flutter sets
  `pendingOnboardingPlanProvider`, consumed by home).
- **FR-5:** Guests bypass onboarding.

## 5. State & persistence (map to StorageKeys)

| Data | Flutter key |
|------|-------------|
| Completion (per user) | `onboarding_completed_<userId>` |
| Completion (device) | `onboarding_completed` |
| Current step | `onboarding_step` |
| Collected data | `onboarding_data` |
| Preferences | `onboarding_preferences` |
| Current user id | `current_user_id` |

## 6. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| save onboarding preferences | POST/PUT | required | confirm from onboarding datasource |
| starter plan enroll | POST | required | reuse plan enroll |

## 7. Navigation

| Flutter route | v2 route (TBD) |
|---------------|----------------|
| `/onboarding` | `src/app/onboarding.tsx` |

## 8. Acceptance criteria

- [ ] New user sees onboarding once after first login.
- [ ] Completion persists per-user; not re-shown on relaunch.
- [ ] Guests never see onboarding.
- [ ] Mid-onboarding resume works from saved step.
- [ ] Starter-plan enrollment (if any) happens once and lands on home.

## 9. Open questions

- Exact onboarding steps + collected fields.
- Is starter-plan enrollment part of onboarding in v1?
- Server-side vs local-only preference storage.

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Onboarding flow | yes | no | |
| Per-user completion | yes | no | |
| Guest skip | yes | no | |
| Resume from step | yes | no | |
| Starter plan enroll | yes | no | |
