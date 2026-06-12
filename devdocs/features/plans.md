# Plans — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/plans` |
| **v2 target** | TBD + `src/components/ui/molecules/cards/plan-card.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-11 |

---

## 1. Summary

Plans are day-structured practice/study programs (within a series or standalone). Users
browse plans by tag, preview a plan, enroll, and track day-by-day progress with
completion.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Plan list (by tag) | `features/home/presentation/screens/plan_list_screen.dart` | `/home/plans/:tag` |
| Plan preview details | `features/plans/presentation/widgets/plan_preview/plan_preview_details.dart` | `/home/plans/:tag/preview`, `/practice/plans/preview` |
| Plan info | `features/plans/presentation/plan_info.dart` | `/plans/info`, `/practice/plans/info` |
| Plan details / track | `features/plans/presentation/widgets/plan_track/plan_details.dart` | `/plans/details`, `/practice/details` |
| Day completion sheet | `features/plans/presentation/widgets/day_completion_bottom_sheet.dart` | — |
| Plan card | `features/plans/presentation/widgets/plan_card.dart`, `user_plan_card.dart` | — |
| Plan entity | `features/plans/domain/entities/plan.dart` | — |
| Plan models | `features/plans/data/models/plans_model.dart`, `user/user_plans_model.dart` | — |
| User plans provider | `features/plans/presentation/providers/user_plans_provider.dart` | — |

## 3. User stories

- As any user, I can browse plans, search for plans by tag and preview plans (guest preview allowed).
- As an any user, I can see day-by-day content.
- As an **authenticated** user, I can enroll in a plan.
- As an enrolled user, when I complete tasks, they are marked complete.
- As an enrolled user, when I complete all the tasks in a day, the day is marked complete.
- As an enrolled user, I can track progress (see marks on completed days and lack of a check mark on days I haven't completed).
- As a user, I am informed of the number of days I have missed so I can find missed days and catch up.

## 4. Functional requirements

- **FR-1:** Plan list filtered by tag.
- **FR-2:** Plan info page in preview mode (guest-accessible): cover, title, description, calendar of days, task list for each day. (Users can click into tasks and see the content of individual tasks, but progress is not tracked and checkboxes don't appear next to tasks)
- **FR-3:** Enroll action on plan info page.
- **FR-4:** Plan details/track: per-day content, current day, missed days listed, completed days checked, checkboxes per tasks, completed tasks get a check mark.
- **FR-5:** Day completion flow (bottom sheet) with progress update: e.g., Day 1 of 8 completed.
- **FR-6:** Enrollment writes plan metadata used by notifications
  (`plan_started_at_<id>`, `plan_total_days_<id>`) — see `foundation/06-notifications`.
- **FR-7:** Day content can include TEXT subtasks rendered inline (`/plan-text/:subtaskId`)
  and links into the reader (`source: plan`).
- **FR-8:** Loading / error / empty states.

## 5. API contracts

**Sources:** Flutter `plans/user_plans/plan_days/tasks_remote_datasource.dart` +
`data/models/**` · Swagger `openapi.json` · Backend `WeBuddhist-Backend/pecha_api/plans/public/plan_views.py`,
`plan_response_models.py`, `plans/users/plan_users_views.py`. Public routes only — no `/cms`.
Base URL + auth: see `foundation/02-api-networking.md` §5.

| Endpoint | Method | Auth | OpenAPI schema | Notes |
|----------|--------|------|----------------|-------|
| `/plans?tag=&group_id=&search=&language=&sort_by=&sort_order=&skip=&limit=` | GET | guest ok | `PublicPlansResponse` | Catalog; `skip` default 0, `limit` default 20 |
| `/plans/{plan_id}` | GET | optional | `PublicPlanDTO` | Single plan preview |
| `/plans/{plan_id}/days` | GET | optional Bearer | `PlanDaysResponse` | Day list; Bearer may trigger auto-enroll |
| `/plans/{plan_id}/days/{day_number}` | GET | guest ok | `PlanDayDTO` | Public day preview (tasks use `subtasks`) |
| `/users/me/plans?status_filter=&series_id=&language=&skip=&limit=` | GET | required | `UserPlansResponse` | Enrolled plans |
| `/users/me/plans` | POST | required | `UserPlanEnrollRequest` → **204** | Enroll `{ "plan_id": "uuid" }` |
| `/users/me/plans/{plan_id}` | GET | required | `UserPlanProgressResponse` (**single object**) | Plan progress |
| `/users/me/plans/{plan_id}` | DELETE | required | **204** (no body) | Unenroll |
| `/users/me/plan/{plan_id}/days/{day_number}` | GET | required | `UserPlanDayDetailsResponse` | User day w/ tasks + subtasks |
| `/users/me/plans/{plan_id}/days/completion_status` | GET | required | `UserPlanDayCompletionStatusResponse` | Per-day completion |
| `/users/me/tasks/{task_id}/complete` | POST | required | **204** (no body) | Mark task complete |
| `/users/me/sub-tasks/{sub_task_id}/complete` | POST | required | **204** (409 = already done → success) | Mark subtask complete |
| `/users/me/task/{task_id}` | DELETE | required | **204** (no body) | Delete task — path is singular `task` |

> No PATCH for completions — use **POST** `.../complete`. Enrollment is `POST /users/me/plans`.

### Catalog list — `PublicPlansResponse` / `PublicPlanDTO`

**Query params (Swagger):** `tag`, `group_id`, `search`, `language`, `sort_by`, `sort_order`,
`skip`, `limit`.

```jsonc
// GET /plans?language=en&tag=&skip=0&limit=20  → 200
{
  "plans": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "language": "string",
      "difficulty_level": "DifficultyLevel|null",   // beginner | intermediate | advanced
      "image": { "thumbnail": "...", "medium": "...", "original": "..." },
      "total_days": 0,
      "tags": [ { "id": "uuid", "name": "string" } ],
      "author": { "id": "uuid", "firstname": "string", "lastname": "string" },
      "start_date": "datetime|null",               // Swagger: date-time
      "display_order": 0,
      "group_id": "uuid|null"
    }
  ],
  "skip": 0,
  "limit": 20,
  "total": 100
}
```

`GET /plans/{plan_id}` returns a single `PublicPlanDTO` (no wrapper).

**Swagger vs Flutter drift:** Flutter `PlansModel` also accepts legacy top-level `image_url`
and parses `start_date` as a calendar date (`YYYY-MM-DD`). Swagger has `group_id`; Flutter
`PlansModel` does not map it (v2 `Plan` type does).

### Plan day list — `PlanDaysResponse`

```jsonc
// GET /plans/{plan_id}/days  → 200
// Optional Authorization: Bearer … — backend may auto-enroll authenticated user (plan_views.py)
{
  "days": [
    { "id": "string", "day_number": 1 }   // PlanDayBasic — id is string, not UUID
  ]
}
```

`GET /plans/{plan_id}/days/{day_number}` returns a single `PlanDayDTO` (guest ok). Public
tasks nest subtasks under **`subtasks`** (not `sub_tasks`). Flutter maps to `PlanDaysModel`
with optional `tasks`, `audio_url`, `audio_duration_ms`.

### Enrolled plans — `UserPlansResponse` / `UserPlanDTO`

```jsonc
// GET /users/me/plans?language=en&skip=0&limit=20  → 200
{
  "plans": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "language": "string",
      "difficulty_level": "string",
      "image": { "thumbnail": "...", "medium": "...", "original": "..." },
      "started_at": "2026-01-01T00:00:00Z",
      "total_days": 0,
      "tags": [ { "id": "uuid", "name": "string" } ],
      "start_date": "datetime|null",
      "display_order": 0,
      "group": { /* AuthorGroupSummaryDTO | null */ }
    }
  ],
  "skip": 0,
  "limit": 20,
  "total": 5
}
```

**Swagger vs Flutter drift:** Flutter `UserPlansModel` also reads legacy `image_url` and
defaults `started_at` to `DateTime.now()` if absent.

### Enroll in plan — `UserPlanEnrollRequest`

```jsonc
// POST /users/me/plans
{ "plan_id": "uuid" }    // required
// → 204 No Content (backend plan_users_views.py)
```

### Unenroll from plan

```jsonc
// DELETE /users/me/plans/{plan_id}
// → 204 No Content (no body, no request body)
// Backend: plan_users_views.py → unenroll_user_from_plan → delete_user_plan_progress
```

- **Auth:** required (`Bearer` ID token).
- **Effect:** deletes user plan progress, task completions, and related enrollment data for
  that plan (cascade in `plan_users_progress_repository.py`).
- **Errors:** **404** if user is not enrolled (`NOT_FOUND` — `"User is not enrolled in plan
  with ID …"`).
