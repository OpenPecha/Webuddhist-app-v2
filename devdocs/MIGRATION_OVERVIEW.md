# WeBuddhist Migration — Program PRD (Flutter → React Native Expo)

| | |
|---|---|
| **Status** | PRD draft |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |
| **Flutter baseline** | `WeBuddhist-app` (`main`) |
| **v2 target** | `Webuddhist-app-v2` (`dev`) |

---

## 1. Why migrate

The product currently ships as a Flutter app (`WeBuddhist-app`) with ~19 feature
modules. v2 re-implements the app on **Expo SDK 56 / React Native 0.85** to:

- Consolidate on a single web+native skill set (TypeScript/React).
- Use Expo's managed build + OTA update pipeline (EAS).
- Reuse the existing backend (`https://api.webuddhist.com/api/v1/`) unchanged.

This is a **re-implementation for behavior parity**, not a redesign. UX changes must
be explicitly called out and signed off per-PRD.

## 2. Definition of "parity"

A feature is at **parity** when:

1. Same user-visible behavior and flows as Flutter (guest + authenticated).
2. Same backend API contracts (endpoints, params, request/response shapes).
3. Same local persistence semantics (what survives a restart, guest vs auth).
4. Verified on **both** iOS and Android.

Intentional deviations are allowed but must be documented in the feature PRD under
"UI/UX parity notes" and marked `Improved` in the parity matrix.

## 3. Success metrics

| Metric | Target |
|--------|--------|
| Feature parity (P0 features) | 100% |
| Feature parity (all migrated features) | ≥ 95% |
| Auth login success rate | ≥ Flutter baseline |
| Crash-free sessions | ≥ 99.5% |
| API contract regressions | 0 |

## 4. Non-goals

- Redesigning the visual language or information architecture (unless a PRD says so).
- Changing backend APIs or data models.
- Removing guest mode or multi-language (en / zh / bo) support.
- Migrating dead/experimental Flutter modules without product confirmation
  (see §8 "Modules to confirm").

## 5. Stack mapping (Flutter → v2)

| Concern | Flutter (`WeBuddhist-app`) | v2 (`Webuddhist-app-v2`) |
|---------|----------------------------|--------------------------|
| Language | Dart | TypeScript |
| UI | Flutter widgets | React Native + Uniwind |
| Navigation | GoRouter (`lib/core/config/router`) | Expo Router (file-based, `src/app`) |
| State / data | Riverpod providers | React Query + React context |
| HTTP | Dio + interceptors (`lib/core/network`) | `fetch` (today) → shared API client (target) |
| Auth | Auth0 + ID-token model (`lib/features/auth`) | `react-native-auth0` (`src/providers/auth0.tsx`) |
| Local storage | SharedPreferences + SecureStorage (`lib/core/storage`) | TBD: `expo-secure-store` + async storage / MMKV |
| i18n | ARB files (`lib/core/l10n`) | TBD i18n lib |
| Notifications | flutter_local_notifications (`lib/features/notifications`) | `expo-notifications` |
| Analytics | route observer (`lib/core/analytics`) | TBD |

## 6. Architecture conventions in v2

| Layer | Location |
|-------|----------|
| Routes (screens) | `src/app/**` (Expo Router) |
| Data fetching hooks | `src/hooks/**` (e.g. `useSeries.ts`) |
| UI components | `src/components/ui/{atoms,molecules}/**` |
| Providers | `src/providers/**` (auth0, query) |
| Shared libs/utils | `src/lib/**` (`image-url`, `utils`, `greeting`) |

## 7. Phasing

PRDs and implementation proceed in dependency order, not alphabetically.

### Wave 0 — Foundation (unblocks everything)
- `foundation/00-app-shell-navigation`
- `foundation/01-auth-guest-onboarding`
- `foundation/02-api-networking`
- `foundation/03-local-storage-offline`
- `foundation/04-i18n-theming`
- `foundation/07-force-update`

### Wave 1 — Core value (P0)
- `features/home` — full dashboard parity: header/streak, calendar, verse of day,
  shortcuts, my practices stats, featured plans, share prompt, notification on load
