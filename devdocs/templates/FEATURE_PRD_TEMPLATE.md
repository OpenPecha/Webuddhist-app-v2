# [Feature Name] — Migration PRD

| | |
|---|---|
| **Status** | Not started / PRD draft / PRD approved / In progress / Parity / Improved |
| **Priority** | P0 / P1 / P2 |
| **Flutter baseline** | `WeBuddhist-app` (module: `lib/features/<name>`) |
| **v2 target** | `Webuddhist-app-v2` (`src/...`) |
| **Owner** | @name |
| **Last updated** | YYYY-MM-DD |

---

## 1. Summary

One paragraph: what this feature does for users and why it matters.

## 2. Flutter reference map

Every in-scope screen and its source location + route.

| Screen / flow | Flutter source | Route |
|---------------|----------------|-------|
| ... | `lib/features/<name>/presentation/...` | `/...` |

## 3. User stories

- As a **guest**, I can ...
- As an **authenticated user**, I can ...

## 4. Functional requirements

Numbered and testable.

- **FR-1:** ...
- **FR-2:** ...

## 5. API contracts

Copy shapes from the Flutter `data/` layer. Backend base: `https://api.webuddhist.com/api/v1/`.

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `/...` | GET | guest ok / required | ... |

Request / response examples:

```jsonc
// GET /...
{ }
```

## 6. State & persistence

- Local keys touched (map to Flutter `StorageKeys`).
- Guest vs authenticated behavior.
- Cache / offline expectations.

## 7. Navigation (Expo Router)

| Flutter route | v2 file route | Params / search params | Notes |
|---------------|---------------|------------------------|-------|
| `/...` | `src/app/...` | ... | ... |

## 8. UI / UX parity notes

- Key visual elements, empty/loading/error states.
- Intentional differences from Flutter (with rationale).

## 9. Platform / Expo considerations

- Native modules required (notifications, video, audio, etc.).
- Does this require a new dev client build? (yes/no)
- iOS / Android differences.

## 10. Acceptance criteria

- [ ] Given ... When ... Then ...
- [ ] Behavior verified on iOS and Android.
- [ ] Guest and authenticated paths both covered.

## 11. Out of scope (this phase)

- ...

## 12. Open questions

- ...

## 13. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| FR-1 | yes | no | |
