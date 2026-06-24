# API-to-Screen Matrix — Series, Plans & Connect

| | |
|---|---|
| **Status** | Research complete (API-resolved) |
| **Last updated** | 2026-06-22 |

Maps backend endpoints to screens across mockups, Flutter, and planned v2 routes. Open product questions resolved in [`open-questions.md`](./open-questions.md).

---

## Critical v2 config correction

[`src/lib/api-config.ts`](../../src/lib/api-config.ts) currently defines:

```ts
series: { enroll: (id) => `/series/${id}/enroll` }
```

**This endpoint does not exist on the backend.** Correct enrollment:

| Action | Method | Path | Body | Response |
|--------|--------|------|------|----------|
| Enroll in series | POST | `/users/me/series` | `{ series_id, auto_enroll_next?, start_immediately? }` | 204 |
| List user series enrollments | GET | `/users/me/series` | — | `{ enrollments[], total, skip, limit }` |
| Series progress (enrolled) | GET | `/users/me/series/{series_id}` | — | `UserSeriesProgressResponse` with `plans[]`, `current_plan_id` |
| Unenroll series | DELETE | `/users/me/series/{series_id}` | — | 204 |

Flutter reference: `series_remote_datasource.dart` → `enrollInSeries`.

**Request defaults** ([`UserSeriesEnrollRequest`](../../../WeBuddhist-Backend/pecha_api/plans/users/plan_users_response_models.py)): `auto_enroll_next=true`, `start_immediately=false`.

---

## Series enroll post-flow

After `POST /users/me/series`, plan progress is **not** created unless one of these paths runs:

| Path | Trigger | Backend |
|------|---------|---------|
| **Routine (default v2)** | Navigate to edit-routine → POST/PATCH routine with PLAN sessions | `_enroll_plans()` in [`routines_service.py`](../../../WeBuddhist-Backend/pecha_api/routines/routines_service.py) |
| **Fast-start** | `start_immediately: true` on enroll body | `auto_enroll_in_next_plan()` for first plan only |
| **Lazy enroll** | Authenticated user opens `GET /plans/{id}/days` | `auto_enroll_plan()` in [`plan_service.py`](../../../WeBuddhist-Backend/pecha_api/plans/public/plan_service.py) |

See [`open-questions.md`](./open-questions.md) §1 for navigation decision (default: edit-routine).

---

## Series

| Endpoint | Auth | Used by (Flutter) | Mockup / v2 screen | Response keys used |
|----------|------|-------------------|--------------------|--------------------|
| `GET /series?language=&skip=&limit=` | Guest | Home featured, series gate | Home featured section | `series[]`, `enrolled_count`, pagination |
| `GET /series/{id}?language=` | Guest | `SeriesDetailScreen` | `series/[id].tsx` | `metadata`, `plans[]`, `image`, `total_days`, **`enrolled_count`**, `group` |
| `GET /series/featured?language=&limit=` | Guest | Home featured | `FeaturedPlanSection` | featured list |
| `POST /users/me/series` | Auth | `FeaturedPlanCard` Enroll | Series sticky Enroll | body: `{ series_id, auto_enroll_next?, start_immediately? }` → 204 |
| `GET /users/me/series` | Auth | `userSeriesEnrollmentsProvider` | Hide Enroll when enrolled | `enrollments[].series_id` |
| `GET /users/me/series/{series_id}` | Auth | *(partial)* | Plan row lock/current when enrolled | `current_plan_id`, `plans[].started_at`, `plans[].start_date` |
| `DELETE /users/me/series/{id}` | Auth | *(not in Flutter)* | Future unenroll | — |

**Stats row (mockup):** Render `plan_count` / `total_days` / **`enrolled_count`** from `GET /series/{id}` — see [`open-questions.md`](./open-questions.md) §8.

**Plan row lock (series-enrolled):** Use `GET /users/me/series/{series_id}` — locked when `started_at == null` or future `start_date`; current = `current_plan_id`. Guests: future `start_date` only — see [`open-questions.md`](./open-questions.md) §2.

---

## Plans — catalog / preview

| Endpoint | Auth | Used by (Flutter) | Mockup / v2 screen | Response keys used |
|----------|------|-------------------|--------------------|--------------------|
| `GET /plans?tag=&language=&skip=&limit=` | Guest | `PlanListScreen` (orphaned) | Future `plans/[tag]` | `plans[]` |
| `GET /plans/{id}?language=` | Guest | Plan preview/info | `plans/[id].tsx` | `title`, `description`, `image`, `total_days`, `start_date` |
| `GET /plans/{id}/days` | Optional Bearer | `planDaysProvider` | Day carousel (preview) | `days[].day_number`, `id`; Bearer triggers `auto_enroll_plan` |
| `GET /plans/{id}/days/{n}` | Guest | Preview task list + **Shorts strip** | Task rows, mockup Shorts | `tasks[]`, `subtasks[]`, **`videos[]`** (`DayVideoSummaryDTO`) |

