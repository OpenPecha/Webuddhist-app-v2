# Texts Library — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/texts` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

The texts library is the browse/navigation hierarchy that leads into the reader:
collections → categories → works → texts → chapters. It also provides search within the
library and the table-of-contents navigation.

## 2. Flutter reference map

| Screen | Flutter source | Route |
|--------|----------------|-------|
| Collections | `features/texts/presentation/screens/collections/collections_screen.dart` | `/texts/collections` |
| Category | `features/texts/presentation/category_screen.dart` | `/texts/category` |
| Works | `features/texts/presentation/screens/works/works_screen.dart` | `/texts/works` |
| Texts | `features/texts/presentation/screens/texts/texts_screen.dart` | `/texts/texts` |
| Chapters | `features/texts/presentation/screens/chapters/chapters_screen.dart` | `/texts/chapters`, `/ai-mode/search-results/text-chapters` |
| Version selection | `features/texts/presentation/version_selection/version_selection_screen.dart` | `/texts/version_selection` |
| Language selection | `features/texts/presentation/version_selection/language_selection.dart` | `/texts/language_selection` |
| Commentary | `features/texts/presentation/commentary/commentary_view.dart` | `/texts/commentary` |
| Search widgets | `features/texts/presentation/widgets/{library_search_delegate,text_search_delegate,search_result_card}.dart` | — |
| TOC | `features/texts/presentation/widgets/table_of_contens.dart` | — |
| Models | `features/texts/data/models/{collections/collections.dart,text/texts.dart}` | — |

> Note: Flutter maps the **AI mode** route (`/ai-mode`) as the `texts` entry
> (`AppRoutes.texts = "/ai-mode"`). Clarify the relationship between the AI mode screen
> and the texts library entry point (see `features/ai-search`).

## 3. User stories

- As any user, I can browse collections → works → texts → chapters.
- As a user, I can search the library and open a result in the reader.
- As a user, I can use a table of contents to jump within a text.

## 4. Functional requirements

- **FR-1:** Browse hierarchy: collections, categories, works, texts, chapters.
- **FR-2:** Library search with result cards; open result → reader (with `source: search`
  and target segment).
- **FR-3:** Table of contents navigation.
- **FR-4:** Version/language selection entry points (shared with reader).
- **FR-5:** Guest-accessible browsing.
- **FR-6:** Loading / error / empty states + pagination where lists are long.

## 5. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| collections | GET | guest ok | |
| categories / works / texts / chapters | GET | guest ok | hierarchy |
| search | GET | guest ok | query → results |

> Confirm exact endpoints + models from `features/texts/data/models/*`.

## 6. Navigation

Mirror the `/texts/*` route tree under `src/app/texts/*`, plus the chapters route shared
with AI search. Coordinate with `features/reader` (versions/language) and
`features/ai-search` (text-chapters).

## 7. Acceptance criteria

- [ ] Full browse hierarchy works with correct data + states.
- [ ] Search returns results and opens reader at the right segment.
- [ ] TOC navigation works.
- [ ] Guest can browse.

## 8. Open questions

- Relationship between `/ai-mode` and the texts library entry.
- Pagination/search API specifics.
- Which hierarchy levels actually exist for current content.

## 9. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Browse hierarchy | yes | no | |
| Library search | yes | no | |
| TOC | yes | no | |
| Version/language entry | yes | no | shared w/ reader |
