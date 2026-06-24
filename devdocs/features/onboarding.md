# Onboarding — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/onboarding` |
| **v2 target** | TBD (`src/app/onboarding.tsx`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

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
  `pendingOnboardingPlanProvider`, consumed by Home on first load — see §10).
- **FR-5:** Guests bypass onboarding.
- **FR-6:** After onboarding completes, user lands on Home; Home then runs the
  notification permission flow and, if a pending plan exists, navigates to Practice tab +
  plan detail (not just "stay on Home").

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
- [ ] Starter-plan enrollment (if any) happens once; Home permission flow runs; user
  opens enrolled plan on Practice tab (see §10).

## 9. Open questions

- Exact onboarding steps + collected fields.
- Is starter-plan enrollment part of onboarding in v1?
- Server-side vs local-only preference storage.

## 10. Home consumption of pending plan (Flutter reference)

When onboarding enrolls a starter plan, Flutter stores it in
`pendingOnboardingPlanProvider`. Home consumes it on first load **after** the
notification permission flow:

```
_onboarding complete → navigate to /home
HomeScreen._requestNotificationPermissionsIfNeeded()
  → permission request + special-plan Day 1 sync
  → _navigateToPendingPlanIfNeeded()
      1. Read pendingOnboardingPlanProvider; clear immediately
      2. context.push('/practice/details', extra: { plan, selectedDay, startDate })
      3. Switch mainNavigationIndexProvider to Practice tab
```

**Why order matters:** push plan detail **before** switching tabs — switching first
unmounts HomeScreen and the push becomes a no-op.

Cross-ref: `features/home` FR-10, `foundation/06-notifications` §7.

## 11. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Onboarding flow | yes | no | |
| Per-user completion | yes | no | |
| Guest skip | yes | no | |
| Resume from step | yes | no | |
| Pending plan → Practice nav | yes | no | consumed on Home load |
