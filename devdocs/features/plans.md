# Plans — Migration PRD

| | |
|---|---|
| **Status** | PRD draft (mockup research complete) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/plans` |
| **v2 target** | `src/app/plans/[id].tsx`, `src/app/practice/details.tsx`, `src/components/plans/*` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 (mockup research + implementation alignment) |

---

## 1. Summary

Plans are day-structured practice/study programs (within a series or standalone). Users
browse plans by tag, preview a plan, enroll, and track day-by-day progress with
completion.

## 2a. v2 current state

| Screen | v2 file | Status |
|--------|---------|--------|
| Plan preview | `src/app/plans/[id].tsx` | **Parity** — square day cards, activity task rows, tap → reader/plan-text (`preview=1`, no completion) |
| Plan track | `src/app/practice/details.tsx` | **Parity** — day cards, checkboxes, Practice Now, completion APIs |
| Plan components | `src/components/plans/*` | `PlanDayCarousel` (card only), `PlanTaskList` (activity rows), `PlanNavigator` |
| Services | `src/services/plans.ts` | Catalog + enrolled reads; preview uses `GET /plans/{id}/days/{n}` |

## 2b. Mockup redesign (`plan_design_revamp`, `Missed_days_flow`)

Design reference: shared mockup sets. Full index:
[`devdocs/research/mockup-screen-index.md`](../research/mockup-screen-index.md).

### Plan preview / detail (`/plans/[id]`) — P0

| Element | Spec | Flutter | API |
|---------|------|---------|-----|
| Hero cover | Top image ~25–40% | `PlanCoverImage` | `GET /plans/{id}` |
| Title + day count | Header area | preview + info screens | `total_days` |
| Intro description | Body text | plan description | |
| Day carousel | Horizontal 1..N square cards; day # + date; check = completed | `DayCarousel` | `PlanDayCarousel` (same card UI on preview + track) |
| Task list | Title + chevron/play (preview read-only; track + checkbox) | `PreviewActivityList` / `ActivityList` | `PlanTaskList` — tap opens child reader |
| Practice Now | Sticky black CTA | opens first incomplete task | enrolled only |

### Plan track enhancements — P1

| Element | Spec | Flutter widget |
|---------|------|----------------|
| Task completion toggles | Circle → checkmark | `ActivityList` + POST complete |
| Day completion sheet | Bottom sheet on day done | `DayCompletionBottomSheet` |
| Missed days badge | Count + tap → first missed | `MissedDaysBadge` |
| On track badge | When zero missed | `OnTrackBadge` |
| Reader bar | Prev / play / Next | `PlanNavigator` |

### Day status rules (from Flutter)

**Carousel future lock** (`lockFutureDays: true`):

```
isDisabled = dayDate > today && dayNumber > previewUnlockDayCount
previewUnlockDayCount = 10 for first plan in series only (SeriesPlanUtils)
```

**Missed days:** `PlanUtils.calculateMissedDays(startDate, totalDays, completionMap)`

See [`open-questions.md`](../research/open-questions.md) §3 — Shorts maps to `PlanDayDTO.videos[]` on day endpoints (`GET /plans/{id}/days/{n}` or user day endpoint). Hide when empty; P2 with plan track.

### Scope tiers

| Tier | Deliverable |
|------|-------------|
| v1 | `/plans/[id]` layout + day list + carousel (read-only preview); enrollment gate via list membership in `GET /users/me/plans` |
| v2 | Enrolled track: completion, Practice Now, missed days |
| v3 | Reader/plan-text; day videos strip (mockup Shorts) |

## 3. Flutter reference map

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
| Day carousel | `features/plans/presentation/widgets/day_carousel.dart` | — |
| Activity list | `features/plans/presentation/widgets/plan_track/activity_list.dart` | — |

## 4. User stories

- As any user, I can browse plans, search for plans by tag and preview plans (guest preview allowed).
- As any user, I can see day-by-day content.
- As an **authenticated** user, I can enroll in a plan.
- As an enrolled user, when I complete tasks, they are marked complete.
- As an enrolled user, when I complete all the tasks in a day, the day is marked complete.
- As an enrolled user, I can track progress (see marks on completed days and lack of a check mark on days I haven't completed).
- As a user, I am informed of the number of days I have missed so I can find missed days and catch up.

## 5. Functional requirements

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

## 6. API contracts

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

## 7. State & persistence

| Data | Flutter key |
|------|-------------|
| Plan started-at | `plan_started_at_<planId>` |
| Plan total days | `plan_total_days_<planId>` |
| Day-shown idempotency | `plan_immediate_shown_<planId>_<date>` |

Special "ITCC-like" plans use `special_plan_*` keys (see notifications PRD).

## 8. Navigation

**Dual routes (Flutter parity)** — preview and track are separate screens; shared components
(`PlanHero`, `PlanDayCarousel`, `PlanTaskList`) are reused across both. No single-route merge.

| Flutter route | v2 route | When |
|---------------|----------|------|
| `/practice/plans/preview` | `src/app/plans/[id].tsx` | Guest or not enrolled — read-only preview |
| `/practice/details` | `src/app/practice/details.tsx` | Enrolled — track mode (`planId`, `selectedDay?`, `title?`) |
| Series plan row (not enrolled) | `src/app/plans/[id].tsx` | From `series/[id].tsx` |
| Series plan row (enrolled) | `src/app/practice/details.tsx` | Same params as track |
| `/practice/plans/info` | TBD or merged into `/plans/[id]` | catalog plan |
| `/home/plans/:tag` | `src/app/plans/[tag].tsx` (TBD) | tag |
| `/plan-text/:subtaskId` | `src/app/plan-text/[subtaskId].tsx` (TBD) | NavigationContext |

**Enrollment gate:** On `plans/[id]` mount, if authed and plan id is in `GET /users/me/plans`,
`router.replace` to `/practice/details` with `planId`, `title`, and `selectedDay` from calendar start.

**Track screen data (Flutter parity):** [`src/app/practice/details.tsx`](../../src/app/practice/details.tsx) does **not** call `GET /users/me/plans/{id}`. It resolves `UserPlan` from the user plans list, loads day tasks via `GET /users/me/plan/{id}/days/{n}`, and completion via `GET /users/me/plans/{id}/days/completion_status`.

**Plan reading (SOURCE_REFERENCE):** [`src/app/reader/[textId].tsx`](../../src/app/reader/[textId].tsx) loads segment text via **`POST /texts/{source_text_id}/details`** with `segment_id` from the subtask's `segment_ids[0]` (or `pecha_segment_id`). Do **not** use `GET /texts/{id}` — that route does not exist on the backend. Inline TEXT subtasks use [`src/app/plan-text/[subtaskId].tsx`](../../src/app/plan-text/[subtaskId].tsx) and subtask `content` from the day API.

**Plan reading navigation (Flutter parity):** [`usePlanReadingSession`](../../src/hooks/usePlanReadingSession.ts) exposes unified `navigate('next' | 'prev' | 'finish')` with an `isNavigating` guard (shared by arrows and swipe). **Next** (arrow or swipe left) and **finish** (checkmark on last item) call **`POST /users/me/sub-tasks/{id}/complete`** via [`plan-subtask-completion.ts`](../../src/utils/plan-subtask-completion.ts) (session-scoped dedup; 409 treated as success). Next completes fire-and-forget before `router.replace`; finish awaits completion then `router.back()`. **Previous** (arrow or swipe right) navigates only — no completion POST. Query invalidation: `userPlanDay` + `completionStatus`. Swipe thresholds in [`plan-reading.ts`](../../src/constants/plan-reading.ts) match Flutter: velocity ≥ 300 or drag > 20% screen width; [`PlanReadingLayout`](../../src/components/plans/PlanReadingLayout.tsx) applies optional content translate while dragging. Reference: Flutter `PlanSubtaskCompletionService`, `plan_text_screen.dart`, `swipe_navigation_wrapper.dart`.

**Plan reading audio (Flutter parity):** Audio is owned per subtask screen via [`usePlanSegmentAudio`](../../src/hooks/usePlanSegmentAudio.ts) + [`PlanSegmentAudioController`](../../src/components/plans/PlanSegmentAudioController.ts) (mirrors Flutter `PlanSegmentAudioController`). Controller re-inits on `subTaskId` change (not just URL — day-level tracks share one URL). `cancel()` stops and `remove()`s the native player; called **before** every navigation (`onBeforeNavigate` in session hook), on header back (`onBeforeBack`), screen blur (`useFocusEffect`), and unmount (`dispose`). Segment windows: `startMs` / `endMs` on [`PlanTextItem`](../../src/types/plan-navigation.ts) seek entry and pause at boundary. Auto-advance on segment end is not wired yet (follow-up).

> Plan navigation uses directional transitions in Flutter
> (`buildPlanNavigationTransition`). Parity is nice-to-have.

## 9. Acceptance criteria

- [ ] Browse plans by tag with proper states.
- [ ] Guest can preview; auth required to enroll/track.
- [ ] Enroll writes plan metadata for notifications.
- [ ] Authenticated user can unenroll; progress removed; enrolled list refreshes.
- [ ] Day content renders (incl. inline TEXT subtasks) and links to reader.
- [ ] Mark-day-complete updates progress and persists.

## 10. Open questions

**Implementation notes (not product blockers):**

- **Verify at runtime:** `GET /users/me/plans/{plan_id}` — Swagger says single
  `UserPlanProgressResponse`; Flutter parses as `List<PlanProgressModel>`.
- Difference between special plans and regular plans in the data model.

**Resolved** — see [`open-questions.md`](../research/open-questions.md):

- [x] Plan vs series enrollment — series enroll creates enrollment record; plan progress
  via routine `_enroll_plans` or `start_immediately` — [series.md §6a](./series.md).
- [x] Dual-route navigation — preview at `/plans/[id]`, track at `/practice/details`.
- [x] Shorts mockup — maps to `PlanDayDTO.videos[]` on day endpoints; P2 — §3.

## 11. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Plan list by tag | yes | no | |
| Plan preview `/plans/[id]` | yes | no | mockup P0 |
| Day carousel | yes | no | |
| Plan track | yes | partial | minimal details screen |
| Enroll | yes | no | |
| Unenroll | yes | no | |
| Day tracking + completion | yes | no | |
| Practice Now CTA | yes | no | |
| Missed days UI | yes | no | utils exist |
| Inline plan-text | yes | no | |
| Shorts (mockup) | no | no | `PlanDayDTO.videos[]` — P2; [open-questions §3](../research/open-questions.md) |

## 12. Research references

| Document | Purpose |
|----------|---------|
| [flutter-series-plans-connect-routes.md](../research/flutter-series-plans-connect-routes.md) | Plan screen variants + navigation |
| [mockup-screen-index.md](../research/mockup-screen-index.md) | Plan mockup frames |
| [api-to-screen-matrix.md](../research/api-to-screen-matrix.md) | Plan endpoints |
| [series-plans-connect-gap-matrix.md](../research/series-plans-connect-gap-matrix.md) | Gap analysis |
