# Practice — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/practice` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Practice is the user's personal daily routine: time-blocked sessions built from series, plans
and recitations. Users build/edit a routine, select series/plans/recitations to include, and
the routine drives scheduled notifications.

**Note: this page will be renamed "Routine" and will be sub-page of the home page. V2 of the app will include a new Practice page with different content.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Practice screen | `features/practice/presentation/screens/practice_screen.dart` | `/practice` |
| Edit routine | `features/practice/presentation/screens/edit_routine_screen.dart` | `/practice/edit-routine` |
| Select plan | `features/practice/presentation/screens/select_plan_screen.dart` | `/practice/edit-routine/select-plan` |
| Select recitation/session | `features/practice/presentation/screens/select_session_screen.dart` | `/practice/edit-routine/select-recitation` |
| Routine item card | `features/practice/presentation/widgets/routine_item_card.dart` | — |
| Time block | `features/practice/presentation/widgets/routine_time_block.dart` | — |
| Filled/empty state | `features/practice/presentation/widgets/routine_filled_state.dart` | — |
| Routine model | `features/practice/data/models/routine_model.dart`, `routine_api_models.dart` | — |
| Repository | `features/practice/data/repositories/practice_items_repository_impl.dart` | — |
| API mapper | `features/practice/data/utils/routine_api_mapper.dart` | — |
| Providers | `features/practice/presentation/providers/{routine_provider,routine_api_providers}.dart` | — |

## 3. User stories

- As a **guest**, I see an empty practice screen (browse-only; building requires auth).
- As an **authenticated** user, I can build a routine of time blocks.
- As a **authenticated** user, I can add series, plans, and recitations to time blocks.
- As a user with series, plans, and/or recitations in my routine, my routine schedules reminders.

## 4. Functional requirements

- **FR-1:** Practice screen showing the current routine (filled/empty states).
- **FR-2:** Guest sees empty practice; building/editing requires auth
  (`/practice/edit-routine` is in `_protectedBasePaths`).
- **FR-3:** Edit routine: add/remove/reorder time blocks.
- **FR-4:** Select plan/series to add to a block (`select-plan`).
- **FR-5:** Select recitation/session to add to a block (`select-recitation`).
- **FR-6:** Persist routine via API + locally; drive notifications
  (`foundation/06-notifications`).
- **FR-7:** Launch-time auto-switch to Practice tab when a routine resolves (Flutter
  `initialPracticeTabResolvedProvider`) — confirm if desired in v2.
- **FR-8:** Loading / error / empty states.

## 5. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| user routine | GET | required | current routine |
| save/update routine | POST/PUT | required | |
| available plans | GET | required | for select-plan |
| available recitations | GET | required | for select-recitation |

> Confirm shapes from `routine_api_models.dart` + `routine_api_mapper.dart`.

## 6. State & persistence

- Routine persisted server-side; notification metadata persisted locally
  (`plan_started_at_*`, `plan_total_days_*`).

## 7. Navigation

Mirror nested routes under `src/app/practice/*`:
`edit-routine`, `edit-routine/select-plan`, `edit-routine/select-recitation`,
`details`, `plans/preview`, `plans/info`, `plans/info/details`.

## 8. Acceptance criteria

- [ ] Practice screen shows routine with correct filled/empty states.
- [ ] Guest sees empty state; editing requires auth.
- [ ] Add/remove plans + recitations to time blocks.
- [ ] Routine persists and reschedules notifications.
- [ ] Auto-switch behavior matches decision.

## 9. Open questions

- Routine data model + endpoints (from `routine_api_models.dart`).
- Keep the launch-time auto-switch-to-practice behavior?
- Practice tab placement (see shell PRD).

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Practice screen | yes | no | |
| Edit routine | yes | no | |
| Select plan/recitation | yes | no | |
| Persist + notifications | yes | no | |
