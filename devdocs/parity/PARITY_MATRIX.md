# Parity Matrix

Single dashboard for migration progress. Update the status whenever a PRD or v2
implementation changes.

**Status legend:** `Not started` · `PRD draft` · `PRD approved` · `In progress` ·
`Parity` · `Improved` · `Won't migrate`

---

## Foundation

| Area | Flutter source | v2 target | PRD | Priority | Status |
|------|----------------|-----------|-----|----------|--------|
| App shell / navigation | `main_navigation_screen.dart`, `app_router.dart` | `src/app/(tabs)/_layout.tsx` | [00](../foundation/00-app-shell-navigation.md) | P0 | PRD draft |
| Auth / guest / onboarding | `features/auth`, `features/onboarding`, `route_guard.dart` | `src/providers/auth0.tsx`, `src/app/_layout.tsx`, `src/app/login.tsx` | [01](../foundation/01-auth-guest-onboarding.md) | P0 | PRD draft |
| API / networking | `core/network/*` (Dio + interceptors) | `src/hooks/*`, `src/lib/*` | [02](../foundation/02-api-networking.md) | P0 | PRD draft |
| Local storage / offline | `core/storage/*` | TBD | [03](../foundation/03-local-storage-offline.md) | P1 | PRD draft |
| i18n / theming | `core/l10n/*`, `core/theme/*` | `global.css`, fonts in `_layout.tsx` | [04](../foundation/04-i18n-theming.md) | P1 | PRD draft |
| Analytics | `core/analytics/*` | TBD | [05](../foundation/05-analytics.md) | P2 | PRD draft |
| Notifications | `features/notifications` | TBD (`expo-notifications`) | [06](../foundation/06-notifications.md) | P1 | PRD draft |
| Force update | `core/services/upgrade/force_update_gate.dart` | `src/components/ForceUpdateGate.tsx` | [07](../foundation/07-force-update.md) | P0 | In progress — env min-version gate; store API check TBD |

## Features

| Feature | Flutter routes | v2 route | PRD | Priority | Status |
|---------|----------------|----------|-----|----------|--------|
| Home | `/home` | `src/app/(tabs)/index.tsx` | [home](../features/home.md) | P0 | Parity — dashboard + theme polish; notification sync stub |
| Home — calendar | `/home/calendar` | `src/app/calendar/index.tsx` | [home](../features/home.md) | P0 | Parity — month grid + nav |
| Home — Mala shortcut | `/mala` | `src/app/mala/index.tsx` | [mala](../features/mala.md) | P0 | Improved — mockup UI + core parity |
| Home — Timer shortcut | `/home/timers` | `src/app/timers/index.tsx` + `timers/active.tsx` | [timer](../features/timer.md) | P0 | Parity — preset grid + active timer screen |
| Mala (screen) | `/mala` | `src/app/mala/index.tsx` | [mala](../features/mala.md) | P0 | Improved — settings, reset, bead arc |
| Timer (screen) | `/home/timers` | `src/app/timers/*` | [timer](../features/timer.md) | P0 | Parity — v2 route `/timers` |
| Series | `/home/series/:id` | `src/app/series/[id].tsx` | [series](../features/series.md) | P0 | In progress |
| Plans | `/home/plans/:tag`, `/plans/info`, `/plans/details` | TBD | [plans](../features/plans.md) | P0 | Not started |
| Recitation | `/recitations/detail` | `src/app/(tabs)/screens/recitation` | [recitation](../features/recitation.md) | P0 | In progress (partial) |
| Reader | `/reader/:textId` (+ versions/language) | TBD | [reader](../features/reader.md) | P1 | Not started |
| Practice | `/practice/*` | TBD | [practice](../features/practice.md) | P1 | Not started |
| Settings / Profile | `/settings`, `/profile`, `/about`, `/privacy-policy` | `src/app/(tabs)/screens/setting` | [settings-profile](../features/settings-profile.md) | P2 | In progress (partial) |
| Onboarding | `/onboarding` | TBD | [onboarding](../features/onboarding.md) | P0 | Not started |

## Home sections (detail)

Sub-components of the Home tab. See [home](../features/home.md) for full requirements.

| Section | Flutter widget | v2 status | Notes |
|---------|---------------|-----------|-------|
| Header + streak | `home_header.dart` | Parity | Greeting + streak badge + share sheet |
| Calendar card | `home_calendar_card.dart` | Parity | `MoonPhaseIcon` + full calendar screen |
| Verse of day | `verse_of_day_card.dart` | Parity | Skeleton + share on tap |
| Shortcuts (Mala/Timer) | `home_shortcuts_row.dart` | Parity | 4 tiles; Mala/Timer guest-gated |
| My practices stats | `my_practices_stats_card.dart` | Parity | Hidden when counts zero or guest |
| Featured plans | `featured_plan_section.dart` | Parity | `/series/featured` + random hero layout |
| Share prompt | `home_share_prompt.dart` | Parity | App share CTA |
| Series gate | `series_provider.dart` | Parity | Empty/error states localized |
| Notification on load | `home_screen.dart` init | In progress | Permission + Day-1 sync stub with idempotency keys |
| Post-onboarding plan nav | `pendingOnboardingPlanProvider` | Parity | Push plan detail then Practice tab |
| Pull-to-refresh | `_onRefresh()` | Parity | Invalidates all home queries |
| Per-section skeletons | verse/stats skeletons | Parity | Verse, stats, featured skeletons |

## Won't migrate (stalled)

Documented in [`stalled_features/`](../stalled_features/README.md) for Flutter reference
only — **no v2 implementation, no API endpoints in scope.**

| Feature | Flutter routes | PRD | Status |
|---------|----------------|-----|--------|
| Texts library | `/texts/*`, `/ai-mode` | [texts-library](../stalled_features/texts-library.md) | Won't migrate |
| AI search | `/ai-mode/search-results`, text-chapters | [ai-search](../stalled_features/ai-search.md) | Won't migrate |
| Story view | `/home/stories`, `*-presenter` | [story-view](../stalled_features/story-view.md) | Won't migrate |
| Meditation / Prayer of day | `/home/meditation_of_the_day`, `/home/prayer_of_the_day` | [meditation-prayer-of-day](../stalled_features/meditation-prayer-of-day.md) | Won't migrate |

## Modules not in v2 scope

| Module | Status |
|--------|--------|
| `connect`, `learn`, `explore`, `creator_info` | Won't migrate — no Flutter routes in main shell; no PRD |
