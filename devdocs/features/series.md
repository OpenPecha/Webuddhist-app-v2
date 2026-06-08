# Series — Migration PRD

| | |
|---|---|
| **Status** | In progress |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/home` (series), `lib/features/home/data/repositories/series_repository.dart` |
| **v2 target** | `src/app/series/[id].tsx`, `src/hooks/useSeries.ts` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

A series is a curated collection of plans. The series detail screen shows cover image,
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
- **FR-2:** Display cover image, title, description, total days, plan count, plan list.
- **FR-3:** Metadata respects the active locale (not hardcoded `EN`) — see
  `foundation/04-i18n-theming`.
- **FR-4:** Enrollment action (authenticated only); guest is prompted to log in.
- **FR-5:** Reflect enrollment state (enrolled vs not) using user enrollments.
- **FR-6:** Tapping a plan → plan info/preview (see `features/plans`).
- **FR-7:** Loading / error / empty states.

## 6. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/series/{id}` | GET | guest ok | Series detail incl. `plans[]` |
| series enroll | POST | required | path TBD — confirm from Flutter datasource |
| user series enrollments | GET | required | `getUserSeriesEnrollments()` → Set<id> |

`SeriesDetail` shape (from v2 `useSeries.ts`):

```ts
interface SeriesDetail {
  id: string;
  metadata: { id: string; title: string; description: string; language: string }[];
  image: ImageSizes;
  image_key: string;
  author_id: string;
  featured: boolean;
  status: string;
  plans: Plan[];
  total_days: number;
  group_id: string | null;
}
```

Flutter repository methods to match: `getSeriesList`, `getSeriesById`, `enrollInSeries`,
`getUserSeriesEnrollments`.

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

- Exact enroll endpoint + payload (confirm `series_remote_datasource.dart`).
- Author display (`author_id`) — is there an author/creator detail screen?
  (relates to `creator_info` module).

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Load by id | yes | yes | `useSeriesById` |
| Render detail | yes | yes | |
| Locale-aware metadata | yes | no | hardcoded EN |
| Enrollment | yes | no | |
| Enrollment state | yes | no | |
