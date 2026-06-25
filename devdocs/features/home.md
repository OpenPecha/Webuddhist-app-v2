# Home — Migration PRD

| | |
|---|---|
| **Status** | Improved (Home1.12 redesign; notification sync stub partial) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/home` |
| **v2 target** | `src/app/(tabs)/index.tsx` + `src/components/home/*` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 (Home1.12 revamp) |

---

## 1. Summary

The home tab is the app's landing screen. In Flutter it is a scrollable **practice
dashboard** gated by the series list API. When series data is available, the screen
shows (top to bottom):

1. **Header** — personalized greeting + calendar icon + streak badge
2. **Verse of the day** hero card (image + quote + share)
3. **Shortcuts row** — Plans, Chants, Mala, Timer (Mala/Timer guest-gated)
4. **My practices stats** card (conditional on routine counts)
5. **Events** section (when `GET /events/today` returns data)
6. **Featured plans** section
7. **Share prompt** at the bottom

**Home1.12 redesign (v2 target):** Calendar moves from scroll body to header icon
(tap → `/calendar`). Events section and Connect tab stub added per product design;
see §3 and shell PRD for Connect placeholder scope.

On first load after onboarding, Home also requests notification permission, fires
special-plan Day 1 notification sync, and consumes any pending onboarding plan
(enrolling user navigates to Practice tab + plan detail).

The scroll body is hidden until `GET /series` succeeds. Empty series list shows a
localized empty state; failure shows retry.

**Not on current Flutter Home** (do not require for parity): "Home" title, tag-based
search bar (SearchAnchor legacy removed), meditation/prayer/stories routes (see
`stalled_features/`), standalone plan cards on home.

**App update UX:** Flutter removed the soft home update banner. Updates are handled
app-wide by a blocking force-update modal (see `foundation/07-force-update`).

---

## 2. Flutter reference map

| Screen / element | Flutter source | Provider / API |
|------------------|----------------|----------------|
| Home screen | `presentation/screens/home_screen.dart` | — |
| Home header | `presentation/widgets/home_header.dart` | `streakFutureProvider` → `GET /users/me/streak` |
| Calendar card | `presentation/widgets/home_calendar_card.dart` | `todayCalendarDayProvider` → `GET /calendar/today` |
| Verse of day | `presentation/widgets/verse_of_day_card.dart` | `verseOfDayFutureProvider` → `GET /verse-of-day/today` |
| Shortcuts row | `presentation/widgets/home_shortcuts_row.dart` | — |
| My practices stats | `presentation/widgets/my_practices_stats_card.dart` | `routineInfoFutureProvider` → `GET /users/me/routine/info` |
| Featured plans | `presentation/widgets/featured_plan_section.dart` | `featuredSeriesFutureProvider` → `GET /series/featured?limit=10` |
| Share prompt | `presentation/widgets/home_share_prompt.dart` | `appShareServiceProvider` |
| Series gate | `presentation/providers/series_provider.dart` | `seriesListFutureProvider` → `GET /series?language=` |
| Tab shell | `presentation/screens/main_navigation_screen.dart` | Home is tab 0 |
| Route | `/home` | — |

**On-load side effects** (`home_screen.dart`):

1. Request notification permission (if not already granted)
2. Fire pending special-plan Day 1 notifications via `notificationSyncEngine.sync(appLaunch)`
3. Consume `pendingOnboardingPlanProvider` → push plan detail on Practice tab

**Pull-to-refresh** invalidates: series list, featured series, verse of day, routine
info, streak.

**Shortcuts note:** `HomeShortcutsRow` defines Plans and Chants callbacks but they are
**not wired** in `home_screen.dart`. Only Mala and Timer are implemented.

---

## 3. v2 current state

`src/app/(tabs)/index.tsx` implements the **Home1.12 dashboard layout** (header through
share prompt). See §11 checklist for per-requirement status.

| Flutter section | v2 status | Notes |
|-----------------|-------------|-------|
| Header + streak | Done | Greeting + calendar icon + streak badge + share sheet |
| Calendar card | Improved | Removed from scroll; header icon → calendar screen |
| Verse of day | Done | Hero card; skeleton + share on tap |
| Shortcuts (Mala/Timer) | Done | Plans/Chants → coming-soon toast; Mala/Timer guest-gated |
| My practices stats | Done | Hidden when counts zero or guest |
| Events | Done | `GET /events/today`; hidden when empty/error |
| Featured plans | Done | `/series/featured` + random hero layout |
| Share prompt | Done | App share CTA |
| Series gate | Done | Localized empty/error + retry |
| Pull-to-refresh | Done | Invalidates series, featured, verse, routine info, streak |
| Loading/error/empty | Done | Per-section skeletons (verse, stats, featured) |
| Notification on load | Partial | Permission + Day-1 sync stub |
| Post-onboarding plan nav | Done | Push plan detail then Practice tab |
| Force update | Done | `ForceUpdateGate` in `_layout.tsx` |

**Pull-to-refresh:** does not invalidate mala data — Home shows no mala counts (Flutter
Me tab owns accumulation stats; see `features/mala`).

**Shortcuts:** four tiles (Plans, Chants, Mala, Timer). Plans and Chants show a coming-soon toast (not wired in Flutter either). Mala/Timer guest-gated.

**Deprecated (abandoned molecule layout — do not implement):**

- `src/components/home/Calander.tsx`
- `src/components/home/Challenge.tsx`
- `src/components/home/Recitation.tsx`
- `src/components/ui/quotation.tsx`
- `src/utils/greeting.ts` (random greetings; Flutter uses static greeting prefix)

---

## 4. User stories

- As any user, I see a personalized greeting on the home tab.
- As an authenticated user, I see my streak count and can share it.
- As any user, I see today's Tibetan calendar date and can open the full calendar.
- As any user, I see today's verse and can share it.
- As an authenticated user, I can open Mala or Timer from shortcuts; as a guest I am
  prompted to sign in.
- As an authenticated user with active practices, I see my plan/recitation counts and
  can jump to the Practice tab.
- As any user, I can browse featured plans and tap one to open series detail.
- As any user, I can share the app from the bottom share prompt.
- As a new user after onboarding, Home requests notification permission and opens my
  enrolled starter plan on the Practice tab.
- As any user, I can pull-to-refresh to reload all home data.

---

## 5. Functional requirements

All requirements below are **P0** (full Flutter parity).

- **FR-1:** Header — personalized greeting (guest vs authenticated) + streak badge from
  `GET /users/me/streak`; tap streak → streak share sheet.
- **FR-2:** Calendar card — today's Tibetan date from `GET /calendar/today`; tap →
  calendar screen.
- **FR-3:** Verse of day card from `GET /verse-of-day/today`; skeleton while loading;
  hidden on error; share on tap.
- **FR-4:** Shortcuts row — Mala → `/mala` ([mala](./mala.md)), Timer → `/timers`
  ([timer](./timer.md)); guests see login drawer instead of navigating. Home owns only
  the shortcut row; screen internals live in dedicated PRDs.
- **FR-5:** My practices stats from `GET /users/me/routine/info`; hidden when
  `seriesCount` and `recitationCount` are both 0 or user is guest; tap → Practice tab.
- **FR-6:** Featured plans from `GET /series/featured?language=&limit=10`; random hero
  selection; layout adapts when user has practice stats; tap → `series/[id]`.
- **FR-7:** Share prompt at scroll bottom (share app CTA).
- **FR-8:** Series list gate — body hidden until `GET /series` succeeds; empty →
  localized empty state; error → retry widget.
- **FR-9:** Pull-to-refresh invalidates all home data (series, featured, verse,
  routine info, streak).
- **FR-10:** On first Home load after onboarding: request notification permission,
  fire special-plan Day 1 sync (`notificationSyncEngine.sync(appLaunch)`), consume
  pending onboarding plan → Practice tab + plan detail (see `features/onboarding` and
  `foundation/06-notifications`).
- **FR-11:** Per-section loading skeletons (verse, stats, featured) — not full-screen
  spinner only.
- **FR-12:** Force-update gate app-wide (not a home banner) — see
  `foundation/07-force-update`.

---

## 6. API contracts

| Endpoint | Method | Auth | Used by |
|----------|--------|------|---------|
| `/series?language=&skip=&limit=` | GET | guest ok | Series gate (body visibility) |
| `/series/featured?language=&limit=10` | GET | guest ok | Featured plans section |
| `/verse-of-day/today?lang=` | GET | guest ok | Verse of day card |
| `/calendar/today` | GET | guest ok | Calendar card |
| `/users/me/streak` | GET | required | Header streak badge |
| `/users/me/routine/info` | GET | required | My practices stats card |

See `foundation/02-api-networking` for the response envelope; `features/series` for
the full `Series` shape.

Language-aware providers refetch when content language / locale changes (mirror Flutter
`contentLanguageProvider` / `localeProvider`).

---

## 7. Navigation

| Flutter route | v2 route | Status |
|---------------|----------|--------|
| `/home` | `src/app/(tabs)/index.tsx` | In scope |
| `/home/series/:id` | `src/app/series/[id].tsx` | In scope |
| `/home/calendar` | `src/app/calendar/index.tsx` | Parity |
| `/mala` | `src/app/mala/index.tsx` | Parity — see [mala](./mala.md) |
| `/home/timers` (Flutter) / `/timers` (v2) | `src/app/timers/index.tsx`, `timers/active.tsx` | Parity — see [timer](./timer.md) |
| `/home/plans/:tag` | TBD (`features/plans`) | Not started |
| `/home/meditation_of_the_day` | — | Won't migrate (`stalled_features/meditation-prayer-of-day`) |
| `/home/prayer_of_the_day` | — | Won't migrate (`stalled_features/meditation-prayer-of-day`) |
| `/home/stories` | — | Won't migrate (`stalled_features/story-view`) |

**Post-onboarding navigation:** push plan detail (`/practice/details` equivalent) then
switch bottom nav to Practice tab (index 1).

---

## 8. UI / UX parity notes

- **Scroll order:** header (fixed) → calendar → verse → shortcuts → stats → featured →
  share prompt.
- **Spacing:** 16px between card sections (`HomeScreenConstants.cardSpacing`).
- **Guest gating:** streak, routine info, and shortcut destinations (Mala, Timer)
  require auth; guests see login drawer or hidden widgets.
- **Featured layout:** when user has practice stats, featured section uses list layout;
  otherwise hero card + list below.
- **Tibetan locale:** greeting uses smaller font sizes in Flutter (`language == 'bo'`).
- **v2 enhancements (optional, not Flutter FR):** title search filter and 2-column browse
  grid may be kept as improvements if product approves — document as `Improved` in parity
  matrix.

---

## 9. Acceptance criteria

- [ ] Greeting correct for guest vs authenticated user.
- [ ] Streak badge loads for authenticated users; tap opens share sheet.
- [ ] Calendar card shows today's Tibetan date; tap opens calendar screen.
- [ ] Verse of day loads with skeleton; share works; hidden on error.
- [ ] Mala and Timer shortcuts work; guests see login prompt.
- [ ] My practices stats shown only when counts > 0; tap switches to Practice tab.
- [ ] Featured plans load from `/series/featured` with random hero; tap opens series detail.
- [ ] Share prompt at bottom triggers app share.
- [ ] Series gate: empty and error states localized; retry works.
- [ ] Pull-to-refresh reloads all home sections.
- [ ] Notification permission requested on first Home load after onboarding.
- [ ] Pending onboarding plan opens on Practice tab after permission flow.
- [ ] Per-section skeletons (not spinner-only).
- [ ] Force-update modal blocks app when update required (app-wide, not home-only).
- [ ] ~~Daily content widgets (meditation/prayer/stories)~~ — out of scope (`stalled_features/`).

---

## 10. Resolved decisions

| Question | Decision |
|----------|----------|
| Which home sections are P0? | **All Flutter dashboard sections** (header through share prompt + on-load hooks). |
| Update banner vs force modal? | **Force-update modal app-wide** (`foundation/07-force-update`). Soft home banner removed in Flutter. |
| Molecule components (`Calander`, `Challenge`, `Quotation`, `Recitation`)? | **Deprecated.** Abandoned v2 prototype; do not wire into Home. |
| Tag-based search / "Home" title? | **Not in Flutter.** Not required for parity. |

---

## 11. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Greeting | yes | yes | Guest vs authenticated + Tibetan font sizing |
| Streak badge | yes | yes | Tap opens share sheet |
| Calendar card | yes | yes | `MoonPhaseIcon` + `CalendarDots`; tap → calendar screen |
| Verse of day | yes | yes | Skeleton + share on tap |
| Shortcuts (Mala/Timer) | yes | yes | Phosphor icons; Mala/Timer guest-gated |
| My practices stats | yes | yes | `ListChecks` + `BookOpenText`; hidden when counts zero |
| Featured plans | yes | yes | `/series/featured` + layout adapts to stats |
| Share prompt | yes | yes | App share CTA |
| Series gate (empty/error) | yes | yes | Localized empty/error + retry |
| Pull-to-refresh | yes | yes | Invalidates all home queries |
| Notification on load | yes | partial | Permission + user-plans refresh + Day-1 sync stub |
| Post-onboarding plan nav | yes | yes | Push plan detail then Practice tab |
| Per-section skeletons | yes | yes | Verse, stats, featured skeletons |
| Force-update gate | yes | yes | `ForceUpdateGate` in `_layout.tsx`; env `EXPO_PUBLIC_MIN_APP_VERSION` |
| Calendar screen | yes | yes | Month grid via `GET /calendar/{year}/{month}` |
| Mala screen | yes | yes | Full parity — see [mala](./mala.md) |
| Timer screen | yes | yes | Parity — see [timer](./timer.md) |
