# Reader + Bookmarks — Manual QA Checklist

Use this checklist to verify the Reader + Bookmarks migration on a **dev client** (not Expo Go).

**Related PRDs:** [reader.md](../features/reader.md) · [bookmarks.md](../features/bookmarks.md)

**Last automated verification:** 2026-06-22 — segment line numbers, Read Full Text in segment mode, tappable Commentaries/Version panels.

---

## Prerequisites

| Check | How to verify | Status |
|-------|---------------|--------|
| Dev client installed | Physical device or emulator with custom dev build | Manual |
| Metro running | `npx expo start --dev-client` (port 8081 or 8082) | Manual |
| `.env` configured | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_AUTH0_DOMAIN`, `EXPO_PUBLIC_AUTH0_CLIENT_ID` | Auto: keys present in `.env` |
| TypeScript clean | `npx tsc --noEmit` | Auto: passed |

```bash
cd Webuddhist-app-v2
npx expo start --dev-client
```

**Test personas:** Guest (Continue as guest) + Signed-in (Google/Apple) for bookmark flows.

---

## Feature map

| Feature | Where to go |
|---------|-------------|
| Font size | Reader header **Aa** |
| Segment actions | Reader with API segments → tap paragraph |
| TEXT bookmark | Reader header bookmark icon |
| VERSE bookmark | Segment action sheet → Bookmark |
| Mala bookmark | Mala → ⋮ settings → Bookmark |
| Bookmarks list | **Me** tab → **Bookmarks** |
| Plan prev/next | Reader from enrolled plan |

**Entry paths to reader:**
- Practice tab → routine / plan → Start Reading
- `/reader/[textId]` deep link
- Plan track from practice details

---

## 1. Font size

**Path:** Open reader → tap **Aa**.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 1.1 | Tap **Aa** | Sheet opens; label `Text size · Npx`; small/large **A** buttons | ☐ |
| 1.2 | Tap decrease to minimum | Text shrinks live; stops at **14px**; decrease disabled | ☐ |
| 1.3 | Tap increase to maximum | Text grows live; stops at **28px**; increase disabled | ☐ |
| 1.4 | Kill app, reopen same reader | Font size restored | ☐ |
| 1.5 | Select segment, then tap **Aa** | Segment selection clears; font sheet only | ☐ |

**Code verified:** `READER_FONT_SIZE_STEPS = [14,16,18,20,22,24,26,28]` in `useReaderFontSize.ts`; `openFontSheet` calls `clear()` in `PlanReadingLayout.tsx`.

---

## 2. Segment actions (segment mode)

**Segment mode requires API segments** (not inline-only blob text). Use Practice → enrolled plan → reading subtask with `source_text_id`.

If you see one continuous text block, that text is in **blob mode** — segment taps are intentionally disabled.

| # | Step | Expected | Pass |
|---|------|----------|------|
| 2.0 | Plan day with segments | Line numbers shown left of each segment (e.g. `01`, `02`) | ☐ |
| 2.0b | Collapsed plan preview | **Read Full Text** button at bottom; expands to full text | ☐ |
| 2.0c | Collapsed preview | Segment taps still open action sheet (Flutter parity) | ☐ |
| 2.1 | Tap a segment | Dotted underline + action sheet | ☐ |
| 2.2 | Tap same segment again | Sheet closes / toggles off | ☐ |
| 2.3 | Tap **Copy** | Share sheet opens with plain segment text | ☐ |
| 2.4 | Tap **Share** | Share sheet with deep-link URL | ☐ |
| 2.5 | Tap **Commentaries** tile | Nested panel with commentary list (or empty state) | ☐ |
| 2.6 | Tap **Version** tile | Nested panel with translation list (or empty state) | ☐ |
| 2.7 | Video thumbnails (if any) | Carousel; tap opens browser | ☐ |
| 2.8 | Swipe down / backdrop tap | Sheet dismisses | ☐ |
| 2.9 | Guest → Bookmark on sheet | Login drawer | ☐ |
| 2.10 | Signed-in → Bookmark on sheet | VERSE bookmark toggles + toast | ☐ |

**Code verified:** `SegmentNumber`, `SegmentActionSheet`, `SegmentCommentaryPanel`, `SegmentTranslationPanel`; APIs `GET /segments/{id}/info`, `/commentaries`, `/translations`.

---

## 3. TEXT bookmark (reader header)

| # | Step | Expected | Pass |
|---|------|----------|------|
| 3.1 | Guest → tap bookmark icon | Login drawer | ☐ |
| 3.2 | Signed-in → tap bookmark | Icon outline ↔ filled; saved/removed toast | ☐ |
| 3.3 | Me → Bookmarks → **Texts** tab | Text appears | ☐ |

**Code verified:** `ReaderBookmarkButton` + `useToggleBookmark({ type: 'TEXT' })`.

---

## 4. Bookmarks screen (Me tab)

| # | Step | Expected | Pass |
|---|------|----------|------|
| 4.1 | Guest → Me → Bookmarks | Login drawer or login prompt | ☐ |
| 4.2 | Signed-in → open Bookmarks | 5 tabs: All / Plans / Mala / Timers / Texts | ☐ |
| 4.3 | Switch tabs | Plans = PLAN+SERIES; Texts = TEXT+VERSE | ☐ |
| 4.4 | Empty tab | Tab-specific empty message | ☐ |
| 4.5 | Pull to refresh | List reloads | ☐ |
| 4.6 | Swipe card right | Remove → confirm → card gone + toast | ☐ |
| 4.7 | Long-press card | Same remove confirm | ☐ |

**Navigation from cards** (after creating bookmarks):

| Type | Create via | Tap navigates to | Pass |
|------|------------|------------------|------|
| TEXT | Reader header | `/reader/[textId]` | ☐ |
| VERSE | Segment sheet | `/reader/[textId]` | ☐ |
| ACCUMULATOR | Mala settings | `/mala?initialPresetId=...` | ☐ |
| SERIES / PLAN | API list only | `/series/[id]` / `/plans/[id]` | ☐ |
| TIMER | API list only | `/timers/active` (disabled if no duration) | ☐ |

**Code verified:** `me/bookmarks.tsx`, `bookmark-filters.ts`, `bookmark-navigation.ts`, `Swipeable` delete.

---

## 5. Mala bookmark

| # | Step | Expected | Pass |
|---|------|----------|------|
| 5.1 | Guest → Mala → ⋮ → Bookmark | Login drawer | ☐ |
| 5.2 | Signed-in → Bookmark | Toast saved/removed | ☐ |
| 5.3 | Me → Bookmarks → **Mala** tab | Preset listed | ☐ |

**Code verified:** `mala/index.tsx` wires `onBookmarkPress` → `useToggleBookmark({ type: 'ACCUMULATOR' })`.

---

## 6. Plan navigation

| # | Step | Expected | Pass |
|---|------|----------|------|
| 6.1 | Swipe left / Next | Next plan text | ☐ |
| 6.2 | Swipe right / Prev | Previous text | ☐ |
| 6.3 | Tap segment (horizontal intent) | No accidental page change | ☐ |
| 6.4 | Last item → Finish | Completion / back flow | ☐ |
| 6.5 | Guest opens plan from series | Square day cards (not circles); task title rows with chevron | ☐ |
| 6.6 | Tap navigable task (preview) | Opens `/plan-text` or `/reader` with `preview=1`; no completion API | ☐ |
| 6.7 | Enrolled user opens `/plans/[id]` | Redirects to `/practice/details`; checkboxes on tasks | ☐ |
| 6.8 | Swipe prev/next in preview reading | Navigates between texts; finish returns to plan preview | ☐ |

**Code verified:** `PanResponder` in `PlanReadingLayout`; `plans/[id].tsx` + `usePlanReadingSession` with `preview=1`.

---

## 7. Edge cases

| Case | Expected | Pass |
|------|----------|------|
| Font sheet while segment selected | Segment clears first | ☐ |
| Double bookmark (409) | No crash; treated as success | ☐ |
| Blob-only text | No segment taps; font + TEXT bookmark work | ☐ |
| TIMER bookmark without duration | Card not tappable | ☐ |
| Offline on Bookmarks | Error + Retry | ☐ |

---

## Known deviation

**Copy** opens the system **share sheet** (not silent clipboard) to avoid `ExpoClipboard` native module issues without a dev-client rebuild. To restore silent copy: `npx expo install expo-clipboard` + `npx expo run:android` (or iOS), then update `copy-to-clipboard.ts`.

---

## 5-minute smoke test

1. ☐ Reader from Practice → **Aa** + bookmark icon visible
2. ☐ Change font size → kill app → size persisted
3. ☐ Tap segment → sheet → Copy + Share work
4. ☐ Sign in → bookmark text → Me → Bookmarks → Texts
5. ☐ Swipe-delete bookmark → gone from list

---

## Sign-off

| Tester | Date | Device | Build | Result |
|--------|------|--------|-------|--------|
| | | | | ☐ Pass / ☐ Fail |

**Notes:**
