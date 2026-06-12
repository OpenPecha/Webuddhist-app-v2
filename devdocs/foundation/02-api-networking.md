# API & Networking — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P0 |
| **Flutter baseline** | `lib/core/network/*` |
| **v2 target** | `src/lib/*`, `src/hooks/*`, `src/providers/query.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-11 |

---

## 1. Summary

Defines the shared networking layer: base URL, auth header injection, error handling,
retry/refresh, caching, and how data is fetched in v2 (React Query). Today v2 calls
`fetch` directly inside hooks with hardcoded URLs; this PRD defines the consolidated
client that feature PRDs depend on.

## 2. Flutter reference map

| Concern | Flutter source |
|---------|----------------|
| HTTP client | `core/network/dio_client.dart` |
| Auth header | `core/network/interceptors/auth_interceptor.dart` |
| Caching (GET) | `core/network/interceptors/cache_interceptor.dart` |
| Error mapping | `core/network/interceptors/error_interceptor.dart` |
| Retry + 401 refresh | `core/network/interceptors/retry_interceptor.dart` |
| Logging | `core/network/interceptors/logging_interceptor.dart` |
| Connectivity | `core/network/connectivity_service.dart` |

Flutter interceptor order (matters): **auth → cache → retry → error → logging**.

> AI streaming (`ai_dio_client.dart`) exists in Flutter for the AI search feature, which
> is **out of v2 scope** (`stalled_features/ai-search.md`). v2 does not need SSE support
> unless a future feature requires it.

## 3. Functional requirements

- **FR-1:** Single base URL config: `https://api.webuddhist.com/api/v1/`
  (env-overridable, like Flutter).
- **FR-2:** Inject the auth token header on authorized requests (ID token — see
  `foundation/01-auth-guest-onboarding`). Guests send unauthenticated requests.
- **FR-3:** Centralized error mapping to typed errors mirroring Flutter failures:
  `ServerFailure`, `NetworkFailure`, `AuthenticationFailure`, `NotFoundFailure`,
  `RateLimitFailure`, `UnknownFailure`.
- **FR-4:** On 401, refresh token once and retry the request (matches Flutter
  `retry_interceptor` + token refresh docs).
- **FR-5:** GET caching strategy (Flutter caches GETs). In v2, React Query provides
  caching — define `staleTime`/`gcTime` defaults per data type.
- **FR-6:** Network connectivity awareness (offline detection) for error states.
- **FR-7:** Consistent list pagination params: `skip`, `limit` (+ `language`),
  as already used by `useSeries`.

## 4. v2 architecture (proposed)

```
src/lib/api/
  client.ts        # fetch wrapper: base URL, headers, error mapping, 401 retry
  errors.ts        # typed error classes mirroring Flutter failures
  types.ts         # shared response envelopes (paginated list, etc.)
src/hooks/
  use*.ts          # React Query hooks calling client.ts
src/providers/
  query.tsx        # QueryClient defaults (staleTime, retry, etc.)
```

Migrate existing direct-`fetch` hooks (e.g. `useSeries.ts`) onto `client.ts`.

## 5. Known endpoints (seed list — expand per feature PRD)

