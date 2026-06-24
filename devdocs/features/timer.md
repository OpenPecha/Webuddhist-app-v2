# Timer — Migration PRD

| | |
|---|---|
| **Status** | Parity |
| **Priority** | P0 |
| **Flutter baseline** | `WeBuddhist-app` (`lib/features/timer`) |
| **v2 target** | `Webuddhist-app-v2` (`src/app/timers/*`, `src/components/timer/*`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

Preset meditation timers. User picks a duration from a grid, runs an active countdown
with pause/resume, hears completion sound, and reports elapsed time to the backend on
exit or completion. Entry is via the Home shortcuts row.

**Disambiguation:** Not the same as backend `timer_session_type` (Practice routine
sessions).

## 2. Flutter reference map

| Screen / flow | Flutter source | Route |
|---------------|----------------|-------|
| Preset grid | `presentation/screens/preset_timers_screen.dart` | `/home/timers` |
| Active timer | `presentation/screens/active_timer_screen.dart` | nested |
| Remote API | `data/datasources/timers_remote_datasource.dart` | — |
| Home shortcut | `features/home/presentation/widgets/home_shortcuts_row.dart` | `/home/timers` |

## 3. User stories

- As an **authenticated user**, I can open Timer from Home and choose a preset duration.
- As an **authenticated user**, I can pause/resume the countdown and finish early; elapsed
  time is reported to the server.
- As an **authenticated user**, I hear a sound when the timer completes.
- As a **guest**, tapping Timer shows the login drawer.

## 4. Functional requirements

- **FR-1:** Load preset list from `GET /timers` with pagination params; filter to
  meditation presets; **fallback presets** when API fails or returns empty.
- **FR-2:** Sort presets by duration ascending; grid layout with skeleton while loading.
- **FR-3:** Tap preset → active timer screen with circular progress ring, remaining time,
  pause/resume.
- **FR-4:** On back, discard, or completion — fire-and-forget
  `POST /timers/user/timer_stop` with `timer_id` and elapsed `duration` (ms).
- **FR-5:** Completion sound via `TimerSoundPlayer` (expo-audio).
- **FR-6:** Guest gating on Home shortcut only (same as Mala).

## 5. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/timers` | GET | guest ok | `skip`, `limit`; returns `{ timers: [...] }` |
| `/timers/user/timer_stop` | POST | required | `{ timer_id, duration }` (ms); fire-and-forget |

Preset shape: `id`, `name`, `duration` / `durationMs`, optional `audioUrl`.

Fallback presets: `src/constants/timer-presets.ts` (`FALLBACK_PRESET_TIMERS`).

## 6. State & persistence

- No local persistence of timer sessions (ephemeral active session only).
- Fallback presets used offline or on API error.

## 7. Navigation (Expo Router)

| Flutter route | v2 file route | Params | Notes |
|---------------|---------------|--------|-------|
| `/home/timers` | `src/app/timers/index.tsx` | — | v2 canonical: `/timers` |
| Active timer | `src/app/timers/active.tsx` | `id`, `durationMs`, `name` | Stack push from grid |
| Home shortcut | `HomeShortcutsRow` → `/timers` | — | Guest → `LoginDrawer` |

## 8. UI / UX parity notes

- v2 route is `/timers` instead of Flutter `/home/timers` — document in parity matrix.
- Grid uses 2-column `FlatList`; matches Flutter grid intent.
- `stopUserTimer` skips reporting for non-API fallback timer ids (`isTimerApiId`).

## 9. Platform / Expo considerations

- **expo-audio** for completion sound (`TimerSoundPlayer.ts`).
- Active timer runs in foreground; no background timer notification in scope.

## 10. Acceptance criteria

- [ ] Guest tap Timer → login drawer; authenticated → `/timers`.
- [ ] Presets load from API or fallback; sorted by duration.
- [ ] Active timer counts down; pause/resume works.
- [ ] Back/discard/complete reports stop to API when timer id is from API.
- [ ] Completion plays sound.
- [ ] Behavior verified on iOS and Android.

## 11. Out of scope (this phase)

- Custom user-created timer durations.
- Background timer / lock-screen controls.
- Practice routine session timers (`timer_session_type`).

## 12. Open questions

- N/A — v2 implementation matches Flutter for P0 scope.

## 13. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Preset grid + skeleton | yes | yes | `timers/index.tsx` |
| API + fallback | yes | yes | `services/timers.ts` |
| Active countdown ring | yes | yes | `timers/active.tsx` |
| Pause/resume | yes | yes | |
| timer_stop reporting | yes | yes | `stopUserTimer` |
| Completion sound | yes | yes | `TimerSoundPlayer` |
| Home shortcut entry | yes | yes | `HomeShortcutsRow` |

**v2 files:**

- `src/app/timers/index.tsx`, `src/app/timers/active.tsx`
- `src/components/timer/*`
- `src/hooks/api/usePresetTimers.ts`, `useActiveTimer`
- `src/services/timers.ts`
- `src/constants/timer-presets.ts`
- `src/types/timers.ts`
