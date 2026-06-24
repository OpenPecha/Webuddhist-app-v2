# Connect — Migration PRD

| | |
|---|---|
| **Status** | PRD draft (research complete) |
| **Priority** | P1 (tab shell done) |
| **Flutter baseline** | `lib/features/connect`, `lib/features/group_profile` |
| **v2 target** | `src/app/(tabs)/connect.tsx`, `src/app/group/[id].tsx` (planned Sprint 3) |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-22 (implementation alignment) |

---

## 1. Summary

The **Connect** tab is the community hub: discover organizations/groups, view joined
groups, and open **group profiles** that host series and practices. Mockups label orgs
like "ITCC" or "Light Of Buddhadharma Foundation International" — these map to
`GroupProfileScreen`, not a separate creator profile.

v2 today: Connect tab exists as a **placeholder** only (`connect.coming_soon`).

---

## 2. Flutter reference map

| Screen / element | Flutter source | Route / navigation |
|------------------|----------------|-------------------|
| Connect tab | `features/connect/presentation/screens/connect_screen.dart` | Main tab (no route) |
| Discover groups | `discover_group_card.dart` + providers | Scroll feed on Connect |
| My groups | `my_groups_section.dart` | Horizontal list on Connect |
| Group search | `group_search_screen.dart` | `MaterialPageRoute` |
| My groups full list | `my_groups_screen.dart` | `MaterialPageRoute` |
| Group profile | `features/group_profile/presentation/screens/group_profile_screen.dart` | `/home/group/:groupId` |
| Profile body | `group_profile_body.dart` | Practices + About tabs |
| Social links | `group_profile_links_drawer.dart` | Bottom sheet |
| Series About → org | `series_info_screen.dart` group row | Push group profile |

**Note:** No standalone "creator profile" route in Flutter.

---

## 3. Mockup redesign (`series_page` community frames)

| Mockup element | Flutter | v2 target | API |
|----------------|---------|-----------|-----|
| Banner hero | Yes | `group/[id]` | `GET /author/groups/{id}` |
| Avatar overlap | Yes | Same | `image` |
| Member count | Yes | Same | `member_count` |
| Description (expandable) | Yes | Same | `description` |
| Join button (black CTA) | Yes | Sticky bottom | `POST .../join` or `.../follow` |
| Practices tab | Yes | Tab → series list | series on profile DTO |
| About tab (MISSION/VISION) | Yes | Markdown sections | `description_long` |
| Social links sheet | Yes | Bottom sheet | `social_links[]` |
| Connect discover feed | Yes | Connect tab scroll | `GET /author/groups?group_type=COMMUNITY` |

Full frame index: [`devdocs/research/mockup-screen-index.md`](../research/mockup-screen-index.md) Set D.

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
- **FR-6:** Group search (optional P2).
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

Flutter sources: `connect_remote_datasource.dart`, `group_profile_remote_datasource.dart`.

**Group type behavior:** `GroupType.page` uses follow/unfollow; `GroupType.community` uses join/leave.

---

## 7. Navigation

| Flutter route | v2 route (planned) |
|---------------|-------------------|
| Connect tab | `src/app/(tabs)/connect.tsx` |
| `/home/group/:groupId` | `src/app/group/[id].tsx` |
| Series About org row | `group/[id]` from `series/[id]/info` |

Register group profile in root stack (`_layout.tsx`) — full screen, no tab bar (mirror calendar/events).

**Cross-links:** Series org row ([series.md §3a](./series.md)) and series About navigate here.
Group profile `series[]` opens [series detail](./series.md). Standalone plans on group DTO
link to [plans preview](./plans.md).

---

## 8. Scope tiers

| Priority | Scope |
|----------|-------|
| **Done** | Connect tab placeholder in bottom nav |
| **P1** | Discover feed, my groups, group profile (Practices + About), join/follow |
| **P2** | Group search, my groups full list, social links polish |
| **P3** | In-app messaging, feeds beyond hosted series |

P1 scope is **fully API-backed** — see [`open-questions.md`](../research/open-questions.md) §5 and [`api-to-screen-matrix.md`](../research/api-to-screen-matrix.md) Connect section.

---

## 9. Acceptance criteria

- [ ] Connect tab shows discover groups with pagination and pull-to-refresh.
- [ ] Authenticated user sees joined groups section.
- [ ] Group profile loads with banner, avatar, description, member count.
- [ ] Join/Follow works; button reflects current state.
- [ ] Practices tab opens series detail on tap.
- [ ] About tab shows long description when present.
- [ ] Series About screen links to group profile.

---

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Connect tab | yes | partial | stub only |
| Discover groups | yes | no | |
| My groups | yes | no | |
| Group profile | yes | no | |
| Join / Follow | yes | no | |
| Group search | yes | no | imperative push |
| Link from series About | yes | no | |

---

## 11. Research references

| Document | Purpose |
|----------|---------|
| [flutter-series-plans-connect-routes.md](../research/flutter-series-plans-connect-routes.md) | Connect + group workflows |
| [mockup-screen-index.md](../research/mockup-screen-index.md) | Community mockup frames |
| [api-to-screen-matrix.md](../research/api-to-screen-matrix.md) | Group endpoints |
| [series-plans-connect-gap-matrix.md](../research/series-plans-connect-gap-matrix.md) | Gap analysis |
