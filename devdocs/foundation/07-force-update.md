# Force Update — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P0 |
| **Flutter baseline** | `lib/core/services/upgrade/` |
| **v2 target** | `src/app/_layout.tsx` (gate component TBD) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

When a newer app version is available on the Play Store / App Store, Flutter shows a
**non-dismissible blocking modal** over every route. The user must tap "Update now" to
open the store.

The soft, dismissible update banner that previously appeared only on the home screen
has been **removed**. Force update is app-wide, not a Home-screen widget.

Cross-ref: `features/home` FR-12.

## 2. Flutter reference map

| Element | Flutter source | Role |
|---------|----------------|------|
| Upgrade service | `core/services/upgrade/app_upgrade_service.dart` | Wraps `upgrader`; `isUpdateAvailable()`, `openAppStore()` |
| Providers | `core/services/upgrade/upgrade_provider.dart` | `updateAvailableProvider`, `openAppStoreProvider` |
| Dialog UI | `core/services/upgrade/force_update_dialog.dart` | Non-dismissible `AlertDialog` |
| Gate widget | `core/services/upgrade/force_update_gate.dart` | Mounted in `MaterialApp.router` builder |
| Router key | `core/config/router/app_router.dart` | `rootNavigatorKey` for in-tree dialog context |

### Architecture

```
MaterialApp.router
  └─ builder: ForceUpdateGate          ← watches updateAvailableProvider
      └─ GoRouter Navigator
          └─ ... all routes ...
```

`ForceUpdateGate` lives above the navigator so it covers every route. Because its
`BuildContext` is above the navigator, `showDialog` uses
`rootNavigatorKey.currentContext` to obtain an in-tree context.

### Flow

```
App launch
  → ForceUpdateGate watches updateAvailableProvider
      → AppUpgradeService.initialize()
      → if update available → show ForceUpdateDialog (non-dismissible)
          → user taps "Update now" → openAppStore()
```

Flutter reference doc: `WeBuddhist-app/docs/implementation/FORCE_UPDATE_MODAL.md`.

## 3. v2 current state

No force-update gate in v2. No equivalent of `upgrader` integration.

## 4. Functional requirements

- **FR-1:** On app launch, check store for a newer version.
- **FR-2:** When update is required, show a **non-dismissible** modal over all routes
  (including Home, login, onboarding).
- **FR-3:** Modal has a single primary action that opens the App Store / Play Store.
- **FR-4:** Gate is mounted in root layout (`src/app/_layout.tsx`), not on the Home tab.
- **FR-5:** Do **not** implement a soft dismissible update banner on Home (removed in
  Flutter).

## 5. v2 implementation notes

- Evaluate Expo-compatible store-version check (e.g. `expo-updates` + store API, or
  a React Native equivalent of `upgrader`).
- Mount gate in root `_layout.tsx` above the stack navigator.
- Use root navigation ref for modal context (mirror `rootNavigatorKey` pattern).

## 6. Acceptance criteria

- [ ] Update available → blocking modal shown on iOS and Android.
- [ ] Modal cannot be dismissed without updating (no swipe/back dismiss).
- [ ] "Update now" opens correct store listing.
- [ ] Modal covers all routes (login, tabs, stack screens).
- [ ] No soft update banner on Home screen.

## 7. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Store version check | yes | no | |
| Blocking modal | yes | no | |
| App-wide gate | yes | no | not home-only |
| Soft home banner | removed | n/a | do not reintroduce |
