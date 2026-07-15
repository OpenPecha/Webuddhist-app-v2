# Gap Matrix — Mockups vs Flutter vs v2

| | |
|---|---|
| **Status** | Flutter-parity pass complete |
| **Last updated** | 2026-06-22 (Flutter-parity pass) |

Columns: **Mockup** (design target) · **Flutter** (production baseline) · **v2** (current) · **API** · **Priority** · **Notes**

> **Note:** Rows below reflect post–Flutter-parity implementation. Treat v2 source + Flutter as truth for QA.

---

## Series

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Series detail hero + featured card | Yes | Yes | **Parity** | `GET /series/{id}` | P0 | FeaturedSeriesPlanCard layout |
| Stats row (plans · days · enrolled) | Yes | Partial | **Parity** | counts on series | P0 | On featured card |
| Enroll on featured card | Yes | Yes | **Parity** | `POST /users/me/series` | P0 | → edit-routine |
| Enrolled → hide Enroll | Yes | Yes | **Parity** | user enrollments | P0 | Cache invalidation fixed |
| Plan list in series | Yes | Yes | **Parity** | `plans[]` | P0 | |
| Plan row lock (future start) | Yes | Yes | **Parity** | `start_date` | P1 | Guests + enrolled |
| Plan row "On track" / missed | Yes | Yes | **Partial** | completion_status | P1 | Track screen wired; series rows partial |
| Series About / intro | Yes | Yes | **Parity** | metadata, group | P1 | Single markdown body |
| Org row → profile | Yes | Yes | **Parity** | `group` on series | P1 | |

---

## Plans

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Plan preview route | Yes | Yes | **Parity** | `GET /plans/{id}` | P0 | `/plans/[id]` |
| Add to Routine CTA | Yes | Yes | **Parity** | routine blocks | P0 | Not direct enroll |
| Day carousel w/ dates | Yes | Yes | **Parity** | start_date | P0 | Preview unlock for first plan |
| Task / subtask completion | Yes | Yes | **Parity** | POST complete | P1 | Optimistic UI |
| Start Reading CTA | Yes | Yes | **Parity** | texts API | P1 | Navigates to reader w/ plan context |
| Day completion sheet | Yes | Yes | **Parity** | — | P1 | Transition-only |
| Missed days badge tap | Yes | Yes | **Parity** | completion_status | P1 | Jumps carousel |
| Shorts section | Yes | **No** | **Partial** | videos[] | P2 | In-app fullscreen browser |
| Reader / plan-text | Yes | Yes | **Partial** | texts API | P2 | Reader placeholder; plan context params |

---

## Connect / Community

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Connect tab | Yes | Yes | **Parity** | — | P1 | ConnectHeader + discover |
| Discover groups | Yes | Yes | **Parity** | `GET /author/groups` | P1 | Inline join |
| My groups | Yes | Yes | **Parity** | joined endpoint | P1 | See-all screen |
| Group search | — | Yes | **Parity** | search param | P2 | `/connect/search` |
| Group profile | Yes | Yes | **Parity** | group detail | P1 | |
| Join / Follow CTA | Yes | Yes | **Parity** | POST join/follow | P1 | |
| Practices tab (series + plans) | Yes | Yes | **Parity** | series, plans | P1 | |
| About tab markdown | Yes | Yes | **Parity** | description_long | P1 | MarkdownText |
| Social links sheet | Yes | Yes | **Parity** | social_links | P2 | Bottom sheet |

---

## Practice / Routine

| Feature | Mockup | Flutter | v2 | P | Notes |
|---------|--------|---------|-----|---|-------|
| SERIES routine card | Yes | Yes | **Parity** | P0 | Fixed type branch |
| Edit-routine series picker | Yes | Yes | **Parity** | P2 | select-session series tab |
| Post-series-enroll flow | Yes | Yes | **Parity** | P0 | edit-routine prefill |

---

## Cross-cutting

| Feature | Mockup | Flutter | v2 | P | Notes |
|---------|--------|---------|-----|---|-------|
| Locale-aware metadata | — | Yes | **Partial** | P0 | en/zh/bo connect keys added |
| Toast/snackbar on error | — | SnackBar | Alert | P1 | Deferred — no shared utility yet |
| Guest gating | — | LoginDrawer | **Parity** | P0 | Connect join + series/plans |

---

## v2 file status summary

| Screen | v2 file | Status |
|--------|---------|--------|
| Series detail | `series/[id].tsx` | Parity |
| Series info | `series/[id]/info.tsx` | Parity |
| Plan preview | `plans/[id].tsx` | Parity |
| Plan track | `practice/details.tsx` | Parity |
| Connect tab | `(tabs)/connect.tsx` | Parity |
| Group search | `connect/search.tsx` | Parity |
| My groups | `connect/my-groups.tsx` | Parity |
| Group profile | `group/[id].tsx` | Parity |
| Edit routine | `practice/edit-routine/*` | Parity |