- `features/series`, `features/plans`, `features/recitation`

### Wave 2 — Reading & engagement (P1)
- `features/reader`, `features/practice`, `foundation/06-notifications`

### Wave 3 — Polish (P2)
- `features/settings-profile`, `foundation/05-analytics`

### Out of scope (`stalled_features/`)
- Texts library, AI search, story view, meditation/prayer of the day — **won't migrate**.
  See `stalled_features/README.md`. No related API endpoints in v2 networking docs.

## 8. Flutter feature inventory

From `WeBuddhist-app/lib/features/`:

| Flutter module | Migration PRD | Wave |
|----------------|---------------|------|
| `auth`, `onboarding` | `foundation/01-auth-guest-onboarding` | 0 |
| `app` (nav shell) | `foundation/00-app-shell-navigation` | 0 |
| `home` | `features/home` | 1 |
| `mala` | `features/mala` | 1 |
| `timer` | `features/timer` | 1 |
| `home` (series) | `features/series` | 1 |
| `plans` | `features/plans` | 1 |
| `recitation` | `features/recitation` | 1 |
| `reader` | `features/reader` | 2 |
| `practice` | `features/practice` | 2 |
| `notifications` | `foundation/06-notifications` | 2 |
| `more` | `features/settings-profile` | 3 |
| `texts` | `stalled_features/texts-library` | — won't migrate |
| `ai` | `stalled_features/ai-search` | — won't migrate |
| `story_view` | `stalled_features/story-view` | — won't migrate |
| `meditation_of_day`, `prayer_of_the_day` | `stalled_features/meditation-prayer-of-day` | — won't migrate |

**Not in v2 scope (full feature):** `connect` (stub tab in shell only), `learn`, `explore`, `creator_info`.

## 9. Known navigation/IA difference to resolve early

Flutter's main shell (`lib/features/home/presentation/screens/main_navigation_screen.dart`)
has tabs **Home · Practice · Me**. v2 today (`src/app/(tabs)/_layout.tsx`) has
**Home · Recitation · Setting**.

➡️ The shell PRD (`foundation/00-app-shell-navigation`) must decide: match Flutter's
tabs, or adopt the v2 IA intentionally. This blocks several feature PRDs and needs
product sign-off.

## 10. Risk register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auth0 ID-token model differs in Expo SDK | High | Foundation auth PRD; reuse Flutter auth docs |
| Reader feature complexity (versions, commentary, segment actions) | High | Split into sub-PRDs; schedule early even if built late |
| Local notification scheduling parity (plan/recitation reminders) | High | Dedicated notifications PRD; map `StorageKeys` notification keys |
| Story viewer native parity | — | Out of scope (`stalled_features/story-view`) |
| Multi-language (bo/zh) font + layout rendering | Medium | i18n/theming PRD; verify Tibetan script rendering |
| Offline/cache behavior (Dio cache interceptor) | Medium | Storage/offline PRD defines cache strategy |

## 11. How PRDs get written & tracked

1. Each feature PRD is created from `templates/FEATURE_PRD_TEMPLATE.md`.
2. Research pulls from Flutter `presentation/`, `data/`, `domain/`, and routes.
3. The feature's row in `parity/PARITY_MATRIX.md` is created/updated.
4. PRD reviewed by Flutter dev (behavior) + Expo dev (feasibility) + product (scope).
5. PRDs are living docs — updated when v2 implementation surfaces gaps.

## 12. References

- Flutter auth docs: `WeBuddhist-app/docs/architecture/AUTH_IMPLEMENTATION.md`,
  `TOKEN_REFRESH_FLOW.md`, `changelog/AUTH0_TOKEN_REFRESH_FIXES.md`,
  `architecture/GUEST_MODE_PERSISTENCE.md`.
- Flutter routes: `WeBuddhist-app/lib/core/config/router/{app_router.dart,app_routes.dart}`.
- Flutter storage keys: `WeBuddhist-app/lib/core/storage/storage_keys.dart`.
- v2 setup: `Webuddhist-app-v2/setup.md`.
