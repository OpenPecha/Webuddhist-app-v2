# Reader — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/reader`, `lib/features/texts` |
| **v2 target** | TBD (`src/app/reader/[textId].tsx`) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

The reader is the core text-reading experience and the **highest-complexity** feature.
It renders Buddhist texts segment-by-segment with version/language/script selection,
commentary, segment actions (highlight, share, create image), an optional dual-panel
mode, and supports navigation from plans, search, and deep links.

> Recommendation: this PRD should be split into sub-PRDs as scope firms up
> (reader-core, versions-languages, commentary, segment-actions, dual-panel).

## 2. Flutter reference map

| Element | Flutter source | Route |
|---------|----------------|-------|
| Reader screen | `features/reader/presentation/screens/reader_screen.dart` | `/reader/:textId` |
| Reader content | `features/reader/presentation/widgets/reader_content/*` | — |
| Reader constants | `features/reader/constants/reader_constants.dart` | — |
| Navigation context | `features/reader/data/models/navigation_context.dart` | — |
| Version selection | `features/texts/presentation/version_selection/version_selection_screen.dart` | `/reader/:textId/versions` |
| Language selection | `features/texts/presentation/version_selection/language_selection.dart` | `/reader/:textId/versions/language` |
| Commentary | `features/texts/presentation/widgets/commentary_*` | `/texts/commentary` |
| Segment actions | `features/texts/presentation/widgets/segment_action_bar.dart` | — |
| Create/choose image | `features/texts/presentation/segment_image/*` | `/choose-image`, `/create-image` |

## 3. NavigationContext (must preserve)

Reader is opened with a `NavigationContext` carrying `source`
(`normal` / `plan` / `search` / `deepLink`), `targetSegmentId`, and for plan navigation
`planTextItems` + `currentTextIndex`. Plan navigation uses directional page transitions.
v2 must carry equivalent context (serializable params or a context store).

## 4. User stories

- As any user, I can read a text and scroll through its segments.
- As a user, I can jump to a target segment (from search/plan/deep link).
- As a user, I can switch version / language / script.
- As a user, I can open commentary for a segment.
- As a user, I can act on a segment: highlight, share, create an image.
- As a user, I can enable a secondary reading panel (dual-slot).

## 5. Functional requirements

- **FR-1:** Render a text by `textId`, segment-based, with scroll + table of contents.
- **FR-2:** Scroll/jump to `targetSegmentId` when provided.
- **FR-3:** Version selection (`/reader/:textId/versions`) and language selection.
- **FR-4:** Commentary panel/tab per segment.
- **FR-5:** Segment action bar: highlight, share, create image, read-full-text.
- **FR-6:** Font-size control (persisted via `font_size`).
- **FR-7:** Optional dual-panel mode, persisted via `reader_secondary_enabled`
  (slot picks are in-memory, text-scoped — match Flutter semantics).
- **FR-8:** Plan-mode navigation between texts with directional transitions and
  prev/next across `planTextItems`.
- **FR-9:** Guest-accessible (reader is in `guestAccessibleRoutes`).
- **FR-10:** Loading / error / empty states.

## 6. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| text by id | GET | guest ok | segments/content |
| text versions | GET | guest ok | available versions/languages/scripts |
| commentary | GET | guest ok | commentary per segment/text |
| segment image create | POST | required? | create-image flow |

> Confirm exact endpoints + models from `features/texts/data/models/text/*` and reader
> data sources.

## 7. State & persistence

| Data | Flutter key |
|------|-------------|
| Dual-panel enabled | `reader_secondary_enabled` |
| Font size | `font_size` |
| Highlights | confirm storage (local vs server) |

## 8. Navigation (Expo Router)

| Flutter route | v2 route (TBD) | Params |
|---------------|----------------|--------|
| `/reader/:textId` | `src/app/reader/[textId].tsx` | textId, segmentId, source |
| `/reader/:textId/versions` | `src/app/reader/[textId]/versions.tsx` | textId |
| `/reader/:textId/versions/language` | `.../versions/language.tsx` | uniqueLanguages |
| `/plan-text/:subtaskId` | `src/app/plan-text/[subtaskId].tsx` | NavigationContext |

## 9. Platform / Expo considerations

- Rich text rendering of multiple scripts (incl. Tibetan) — verify shaping/line-height
  (ties to `foundation/04-i18n-theming`).
- "Create image" likely needs view-to-image capture (`react-native-view-shot`) + share.
- Performance: long texts need virtualization (FlashList / FlatList).

## 10. Acceptance criteria

- [ ] Text renders with correct segments and TOC.
- [ ] Jump-to-segment works from search/plan/deep link.
- [ ] Version/language/script switching works.
- [ ] Commentary opens per segment.
- [ ] Segment actions (highlight/share/create image) work.
- [ ] Font size + dual-panel preferences persist with Flutter semantics.
- [ ] Plan prev/next navigation works with transitions.
- [ ] Verified on iOS + Android, incl. Tibetan script.

## 11. Open questions

- Are highlights stored locally or server-side?
- Full text/version/commentary API shapes.
- Which segment actions are P1 vs deferrable?
- Best RN library for segment rendering + selection.

## 12. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Render text | yes | no | |
| Versions/languages | yes | no | |
| Commentary | yes | no | |
| Segment actions | yes | no | |
| Dual-panel | yes | no | |
| Plan navigation | yes | no | |
