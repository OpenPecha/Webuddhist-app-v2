# Mala — Migration PRD

| | |
|---|---|
| **Status** | Improved (mockup UI: settings, reset, screen lock) |
| **Priority** | P0 |
| **Flutter baseline** | `WeBuddhist-app` (`lib/features/mala`) |
| **v2 target** | `Webuddhist-app-v2` (`src/app/mala/*`, `src/components/mala/*`, `src/services/mala/*`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

Per-mantra prayer-bead counter. The user taps an arc of beads; each tap is a monotonic
+1 persisted locally and synced to the backend as an **absolute lifetime total**.
Counting never decreases. Entry is via the Home shortcuts row only (no mala stats widget
on Home — accumulation summary lives on the Me tab in Flutter, out of scope here).

## 2. Flutter reference map

| Screen / flow | Flutter source | Route |
|---------------|----------------|-------|
| Mala screen | `presentation/screens/mala_screen.dart` | `/mala` |
| Bead arc | `presentation/widgets/mala_beads.dart` | — |
| Mantra carousel | `presentation/widgets/mantra_switcher.dart` | — |
| Loading skeleton | `presentation/widgets/mala_skeleton.dart` | — |
| Counter + seed | `presentation/providers/mala_counter_notifier.dart` | — |
| Background sync | `presentation/providers/mala_sync_manager.dart` | — |
| Bead tap sound | `presentation/services/mala_sound_player.dart` | — |
| Home shortcut | `features/home/presentation/widgets/home_shortcuts_row.dart` | `/mala` |

Feature README (source of truth): `WeBuddhist-app/lib/features/mala/README.md`.

## 3. User stories

- As an **authenticated user**, I can open Mala from the Home shortcut and count beads
  for any preset mantra in my content language.
- As an **authenticated user**, my counts survive app restarts and sync across devices
  via the accumulators API.
- As a **guest**, tapping the Mala shortcut shows the login drawer instead of navigating.
- As an **authenticated user**, I can switch mantras and each preset keeps its own count.
- As an **authenticated user**, I can deep-link to a specific preset via
  `initialPresetId`.

## 4. Functional requirements

- **FR-1:** Fetch mantra catalogue from `GET /accumulators/presets` (paged, content
  language); skeleton while loading; error + retry.
- **FR-2:** **Seed-before-tap** — `GET /accumulators/{parent_id}` merges server total
  with local via `max()` before taps are enabled; 404 ⇒ seed at 0.
- **FR-3:** Tap increments absolute total by 1; display `beadInRound/108` and completed
  rounds (`total ~/ 108`).
- **FR-4:** **Monotonic increment** during normal counting; v2 adds an explicit **reset**
  flow (mockup) via `DELETE /accumulators/user/{id}` + local clear — not in Flutter.
- **FR-5:** Per-user local keys `mala_counts:{userId}:{presetId}` (AsyncStorage); dirty
  when `total > syncedTotal`.
- **FR-6:** Background sync — debounced 5s on tap, immediate on round complete (108),
  flush on background/app leave/screen leave; lazy `POST /accumulators/user` on first
  sync; `PUT` absolute `current_count`; exponential backoff on failure.
- **FR-7:** Bead tap sound (expo-audio); vibration on tap — both **toggleable** in
  settings sheet (v2 Improved).
- **FR-8:** Layout — upper ~40% mantra switcher (swipe + chevrons), lower ~60% left-aligned
  counter + bead arc; block taps while `isSeeding`.
- **FR-9:** Optional deep link search param `initialPresetId` on `/mala`.
- **FR-10:** Resolve user id from persisted `current_user_id` with Auth0 `sub` fallback.
- **FR-11:** Settings gear → options sheet: reset count, sound, vibration, screen lock
  (`expo-keep-awake` while focused).

## 5. API contracts

Base: `https://api.webuddhist.com/api/v1/`. **All `/accumulators/*` routes require bearer
token.**

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/accumulators/presets` | GET | required | `skip`, `limit`, `language`; `Cache-Control: no-cache` |
| `/accumulators/{parent_id}` | GET | required | User detail for preset; **404 ⇒ no accumulator yet** |
| `/accumulators/user` | POST | required | Body `{ parent_id }`; creates at 0 |
| `/accumulators/user/{id}` | PUT | required | Body `{ current_count }`; server merge |
| `/accumulators/user/{id}` | DELETE | required | Soft-delete user accumulator (reset flow) |

`mala_image_url` at accumulator and mantra level drives custom bead artwork.

## 6. State & persistence

| Key pattern | Value | Notes |
|-------------|-------|-------|
| `mala_counts:{userId}:{presetId}` | JSON `LocalMalaState` | `total`, `syncedTotal`, `accumulatorId`, `beadImageUrl` |
| `current_user_id` | string | Written at login / first mala resolve |

Deprecated: global `mala_counter` (MVP) — ignored; no migration.

Guest users cannot reach the screen (Home shortcut gated).

Offline: taps persist locally; sync manager flushes when logged in and network available.

See `foundation/03-local-storage-offline`.

## 7. Navigation (Expo Router)

| Flutter route | v2 file route | Params | Notes |
|---------------|---------------|--------|-------|
| `/mala` | `src/app/mala/index.tsx` | `initialPresetId?` | Stack; back to Home |
| Home shortcut | `HomeShortcutsRow` → `router.push('/mala')` | — | Guest → `LoginDrawer` |

## 8. UI / UX parity notes

- Bead arc is SVG-based in v2 (simplified vs Flutter `CustomPainter`); same tap/swipe
  increment behavior.
- Gradient fallback bead when no `mala_image_url` or image load fails.
- No bundled bead asset fallback (matches Flutter).
- Reset button removed from MVP; v2 **Improved** adds settings-sheet reset with confirm dialog.

## 9. Platform / Expo considerations

- **expo-audio** for bead click (`MalaSoundPlayer.ts`); requires dev client build if
  native module changes.
- **Vibration** API for haptics (`expo-haptics` not required).
- Auth token must be access token with API audience (see `foundation/01-auth-guest-onboarding`).

## 10. Acceptance criteria

- [ ] Guest tap Mala on Home → login drawer; authenticated → `/mala`.
- [ ] Presets load for content language; skeleton then content.
- [ ] Seed blocks taps until server/local merge; seed failure shows retry.
- [ ] Tap increments; round at 108 triggers immediate sync + stronger vibration.
- [ ] Switch mantra preserves per-preset counts.
- [ ] Offline taps persist; sync on reconnect/background.
- [ ] Settings toggles persist; screen lock keeps display awake while on Mala.
- [ ] Reset clears count locally and deletes server accumulator when online.
- [ ] `initialPresetId` opens correct mantra when valid.
- [ ] Behavior verified on iOS and Android.

## 11. Out of scope (this phase)

- Mala stats card on Home (Flutter Me tab / `accumulation_sheet.dart`).
- Plans/Chants Home shortcuts.

## 12. Open questions

- N/A — Flutter README is authoritative.

## 13. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Catalogue fetch | yes | yes | `useMalaPresets` |
| Seed-before-tap | yes | yes | `useMalaCounter.seed` |
| Monotonic increment | yes | yes | |
| Per-user local storage | yes | yes | `mala-storage.ts` |
| Background sync | yes | yes | `mala-sync-manager.ts` + `MalaSyncBootstrap` |
| Mantra switcher | yes | yes | `MantraSwitcher.tsx` |
| Bead arc + image | yes | yes | `MalaBeads.tsx` (simplified painter) |
| Sound + haptic | yes | yes | `MalaSoundPlayer` + `Vibration` |
| Deep link preset | yes | yes | `initialPresetId` param |
| Home shortcut entry | yes | yes | `HomeShortcutsRow` |
| Settings + reset | no | yes | Mockup UI — Improved vs Flutter |
| Screen lock | no | yes | `expo-keep-awake` |

**v2 target files:**

- `src/app/mala/index.tsx`, `src/app/mala/_layout.tsx`
- `src/components/mala/*`
- `src/services/mala/accumulators.ts`, `mala-sync-manager.ts`
- `src/hooks/api/useMalaPresets.ts`, `src/hooks/useMalaCounter.ts`
- `src/lib/mala-storage.ts`, `src/lib/mala-user-id.ts`
- `src/types/mala.ts`
- `src/lib/mala-preferences.ts`, `src/lib/mala-bead-geometry.ts`
- `src/hooks/useMalaPreferences.ts`
- `src/components/mala/MalaSettingsSheet.tsx`
- `src/providers/mala-sync.tsx`
