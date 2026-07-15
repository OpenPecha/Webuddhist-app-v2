# Reader — Migration PRD

| | |
|---|---|
| **Status** | In progress |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/reader`, `lib/features/texts` |
| **v2 target** | `src/app/reader/[textId].tsx`, `PlanReadingLayout` |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

The reader renders Buddhist texts for plan subtasks and standalone deep links. Current v2 scope (this migration slice):

- **Font size** — header `Aa` button → bottom sheet, 14–28px steps, persisted via `StorageKeys.fontSize`
- **Segment mode** — when API returns segments, tap opens action sheet (copy, share, verse bookmark, related counts, video thumbnails in browser)
- **TEXT bookmark** — header toggle on reader
- **Plan navigation** — prev/next via `PlanReadingLayout` + `usePlanReadingSession`

Deferred: version/language picker, commentary dual-panel, create-image, TOC, full virtualization.

## 2. Flutter reference map

| Element | Flutter source | RN target |
|---------|----------------|-----------|
| Reader screen | `reader_screen.dart` | `reader/[textId].tsx` |
| Font size | `reader_font_size_button.dart` | `ReaderFontSizeButton` + `ReaderFontSizeSheet` |
| Segment actions | `segment_action_bar.dart` | `SegmentActionSheet` |
| Segment list | `reader_content/*` | `ReaderSegmentList` / `ReaderSegmentBlock` |

## 3. Segment actions

- **API:** `GET /segments/{segmentId}/info` → commentaries count, translations count, videos
- **Copy:** system share sheet via `copy-to-clipboard.ts` (upgrade to `expo-clipboard` after native rebuild)
- **Share:** deep link via `buildReaderSegmentShareUrl`
- **Videos:** `expo-web-browser` (no in-app YouTube)
- **Guest:** copy/share allowed; bookmark requires auth

## 4. Layout integration

`PlanReadingLayout` accepts optional `segments` + `textId`:

- Segment list replaces blob `MarkdownText` when segments available
- Collapsed preview limits segment taps until "Read Full Text"
- Opening font size sheet clears segment selection
- `SegmentActionSheet` rendered when a segment is selected

## 5. State & persistence

| Data | Storage |
|------|---------|
| Font size | AsyncStorage `font_size` — steps `[14,16,18,20,22,24,26,28]` |

## 6. Acceptance criteria (this slice)

- [x] Font size button + sheet; range 14–28px; persisted
- [x] Segment tap → underline + action sheet
- [x] Copy / share / verse bookmark
- [x] Segment info counts + video carousel (browser)
- [x] TEXT bookmark in reader header
- [x] Plan prev/next + swipe
- [ ] Version/language/commentary (deferred)
- [ ] Full reader TOC / jump-to-segment (deferred)

## 7. Files

| Area | Path |
|------|------|
| Screen | `src/app/reader/[textId].tsx` |
| Layout | `src/components/plans/PlanReadingLayout.tsx` |
| Segments | `ReaderSegmentList`, `SegmentActionSheet` |
| Hooks | `useReaderFontSize`, `useReaderSegmentSelection`, `useSegmentInfo` |
| Utils | `flattenReaderSegments`, `segment-plain-text`, `reader-deep-link` |

See also: [bookmarks.md](./bookmarks.md) for bookmark hooks and Me tab screen.

**QA checklist:** [reader-bookmarks-manual-qa.md](../qa/reader-bookmarks-manual-qa.md)