> **Base URL:** env-driven (`BASE_API_URL` in `.env`, read via `Env.apiBaseUrl` →
> `ApiConfig`). The base URL **includes** the `/api/v1` prefix, so endpoint paths below
> are written without it (e.g. `/series`, not `/api/v1/series`). Known values:
> production `https://api.webuddhist.com/api/v1`, dev
> `https://webuddhist-dev-backend.onrender.com/api/v1`.
>
> **Auth header:** `Authorization: Bearer <ID token>`. The token is the Auth0 **ID
> token** (`AuthService.getValidIdToken()` via `AuthServiceTokenProvider`, wired in
> `core/di/core_providers.dart`), **not** the access token. It is attached by
> `AuthInterceptor` only for paths listed in `ProtectedRoutes` (required) or
> `ProtectedRoutes.optionalPaths` (sent if present, skipped for guests). Public paths
> (e.g. `/series`, `/plans`, `/recitations`) are sent unauthenticated.
>
> **Timeouts:** connect / receive / send all **30 s** (`Env.apiTimeout`).
>
> **Interceptor order:** auth → cache → retry (401 refresh + network retry) → error →
> logging (`core/network/dio_client.dart`).
>
> **OpenAPI (Swagger):** `https://webuddhist-dev-backend.onrender.com/openapi.json`
> (UI at `/docs`). Schema names reference `components/schemas/*`.
>
> **Backend source (canonical):** `WeBuddhist-Backend/pecha_api/` — FastAPI routers in
> `*_views.py`, Pydantic models in `*_response_models.py`. Only **public + `/users/me`**
> routes are documented here; **`/cms/*` excluded**.
>
> **Mutation responses:** enroll (plan/series), task/subtask complete, and most deletes
> return **`204 No Content`** (no JSON body). Where Flutter/Swagger differ, feature PRDs
> note **Backend vs Flutter drift**.

| Endpoint | Method | Auth | OpenAPI schema | Used by |
|----------|--------|------|----------------|---------|
| `/series?language=&search=&group_id=&skip=&limit=` | GET | guest ok | `SeriesListResponse` | home, series |
| `/series/{series_id}?language=` | GET | guest ok | `SeriesDTO` | series detail |
| `/users/me/series` | POST | required | `UserSeriesEnrollRequest` → **204** (no body) | series enroll |
| `/users/me/series?status_filter=&language=&skip=&limit=` | GET | required | `UserSeriesEnrollmentsResponse` | user series enrollments |
| `/users/me/series/{series_id}` | DELETE | required | **204** (no body) | unenroll from series |
| `/plans?tag=&group_id=&search=&language=&sort_by=&sort_order=&skip=&limit=` | GET | guest ok | `PublicPlansResponse` | plans list |
| `/plans/{plan_id}` | GET | optional | `PublicPlanDTO` | plan detail |
| `/plans/{plan_id}/days` | GET | optional Bearer | `PlanDaysResponse` | day list; Bearer may auto-enroll |
| `/plans/{plan_id}/days/{day_number}` | GET | guest ok | `PlanDayDTO` | public day preview (`subtasks`) |
| `/users/me/plans?status_filter=&series_id=&language=&skip=&limit=` | GET | required | `UserPlansResponse` | enrolled plans |
| `/users/me/plans` | POST | required | `UserPlanEnrollRequest` → **204** (no body) | enroll in plan |
| `/users/me/plans/{plan_id}` | GET | required | `UserPlanProgressResponse` (**single object**) | user plan progress |
| `/users/me/plans/{plan_id}` | DELETE | required | **204** (no body) | unenroll from plan |
| `/users/me/plan/{plan_id}/days/{day_number}` | GET | required | `UserPlanDayDetailsResponse` | user plan day content |
| `/users/me/plans/{plan_id}/days/completion_status` | GET | required | `UserPlanDayCompletionStatusResponse` | day completion map |
| `/users/me/tasks/{task_id}/complete` | POST | required | **204** (no body) | mark task complete |
| `/users/me/sub-tasks/{sub_task_id}/complete` | POST | required | **204** (409 = already done) | mark subtask complete |
| `/users/me/task/{task_id}` | DELETE | required | **204** (no body) | delete user task — note singular `task` |
| `/plan-items/{planItemId}/tasks` | GET | guest ok | — | tasks for a plan item |
| `/tasks/{id}` | GET / PUT | guest ok / required | — | task detail / update |
| `/recitations?language=**&search=` | GET | guest ok (`language` **required** in Swagger) | `RecitationsResponse` | recitation list |
| `/recitations/{text_id}` | POST | guest ok | `RecitationDetailsRequest` → `RecitationDetailsResponse` | recitation content |
| `/users/me/recitations` | GET | required | `UserRecitationsResponse` | saved list (`UserRecitationDTO`) |
| `/users/me/recitations` | POST | required | `CreateUserRecitationRequest` → **200** (empty) | save recitation |
| `/users/me/recitations/{text_id}` | DELETE | required | **204** | unsave recitation |
| `/users/me/recitations/order` | PUT | required | `UpdateRecitationOrderRequest` → **200** (empty) | reorder saved |

