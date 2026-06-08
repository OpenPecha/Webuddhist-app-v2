# Local Storage & Offline — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P1 |
| **Flutter baseline** | `lib/core/storage/*` |
| **v2 target** | TBD (`expo-secure-store` + async storage / MMKV) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Defines local persistence: what is stored, where (secure vs plain), and the migration
of Flutter's `StorageKeys` namespace to v2. Several features (auth, onboarding,
notifications, reader prefs, plan metadata) depend on stable persistence semantics.

## 2. Flutter reference map

| Element | Flutter source |
|---------|----------------|
| Key registry | `core/storage/storage_keys.dart` |
| Prefs service | `core/storage/preferences_service.dart`, `storage_service.dart` |
| Secure storage | `core/storage/secure_storage_impl.dart` |
| Plan metadata | `core/storage/plan_metadata_store.dart` |
| Special plan started-at | `core/storage/special_plan_started_at_store.dart` |

## 3. Storage classification (from `storage_keys.dart`)

**Secure storage** (`expo-secure-store` in v2):

| Key | Purpose |
|-----|---------|
| `access_token` | API access token |
| `refresh_token` | Token refresh |
| `id_token` | ID token (authorization) |
| `user_id` | User identifier |

**Plain key-value** (async storage / MMKV in v2):

| Category | Keys |
|----------|------|
| Auth/user | `user_data`, `is_guest_mode`, `current_user_id` |
| Onboarding | `onboarding_completed`, `onboarding_completed_<userId>`, `onboarding_preferences`, `onboarding_step`, `onboarding_data` |
| Preferences | `theme_mode`, `locale`, `font_size`, `first_launch` |
| Notifications | `daily_reminder_time`, `daily_reminder_enabled`, `notification_master_enabled`, `notification_routine_enabled`, `notification_recitation_enabled` |
| Special plans | `special_plan_started_at_<planId>`, `special_plan_day1_shown_<planId>_<date>` |
| General plans | `plan_started_at_<planId>`, `plan_total_days_<planId>`, `plan_immediate_shown_<planId>_<date>` |
| Reader | `reader_secondary_enabled` |
| Business | `profile_data`, `last_profile_update`, `streak_count` |
| Cache meta | `last_sync_time`, `cache_version` |

## 4. Functional requirements

- **FR-1:** Mirror Flutter's key registry as a single v2 module (one source of truth
  for keys), preserving exact key strings where cross-app continuity matters.
- **FR-2:** Tokens and user id stored in `expo-secure-store`; everything else in plain
  KV store. Choose one KV lib (recommend MMKV for sync reads or AsyncStorage for
  simplicity) and document it.
- **FR-3:** Per-user onboarding keys use the same `onboarding_completed_<userId>`
  scheme.
- **FR-4:** Plan notification metadata (started-at, total-days, idempotency flags)
  persists with the same prefix scheme so notification scheduling matches Flutter.
- **FR-5:** Define cache/offline behavior: which data is available offline and how
  React Query persistence (if any) interacts with KV storage.

## 5. Offline expectations

Flutter has a GET cache interceptor + connectivity service. Decide for v2:

- **Minimum:** show cached React Query data + an offline banner when disconnected.
- **Stretch:** persist React Query cache to disk for cold-start offline reads.

## 6. Acceptance criteria

- [ ] Secure values never written to plain storage.
- [ ] Key names documented and centralized.
- [ ] Onboarding/plan/notification keys follow Flutter's scheme.
- [ ] Offline behavior defined and implemented to at least the "minimum" bar.

## 7. Open questions

- KV library choice: MMKV vs AsyncStorage?
- Do we need to migrate any existing on-device data, or is v2 a fresh install only?
- Persistent React Query cache in scope for v1?

## 8. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Secure token storage | yes | no | needs `expo-secure-store` |
| KV preferences | yes | no | lib not chosen |
| Key registry | yes | no | |
| Offline/cache | yes | partial | React Query in-memory only |