- **Flutter:** `user_plans_remote_datasource.dart` → `unenrollFromPlan(planId)`;
  `dio.delete('/users/me/plans/$planId')`; treats any 2xx as success.
- **Flutter UI:** confirmation dialog + snackbar in `plan_details.dart`, `my_plan_tab.dart`,
  `user_plan_card.dart` (via `userPlanUnsubscribeFutureProvider`).

> Unenrolling a plan is separate from removing it from a **routine** session
> (`DELETE /users/me/task/{task_id}`) — routine removal does not call plan unenroll.

### Plan progress — `UserPlanProgressResponse`

```jsonc
// GET /users/me/plans/{plan_id}  → 200
{
  "id": "uuid",
  "user_id": "uuid",
  "plan_id": "uuid",
  "plan": { /* object — additionalProperties in OpenAPI */ },
  "started_at": "2026-01-01T00:00:00Z",
  "streak_count": 0,
  "longest_streak": 0,
  "status": "string",
  "is_completed": false,
  "completed_at": "datetime|null",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Backend vs Flutter drift:** Backend `get_user_plan_progress` returns a **single**
`UserPlanProgressResponse` (`plan_users_views.py`); Flutter
`getUserPlanProgressDetails` parses as **`List<PlanProgressModel>`** — Flutter bug. **v2
must use the single-object shape.**

### User plan day content — `UserPlanDayDetailsResponse`

Tasks: `UserTaskDTO` · Subtasks: `UserSubTaskDTO`

```jsonc
// GET /users/me/plan/{plan_id}/days/{day_number}  → 200
{
  "id": "uuid",
  "day_number": 1,
  "is_completed": false,
  "audio_url": "https://...|null",
  "audio_duration_ms": 0,
  "tasks": [
    {
      "id": "uuid",
      "title": "string",
      "estimated_time": 0,          // nullable (minutes)
      "display_order": 0,
      "is_completed": false,
      "sub_tasks": [
        {
          "id": "uuid",
          "is_completed": false,
          "content_type": "ContentType",    // enum — e.g. TEXT, VIDEO, etc.
          "content": "string",
          "display_order": 0,
          "duration": "string|null",
          "audio_url": "https://...|null",  // Swagger only — Flutter UserSubtasksDto ignores
          "source_text_id": "uuid|null",
          "pecha_segment_id": "string|null",
          "segment_ids": ["uuid"],
          "start_ms": 0,
          "end_ms": 0
        }
      ]
    }
  ]
}
```

**Swagger vs Flutter drift:** Swagger `UserSubTaskDTO` includes `audio_url`; Flutter
`UserSubtasksDto` does not parse it. v2 should include `audio_url` if the API returns it.

### Day completion status — `UserPlanDayCompletionStatusResponse`

```jsonc
// GET /users/me/plans/{plan_id}/days/completion_status  → 200
{
  "days": [ { "day_number": 1, "is_completed": true } ],
  "start_date": "2026-01-01T00:00:00Z"   // optional — backend UserPlanDayCompletionStatusResponse
}
// client maps to { [dayNumber]: isCompleted }
```

### Mark complete

```jsonc
// POST /users/me/tasks/{task_id}/complete         → 204 (no body)
// POST /users/me/sub-tasks/{sub_task_id}/complete → 204 (409 = already complete → success)
```

## 6. State & persistence

| Data | Flutter key |
|------|-------------|
| Plan started-at | `plan_started_at_<planId>` |
| Plan total days | `plan_total_days_<planId>` |
| Day-shown idempotency | `plan_immediate_shown_<planId>_<date>` |

Special "ITCC-like" plans use `special_plan_*` keys (see notifications PRD).

## 7. Navigation

| Flutter route | v2 route (TBD) | Params |
|---------------|----------------|--------|
| `/home/plans/:tag` | `src/app/plans/[tag].tsx` | tag |
| `/plans/info` | `src/app/plans/info.tsx` | plan |
| `/plans/details` | `src/app/plans/details.tsx` | plan, selectedDay, startDate |
| `/plan-text/:subtaskId` | `src/app/plan-text/[subtaskId].tsx` | NavigationContext |

> Plan navigation uses directional transitions in Flutter
> (`buildPlanNavigationTransition`). Parity is nice-to-have.

## 8. Acceptance criteria

- [ ] Browse plans by tag with proper states.
- [ ] Guest can preview; auth required to enroll/track.
- [ ] Enroll writes plan metadata for notifications.
- [ ] Authenticated user can unenroll; progress removed; enrolled list refreshes.
- [ ] Day content renders (incl. inline TEXT subtasks) and links to reader.
- [ ] Mark-day-complete updates progress and persists.

## 9. Open questions

- **Verify at runtime:** `GET /users/me/plans/{plan_id}` — Swagger says single
  `UserPlanProgressResponse`; Flutter parses as `List<PlanProgressModel>`.
- Difference between special plans and regular plans in the data model.
- [x] Plan vs series enrollment relationship (enrolling in a series auto-enrolls its plans —
  see `features/series.md` §6).

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Plan list by tag | yes | no | |
| Plan preview | yes | no | `plan-card` molecule exists |
| Enroll | yes | no | |
| Unenroll | yes | no | `DELETE /users/me/plans/{plan_id}` |
| Day tracking + completion | yes | no | |
| Inline plan-text | yes | no | |
