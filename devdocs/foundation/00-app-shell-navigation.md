# App Shell & Navigation — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/app`, `lib/features/home/presentation/screens/main_navigation_screen.dart`, `lib/core/config/router` |
| **v2 target** | `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Defines the app's navigation skeleton: the root stack, the bottom tab bar, route
naming, deep-link structure, and how the screens hang off them. Everything else
plugs into this shell, so it ships first.

**Import paths:** Use `@/…` imports rooted at `src/` (e.g. `@/components/settings/Foo`,
`@/hooks/useContentLanguage`). Configured in `tsconfig.json` as `@/*` → `./src/*`.

## 2. Flutter reference map

| Element | Flutter source | Notes |
|---------|----------------|-------|
| Root router | `lib/core/config/router/app_router.dart` | GoRouter, `initialLocation: /home` |
| Route constants | `lib/core/config/router/app_routes.dart` | 40+ route paths |
| Route guard | `lib/core/config/router/route_guard.dart` | auth/guest/onboarding redirects |
| Tab shell | `features/home/presentation/screens/main_navigation_screen.dart` | tabs: Home · Practice · Me |
| Bottom bar | `shared/widgets/appBottomNavBar/app_bottom_nav_bar.dart` | |

> Note: a second/legacy router exists at `lib/core/config/router/go_router.dart`.
> `app_router.dart` is the authoritative one (uses `RouteGuard`). Confirm the legacy
> file is dead before relying on it.

## 3. Tab structure decision (BLOCKER)

| | Flutter | v2 today |
|--|---------|----------|
| Tabs | Home · Practice · Me | Home · Recitation · Setting |

**Decision required from product** before dependent feature PRDs (practice, recitation,
settings) are finalized:

- **Option A** — match Flutter: Home · Practice · Me (Me = settings/profile).
- **Option B** — keep v2 IA: Home · Recitation · Setting.
- **Option C** — superset: Home · Practice · Recitation · Me.

Record the decision here once made. All tab-level feature PRDs reference this.

## 4. Functional requirements

- **FR-1:** Root navigator renders a stack with `login`, the tab group, and
  full-screen routes (series detail, reader) outside the tabs. Story presenter is out of
  scope (`stalled_features/story-view`).
- **FR-2:** Bottom tab bar matches the approved tab structure (§3), with icons +
  labels, and preserves per-tab navigation state.
- **FR-3:** Unknown routes fall back to the main navigation screen (Flutter
  `errorBuilder` → `MainNavigationScreen`). v2: a `+not-found` route redirecting home.
- **FR-4:** Deep links resolve to the correct route, including parameterized routes
  (`series/:id`, `reader/:textId`, `plan-text/:subtaskId`).
- **FR-5:** Auth/guest/onboarding redirects are enforced at the navigation layer
  (see `foundation/01-auth-guest-onboarding`).

## 5. Route map (Flutter → Expo Router)

| Flutter route | v2 file route | Type |
|---------------|---------------|------|
| `/login` | `src/app/login.tsx` | stack |
| `/onboarding` | `src/app/onboarding.tsx` (TBD) | stack |
| `/home` | `src/app/(tabs)/index.tsx` | tab |
| `/practice` | `src/app/(tabs)/practice/...` (TBD, pending §3) | tab |
| `/settings` (Me) | `src/app/(tabs)/screens/setting/index.tsx` | tab |
| `/recitations/detail` | `src/app/(tabs)/screens/recitation/...` | tab/stack |
| `/home/series/:id` | `src/app/series/[id].tsx` | stack (full screen) |
| `/reader/:textId` | `src/app/reader/[textId].tsx` (TBD) | stack (full screen) |
| `/reader/:textId/versions` | `src/app/reader/[textId]/versions.tsx` (TBD) | stack |
| `/reader/:textId/versions/language` | `.../versions/language.tsx` (TBD) | stack |
| `/plan-text/:subtaskId` | `src/app/plan-text/[subtaskId].tsx` (TBD) | stack |
| `/home/stories`, `*-presenter` | — | Won't migrate (`stalled_features/story-view`) |
| `/ai-mode`, `/texts/*` | — | Won't migrate (`stalled_features/`) |
| `/about`, `/privacy-policy`, `/profile` | `src/app/settings/...` (TBD) | stack |

Full Flutter route list: `lib/core/config/router/app_routes.dart`.

## 6. Navigation patterns to preserve

- **`extra` payloads:** Flutter passes objects via GoRouter `extra` (e.g. a `Series`
  to series detail to avoid refetch). In Expo Router, params are string-serializable —
  pass IDs and refetch via React Query, or pass JSON via params. Document per-screen.
- **Custom transitions:** Flutter uses directional transitions for plan navigation
  (`buildPlanNavigationTransition`) and fade/slide for creator info. v2 should map these
  to Expo Router `Stack.Screen` animation options (parity is "nice to have", not P0).
- **Nested routes:** practice and reader have nested sub-routes; mirror with nested
  folders in `src/app`.

## 7. Acceptance criteria

- [ ] Approved tab structure (§3) implemented in `(tabs)/_layout.tsx`.
- [ ] All P0 routes from §5 resolve and render placeholder or real screens.
- [ ] Deep link to `series/[id]` opens the correct series.
- [ ] Unknown route redirects to home without crashing.
- [ ] Tab state preserved when switching tabs.
- [ ] Works on iOS and Android.

## 8. Open questions

- Resolve §3 tab structure.
- Is `go_router.dart` dead code, or still referenced anywhere?
- Which routes should be modals vs full-screen pushes in v2?

## 9. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Tab shell | yes | partial | v2 has 3 tabs, structure unconfirmed |
| Root stack | yes | partial | `_layout.tsx` has login/(tabs)/series |
| Route guard | yes | partial | login-only gate today |
| Deep links | yes | unknown | needs audit |
