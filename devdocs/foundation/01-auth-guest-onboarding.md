# Auth, Guest Mode & Onboarding — Migration PRD

| | |
|---|---|
| **Status** | PRD draft |
| **Priority** | P0 |
| **Flutter baseline** | `lib/features/auth`, `lib/features/onboarding`, `lib/core/config/router/route_guard.dart` |
| **v2 target** | `src/providers/auth0.tsx`, `src/app/_layout.tsx`, `src/app/login.tsx` |
| **Owner** | @migration-lead |
| **Last updated** | 2026-06-08 |

---

## 1. Summary

Authentication, guest mode, and onboarding gate the entire app. This PRD captures the
Flutter Auth0 model (notably its **ID-token-based** authorization), guest-mode
persistence, and the onboarding flow, and defines how v2 reproduces them with
`react-native-auth0`.

## 2. Flutter reference & existing docs

Reuse — do not rewrite — the Flutter auth documentation:

| Doc | Path |
|-----|------|
| Auth architecture | `WeBuddhist-app/docs/architecture/AUTH_IMPLEMENTATION.md` |
| Token refresh flow | `WeBuddhist-app/docs/architecture/TOKEN_REFRESH_FLOW.md` |
| Token refresh fixes | `WeBuddhist-app/docs/changelog/AUTH0_TOKEN_REFRESH_FIXES.md` |
| Guest mode persistence | `WeBuddhist-app/docs/architecture/GUEST_MODE_PERSISTENCE.md` |

Source files:

| Element | Flutter source |
|---------|----------------|
| Auth state | `features/auth/presentation/providers/state_providers.dart` |
| Login screen | `features/auth/presentation/screens/login_page.dart` |
| Splash | `features/auth/presentation/screens/splash_screen.dart` |
| Route guard | `core/config/router/route_guard.dart` |
| Onboarding | `features/onboarding/presentation/screens/onboarding_wrapper.dart` |

## 3. Key architectural decision: ID tokens

Flutter uses **ID tokens** (not access tokens) for API authorization — this is a
deliberate decision documented in `AUTH_IMPLEMENTATION.md`. v2 must:

- Confirm the backend still expects the ID token as bearer.
- Implement matching token refresh + 401-retry behavior (see token refresh docs).
- Store tokens in secure storage (`expo-secure-store`).

➡️ **Open question:** v2's current `auth0.tsx` is a thin `Auth0Provider`. The ID-token
authorization model and refresh/concurrency control are **not yet ported**. This is the
biggest auth risk.

## 4. Auth states

From Flutter `authProvider` + route guard, the app distinguishes:

| State | Meaning |
|-------|---------|
| Unauthenticated | No tokens; only public routes |
| Guest | `is_guest_mode = true`; guest-accessible routes only |
| Authenticated | Valid tokens; full access |
| Authenticated + onboarding incomplete | Redirected to `/onboarding` |

## 5. Functional requirements

- **FR-1:** Auth0 Universal Login via `react-native-auth0` using `webuddhist://` scheme.
  Callback/logout URLs per `setup.md`.
- **FR-2:** Persist session across restarts; auto-restore on launch (matches Flutter
  splash → home/login decision).
- **FR-3:** Guest mode — user can enter the app without logging in; persisted via a
  guest flag (Flutter `StorageKeys.isGuestMode`). Survives restarts.
- **FR-4:** Guest → authenticated upgrade path (login from within guest session)
  preserving navigation intent (Flutter uses a "pending route" provider).
- **FR-5:** Route protection per `AppRoutes`:
  - Public: `/splash`, `/login`.
  - Guest-accessible (prefix match): `/home`, `/more`, `/ai-mode`, `/practice`,
    `/practice/plans/preview`, `/reader`, `/notifications`, `/plan-text`.
  - Auth-required (prefix match): `/practice/edit-routine`, `/profile`, `/plans/info`,
    `/recitations/detail`.
- **FR-6:** Onboarding — first-time users complete onboarding after first login;
  completion is **per-user** (`onboarding_completed_<userId>`) plus a device-level
  fallback flag. Guests skip onboarding.
- **FR-7:** ID-token-based API authorization + silent refresh + 401 retry (see §3).
- **FR-8:** Logout clears tokens, user data, and resets to `/login`.

## 6. API / Auth0 config

| Item | Value (from `setup.md` / `auth0.tsx`) |
|------|----------------------------------------|
| Provider | `react-native-auth0` `Auth0Provider` |
| Domain | `EXPO_PUBLIC_AUTH0_DOMAIN` |
| Client ID | `EXPO_PUBLIC_AUTH0_CLIENT_ID` (Native app) |
| Custom scheme | `webuddhist` |
| Android package / iOS bundle | `com.webuddhist.app` |
| Callback URL | `webuddhist://<domain>/android|ios/com.webuddhist.app/callback` |

API base for authorized calls: `https://api.webuddhist.com/api/v1/`.

## 7. State & persistence (map to Flutter StorageKeys)

| Data | Flutter key | Storage | v2 target |
|------|-------------|---------|-----------|
| User data | `user_data` | prefs | async storage |
| Guest flag | `is_guest_mode` | prefs | async storage |
| Access token | `access_token` | secure | `expo-secure-store` |
| Refresh token | `refresh_token` | secure | `expo-secure-store` |
| ID token | `id_token` | secure | `expo-secure-store` |
| User ID | `user_id` / `current_user_id` | secure / prefs | secure / async |
| Onboarding (per user) | `onboarding_completed_<userId>` | prefs | async storage |
| Onboarding (device) | `onboarding_completed` | prefs | async storage |

## 8. Navigation (Expo Router)

Current v2 gate (`src/app/_layout.tsx` → `AuthGate`) only handles
authenticated-vs-login. It must be extended to a full guard:

| Condition | Redirect |
|-----------|----------|
| Loading session | Splash/spinner |
| Not auth, not guest, protected route | `/login` |
| Authenticated, onboarding incomplete | `/onboarding` |
| Authenticated on `/login` | `/` (home) |
| Guest on auth-required route | `/login` (preserve intent) |

## 9. Acceptance criteria

- [ ] Login via Auth0 works on iOS + Android (dev client).
- [ ] Session restores on cold start without re-login.
- [ ] Guest mode persists across restarts; guest sees only guest-accessible routes.
- [ ] Guest → login upgrade returns user to intended route.
- [ ] Authenticated API calls carry the correct token; 401 triggers refresh + retry.
- [ ] Onboarding shows once per user, skipped for guests, and is not re-shown.
- [ ] Logout clears all tokens/user data and returns to login.

## 10. Open questions

- Confirm backend bearer token type (ID vs access) for v2.
- Does v2 need the same refresh concurrency control as Flutter, or does
  `react-native-auth0` handle it?
- Guest mode is absent in v2 today — confirm it's in scope for first release.

## 11. Migration status checklist

| Requirement | Flutter | v2 | Notes |
|-------------|---------|-----|-------|
| Auth0 login | yes | yes (basic) | provider wired |
| Session restore | yes | partial | via `useAuth0` |
| Guest mode | yes | no | not implemented |
| Route guard (full) | yes | no | login-only gate |
| ID-token auth + refresh | yes | no | biggest gap |
| Onboarding | yes | no | not implemented |
