# Home — Migration PRD

| | |
|---|---|
| **Status** | In progress (partial) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/home` |
| **v2 target** | `src/app/(tabs)/index.tsx` + `src/components/home/*` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

The home tab is the app's landing screen. In Flutter it is a scrollable **practice
dashboard** gated by the series list API. When series data is available, the screen
shows (top to bottom):

1. **Header** — personalized greeting + streak badge
2. **Calendar card** — today's Tibetan lunar date
3. **Verse of the day** card
4. **Shortcuts row** — Mala and Timer (guest-gated)
5. **My practices stats** card (conditional on routine counts)
6. **Featured plans** section
7. **Share prompt** at the bottom

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

`src/app/(tabs)/index.tsx` implements a **series-discovery layout** — only partial
overlap with Flutter's dashboard.

| Flutter section | v2 status | Notes |
|-----------------|-------------|-------|
| Header + streak | Partial | Time-of-day greeting + Auth0 first name; **no streak badge** |
| Calendar card | Missing | `Calander.tsx` exists but unused (hardcoded placeholder) |
| Verse of day | Missing | `quotation.tsx` exists but unused (static dummy) |
| Shortcuts (Mala/Timer) | Missing | — |
| My practices stats | Missing | — |
| Featured plans | Partial | Uses first `featured` from `GET /series`, not `/series/featured` with random hero |
| Share prompt | Missing | — |
| Series gate | Partial | Loads `/series` but no global empty state |
| Pull-to-refresh | Done | `refetch()` on FlatList |
| Loading/error/empty | Partial | Spinner + hardcoded English error; no per-section skeletons |
| Notification on load | Missing | Only via Settings toggle today |
| Post-onboarding plan nav | Missing | — |
| Force update | Missing | No app-wide gate |

**v2-only (not Flutter parity):** client-side title search, 2-column `SeriesCard` browse
grid, "Continue today" section stub (`enrolledSeries = []`; `useUserPlans` not wired).

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
- **FR-4:** Shortcuts row — Mala → `/mala`, Timer → `/home/timers`; guests see login
  drawer instead of navigating.
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
| `/home/calendar` | TBD | Not started |
| `/mala` | TBD | Not started |
| `/home/timers` | TBD | Not started |
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
| Greeting | yes | partial | time-of-day + name; no streak |
| Streak badge | yes | no | |
| Calendar card | yes | no | placeholder component unused |
| Verse of day | yes | no | dummy quotation unused |
| Shortcuts (Mala/Timer) | yes | no | |
| My practices stats | yes | no | |
| Featured plans | yes | partial | wrong endpoint; no random hero |
| Share prompt | yes | no | |
| Series gate (empty/error) | yes | partial | loads but no global empty state |
| Pull-to-refresh | yes | yes | only refetches series today |
| Notification on load | yes | no | |
| Post-onboarding plan nav | yes | no | |
| Per-section skeletons | yes | no | spinner only |
| Force-update gate | yes | no | app-wide modal |
| Notification permission | yes | no | |
