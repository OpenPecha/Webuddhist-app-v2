# Settings & Profile (More) — Migration PRD

| | |
|---|---|
| **Status** | In progress (partial) |
| **Priority** | P2 |
| **Flutter baseline** | `lib/features/more` |
| **v2 target** | `src/app/(tabs)/screens/setting/index.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-11 |

---

## 1. Summary

The "Me" tab contains the user profile, settings (language, theme, notifications),
about, privacy policy, and account actions (login/logout, guest upgrade). For guests,
it also shows benefits copy and a sign-in CTA.

## 2. Flutter reference map

| Screen | Flutter source | Route |
|--------|----------------|-------|
| More / settings hub | `features/more/presentation/more_screen.dart` | `/settings`, `/home/settings` |
| Me screen | `features/more/presentation/me_screen.dart` | (Me tab) |
| Edit profile | `features/more/presentation/edit_profile_screen.dart` | `/profile` |
| About | `features/more/presentation/about_screen.dart` | `/about` |
| Privacy policy | `features/more/presentation/privacy_policy_screen.dart` | `/privacy-policy` |
| Notification settings | `features/notifications/presentation/notification_settings_screen.dart` | `/notifications` |

## 3. User stories

- As an **authenticated** user, I can view/edit my profile and sign out.
- As a **guest**, I see a guest profile with sign-in benefits and an upgrade CTA.
- As any user, I can change language and theme, and open about/privacy.
- As any user, I can manage notification settings.

## 4. Functional requirements

- **FR-1:** Settings hub listing: profile, language, theme, notifications, about,
  privacy, account action.
- **FR-2:** Profile view/edit (auth-required; `/profile` is protected).
- **FR-3:** Guest profile view with benefits card + sign-in CTA (Flutter guest mode).
- **FR-4:** Language switcher (see `foundation/04-i18n-theming`).
- **FR-5:** Theme switcher (light/dark/system), persisted.
- **FR-6:** Notification settings entry (see `foundation/06-notifications`).
- **FR-7:** About + privacy policy screens.
- **FR-8:** Logout (clears tokens/user data → login) and guest→login upgrade.

## 5. API contracts

**Source:** Flutter `edit_profile_screen.dart` · Backend `WeBuddhist-Backend/pecha_api/users/users_views.py`
(`user_response_models.py`). Profile lives under **`/users/info`**, not `/users/me`.

| Endpoint | Method | Auth | OpenAPI / backend schema | Notes |
|----------|--------|------|--------------------------|-------|
| `/users/info` | GET | required | `UserInfoResponse` | Load profile |
| `/users/info` | POST | required | `UserInfoRequest` → **201** | Update profile (Flutter uses POST, not PUT) |
| `/users/info` | DELETE | required | **204** | Delete account |
| `/users/upload` | POST | required | multipart `file` → **201** | Avatar upload |

`UserInfoResponse`: `firstname`, `lastname`, `username`, `email`, `title`, `organization`,
`location`, `educations[]`, `avatar_url`, `about_me`, `followers`, `following`,
`social_profiles[]`.

Local cache keys: `profile_data`, `last_profile_update` (see §6).

## 6. State & persistence

| Data | Flutter key |
|------|-------------|
| Theme | `theme_mode` |
| Language | `locale` |
| Profile cache | `profile_data`, `last_profile_update` |
| Guest flag | `is_guest_mode` |

## 7. Navigation

| Flutter route | v2 route |
|---------------|----------|
| `/settings` | `src/app/(tabs)/screens/setting/index.tsx` |
| `/profile` | `src/app/settings/profile.tsx` (TBD) |
| `/about` | `src/app/settings/about.tsx` (TBD) |
| `/privacy-policy` | `src/app/settings/privacy.tsx` (TBD) |
| `/notifications` | `src/app/settings/notifications.tsx` (TBD) |

Tab placement depends on shell decision (`foundation/00-app-shell-navigation`).

## 8. Acceptance criteria

- [ ] Settings hub renders all entries.
- [ ] Profile view/edit works for authenticated users.
- [ ] Guest profile shows benefits + working sign-in CTA.
- [ ] Language + theme switch and persist.
- [ ] About + privacy render.
- [ ] Logout clears session and returns to login.

## 9. Open questions

- Profile fields + update endpoint shape.
- Guest benefits content/copy source.
- Is "Me" tab == settings, or separate (depends on shell decision)?

## 10. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Settings hub | yes | partial | settings screen scaffolded |
| Profile edit | yes | no | |
| Guest profile | yes | no | |
| Language/theme switch | yes | no | |
| About/privacy | yes | no | |
| Logout | yes | partial | auth gate exists |
