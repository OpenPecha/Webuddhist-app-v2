# API & Networking — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P0 |
| **Flutter baseline** | `lib/core/network/*` |
| **v2 target** | `src/lib/*`, `src/hooks/*`, `src/providers/query.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

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
| AI streaming (SSE) | `core/network/ai_dio_client.dart`, `dio_client.sendStreamedRequest` |

Flutter interceptor order (matters): **auth → cache → retry → error → logging**.

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
- **FR-7:** SSE/streaming support for AI search (see `features/ai-search`).
- **FR-8:** Consistent list pagination params: `skip`, `limit` (+ `language`),
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

| Endpoint | Method | Auth | Used by |
|----------|--------|------|---------|
| `/series?language=&skip=&limit=` | GET | guest ok | home, series |
| `/series/{id}` | GET | guest ok | series detail |
| `/series/{id}/enroll` (TBD path) | POST | required | series enroll |
| `/plans*` | GET | guest ok (preview) | plans |
| user plans / enrollment | GET/POST | required | plans, practice |
| recitations | GET | guest ok | recitation |
| texts / collections / chapters / versions | GET | guest ok | reader, texts |
| AI search (SSE) | POST/stream | TBD | ai-search |

> Each feature PRD owns documenting the precise request/response shapes from the
> Flutter `data/models` for its endpoints.

## 6. Response envelope example (series list)

```jsonc
// GET /series?language=en&skip=0&limit=10
{
  "series": [ /* Series[] */ ],
  "skip": 0,
  "limit": 10,
  "total": 42
}
```

(Confirmed against v2 `src/hooks/useSeries.ts`.)

## 7. Acceptance criteria

- [ ] All feature hooks use the shared client (no scattered hardcoded `fetch`).
- [ ] Authorized requests include the correct token; guest requests omit it.
- [ ] 401 triggers a single refresh + retry, then surfaces auth error if still failing.
- [ ] Errors map to typed categories consumable by UI (offline vs server vs auth).
- [ ] React Query defaults documented and applied.
- [ ] Pagination works with `skip`/`limit`.

## 8. Open questions

- Exact enroll endpoint paths (confirm from Flutter `*_remote_datasource.dart`).
- Caching: rely solely on React Query, or add persistent cache (offline)? See
  `foundation/03-local-storage-offline`.
- Does the backend return the documented failure categories via status codes only?

## 9. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Base URL config | yes | partial | hardcoded in hooks |
| Auth header injection | yes | no | no shared client yet |
| Error mapping | yes | no | hooks throw generic Error |
| 401 refresh+retry | yes | no | |
| React Query setup | n/a | yes | `query.tsx` exists |
