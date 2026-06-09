# Recitation — Migration PRD

| | |
|---|---|
| **Status** | In progress (partial) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/recitation` |
| **v2 target** | `src/app/(tabs)/screens/recitation/index.tsx`, `src/components/ui/molecules/cards/recitation-card.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Recitations are chant texts. Authenticated users add them to a practice routine on the
Practice page. Once a recitation is in their routine, they can tap its card on the routine
page to open it in the reader and recite it.

There is no preview mode for anyone: even authenticated users who browse the recitation
list can't open a recitation until they've added it to a routine.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Recitation detail | `features/recitation/presentation/screens/recitation_detail_screen.dart` | `/recitations/detail` |
| Recitation model | `features/recitation/data/models/recitation_model.dart` | — |
| Best practices doc | `features/recitation/BEST_PRACTICES_APPLIED.md` | — |

There is a recitation home molecule (`src/components/ui/molecules/homepage/recitation.tsx`)
and a recitation tab in v2.

## 3. User stories

- As an **authenticated** user, I can add a recitation to my routine.
- As an **authenticated** user with a recitation in my routine, I can open it in the text reader and recite it there.
- As an **unauthenticated** user, I cannot view recitations; I need to sign in and enroll before I can view or recite them.


## 4. Functional requirements

- **FR-1:** Recitation list (tab on routine page after a user taps Add to Session).
- **FR-2:** Add recitation to routine (links to `features/practice`).
- **FR-3:** Loading / error / empty states.

## 5. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| recitations list | GET | guest ok | confirm path |
| recitation detail | GET | required? | confirm guest access |

> Confirm `RecitationModel` shape and endpoints from
> `features/recitation/data/models/recitation_model.dart`.

## 6. Platform / Expo considerations

- If audio playback is in scope: use `expo-av` / `expo-audio`. Background audio +
  lock-screen controls may need extra config (matches Flutter `audio_handler`).

## 7. Navigation

| Flutter route | v2 route |
|---------------|----------|
| `/recitations/detail` | `src/app/(tabs)/screens/recitation/[id].tsx` (TBD) |

Note tab placement depends on the shell decision in `foundation/00-app-shell-navigation`
(Flutter has no recitation tab; v2 does).

## 8. Acceptance criteria

- [ ] Recitation list renders with states.
- [ ] Detail opens and plays/recites correctly.
- [ ] Auth gating matches Flutter (`/recitations/detail` protected).
- [ ] Add-to-routine works (if in scope).

## 9. Open questions

- Is audio playback in scope for v1?
- Is the recitation tab intentional (vs Flutter accessing recitations elsewhere)?
- Guest access to detail?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| List | yes | partial | tab + molecule scaffolded |
| Detail | yes | no | |
| Audio playback | yes | no | confirm scope |
| Add to routine | yes | no | |
