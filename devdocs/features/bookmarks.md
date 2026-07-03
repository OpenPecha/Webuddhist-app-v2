# Bookmarks — Migration PRD

| | |
|---|---|
| **Status** | In progress |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/practice/data/datasource/bookmark_remote_datasource.dart`, `bookmarks_screen.dart` |
| **v2 target** | `src/app/(tabs)/me/bookmarks.tsx` (Me tab entry; Flutter uses Practice tab) |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

Bookmarks let signed-in users save plans, series, mala presets, timers, texts, and verse segments for quick access. RN implements:

- Paginated fetch (`GET /bookmarks`, 50/page) merged client-side
- Optimistic create/delete via React Query
- Me tab screen with 5 filter tabs
- Reader header toggle (TEXT) and segment action sheet toggle (VERSE)

## 2. Flutter reference map

| Element | Flutter source | RN target |
|---------|----------------|-----------|
| Remote datasource | `bookmark_remote_datasource.dart` | `src/services/bookmarks.ts` |
| Bookmarks screen | `bookmarks_screen.dart` | `src/app/(tabs)/me/bookmarks.tsx` |
| Entry | Practice explore → `/practice/bookmarks` | Me tab row → `/me/bookmarks` |

## 3. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| List bookmarks | GET | required | Paginated; `language` query param |
| Create bookmark | POST | required | 409 → treat as success |
| Check exists | GET | required | `sourceId` + `type` |
| Delete bookmark | DELETE | required | By bookmark row id |

Types: `src/types/bookmarks.ts` — `BookmarkDTO`, `BookmarkCreateType`, tab filters.

## 4. Navigation

| Bookmark type | RN route |
|---------------|----------|
| TEXT / VERSE | `/reader/[textId]` |
| SERIES | `/series/[id]` |
| PLAN | `/plans/[id]` |
| TIMER | `/timers/active` (`id`, `durationMs`, `name`) |
| ACCUMULATOR (mala) | `/mala` (`initialPresetId`) |

TIMER rows without `timerDurationMs` are non-tappable (matches Flutter guard).

## 5. UI

- **Tabs:** All, Plans (PLAN+SERIES), Mala, Timers, Texts (TEXT+VERSE)
- **Cards:** Title, image/icon, type badge; text/verse cards show excerpt strip
- **Delete:** Swipe right + long-press confirm
- **Guest:** Me entry and toggles open `LoginDrawer`; list query disabled

## 6. Hooks

| Hook | Purpose |
|------|---------|
| `useBookmarks` | Full list for current language |
| `useBookmarkExists` / `useIsBookmarked` | Exists cache per source |
| `useToggleBookmark` | Optimistic toggle + toasts |
| `useRemoveBookmark` | List optimistic delete |

Query keys: `QUERY_KEYS.bookmarks.all`, `.list(language)`, `.exists(sourceId, type)`.

## 7. Acceptance criteria

- [x] Hooks + service with 409 handling
- [x] Me tab entry + bookmarks screen with 5 tabs
- [x] Reader TEXT bookmark toggle in header
- [x] Segment VERSE bookmark in action sheet
- [x] Mala preset bookmark toggle in mala settings sheet
- [x] Swipe/long-press delete with optimistic update
- [x] Navigation per type

**QA checklist:** [reader-bookmarks-manual-qa.md](../qa/reader-bookmarks-manual-qa.md)

## 8. Open questions

- Date grouping headers (Today/Yesterday) — keys exist; grouping UI deferred
- Timer bookmark creation entry points outside reader
