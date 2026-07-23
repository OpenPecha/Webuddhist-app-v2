# Recitation — Migration PRD

| | |
|---|---|
| **Status** | In progress (partial) |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/recitation` |
| **v2 target** | `src/app/(tabs)/index/recitations.tsx`, `src/app/(tabs)/index/recitations-search.tsx`, `src/components/recitation/RecitationListTile.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-07-22 |

---

## 1. Summary

Recitations are chant texts. Authenticated users add them to a practice routine on the
Practice page. Once a recitation is in their routine, they can tap its card on the routine
page to open it in the reader and recite it.

**Browse all (v2):** Home Chants → `/recitations` (Home-tab stack under
`(tabs)/index`, so bottom tab bar stays visible). Chant cards: accent bar, title,
optional `first_segment` subtitle, caret. Search icon → `/recitations-search` (same
stack; capsule field; empty query shows blank; client-side title filter). Tap opens
`/reader/[textId]` on the root stack (full-screen, no tabs). Loading skeleton, error +
Retry, empty states.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| All chants browse | `practice/.../all_recitations_screen.dart` | Navigator push from Home Chants |
| Recitation detail | `features/recitation/presentation/screens/recitation_detail_screen.dart` | `/recitations/detail` |
| Recitation model | `features/recitation/data/models/recitation_model.dart` | — |
| Best practices doc | `features/recitation/BEST_PRACTICES_APPLIED.md` | — |

v2 browse: `/recitations` + `/recitations-search` under the Home tab stack
(`(tabs)/index`). On Flutter Home, Chants opens `AllRecitationsScreen` in-shell.
The deprecated v2 molecule `src/components/home/Recitation.tsx` (dummy data) is not
part of Home parity.

## 3. User stories

- As an **authenticated** user, I can add a recitation to my routine.
- As an **authenticated** user with a recitation in my routine, I can open it in the text reader and recite it there.
- As an **unauthenticated** user, I cannot view recitations; I need to sign in and enroll before I can view or recite them.


## 4. Functional requirements

- **FR-1:** Recitation list (tab on routine page after a user taps Add to Session).
- **FR-2:** Add recitation to routine (links to `features/practice`).
- **FR-3:** Loading / error / empty states.

## 5. API contracts

**Sources:** Flutter `recitations_remote_datasource.dart`, `recitation_model.dart`,
`recitation_content_model.dart` · Swagger `openapi.json` · Backend
`WeBuddhist-Backend/pecha_api/recitations/` (public) and
`plans/users/recitation/user_recitations_views.py` (saved list). Public routes only — no `/cms`.
Base URL + auth: see `foundation/02-api-networking.md` §5.

| Endpoint | Method | Auth | OpenAPI schema | Notes |
|----------|--------|------|----------------|-------|
| `/recitations?language=**&search=` | GET | guest ok | `RecitationsResponse` | List — `language` **required** in Swagger |
| `/recitations/{text_id}` | POST | guest ok | `RecitationDetailsRequest` → `RecitationDetailsResponse` | Content (not GET) |
| `/users/me/recitations` | GET | required | `UserRecitationsResponse` | Saved — `UserRecitationDTO` (not public `RecitationDTO`) |
| `/users/me/recitations` | POST | required | `CreateUserRecitationRequest` | `{ "text_id": "uuid" }` → **200** (empty body) |
| `/users/me/recitations/{text_id}` | DELETE | required | **204** | Unsave |
| `/users/me/recitations/order` | PUT | required | `UpdateRecitationOrderRequest` | `{ "recitations": [{ "text_id", "display_order" }] }` → **200** |

> Recitation "detail" is **POST** `/recitations/{text_id}` — body selects language and text
> layers (recitation / translations / transliterations / adaptations).

### List — `RecitationsResponse` / `RecitationDTO`

**Query params (Swagger):** `search` (optional), `language` (**required**).

```jsonc
// GET /recitations?language=en&search=  → 200
{
  "recitations": [
    {
      "text_id": "uuid",          // required
      "title": "string",          // required
      "image_url": "string|null"  // optional (Swagger)
    }
  ]
}
```

**Backend vs Flutter drift:** Public catalog uses `RecitationDTO` (`text_id`, `title`,
`image_url` only). Saved list uses **`UserRecitationDTO`** with required `language` and
`display_order` (`user_recitations_response_models.py`) — Flutter `RecitationModel` tolerates
both shapes. v2 should type saved vs catalog responses separately.

### Detail/content — `RecitationDetailsRequest` → `RecitationDetailsResponse`

```jsonc
// POST /recitations/{text_id}
// Request — RecitationDetailsRequest (`language` required; layer arrays default to [])
{
  "language": "en",
  "recitation": [],          // string[] of version ids
  "translations": [],
  "transliterations": [],
  "adaptations": []
}
```

```jsonc
// Response — RecitationDetailsResponse
{
  "text_id": "uuid",
  "title": "string",
  "segments": [
    {
      // RecitationSegment — each layer is a map: versionId → Segment { id, content }
      "recitation":       { "<versionId>": { "id": "uuid", "content": "string" } },
      "translations":     { "<versionId>": { "id": "uuid", "content": "string" } },
      "transliterations": { "<versionId>": { "id": "uuid", "content": "string" } },
      "adaptations":      { "<versionId>": { "id": "uuid", "content": "string" } }
    }
  ]
}
```

OpenAPI `Segment`: `{ "id": "uuid", "content": "string" }` — matches Flutter
`RecitationTextModel`.

### Saved recitations — `UserRecitationsResponse` / `UserRecitationDTO`

```jsonc
// GET /users/me/recitations  → 200
{
  "recitations": [
    {
      "text_id": "uuid",
      "title": "string",
      "image_url": "string|null",
      "language": "en",        // required on saved list
      "display_order": 1       // required on saved list
    }
  ]
}
```

### Save / reorder bodies

```jsonc
// POST /users/me/recitations   { "text_id": "uuid" }  → 200 (empty body)
// PUT  /users/me/recitations/order
//   { "recitations": [ { "text_id": "uuid", "display_order": 1 } ] }  → 200 (empty body)
// DELETE /users/me/recitations/{text_id}  → 204
```

## 6. Platform / Expo considerations

- If audio playback is in scope: use `expo-av` / `expo-audio`. Background audio +
  lock-screen controls may need extra config (matches Flutter `audio_handler`).

## 7. Navigation

| Flutter route | v2 route |
|---------------|----------|
| `/recitations/detail` | `src/app/(tabs)/screens/recitation/[id].tsx` (TBD) |

Note tab placement depends on the shell decision in `foundation/00-app-shell-navigation`
(Flutter has no recitation tab; v2 does).

## 8. Acceptance criteria

- [ ] Recitation list renders with states.
- [ ] Detail opens and plays/recites correctly.
- [ ] Auth gating matches Flutter (`/recitations/detail` protected).
- [ ] Add-to-routine works (if in scope).

## 9. Open questions

- Is the recitation tab intentional (vs Flutter accessing recitations elsewhere)?
- ~~Guest access to detail?~~ → resolved: not in `ProtectedRoutes`; list + content are
  guest-accessible. Only `/users/me/recitations*` require auth.
- ~~Is `language` required on list?~~ → Swagger: **yes** (required query param). Flutter
  treats it as optional — v2 should always pass `language`.

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Browse list | yes | yes | Home-stack `/recitations` + `/recitations-search`; tab bar visible |
| List (routine picker) | yes | partial | `select-recitation.tsx` |
| Detail / reader | yes | yes | `/reader/[textId]` from browse + routine |
| Audio playback | yes | no | We are planning to add |
| Add to routine | yes | no | |
