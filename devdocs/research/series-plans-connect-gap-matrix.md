# Gap Matrix — Mockups vs Flutter vs v2

| | |
|---|---|
| **Status** | Research complete |
| **Last updated** | 2026-06-22 (synced with PRDs) |

Columns: **Mockup** (design target) · **Flutter** (production baseline) · **v2** (current) · **API** · **Priority** · **Notes**

---

## Series

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Series detail hero | Yes | Yes | Partial | `GET /series/{id}` | P0 | v2 has hero; missing stats row |
| Stats row (plans · days · enrolled) | Yes | Partial | No | `plan_count`, `total_days`, `enrolled_count` | P0 | Flutter shows plans+days only |
| Sticky Enroll | Yes | Yes | Stub (Alert) | `POST /users/me/series` | P0 | v2 wrong endpoint in config |
| Enrolled → hide Enroll | Yes | Yes | No | `GET /users/me/series` | P0 | |
| Plan list in series | Yes | Yes | Yes | `plans[]` | P0 | |
| Plan row date range | Yes | Yes | Partial | `start_date`, `total_days` | P1 | v2 shows day count only |
| Plan row lock (future start) | Yes | Yes | No | `start_date` | P1 | |
| Plan row "On track" | Yes | Yes | No | completion_status | P1 | v2 component exists but not on series rows |
| Series About / intro | Yes | Yes | No | metadata, group | P1 | `SeriesInfoScreen` — no v2 route |
| Org row → profile | Yes | Yes | Dead link | `group` on series | P1 | v2 shows author placeholder |
| Tap featured → About | Yes | Yes | No | — | P2 | |
| Series unenroll | — | No | No | DELETE `/users/me/series/{id}` | P3 | Backend only |

---

## Plans

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Plan preview route | Yes | Yes | **Missing** | `GET /plans/{id}` | P0 | v2 broken nav to `/series/{planId}/plan` |
| Hero + description | Yes | Yes | No | plan detail | P0 | |
| Day carousel | Yes | Yes | No | `/plans/{id}/days` | P0 | v2 uses chevron prev/next only |
| Task list | Yes | Yes | Partial | user day endpoint | P0 | v2 lists tasks, no completion UI |
| Practice Now CTA | Yes | Yes | No | — | P1 | |
| Task completion toggles | Yes | Yes | No | POST complete | P1 | |
| Day completion sheet | Yes | Yes | No | — | P1 | |
| Missed days badge | Yes | Yes | Partial | completion_status | P1 | v2 utils exist; not on plan screen |
| Reader / plan-text | Yes | Yes | Partial | texts API | P2 | v2 reader placeholder |
| Shorts section | Yes | **No** | No | `PlanDayDTO.videos[]` | P2 | Mockup Shorts strip on plan day; hide when empty — [open-questions §3](./open-questions.md) |
| Plan list by tag | — | Yes (orphaned) | No | `GET /plans?tag=` | P2 | |
| PlanInfo enroll screen | — | Yes | No | POST `/users/me/plans` | P1 | Separate from series enroll |

---

## Connect / Community

| Feature | Mockup | Flutter | v2 | API | P | Notes |
|---------|--------|---------|-----|-----|---|-------|
| Connect tab | Yes | Yes | Stub | — | P1 | v2 placeholder only |
| Discover groups | Yes | Yes | No | `GET /author/groups` | P1 | |
| My groups | Yes | Yes | No | `GET /users/me/joined/...` | P1 | |
| Group search | — | Yes (push) | No | search param | P2 | |
| Group profile | Yes | Yes | **Missing** | `GET /author/groups/{id}` | P1 | |
| Join / Follow CTA | Yes | Yes | No | POST join/follow | P1 | |
| Practices tab | Yes | Yes | No | series on profile | P1 | |
| About tab | Yes | Yes | No | description_long | P1 | |
| Social links drawer | Yes | Yes | No | social_links | P2 | |
| Creator standalone profile | — | **No** | No | — | — | Use group profile; "creator" is home copy |

---

## Cross-cutting

| Feature | Mockup | Flutter | v2 | P | Notes |
|---------|--------|---------|-----|---|-------|
| Post-series-enroll navigation | Practice tab implied | edit-routine | — | P0 | **Resolved:** edit-routine + SERIES session — [open-questions §1](./open-questions.md) |
| Locale-aware metadata | — | Yes | No | P0 | v2 hardcodes `'EN'` |
| Toast/snackbar on enroll error | — | SnackBar | Alert only | P1 | No shared v2 utility |
| Guest gating | — | LoginDrawer | Partial | P0 | Home has pattern; series lacks |

---

## v2 file status summary

| Screen | v2 file | Status |
|--------|---------|--------|
| Series detail | `src/app/series/[id].tsx` | Partial UI; enroll stub |
| Series info | — | Missing |
| Plan preview | — | Missing (`/plans/[id]`) |
| Plan track | `src/app/practice/details.tsx` | Minimal |
| Connect | `src/app/(tabs)/connect.tsx` | Stub |
| Group profile | — | Missing |

---

## Recommended implementation backlog (future phase)

1. **P0:** Fix series enroll API + mutation; plan preview route; fix plan row navigation; locale metadata
2. **P0:** Day carousel + public plan fetch on `/plans/[id]`
3. **P1:** Enrolled track UX (completion, Practice Now, on-track on series rows)
4. **P1:** Connect discover + group profile
5. **P2:** Reader/plan-text integration; series info route; day videos strip (mockup Shorts)
6. **P2:** Series unenroll; plan list by tag

See [`open-questions.md`](./open-questions.md) — all product decisions resolved via backend API.
