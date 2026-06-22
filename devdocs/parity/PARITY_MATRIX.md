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
| Force update | `core/services/upgrade/force_update_gate.dart` | `src/app/_layout.tsx` (TBD) | [07](../foundation/07-force-update.md) | P0 | Not started |

## Features

| Feature | Flutter routes | v2 route | PRD | Priority | Status |
|---------|----------------|----------|-----|----------|--------|
| Home | `/home` | `src/app/(tabs)/index.tsx` | [home](../features/home.md) | P0 | In progress (partial) — series browse partial; dashboard widgets not started |
| Home — calendar | `/home/calendar` | TBD | [home](../features/home.md) | P0 | Not started |
| Home — Mala shortcut | `/mala` | TBD | [home](../features/home.md) | P0 | Not started |
| Home — Timer shortcut | `/home/timers` | TBD | [home](../features/home.md) | P0 | Not started |
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
| Header + streak | `home_header.dart` | Partial | Greeting only; no streak badge |
| Calendar card | `home_calendar_card.dart` | Not started | Deprecated `Calander.tsx` unused |
| Verse of day | `verse_of_day_card.dart` | Not started | Deprecated `quotation.tsx` unused |
| Shortcuts (Mala/Timer) | `home_shortcuts_row.dart` | Not started | Guest gate required |
| My practices stats | `my_practices_stats_card.dart` | Not started | Auth required |
| Featured plans | `featured_plan_section.dart` | Partial | Wrong endpoint; no random hero |
| Share prompt | `home_share_prompt.dart` | Not started | |
| Series gate | `series_provider.dart` | Partial | Loads; no global empty state |
| Notification on load | `home_screen.dart` init | Not started | Cross-ref notifications PRD |
| Post-onboarding plan nav | `pendingOnboardingPlanProvider` | Not started | Cross-ref onboarding PRD |
| Pull-to-refresh | `_onRefresh()` | Partial | Refetches series only today |
| Per-section skeletons | verse/stats skeletons | Not started | Spinner only today |

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
