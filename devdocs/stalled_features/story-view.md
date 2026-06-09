# Story View — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P2 |
| **Flutter baseline** | `lib/features/story_view` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

A full-screen, Instagram-style story presenter used for plan content and daily content.
Stories can be image, text, or video, auto-advance with timed progress bars, and support
tap/swipe navigation.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Story feature | `features/story_view/presentation/screens/story_feature.dart` | `/home/stories` |
| Story presenter | `features/story_view/presentation/screens/story_presenter.dart` | `/home/stories-presenter` |
| Plan story presenter | `features/story_view/presentation/screens/plan_story_presenter.dart` | `/home/plan-stories-presenter` |
| Image / text / video story | `features/story_view/presentation/widgets/{image_story,text_story,video_story}.dart` | — |
| Helpers | `features/story_view/utils/helper_functions.dart` | — |

Flutter uses the `story_view` and `flutter_story_presenter` packages; story items are
built from plan subtasks (`UserSubtasksDto`) with per-type durations (text 15s, video 5m).

## 3. User stories

- As a user, I can view a sequence of stories (image/text/video) that auto-advance.
- As a user, I can tap to go next/previous and pause on long-press.
- As a user, I can view plan-day content as a story.

## 4. Functional requirements

- **FR-1:** Full-screen story presenter with timed progress bars.
- **FR-2:** Support image, text, and video story types.
- **FR-3:** Auto-advance with per-type durations; tap next/prev; pause on hold.
- **FR-4:** Plan story mode built from plan subtasks, with author attribution.
- **FR-5:** Dismiss/close returns to origin.
- **FR-6:** Loading / error states (esp. video buffering).

## 5. Data

- Story items derive from plan subtasks (`UserSubtasksDto`) — confirm shape from
  `features/plans/data/models/user/user_subtasks_dto.dart`.

## 6. Platform / Expo considerations

- No drop-in equivalent of `flutter_story_presenter` — evaluate RN story libraries
  (e.g. `react-native-stories`) or build a custom presenter.
- Video: `expo-video`/`expo-av`. **May require dev client build.**
- Gestures: `react-native-gesture-handler` + `reanimated` for progress/transitions.

## 7. Navigation

| Flutter route | v2 route (TBD) |
|---------------|----------------|
| `/home/stories` | `src/app/stories/index.tsx` |
| `/home/stories-presenter` | `src/app/stories/presenter.tsx` |
| `/home/plan-stories-presenter` | `src/app/stories/plan-presenter.tsx` |

## 8. Acceptance criteria

- [ ] Story sequence auto-advances with correct timings.
- [ ] Image/text/video render correctly.
- [ ] Tap/swipe/hold gestures work.
- [ ] Plan stories build from subtasks with author.
- [ ] Verified on iOS + Android.

## 9. Open questions

- Which RN story library, or custom build?
- Are video stories in scope for v1?
- Story content source(s) beyond plan subtasks?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Story presenter | yes | no | |
| Image/text/video types | yes | no | |
| Plan stories | yes | no | |
