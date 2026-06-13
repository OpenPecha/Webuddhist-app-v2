# WeBuddhist (Expo)

React Native app built with Expo SDK 56, EAS Build, and a dev-client workflow.

---

## For team members (daily development)

Most day-to-day work is **JavaScript/TypeScript only** — no EAS builds or keystore setup needed.

### One-time setup on your machine

1. Clone the repo and `cd Webuddhist-app-v2`
2. Copy env file and get values from a teammate / secrets doc:

   ```bash
   cp .env.example .env
   ```

   Fill in at minimum: `EXPO_PUBLIC_AUTH0_DOMAIN`, `EXPO_PUBLIC_AUTH0_CLIENT_ID`, and API URLs.

3. Install dependencies:

   ```bash
   npm install
   ```

4. **Install the dev client** on your device (one time per native change):
   - Ask a maintainer for the latest **WeBuddhist Dev** build link from [expo.dev](https://expo.dev), **or**
   - Download from your team’s shared install link / internal doc.
   - Install the `.apk` on Android or the simulator build on iOS (Mac).
   - Use **WeBuddhist Dev** — **not Expo Go**.

5. Optional — Expo login (only if you need to view builds on expo.dev):

   ```bash
   eas login
   ```

### Daily workflow

```bash
npm start
# if your phone can't reach your PC over Wi‑Fi:
npm run start:tunnel
```

1. Open **WeBuddhist Dev** on your phone or simulator.
2. Edit code — changes hot-reload over Metro.
3. Run lint before pushing: `npm run lint`

### What team members should do

| Do | Why |
|----|-----|
| Use `npm install` / `npm start` | Standard JS workflow |
| Keep `.env` local only | Never commit secrets |
| Install **WeBuddhist Dev** (`org.pecha.app.dev`) | Runs alongside the store app |
| Ask for a new dev build when native deps change | See “When you need a new dev build” below |
| Use `npm run start:tunnel` if Metro is unreachable | Fixes “host unreachable” on device |

### What team members should **not** do

| Don't | Why |
|-------|-----|
| Use **Expo Go** | This project requires a dev client |
| Press `s` to switch to Expo Go in Metro | Same as above |
| Run `eas build` unless asked by a maintainer | Builds cost time; credentials are shared |
| Run `eas credentials` or change keystores | Can break Play Store signing for everyone |
| Change `app.config.js`, `eas.json`, or app ids without review | Affects signing, Auth0, and store releases |
| Commit `.env` | Contains secrets |
| Generate a **production** keystore | Production must keep the Flutter upload key |
| Install dev APK over the store app if using old `org.pecha.app` builds | Use **WeBuddhist Dev** (`.dev`) instead |

### When you need a new dev build

Ask a maintainer (or run yourself only if approved) when any of these change:

- New native module (`npm install` package with native code)
- Changes to `app.config.js`, `eas.json`, or Expo plugins
- Auth0 native scheme / app id changes
- Expo SDK upgrade

**JS-only changes** (screens, hooks, styles) → just `npm start`, no new build.

### Team troubleshooting

| Problem | Try |
|---------|-----|
| “Host unreachable” / red error screen | `npm run start:tunnel`; same Wi‑Fi; don’t use Expo Go |
| Login fails after Auth0 screen | Confirm `.env` Auth0 values; ask if callback URLs were updated |
| “Package appears to be invalid” (old APK) | Install **WeBuddhist Dev** (`.dev`), not an old `org.pecha.app` dev APK |
| App won’t connect after native change | Install the latest dev build from the team link |

---

## For maintainers (first-time / infra setup)

One person (or release owner) sets up EAS, credentials, and Auth0 **once**. Team members then only install the resulting dev build.

### Prerequisites

- Node.js 20+
- [EAS CLI](https://docs.expo.dev/build/setup/): `npm install -g eas-cli`
- Expo account access to project `a2b8d034-7594-4d47-8760-4f4989d706d1`
- Flutter **upload keystore** file (for future Play Store builds only)

```bash
eas login
npm install
cp .env.example .env   # fill in values
```

### Link EAS project (once)

From `Webuddhist-app-v2`:

```bash
eas init --id a2b8d034-7594-4d47-8760-4f4989d706d1 --force
```

Only needed if the project is not already linked.

### Auth0 (once per app id)

Add callback and logout URLs in the Auth0 dashboard for **both** app ids:

| App id | Used for |
|--------|----------|
| `org.pecha.app.dev` | Dev client (`development` / `preview` builds) |
| `org.pecha.app` | Production / Play Store (Flutter replacement) |

Runtime scheme is read from `Constants.expoConfig.extra.auth0CustomScheme` in `src/providers/auth0.tsx` — keep dashboard URLs in sync with `app.config.js`.

---

## App variants

Controlled by `APP_VARIANT` in `app.config.js` (set per EAS profile in `eas.json`).

| EAS profile | `APP_VARIANT` | App ID | Use |
|-------------|---------------|--------|-----|
| `development`, `preview` | `development` | `org.pecha.app.dev` | Dev client; installs **alongside** the store Flutter app |
| `production` | `production` | `org.pecha.app` | Play / App Store release |

Local `npm start` defaults to **development** (`org.pecha.app.dev`).

---

## Keystore & signing (maintainers only)

Credentials live on **EAS**, not in this repo. One credential set per app id.

### Android keystores

| App ID | EAS profile | Keystore | When to set up |
|--------|-------------|----------|----------------|
| `org.pecha.app.dev` | `development`, `preview` | **New EAS keystore** | First Android dev build — answer **Y** to “Generate a new Android Keystore?” |
| `org.pecha.app` | `production` | **Flutter upload keystore** | Before first Play Store build — **upload existing**, never generate new |

#### Why two Android keystores?

- **Dev (`.dev`)** — new EAS key is fine; installs next to the Flutter store app.
- **Production (`org.pecha.app`)** — must use the **same upload key** as the live Flutter app, or Google Play rejects updates.

If Play App Signing is enabled, use the **upload keystore** (`.jks` / `.keystore`) from Flutter/Android release setup.

#### Set up Android credentials

**Development** (generate new):

```bash
eas credentials -p android --profile development
```

**Production** (upload Flutter key — before first Play build):

```bash
eas credentials -p android --profile production
```

Choose **Upload existing keystore**; provide file, keystore password, key alias, and key password.

Manage via CLI or [expo.dev](https://expo.dev) → Project → **Credentials** → Android.

#### Android signing troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| “Package appears to be invalid” | Old dev APK on same package as store app | Use `.dev` dev build, or uninstall store app |
| Play Store rejects production AAB | Wrong upload keystore | Upload Flutter keystore under `production` |
| Wrong artifact on phone | Installed `.aab` instead of `.apk` | Dev/preview builds `.apk` only |

### iOS credentials (maintainers)

| App ID | EAS profile | Credentials | Device target |
|--------|-------------|-------------|---------------|
| `org.pecha.app.dev` | `development` | EAS-managed | **Simulator only** (`ios.simulator: true`) |
| `org.pecha.app` | `production` | App Store distribution | App Store |

```bash
eas credentials -p ios --profile development
eas credentials -p ios --profile production
```

Requires **Apple Developer** membership.

---

## Development builds (maintainers — create builds for the team)

Run from `Webuddhist-app-v2`. After a build completes, share the install link with the team.

A dev build is a **custom dev client** (not Expo Go). Team members install it once, then use `npm start` daily.

### Android development build (physical device)

**Output:** `.apk` for `org.pecha.app.dev`

#### 1. Build

```bash
eas build --platform android --profile development
```

First run prompts:

| Prompt | Answer |
|--------|--------|
| Generate a new Android Keystore? | **Y** (for `org.pecha.app.dev`) |

#### 2. Share with team

Send the build URL from [expo.dev](https://expo.dev). Teammates tap **Install** on their phone.

#### 3. Metro (everyone)

```bash
npm start
# or: npm run start:tunnel
```

```bash
eas build:list --profile development --platform android
```

---

### iOS development build (Simulator)

**Output:** Simulator build for `org.pecha.app.dev`  
**Requires:** macOS + Xcode  
**Note:** Current profile is **simulator only** — not for physical iPhone.

#### 1. Build

```bash
eas build --platform ios --profile development
```

#### 2. Install on Simulator (Mac)

```bash
eas build:run --profile development --platform ios --latest
```

Or download `.tar.gz` from expo.dev and drag `.app` onto the simulator.

#### 3. Metro

```bash
npx expo start --dev-client
```

#### Physical iPhone

Not covered by the current `development` profile. Options:

- Local: `npx expo run:ios --device` (Mac + Xcode)
- EAS: new profile without `ios.simulator: true` + registered device UDIDs

---

## Local native builds (optional)

For maintainers debugging native code without EAS:

```bash
npm run android          # Android SDK required
npx expo run:ios --device   # macOS + Xcode only
```

Native config changes require a **new** EAS or local build — Metro alone is not enough.

---

## Production builds (maintainers only)

```bash
# Android — AAB for Play Store (org.pecha.app, Flutter upload keystore)
eas build --platform android --profile production

# iOS — App Store (org.pecha.app)
eas build --platform ios --profile production
```

Upload Flutter Android upload keystore **before** the first production Android build:

```bash
eas credentials -p android --profile production
```

---

## Quick reference

### Team members

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev server | `npm start` |
| Dev server (tunnel) | `npm run start:tunnel` |
| Lint | `npm run lint` |
| Get dev build | Ask maintainer for latest **WeBuddhist Dev** link on expo.dev |

### Maintainers

| Task | Command |
|------|---------|
| **Android** dev build | `eas build --platform android --profile development` |
| **iOS** dev build (simulator) | `eas build --platform ios --profile development` |
| Install latest iOS sim build | `eas build:run --profile development --platform ios --latest` |
| Android dev credentials | `eas credentials -p android --profile development` |
| Android prod credentials (Flutter key) | `eas credentials -p android --profile production` |
| iOS credentials | `eas credentials -p ios --profile development` |
| Production Android build | `eas build --platform android --profile production` |
| Production iOS build | `eas build --platform ios --profile production` |
