# Series — Migration PRD

| | |
|---|---|
| **Status** | In progress |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/home` (series), `lib/features/home/data/repositories/series_repository.dart` |
| **v2 target** | `src/app/series/[id].tsx`, `src/hooks/useSeries.ts` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-11 |

---

## 1. Summary

A series is a sequential collection of plans. The series detail screen shows cover image,
title/description, day/plan counts, and the list of plans, with an enrollment action for
authenticated users.

## 2. Flutter reference map

| Element | Flutter source | Route |
|---------|----------------|-------|
| Series detail | `features/home/presentation/screens/series_detail_screen.dart` | `/home/series/:id` |
| Series repository | `features/home/data/repositories/series_repository.dart` | — |
| Series model | `features/home/data/models/series_model.dart` | — |
| Series entity | `features/home/domain/entities/series.dart` | — |

## 3. v2 current state

`src/app/series/[id].tsx` already renders cover image, metadata (title/description),
day/plan counts, and a list of `PlanCard`s via `useSeriesById`. **Missing:** enrollment
action, enrollment-state awareness, and language selection of metadata (currently
hardcoded `'EN'`).

## 4. User stories

- As any user, I can open a series and see its plans.
- As an **authenticated** user, I can enroll in a series.
- As a user, I see whether I'm already enrolled.

## 5. Functional requirements

- **FR-1:** Load series by id via `/series/{id}`.
- **FR-2:** Display cover image, title, description, total days, plan list.
- **FR-3:** Metadata respects the active locale (not hardcoded `EN`) — see
  `foundation/04-i18n-theming`.
- **FR-4:** Enrollment action (authenticated only); guest is prompted to log in.
- **FR-5:** Reflect enrollment state (enrolled vs not) using user enrollments.
- **FR-6:** Tapping a plan → plan info/preview (see `features/plans`).
- **FR-7:** Loading / error / empty states.

## 6. API contracts

**Sources:** Flutter `series_remote_datasource.dart`, `series_model.dart` · Swagger
`openapi.json` · Backend `WeBuddhist-Backend/pecha_api/plans/series/series_views.py`,
`series_response_models.py`, `plans/users/plan_users_views.py` (enrollment routes under
`/users/me/series`). Public routes only — no `/cms`.

| Endpoint | Method | Auth | OpenAPI schema | Notes |
|----------|--------|------|----------------|-------|
| `/series?language=&search=&group_id=&skip=&limit=` | GET | guest ok | `SeriesListResponse` | Paginated list |
| `/series/{series_id}?language=` | GET | guest ok | `SeriesDTO` | Detail incl. `plans[]` |
| `/users/me/series` | POST | required | `UserSeriesEnrollRequest` → **204** | Enroll in series |
| `/users/me/series?status_filter=&language=&skip=&limit=` | GET | required | `UserSeriesEnrollmentsResponse` | User enrollments |
| `/users/me/series/{series_id}` | DELETE | required | **204** (no body) | Unenroll from series |

> There is **no** `/series/{id}/enroll` endpoint. Enrollment is `POST /users/me/series`.

### Series list — `SeriesListResponse`

**Query params (Swagger):** `search`, `language`, `group_id`, `skip`, `limit`.

```jsonc
// GET /series?language=en&skip=0&limit=10  → 200
{
  "series": [
    {
      "id": "uuid",
      "metadata": [ /* SeriesMetadataDTO[] or single object or null */ ],
      "image": { "thumbnail": "...", "medium": "...", "original": "..." },
      "image_key": "string|null",
      "author_id": "uuid",
      "featured": false,
      "status": "PlanStatus",
      "plan_count": 0,
      "total_days": 0,
      "enrolled_count": 0,           // backend SeriesListItemDTO
      "group": { /* AuthorGroupSummaryDTO | null */ }
    }
  ],
  "skip": 0,
  "limit": 10,
  "total": 42
}
```

**Swagger vs Flutter drift:** Flutter `fetchSeriesList` only passes `language` and reads
`series[]` — ignores `skip`/`limit`/`total`. v2 `useSeries` uses the full paginated envelope.

### Series detail — `SeriesDTO`

```jsonc
// GET /series/{series_id}?language=en  → 200
{
  "id": "uuid",
  "metadata": [ /* SeriesMetadataDTO[] — id, title, sub_title, description, language */ ],
  "image": { "thumbnail": "...", "medium": "...", "original": "..." },
  "image_key": "string|null",
  "author_id": "uuid",
  "featured": false,
  "status": "PlanStatus",
  "plans": [ /* SeriesPlanDTO[] — see features/plans.md §5 */ ],
  "total_days": 0,
  "enrolled_count": 0,             // backend SeriesDTO
  "group": { /* AuthorGroupSummaryDTO | null */ }
}
```

**Swagger vs Flutter drift:** Flutter also accepts legacy `image` as a string or top-level
`image_url` fallback (`ImageModel.fromJsonMap`).

### Enroll in series — `UserSeriesEnrollRequest`

```jsonc
// POST /users/me/series
{
  "series_id": "uuid",              // required
  "auto_enroll_next": true,         // optional — backend default true
  "start_immediately": false        // optional — backend default false
}
// → 204 No Content (backend plan_users_views.py; Flutter treats any 2xx as success)
```

**Backend vs Flutter drift:** Flutter only sends `{ "series_id": "..." }`; backend applies
defaults `auto_enroll_next=true`, `start_immediately=false`. v2 should send explicit flags if
product behavior differs.

### Unenroll from series

```jsonc
// DELETE /users/me/series/{series_id}
// → 204 No Content (no body, no request body)
// Backend: plan_users_views.py → unenroll_user_from_series → delete_user_series_enrollment
```

- **Auth:** required (`Bearer` ID token).
- **Effect:** removes the user's series enrollment record. Does **not** automatically
  unenroll individual plans enrolled via the series — confirm product behavior if v2 adds
  a series-unenroll UI.
- **Errors:** backend returns **204** even when no enrollment row existed (idempotent delete).
- **Flutter:** **not implemented** — `series_remote_datasource.dart` has enroll + list only;
  no `unenrollFromSeries` call. v2 may add if product wants series-level leave.

### User series enrollments — `UserSeriesEnrollmentsResponse`

```jsonc
// GET /users/me/series?skip=0&limit=20  → 200
{
  "enrollments": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "series_id": "uuid",
      "series_title": "string",
      "series_description": "string|null",
      "image": { "thumbnail": "...", "medium": "...", "original": "..." },
      "enrolled_at": "2026-01-01T00:00:00Z",
      "status": "string",
      "auto_enroll_next": false,
      "current_plan_id": "uuid|null",
      "current_plan_title": "string|null",
      "is_completed": false,
      "completed_at": "datetime|null",
      "total_plans": 0,
      "completed_plans": 0,
      "progress_percentage": 0.0,
      "group": { /* AuthorGroupSummaryDTO | null */ }
    }
  ],
  "skip": 0,
  "limit": 20,
  "total": 3
}
```

**Swagger vs Flutter drift:** Flutter defensively parses multiple legacy shapes
(top-level list, `{ series: [...] }`, `{ enrollments: [...] }`) and extracts only
`series_id` into a `Set<String>`. v2 should use the full `UserSeriesEnrollmentDTO` shape.

Flutter repository methods to match: `getSeriesList`, `getSeriesById`, `enrollInSeries`,
`getUserSeriesEnrollments`. Unenroll API exists on backend but has **no Flutter datasource
method** yet.

## 7. Navigation

| Flutter route | v2 route | Params |
|---------------|----------|--------|
| `/home/series/:id` | `src/app/series/[id].tsx` | `id` (search param) |

> Flutter passes the `Series` object via `extra` to avoid refetch. v2 refetches by id
> via React Query — acceptable; document as intentional.

## 8. Acceptance criteria

- [ ] Series detail loads by id with correct image, metadata, counts, plans.
- [ ] Metadata uses active locale, with fallback.
- [ ] Authenticated user can enroll; state reflects after enrollment.
- [ ] Guest enrollment attempt routes to login.
- [ ] Plan tap navigates to plan detail.

## 9. Open questions

- ~~Exact enroll endpoint + payload~~ → resolved: `POST /users/me/series` with
  `{ "series_id": "..." }` (see §6).
- Author display (`author_id`) — `creator_info` module is out of v2 scope; show author
  from plan/series DTO only if needed.

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Load by id | yes | yes | `useSeriesById` |
| Render detail | yes | yes | |
| Locale-aware metadata | yes | no | hardcoded EN |
| Enrollment | yes | no | |
| Enrollment state | yes | no | |
