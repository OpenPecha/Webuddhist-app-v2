# Meditation & Prayer of the Day — Migration PRD

| | |
|---|---|
| **Status** | Won't migrate |
| **Priority** | — (out of scope) |
| **Flutter baseline** | `lib/features/meditation_of_day`, `lib/features/prayer_of_the_day` |
| **v2 target** | TBD |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-11 |

---

> **Out of scope for v2.** This feature will not be built. No meditation/prayer-of-day
> API endpoints are required in v2 networking or feature PRDs. Flutter reference only.

## 1. Summary

Daily content surfaces: a "Meditation of the Day" and a "Prayer of the Day", reached
from the home screen. Includes associated media (illustrations, meditation video) and
prayer data display.

## 2. Flutter reference map

| Screen / element | Flutter source | Route |
|------------------|----------------|-------|
| Meditation of the day | `features/meditation_of_day/presentation/meditation_of_day_screen.dart` | `/home/meditation_of_the_day` |
| Prayer of the day | `features/prayer_of_the_day/presentation/prayer_of_the_day_screen.dart` | `/home/prayer_of_the_day` |
| Meditation video | `features/home/presentation/widgets/meditation_video.dart` | `/home/meditation_video` |
| View illustration | `features/home/presentation/widgets/view_illustration.dart` | `/home/view_illustration` |
| YouTube player | `features/home/presentation/widgets/youtube_video_player.dart` | `/home/video_player` |
| Prayer data | `features/home/data/models/prayer_data.dart` | — |

## 3. User stories

- As any user, I can open the meditation of the day and watch its video.
- As any user, I can open the prayer of the day and read it.
- As a user, I can view a full-screen illustration.

## 4. Functional requirements

- **FR-1:** Meditation-of-the-day screen with content + video.
- **FR-2:** Prayer-of-the-day screen with prayer text/data.
- **FR-3:** Video playback (meditation video + YouTube player).
- **FR-4:** Full-screen illustration viewer (image + title).
- **FR-5:** Guest-accessible (reached from `/home`).
- **FR-6:** Loading / error states.

## 5. API contracts

N/A — out of v2 scope. Meditation/prayer-of-day endpoints are not documented in
`foundation/02-api-networking.md` or implemented in v2.

## 6. Platform / Expo considerations

- Video: YouTube playback needs `react-native-youtube-iframe` or a WebView; generic
  video via `expo-video`.
- Image viewer: `expo-image` + zoom (`react-native-image-zoom` or gesture-based).

## 7. Navigation

| Flutter route | v2 route (TBD) |
|---------------|----------------|
| `/home/meditation_of_the_day` | `src/app/daily/meditation.tsx` |
| `/home/prayer_of_the_day` | `src/app/daily/prayer.tsx` |
| `/home/meditation_video` | `src/app/daily/video.tsx` |
| `/home/view_illustration` | `src/app/daily/illustration.tsx` |

## 8. Acceptance criteria

- [ ] Meditation + prayer screens render daily content.
- [ ] Video plays (YouTube + generic).
- [ ] Illustration viewer works.
- [ ] Guest-accessible.

## 9. Open questions

- API endpoints for daily content.
- Is YouTube playback required, or self-hosted video only?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Meditation of day | yes | no | |
| Prayer of day | yes | no | |
| Video playback | yes | no | |
| Illustration viewer | yes | no | |
