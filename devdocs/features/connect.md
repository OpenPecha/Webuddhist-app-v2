# Connect — Migration PRD

| | |
|---|---|
| **Status** | **Parity** (v2 implementation complete) |
| **Priority** | P1 |
| **Flutter baseline** | `lib/features/connect`, `lib/features/group_profile` |
| **v2 target** | `src/app/(tabs)/connect.tsx`, `src/app/connect/*`, `src/app/group/[id].tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 |

---

## 1. Summary

The **Connect** tab is the community hub: discover organizations/groups, view joined
groups, and open **group profiles** that host series and practices. Mockups label orgs
like "ITCC" or "Light Of Buddhadharma Foundation International" — these map to
`GroupProfileScreen`, not a separate creator profile.

v2 implements full Connect parity: discover feed, my groups, search, and group profile
with join/follow, Practices/About tabs, and social links.

---

## 2. Flutter reference map

| Screen / element | Flutter source | v2 route |
|------------------|----------------|----------|
| Connect tab | `connect_screen.dart` | `/(tabs)/connect` |
| Discover groups | `discover_group_card.dart` + providers | Scroll feed on Connect |
| My groups | `my_groups_section.dart` | Horizontal list on Connect |
| Group search | `group_search_screen.dart` | `/connect/search` |
| My groups full list | `my_groups_screen.dart` | `/connect/my-groups` |
| Group profile | `group_profile_screen.dart` | `/group/[id]` |
| Profile body | `group_profile_body.dart` | Practices + About tabs |
| Social links | `group_profile_links_drawer.dart` | Bottom sheet |
| Series About → org | `series_info_screen.dart` group row | `/group/[id]` via `SeriesGroupRow` |

**Note:** No standalone "creator profile" route in Flutter.

---

## 3. Parity helpers (v2)

| Flutter provider | v2 module |
|------------------|-----------|
| `filterDiscoverGroups` | `src/lib/connect-groups.ts` |
| `mergeMyGroupsWithPending` | `src/lib/connect-groups.ts` |
| Optimistic join/follow | `src/stores/pending-groups.ts` |

Discover feed excludes joined groups. My-groups carousel merges optimistic joins ahead of
API results until refetch confirms membership.

---

## 4. User stories

- As any user, I can browse discoverable community groups on the Connect tab.
- As an authenticated user, I can see groups I have joined.
- As any user, I can open a group profile and read about the organization.
- As an authenticated user, I can join a community group or follow a page-type group.
- As any user, I can browse series/practices hosted by a group and open series detail.
- As any user, I can access social links for a group.

---

## 5. Functional requirements

- **FR-1:** Connect tab with discover groups (paginated) and my groups section.
- **FR-2:** Group profile: banner, avatar, name, member count, description, Join/Follow CTA.
- **FR-3:** Practices tab listing series → tap opens `/series/[id]`.
- **FR-4:** About tab when long description exists.
- **FR-5:** Social links drawer when multiple links exist.
- **FR-6:** Group search with debounced query.
- **FR-7:** Guest can browse; join/follow requires auth (login drawer).
- **FR-8:** Loading / error / empty / pull-to-refresh.

---

## 6. API contracts

| Endpoint | Method | Auth | Used for |
|----------|--------|------|----------|
| `/author/groups?language=&group_type=COMMUNITY&search=&skip=&limit=` | GET | Guest | Discover feed |
| `/users/me/joined/author/groups?language=&skip=&limit=` | GET | Auth | My groups |
| `/author/groups/{id}?language=` | GET | Guest | Group profile |
| `/author/groups/{id}/join` | POST | Auth | Community join |
| `/author/groups/{id}/follow` | POST | Auth | Page follow |
| `DELETE /author/groups/{id}/join` | DELETE | Auth | Leave |
| `DELETE /author/groups/{id}/follow` | DELETE | Auth | Unfollow |
| `/users/me/joined/author/groups?group_id=` | GET | Auth | Join status |
| `/users/me/following/author/groups?group_id=` | GET | Auth | Follow status |

**Group type behavior:** `PAGE` uses follow/unfollow; `COMMUNITY` uses join/leave.

---

## 7. Navigation

| Flutter route | v2 route |
|---------------|----------|
| Connect tab | `src/app/(tabs)/connect.tsx` |
| `/home/group/:groupId` | `src/app/group/[id].tsx` |
| Series About org row | `group/[id]` from `SeriesGroupRow` |

Register group profile in root stack (`_layout.tsx`) — full screen, no tab bar.

**Cross-links:** Series org row ([series.md §3a](./series.md)) navigates to group profile.
Group profile `series[]` opens [series detail](./series.md). Standalone plans link to
[plans preview](./plans.md).

### Group profile UI (Flutter / mockup parity)

Refactored into `src/components/group-profile/*` to match `group_profile_body.dart`:

| Element | v2 behavior |
|---------|-------------|
| App bar | Fixed top back row on scaffold (not overlaid on banner) |
| Banner | Horizontal inset 16px, radius 16, 16:9 aspect ratio |
| Header | 44px avatar beside title; subtitle; bold member/follower count |
| Description | 15px expandable short bio |
| Social links | Primary host URL + `and {{count}} more links` → sheet or open |
| Join CTA | Inline full-width stadium button (48px, radius 24) — no sticky footer |
| Tabs | Left-aligned Practices / About; About hidden when no `description_long` |
| Practices | 56px thumbs, subtitle from `sub_title` or formatted date range; includes plans |

---

## 8. Scope tiers

| Priority | Scope | Status |
|----------|-------|--------|
| **P1** | Discover feed, my groups, group profile, join/follow, search | **Done** |
| **P2** | Offline cache (Flutter Hive), shared toast vs Alert | Deferred |
| **P3** | In-app messaging, feeds beyond hosted series | Out of scope |

---

## 9. Acceptance criteria

- [x] Connect tab shows discover groups with pagination and pull-to-refresh.
- [x] Authenticated user sees joined groups section (with optimistic merge).
- [x] Joined groups hidden from discover feed.
- [x] Group profile loads with banner, avatar, description, member count.
- [x] Join/Follow works; button reflects current state (COMMUNITY vs PAGE).
- [x] Practices tab opens series detail on tap.
- [x] About tab shows long description when present.
- [x] Series About screen links to group profile.

---

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Connect tab | yes | yes | |
| Discover groups | yes | yes | Filtered by joined set |
| My groups | yes | yes | Optimistic merge |
| Group profile | yes | yes | |
| Join / Follow | yes | yes | PAGE vs COMMUNITY |
| Group search | yes | yes | `/connect/search` |
| Link from series About | yes | yes | `SeriesGroupRow` |

---

## 11. Research references

| Document | Purpose |
|----------|---------|
| [flutter-series-plans-connect-routes.md](../research/flutter-series-plans-connect-routes.md) | Connect + group workflows |
| [mockup-screen-index.md](../research/mockup-screen-index.md) | Community mockup frames |
| [api-to-screen-matrix.md](../research/api-to-screen-matrix.md) | Group endpoints |
| [series-plans-connect-gap-matrix.md](../research/series-plans-connect-gap-matrix.md) | Gap analysis |
