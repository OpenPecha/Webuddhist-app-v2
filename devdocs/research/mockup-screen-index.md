# Mockup Screen Index — Series, Plan & Community

| | |
|---|---|
| **Status** | Research complete |
| **Last updated** | 2026-06-22 (synced with PRDs) |
| **Design source** | Shared mockup images: `series_page`, `plan_design_revamp`, `Missed_days_flow` |

Frame-by-frame index mapping mockup UI to Flutter screens, v2 targets, and APIs.

---

## Set A — `series_page` (Series detail & About)

### A1 — Series detail (not enrolled)

| Mockup element | Spec | Flutter | v2 target | API fields |
|----------------|------|---------|-----------|------------|
| Back | Top-left chevron | `SeriesDetailScreen` app bar | `series/[id].tsx` | — |
| Hero image | 16:9 cover | `FeaturedPlanCard` in `PlanListView` | Hero `Image` | `SeriesDTO.image` |
| Stats row | "10 PLANS • 300 DAYS • 200 ENROLLED" | `series_stats(plans.length, totalDays)` — **no enrolled count in Flutter UI today** | **Parity** — uppercase `stats_plans/stats_days/stats_enrolled` on featured card | `plans.length`, `total_days`, **`enrolled_count`** |
| Subtitle | Series edition name | `series.subTitle` on featured card | Bold `sub_title` below stats (title in app bar only) | `metadata[].sub_title` |
| Sticky Enroll | Full-width black CTA | `FeaturedPlanCard` ElevatedButton | Bottom sticky `Pressable` | `POST /users/me/series` |
| Plan rows | Thumbnail 86×86, title, date range | `PlanListItem` | `PlanRow` in series detail | `plans[]` sorted by `display_order` |
| Row status (future) | Lock icon, dimmed | `isLocked` when `startDate > now` | Lock + opacity 0.45 | `plan.start_date` |
| Row status (enrolled) | "On track" pill | `EnrolledPlanStatusIndicator` | `EnrolledPlanStatusIndicator` (exists in v2) | `GET .../completion_status` |
| Bottom tabs | Home · Practice · Connect · Me | `MainNavigationScreen` | `AppBottomTabBar` | — |

**Tap behaviors:**

- Featured card body → Series About (`/home/series/:id/info`)
- Enroll → `POST /users/me/series` → edit-routine with `enrollSeriesId` + SERIES routine session ([open-questions §1](./open-questions.md))
- Plan row (not enrolled) → `/plans/[id]`; enrolled → `/practice/details`

### A2 — Series About / Introduction

| Mockup element | Spec | Flutter | v2 target |
|----------------|------|---------|-----------|
| Hero + title | Full-width image, series title | `SeriesInfoScreen` | New `series/[id]/info` or inline About tab |
| Org row | Logo + "ITCC" + chevron | `_buildGroupRow` → group profile | Link to `group/[id]` |
| INTRODUCTION | Section label + body | `series.description` markdown | About section |
| ABOUT THIS TEXT | Long-form copy | Same description block | `metadata.description` |

Maps to [`SeriesInfoScreen`](WeBuddhist-app/lib/features/home/presentation/screens/series_info_screen.dart), **not** a separate creator entity.

### A3 — Series detail (enrolled)

| Mockup element | Spec | Flutter | v2 target |
|----------------|------|---------|-----------|
| Enroll hidden | Button removed after enroll | `hideEnrollButton` when `isSeriesEnrolled` | Same |
| Plan rows "On track" | Status pill on enrolled plans | `EnrolledPlanStatusIndicator` | Wire on series plan rows |
| Checkmark on completed plan | Optional in mockup | Partial via completion status | Same indicator tree |

---

## Set B — `plan_design_revamp` (Plan detail & content)

### B1 — Plan detail (enrolled track)

| Mockup element | Spec | Flutter | v2 target | API |
|----------------|------|---------|-----------|-----|
| Header | Back + plan title | `PlanDetails` | `practice/details.tsx` (track); preview at `plans/[id].tsx` | — |
| Hero image | ~25–40% viewport | `PlanCoverImage` | Top `Image` | `plan.image` |
| Intro text | Welcome paragraph | Plan description / day intro | Text block | `GET /plans/{id}` |
| "Day N of M" + status | On track label | Plan details header | Status row | progress + completion |
| Day carousel | Horizontal square cards 1–7; day # + date; check = done | `DayCarousel` | **Parity** — `PlanDayCarousel` (preview + track) | `GET /plans/{id}/days` + completion_status |
| Task list | Title + circle/check + chevron | `ActivityList` | **Parity** — `PlanTaskList` activity rows | day endpoint |
| Practice Now | Sticky black CTA | Opens first incomplete task | **Parity** — sticky CTA in `practice/details.tsx` | task list |
| Missed days | Badge on header | `MissedDaysBadge` | **Parity** — `PlanDayHeader` + `EnrolledPlanStatusIndicator` | completion_status |

### B2 — Content reader session

