# Home — Migration PRD

| | |
|---|---|
| **Status** | In progress (partial) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/home` |
| **v2 target** | `src/app/(tabs)/index.tsx` + `src/components/ui/molecules/homepage/*` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

The home tab is the app's landing screen. Currently, it contains a title: Home; a search bar, where users can search for plans and series via tags; and series and standalone cards. The cards lead to the series, which contains all the plans in the series, or a standalone plan

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Home screen | `features/home/presentation/screens/home_screen.dart` | `/home` |
| Series card | `features/home/presentation/widgets/series_card.dart` | — |
| Plan list view | `features/home/presentation/widgets/plan_list_view.dart` | — |
| Series provider | `features/home/presentation/providers/series_provider.dart` | — |
| Series entity | `features/home/domain/entities/series.dart` | — |

Home also: requests notification permission on load, shows an update banner
(`upgrade_provider`), and triggers plan-enrollment hooks.

## 3. v2 current state

`src/app/(tabs)/index.tsx` renders greeting + `Calander`, `Quotation`, `Challenge`,
`Recitation` molecules. Series/plan discovery lists and the permission/update flows are
**not yet** present.

## 4. User stories

- As any user, I can browser series and plans.
- As any user, I can search for series and plans.
- As any user, I can tap a series to open its detail.

## 5. Functional requirements

- **FR-1:** Home title.
- **FR-2:** Search bar, where users search for content. Results are tag-based.
- **FR-3:** Series discovery list (horizontal/vertical) using `/series`.
- **FR-4:** Plan list / continue-reading entry points (link to `features/plans`).
- **FR-5:** Tapping a series → `series/[id]`.
- **FR-6:** Trigger notification-permission prompt after onboarding (see
  `foundation/06-notifications`).
- **FR-7:** Update banner (app upgrade).
- **FR-8:** Loading skeletons + error + empty states.

## 6. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/series?language=&skip=&limit=` | GET | guest ok | Series list (paginated) |

See `foundation/02-api-networking` for the response envelope; `features/series` for the
full `Series` shape.

## 7. Navigation

| Flutter route | v2 route |
|---------------|----------|
| `/home` | `src/app/(tabs)/index.tsx` |
| `/home/series/:id` | `src/app/series/[id].tsx` |
| `/home/plans/:tag` | TBD (`features/plans`) |
| `/home/meditation_of_the_day` | `features/meditation-prayer-of-day` |
| `/home/prayer_of_the_day` | `features/meditation-prayer-of-day` |
| `/home/stories` | `features/story-view` |

## 8. UI / UX parity notes

- v2 home composition differs from Flutter (molecule-based). Confirm which Flutter home
  sections are required vs which v2 molecules are new/intentional.
- Greeting randomization is a v2 addition (`src/lib/greeting`).

## 9. Acceptance criteria

- [ ] Greeting correct for guest vs authenticated.
- [ ] Series list loads from `/series` with pagination, skeletons, error/empty states.
- [ ] Series tap opens correct detail.
- [ ] Daily content widgets render with real/placeholder data.
- [ ] Notification permission prompt fires at the correct time (post-onboarding).

## 10. Open questions

- Which home sections are P0 vs later? (Flutter home is dense.)
- Is the update banner in scope for v1?
- Are `Calander`/`Challenge`/`Quotation` backed by real APIs or placeholders?

## 11. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Greeting | yes | yes | randomized in v2 |
| Daily widgets | yes | partial | molecules exist |
| Series list | yes | no | hook exists, not wired on home |
| Permission prompt | yes | no | |
| Update banner | yes | no | confirm scope |
