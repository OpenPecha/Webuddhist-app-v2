# AI Search — Migration PRD

| | |
|---|---|
| **Status** | Not started |
| **Priority** | P2 |
| **Flutter baseline** | `lib/features/ai` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

AI mode provides a search/assistant experience over the text corpus. Users enter a query
and receive results (potentially streamed), then drill into matching text chapters in
the reader.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| AI mode screen | `features/ai/presentation/screens/ai_mode_screen.dart` | `/ai-mode` |
| Search results | `features/ai/presentation/screens/search_results_screen.dart` | `/ai-mode/search-results`, `/search-results` |
| → text chapters | `features/texts/presentation/screens/chapters/chapters_screen.dart` | `/ai-mode/search-results/text-chapters` |
| AI HTTP client (SSE) | `core/network/ai_dio_client.dart` | — |

`/ai-mode` is also mapped as `AppRoutes.texts` — clarify whether AI mode is the texts
entry point or a separate feature (see `features/texts-library`).

## 3. User stories

- As any user, I can enter a query and get search results.
- As a user, I can open a result's text chapters in the reader at the matched segment.

## 4. Functional requirements

- **FR-1:** Query input + submit.
- **FR-2:** Results list (cards) with relevance; possibly streamed (SSE).
- **FR-3:** Open result → chapters → reader with `source: search` + target segment.
- **FR-4:** Guest-accessible (AI mode is guest-accessible in Flutter).
- **FR-5:** Loading / streaming / error / empty states.

## 5. API contracts

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| AI search | POST (stream) | guest ok | SSE streaming (see `ai_dio_client`) |

> v2 networking layer must support SSE/streaming (see `foundation/02-api-networking`
> FR-7). Confirm request/response/stream format from `ai_dio_client.dart`.

## 6. Platform / Expo considerations

- Streaming over `fetch` in RN: use `expo/fetch` streaming or `react-native-sse`.

## 7. Navigation

`src/app/ai/index.tsx`, `src/app/ai/search-results.tsx`,
`src/app/ai/search-results/text-chapters.tsx` (TBD), coordinating with reader + texts.

## 8. Acceptance criteria

- [ ] Query returns results (streamed if applicable).
- [ ] Result opens chapters/reader at the matched segment.
- [ ] Guest can use AI search.
- [ ] Streaming + error states handled.

## 9. Open questions

- Is `/ai-mode` the texts entry point or separate?
- Exact streaming protocol/format.
- Is AI search in scope for v1 or a later release?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Query + results | yes | no | |
| Streaming (SSE) | yes | no | needs RN streaming |
| Drill into reader | yes | no | |