> Endpoints for **stalled** features (texts library, AI search, story view,
> meditation/prayer of the day) are intentionally omitted — see `stalled_features/`.
> Reader-specific text APIs will be added in `features/reader.md` when that PRD is
> researched.

> Each in-scope feature PRD documents full request/response shapes. Canonical schema:
> **Swagger** + **backend** (`WeBuddhist-Backend/pecha_api`).
> **Flutter drift** notes where the client parses a subset or differs.

## 6. Paginated list envelopes (Swagger)

All list endpoints below return `skip`, `limit`, and `total` except recitations list.

### Series — `SeriesListResponse`

```jsonc
// GET /series?language=en&skip=0&limit=10
// OpenAPI: SeriesListResponse  |  Flutter: reads `series` only  |  v2 useSeries: full envelope
{
  "series": [ /* SeriesListItemDTO[] */ ],
  "skip": 0,
  "limit": 10,
  "total": 42
}
```

### Plans — `PublicPlansResponse`

```jsonc
// GET /plans?language=en&tag=&skip=0&limit=20
// OpenAPI: PublicPlansResponse  |  Flutter: reads `plans` only
{
  "plans": [ /* PublicPlanDTO[] */ ],
  "skip": 0,
  "limit": 20,
  "total": 100
}
```

### User plans — `UserPlansResponse`

```jsonc
// GET /users/me/plans?language=en&skip=0&limit=20
{
  "plans": [ /* UserPlanDTO[] */ ],
  "skip": 0,
  "limit": 20,
  "total": 5
}
```

### User series enrollments — `UserSeriesEnrollmentsResponse`

```jsonc
// GET /users/me/series?skip=0&limit=20
// OpenAPI: `enrollments` array  |  Flutter: defensively extracts `series_id` only
{
  "enrollments": [ /* UserSeriesEnrollmentDTO[] */ ],
  "skip": 0,
  "limit": 20,
  "total": 3
}
```

### Recitations — catalog vs saved (no pagination)

```jsonc
// GET /recitations?language=en   ← language REQUIRED (public catalog)
// RecitationDTO: { text_id, title, image_url? }

// GET /users/me/recitations   ← saved list (different schema)
// UserRecitationDTO: { text_id, title, image_url?, language, display_order }
{
  "recitations": [ /* RecitationDTO[] or UserRecitationDTO[] */ ]
}
```

## 7. Acceptance criteria

- [ ] All feature hooks use the shared client (no scattered hardcoded `fetch`).
- [ ] Authorized requests include the correct token; guest requests omit it.
- [ ] 401 triggers a single refresh + retry, then surfaces auth error if still failing.
- [ ] Errors map to typed categories consumable by UI (offline vs server vs auth).
- [ ] React Query defaults documented and applied.
- [ ] Pagination works with `skip`/`limit`.

## 8. Open questions

- ~~Exact enroll endpoint paths~~ → resolved: series `POST /users/me/series`, plan
  `POST /users/me/plans` (see §5 and the series/plans PRDs).
- Caching: rely solely on React Query, or add persistent cache (offline)? See
  `foundation/03-local-storage-offline`.
- Does the backend return the documented failure categories via status codes only?
- **Swagger + backend verified (2026-06-11):** paths/methods/schemas for series, plans,
  recitation match `WeBuddhist-Backend/pecha_api`. Known drifts in feature PRDs (Flutter
  parses plan progress as array; public plan day uses `subtasks`, user day uses `sub_tasks`;
  recitation `language` required on list).
- User profile is **`/users/info`** (not `/users/me`) — see `features/settings-profile.md`.

## 9. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Base URL config | yes | partial | hardcoded in hooks |
| Auth header injection | yes | no | no shared client yet |
| Error mapping | yes | no | hooks throw generic Error |
| 401 refresh+retry | yes | no | |
| React Query setup | n/a | yes | `query.tsx` exists |