| Mockup element | Spec | Flutter | v2 target |
|----------------|------|---------|-----------|
| Header | Back, search, AA, share | Reader / plan-text screens | **Partial** — `PlanReadingLayout` (Aa + placeholder search/globe) |
| Scrollable text | Sections with headings | `PlanTextScreen` / reader | **Partial** — markdown body via `plan-text/[subtaskId]` + `reader/[textId]` |
| Bottom bar | Prev · play · section · Next | `PlanNavigator` | **Parity** — footer prev/title/next; play in body |
| Read Now overlay | Optional CTA on content | Reader entry | **Parity** — "Read Full Text" expand button |

### B3 — Shorts / day videos (mockup Shorts strip)

Maps to **`PlanDayDTO.videos[]`** on plan day endpoints — not a separate Shorts API.
See [open-questions §3](./open-questions.md).

| Mockup element | Spec | Flutter | v2 |
|----------------|------|---------|-----|
| "Shorts from the community" | Horizontal video cards | **Not implemented** | `PlanDayVideosStrip` P2; hide when `videos[]` empty |
| Full-screen vertical video | TikTok-style player | **Not implemented** | Modal player using `video.url` |

---

## Set C — `Missed_days_flow`

### C1 — Series-level day list (Daily Tipitaka style)

| Mockup element | Spec | Flutter equivalent | Notes |
|----------------|------|-------------------|-------|
| Vertical day rows | ITCC Day 1, Meditation subtitle | **Differs from Flutter** — Flutter uses **plan rows** not day rows at series level | Mockup may conflate series-of-days with multi-plan series |
| "Current day" label | Bold status on active row | Closest: `PlanDateRangeLabel` active pill on enrolled plan row | |
| "Locked" label | Greyed future rows | `isLocked` on plan with future `start_date` | Not sequential day lock within single plan |

**Research finding:** The "Current day / Locked" vertical list in mockup Set C maps loosely to **plan rows within a series** (each plan = a segment), not individual plan days. Individual plan days use the **horizontal carousel** in Set B.

### C2 — Plan track progression (days 1→7)

| Frame | State | Logic |
|-------|-------|-------|
| Day 1 selected | Tasks with empty circles | Default or first incomplete |
| Day 1 complete | Carousel day 1 has checkmark | `dayCompletionStatus[1] == true` |
| Day 2 active | Carousel selection moves forward | User tap or auto after day completion sheet |
| All tasks checked | Green/black check icons | `POST .../tasks/{id}/complete` |

**Day status pseudocode** (from Flutter `DayCarousel` + `PlanDetails`):

```
for each dayNumber in 1..totalDays:
  dayDate = startDate + (dayNumber - 1) days
  isFuture = dayDate > today
  isCompleted = completionStatus[dayNumber] == true
  isSelected = selectedDay == dayNumber
  isDisabled = lockFutureDays && isFuture && dayNumber > previewUnlockDayCount
  isLocked = isDisabled  // carousel: greyed, no tap
  isCurrent = dayDate == today  // visual "today" dot in carousel
```

**Missed days:**

```
missedCount = PlanUtils.calculateMissedDays(startDate, totalDays, completionStatus)
firstMissedDay = lowest day in 1..upperBound where completion[day] != true
upperBound = planOver ? totalDays : todayDayNumber - 1
```

---

## Set D — Community profile (`series_page` frames 3–8)

### D1 — Group / org profile

| Mockup element | Spec | Flutter | v2 target | API |
|----------------|------|---------|-----------|-----|
| Banner hero | Cover photo, inset + rounded | `GroupProfileBody` banner | `group/[id].tsx` | `GET /author/groups/{id}` |
| Avatar + title | 44px circle beside title row | Inline header row | Same | `group.image` |
| Member count | Bold number + "members" | Formatted count + label | Same | `joiner_count` / `follower_count` |
| Description | Expandable bio | Tap to expand | Same | `description` |
| Join button | Full-width black CTA inline | `followGroup` / join | Inline stadium CTA | `POST .../join` or `.../follow` |
| Practices tab | Series list | Tab → series cards | Tab content | `group.series[]` or separate fetch |
| About tab | MISSION, VISION | `descriptionLong` markdown sections | Second tab | `description_long` |
| Social links sheet | Website, IG, FB, X, YT | `GroupProfileLinksDrawer` | Bottom sheet | `social_links[]` |

### D2 — Connect tab entry

| Mockup element | Flutter | v2 |
|----------------|---------|-----|
| Discover groups | `ConnectScreen` + `DiscoverGroupCard` | Stub only |
| My groups horizontal | `MyGroupsSection` | Missing |
| Search | `GroupSearchScreen` | Missing |

---

## Scope tiers (for future implementation)

| Tier | Screens / features |
|------|-------------------|
| **P0 — Data + nav** | Series enroll, plan preview `/plans/[id]`, fix plan row nav, stats row |
| **P1 — Track UX** | Day carousel, task list, Practice Now, completion status, on-track badge |
| **P1 — Connect** | Discover, my groups, group profile |
| **P2 — Reader** | Plan-text, reader bar, task completion mutations |
| **P3 — Net-new** | Shorts, full-screen video, creator standalone profile |

---

## Cross-reference

- Flutter routes: [`flutter-series-plans-connect-routes.md`](./flutter-series-plans-connect-routes.md)
- Gap matrix: [`series-plans-connect-gap-matrix.md`](./series-plans-connect-gap-matrix.md)
- Product decisions: [`open-questions.md`](./open-questions.md)
