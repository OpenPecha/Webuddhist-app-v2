# Practice — Migration PRD

| | |
|---|---|
| **Status** | In progress (explore tab + routine + edit-routine exist) |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/practice` |
| **v2 target** | `src/app/(tabs)/practice/*`, `src/app/practice/edit-routine/*`, `src/app/practice/details.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-07-27 (practice explore tab) |

---

## 1. Summary

Practice is the user's personal daily routine: time-blocked sessions built from series, plans
and recitations. Users build/edit a routine, select series/plans/recitations to include, and
the routine drives scheduled notifications.

The Practice **tab** itself is an explore hub (Plans, My practices, Bookmarks, Chants,
Accumulations, Meditation Timer); the routine list lives behind the "My practices" button at
`/practice/my-practices`, matching Flutter.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Practice explore tab | `features/practice/presentation/screens/practice_explore_screen.dart` | `/practice` |
| My practices (routine) | `features/practice/presentation/screens/practice_screen.dart` | `/practice/my-practices` |
| Section container | `features/practice/presentation/widgets/practice_section_container.dart` | — |
| Plan carousel card | `features/practice/presentation/widgets/practice_plan_card.dart` | — |
| Action buttons | `features/practice/presentation/widgets/practice_tab_button.dart` | — |
| Accumulation circle | `features/practice/presentation/widgets/practice_accumulation_circle_item.dart` | — |
| Timer card | `features/practice/presentation/widgets/practice_timer_card.dart` | — |
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

## 2a. v2 current state

| Screen / flow | v2 file | Status |
|---------------|---------|--------|
| Practice explore tab | `src/app/(tabs)/practice/index.tsx` | Done — Plans / Chants / Accumulations / Timers sections, action buttons, guest gating |
| My practices (routine) | `src/app/(tabs)/practice/my-practices.tsx` | Partial — routine display, login gating, plan card nav |
| Plans "See all" | `src/app/(tabs)/practice/plans.tsx` → `AllPlansView` | Done — shared with root `/plans` |
| Chants "See all" | `src/app/(tabs)/practice/chants.tsx` → `RecitationsBrowseView` | Done — shared with Home `/recitations` |
| Chants search | `src/app/(tabs)/practice/chants-search.tsx` → `RecitationsSearchView` | Done |
| Accumulations "See all" | `src/app/(tabs)/practice/accumulations.tsx` | Done — 2-column bead grid |
| Timers "See all" | `src/app/(tabs)/practice/timers.tsx` → `PresetTimersView` | Done — shared with root `/timers` |
| Bookmarks | `src/app/(tabs)/practice/bookmarks.tsx` → `BookmarksView` | Done — shared with `/me/bookmarks` |
| Edit routine | `src/app/practice/edit-routine/index.tsx` | Partial — time blocks, plan/recitation select; **missing SERIES session type + `enrollSeriesId` prefill** |
| Select plan | `src/app/practice/edit-routine/select-plan.tsx` | Exists |
| Select recitation | `src/app/practice/edit-routine/select-recitation.tsx` | Exists |
| Plan track | `src/app/practice/details.tsx` | Minimal — chevron day nav; see [plans.md](./plans.md) |

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

Two directories feed the `/practice` prefix:

- `src/app/(tabs)/practice/*` — tab stack, bottom tab bar stays visible
  (`index`, `my-practices`, `plans`, `chants`, `chants-search`, `accumulations`, `timers`, `bookmarks`).
- `src/app/practice/*` — full-screen root stack (`details`, `edit-routine`, `edit-routine/select-*`).

Explore tap targets: plan card → `/series/{id}`, chant → `/reader/[textId]`,
accumulation → `/mala?initialPresetId=`, timer → `/timers/active`. Bookmarks, accumulation and
timer taps open the login drawer for guests.

Notification deep links are consumed by `usePendingRoutineNavigation()` in
`src/app/(tabs)/practice/_layout.tsx`, so they still fire when the tab opens on the explore hub.

| Flow | v2 route | Notes |
|------|----------|-------|
| Plan track (enrolled) | `src/app/practice/details.tsx` | Dual-route parity — not merged into `/plans/[id]`; see [plans.md §8](./plans.md) |
| Post-series enroll | `src/app/practice/edit-routine/index.tsx` | Param `enrollSeriesId`; inject SERIES session — [series.md §6a](./series.md), [open-questions §1](../research/open-questions.md) |

Legacy Flutter routes `plans/preview`, `plans/info` map to [plans.md](./plans.md) preview at `/plans/[id]`.

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

**Resolved (series enroll):** Post-series enroll → edit-routine with `enrollSeriesId` and
SERIES routine session — see [open-questions.md §1](../research/open-questions.md).

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Practice explore tab | yes | yes | Plans / Chants / Accumulations / Timers + action buttons |
| Practice screen | yes | partial | routine at `/practice/my-practices` |
| Edit routine | yes | partial | missing SERIES type |
| Select plan/recitation | yes | yes | |
| SERIES enroll prefill | yes | no | see series.md §6a |
| Plan track screen | yes | partial | `practice/details.tsx` |
| Persist + notifications | yes | partial | |

## 11. Research references

| Document | Purpose |
|----------|---------|
| [open-questions.md](../research/open-questions.md) | Post-enroll navigation §1 |
| [series.md](./series.md) | SERIES routine session §6a |
| [plans.md](./plans.md) | Plan track dual routes |
