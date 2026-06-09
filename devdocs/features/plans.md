# Plans — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/plans` |
| **v2 target** | TBD + `src/components/ui/molecules/cards/plan-card.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

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

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| plans list (by tag) | GET | guest ok | confirm path/params |
| plan by id | GET | guest ok (preview) | full plan + days/subtasks |
| enroll in plan | POST | required | |
| user plans | GET | required | enrolled plans + progress |
| mark day/subtask complete | POST/PATCH | required | |

`Plan` shape (from v2 `useSeries.ts`):

```ts
interface Plan {
  id: string; title: string; description: string; language: string;
  difficulty_level: string; image: ImageSizes; image_key: string;
  tags: string[]; status: string; featured: boolean; display_order: number;
  start_date: string; total_days: number; group_id: string | null;
}
```

> Confirm `UserPlansModel` and subtask DTO shapes from
> `features/plans/data/models/user/*` and `user_subtasks_dto.dart`.

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
- [ ] Day content renders (incl. inline TEXT subtasks) and links to reader.
- [ ] Mark-day-complete updates progress and persists.

## 9. Open questions

- Exact plan list/enroll/complete endpoints and payloads.
- Difference between special plans and regular plans in the data model.
- Plan vs series enrollment relationship.

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Plan list by tag | yes | no | |
| Plan preview | yes | no | `plan-card` molecule exists |
| Enroll | yes | no | |
| Day tracking + completion | yes | no | |
| Inline plan-text | yes | no | |
