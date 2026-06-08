# i18n & Theming — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P1 |
| **Flutter baseline** | `lib/core/l10n/*`, `lib/core/theme/*` |
| **v2 target** | `global.css`, fonts in `src/app/_layout.tsx`, TBD i18n lib |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

The app is multilingual (English, Chinese, Tibetan) and supports light/dark theming.
This PRD defines how localization strings, locale selection, fonts (including Tibetan
script), and theming migrate to v2 (Uniwind + Expo fonts).

## 2. Flutter reference map

| Element | Flutter source |
|---------|----------------|
| Localizations (generated) | `core/l10n/generated/app_localizations.dart` |
| English strings | `core/l10n/app_en.arb` |
| Chinese strings | `core/l10n/app_zh.arb` |
| Tibetan strings | `core/l10n/app_bo.arb` |
| Theme | `core/theme/*` |
| Locale persistence | `StorageKeys.preferredLanguage` (`locale`) |
| Theme persistence | `StorageKeys.themeMode` |
| Font size pref | `StorageKeys.fontSize` |

Supported locales: **en**, **zh**, **bo** (Tibetan).

## 3. Functional requirements

- **FR-1:** Provide all three locales (en/zh/bo) with string parity to the ARB files.
- **FR-2:** Runtime language switching, persisted via the `locale` key.
- **FR-3:** Tibetan (`bo`) script renders correctly — bundle a Tibetan-capable font and
  verify line-height/shaping. v2 already loads `EBGaramond-Regular`; add scripts as
  needed.
- **FR-4:** Light/dark theme support, persisted via `theme_mode` (light/dark/system),
  implemented through Uniwind tokens / `global.css`.
- **FR-5:** Reader font-size preference persists (`font_size`) — used by reader/texts.
- **FR-6:** Default locale resolution: stored pref → device locale → `en`.

## 4. v2 approach (proposed)

| Concern | Approach |
|---------|----------|
| String catalog | Convert ARB → JSON resource bundles; use an i18n lib (e.g. `i18next` / `expo-localization`) |
| Theme | Uniwind classes + CSS variables in `global.css`; theme toggle in settings |
| Fonts | `expo-font` (`useFonts`) in `_layout.tsx` — extend with Tibetan/CJK fonts |

## 5. Acceptance criteria

- [ ] All three languages selectable and persisted across restarts.
- [ ] Tibetan text renders correctly on iOS + Android (no tofu / broken stacking).
- [ ] Dark/light/system theme works and persists.
- [ ] Reader font-size preference persists and applies.
- [ ] String coverage matches the ARB files (no missing keys).

## 6. Open questions

- i18n library choice (i18next vs LinguiJS vs custom).
- Are ARB strings auto-convertible, or is manual re-keying needed?
- Which Tibetan/CJK fonts are licensed for bundling?

## 7. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| en/zh/bo strings | yes | no | only hardcoded English in v2 |
| Locale switching | yes | no | |
| Theme (light/dark) | yes | partial | bg color set; no toggle |
| Tibetan font | yes | no | only EBGaramond loaded |
