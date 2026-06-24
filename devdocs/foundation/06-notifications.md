# Notifications — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/notifications` |
| **v2 target** | TBD (`expo-notifications`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

Local notifications drive daily practice/routine and recitation reminders, plus
plan-enrollment scheduling. Flutter uses `flutter_local_notifications` with timezone
scheduling and per-plan idempotency tracking. v2 must reproduce this with
`expo-notifications`, preserving the storage-key scheme so scheduling behavior matches.

## 2. Flutter reference map

| Element | Flutter source |
|---------|----------------|
| Settings screen | `features/notifications/presentation/notification_settings_screen.dart` |
| Settings model | `features/notifications/data/notification_settings_model.dart` |
| Provider | `features/notifications/presentation/providers/notification_provider.dart` |
| Core service | `features/notifications/data/services/notification_service.dart` |
| Routine scheduling | `features/notifications/data/services/routine_notification_service.dart` |
| Channels | `features/notifications/data/channels/notification_channels.dart` |
| Plan enrollment hooks | `features/notifications/application/plan_enrollment_hook.dart`, `special_plan_enrollment_hook.dart` |
| Bootstrap | `features/notifications/application/special_plan_bootstrap.dart`, `data/plan_notification_bootstrap.dart` |
| Nav on tap | `features/notifications/data/notification_nav.dart` |

## 3. Notification types

| Type | Trigger | Idempotency key (StorageKeys) |
|------|---------|-------------------------------|
| Routine/plan block reminder | Scheduled per routine time block | — |
| Recitation block reminder | Scheduled per recitation block | — |
| Special-plan per-day content | Day-based after enroll | `special_plan_started_at_<planId>`, `special_plan_day1_shown_<planId>_<date>` |
| General plan duration reminder | Day-based after enroll | `plan_started_at_<planId>`, `plan_total_days_<planId>`, `plan_immediate_shown_<planId>_<date>` |
| Daily reminder | Fixed daily time | `daily_reminder_time`, `daily_reminder_enabled` |

## 4. Settings (toggles)

From `StorageKeys`:

| Toggle | Key | Default |
|--------|-----|---------|
| Master notifications | `notification_master_enabled` | true |
| Routine (plan) notifications | `notification_routine_enabled` | true |
| Recitation notifications | `notification_recitation_enabled` | true |
| Daily reminder enabled | `daily_reminder_enabled` | — |
| Daily reminder time | `daily_reminder_time` | — |

Master off → cancel all scheduled notifications (without revoking OS permission);
re-enabling re-schedules from stored routine.

## 5. Functional requirements

- **FR-1:** Request OS notification permission at the right moment (Flutter does this in
  the home-screen flow after onboarding — see `features/home` FR-10 and §10 below).
- **FR-2:** Schedule routine + recitation reminders from the user's routine, using
  timezone-correct local scheduling.
- **FR-3:** Plan/special-plan day-based notifications with idempotency flags so a day's
  notification fires at most once (mirror the `*_shown_<planId>_<date>` scheme).
- **FR-4:** Settings screen with master + per-category toggles, persisted.
- **FR-5:** Master toggle cancels/reschedules without touching OS permission.
- **FR-6:** Tapping a notification deep-links to the relevant screen (Flutter
  `notification_nav.dart`).
- **FR-7:** Re-bootstrap scheduled notifications on app launch / enrollment changes.
- **FR-8:** Respect the `kSchedulePlanNotifications` feature flag equivalent.

## 6. Platform / Expo considerations

- Uses `expo-notifications` (local scheduling). **Requires a dev client build** (not
  Expo Go).
- Android notification channels must mirror Flutter `notification_channels.dart`.
- iOS: handle permission prompt + provisional auth as appropriate.
- Timezone handling: ensure scheduled times respect device timezone (Flutter uses the
  `timezone` package).

## 7. Home-screen permission flow (Flutter reference)

Triggered on first `HomeScreen` load (`home_screen.dart` →
`_requestNotificationPermissionsIfNeeded`). Cross-ref: `features/home` FR-10.

```
HomeScreen initState (post-frame callback)
  1. Capture ProviderContainer BEFORE any await
     (OS permission dialog may dispose widget; container survives)
  2. If notifications not enabled → requestPermission()
  3. _firePendingSpecialPlanDay1IfNeeded(container)
     → invalidate userPlansFutureProvider (fresh auth fetch)
     → notificationSyncEngine.sync(trigger: appLaunch)
  4. _navigateToPendingPlanIfNeeded()
     → consume pendingOnboardingPlanProvider
     → push /practice/details, switch tab to Practice
```

**v2 implementation note:** capture notification/plan state in a root-level store or
ref before showing the OS permission dialog — the Home component may unmount while the
dialog is open (same issue Flutter solves with `ProviderScope.containerOf`).

## 8. Acceptance criteria

- [ ] Permission requested and handled (grant/deny) on iOS + Android.
- [ ] Routine and recitation reminders fire at correct local times.
- [ ] Plan day notifications fire once per day (idempotency holds across restarts).
- [ ] Master + category toggles work and persist.
- [ ] Notification tap opens the correct screen.
- [ ] Re-launch reschedules without duplicates.
- [ ] Home load after onboarding triggers permission request + special-plan Day 1 sync
  (see §7).

## 9. Open questions

- Full per-day content payload structure for special plans (extract from
  `special_plan_notifications.dart`).
- Do we need background tasks, or is launch-time + enrollment-time rescheduling enough?
- Rich notifications (cover images) parity — required for v1?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Local scheduling | yes | no | needs `expo-notifications` |
| Routine reminders | yes | no | |
| Plan day notifications | yes | no | idempotency scheme to port |
| Settings toggles | yes | no | |
| Deep-link on tap | yes | no | |
| Permission on Home load | yes | no | see §7 + home FR-10 |