**Enrollment gate for preview vs track:** `GET /users/me/plans/{plan_id}` → 200 = enrolled (track mode), 404 = preview — see [`open-questions.md`](./open-questions.md) §6.

---

## Plans — enrolled / track

| Endpoint | Auth | Used by (Flutter) | Mockup / v2 screen | Response keys used |
|----------|------|-------------------|--------------------|--------------------|
| `GET /users/me/plans` | Auth | Practice tab, plan row enroll check | Practice tab | `plans[]` |
| `GET /users/me/plans/{id}` | Auth | Enrollment check + `PlanDetails` progress | `/plans/[id]` mode switch, `practice/details.tsx` | 200/404; progress object |
| `POST /users/me/plans` | Auth | `PlanInfo` enroll | Plan detail Enroll | `{ plan_id }` → 204 |
| `DELETE /users/me/plans/{id}` | Auth | Unenroll dialogs | Future | — |
| `GET /users/me/plans/{id}/days/{n}` | Auth | `ActivityList` | Task list + **Shorts strip** | `tasks[]`, `is_completed`, **`videos[]`** |
| `GET /users/me/plans/{id}/days/completion-status` | Auth | `EnrolledPlanStatusIndicator`, `DayCarousel` | On track / checkmarks | `days[].day_number`, `is_completed` |
| `POST /users/me/tasks/{id}/complete` | Auth | Task toggle | Task checkmarks | 204 |
| `POST /users/me/sub-tasks/{id}/complete` | Auth | Subtask toggle | Subtask rows | 204 (409 = ok) |

**Shorts mapping:** Mockup "Shorts from the community" = horizontal `videos[]` on active plan day (`DayVideoSummaryDTO`: `id`, `url`, `video_id`, `title`, `display_order`). Hide when empty. P2 — see [`open-questions.md`](./open-questions.md) §3.

---

## Connect / groups

| Endpoint | Auth | Used by (Flutter) | Mockup / v2 screen | Response keys used |
|----------|------|-------------------|--------------------|--------------------|
| `GET /author/groups?language=&group_type=COMMUNITY&search=&tag_id=&skip=&limit=` | Guest | `ConnectScreen` discover | Connect tab | `groups[]` |
| `GET /users/me/joined/author/groups` | Auth | My groups section | Connect tab | `groups[]` |
| `GET /users/me/following/author/groups` | Auth | Followed groups | Connect tab (optional) | `groups[]` |
| `GET /author/groups/{id}?language=` | Guest | `GroupProfileScreen` | `group/[id].tsx` | metadata, banner, `series[]`, `plans[]`, `social_links`, `follower_count`, `joiner_count` |
| `POST /author/groups/{id}/join` | Auth | Community groups | Join button | 204 |
| `POST /author/groups/{id}/follow` | Auth | Page-type groups | Follow button | 204 |
| `DELETE /author/groups/{id}/join` | Auth | Leave group | — | 204 |
| `DELETE /author/groups/{id}/follow` | Auth | Unfollow page | — | 204 |
| `GET /users/me/joined/author/groups?group_id=` | Auth | Join status check | Button state | 200/404 |
| `GET /users/me/following/author/groups?group_id=` | Auth | Follow status check | Button state | 200/404 |

P1 Connect is fully API-backed — see [`open-questions.md`](./open-questions.md) §5.

---

## Routine (post-enroll)

| Endpoint | Auth | Used by (Flutter) | Notes |
|----------|------|-------------------|-------|
| `GET /users/me/routine` | Auth | Practice tab | Shows enrolled items |
| `POST /routines` + time blocks | Auth | `EditRoutineScreen` | Post series enroll prefill; `_enroll_plans` creates plan progress |

---

## Endpoints with limited mockup / Flutter consumer

| Endpoint | Notes |
|----------|-------|
| `GET /users/me/series/day-completed` | Backend exists; paginated series with completed day counts — Flutter usage TBD |

---

## v2 service gaps (implementation backlog)

| Service function | Endpoint | Status in v2 |
|------------------|----------|--------------|
| `enrollInSeries(seriesId)` | POST `/users/me/series` | Missing |
| `fetchUserSeriesEnrollments()` | GET `/users/me/series` | Missing |
| `fetchUserSeriesProgress(seriesId)` | GET `/users/me/series/{series_id}` | Missing |
| `fetchPlanById(id)` | GET `/plans/{id}` | Missing |
| `fetchPlanDays(id)` | GET `/plans/{id}/days` | Missing |
| `enrollInPlan(planId)` | POST `/users/me/plans` | Missing |
| `completeTask(taskId)` | POST `/users/me/tasks/{id}/complete` | Missing |
| `fetchGroupProfile(id)` | GET `/author/groups/{id}` | Missing |
| `fetchDiscoverGroups()` | GET `/author/groups` | Missing |
| `joinGroup(id)` | POST `/author/groups/{id}/join` | Missing |

Existing v2 plan services: `fetchUserPlans`, `fetchUserPlanProgress`, `fetchUserPlanDay`, `fetchPlanCompletionStatus` — sufficient for partial track screen only.
