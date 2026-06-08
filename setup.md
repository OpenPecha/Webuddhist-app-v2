# Webuddhist App — Clone & Run Guide

Setup instructions for the Webuddhist mobile app. This project uses **Expo SDK 56**, **React Native 0.85**, **Expo Router**, **Auth0**, and **Uniwind**.

> **Important:** This app requires a **development build**. **Expo Go will not work** because of native modules (Auth0).

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js 20+** | [nodejs.org](https://nodejs.org/) |
| **npm** | Comes with Node.js |
| **Expo account** | [expo.dev](https://expo.dev) — ask your team for access |
| **EAS CLI** | `npm install -g eas-cli` — for cloud dev builds (recommended) |

**For local Android builds only:**

| Requirement | Notes |
|-------------|-------|
| **Android Studio** | [developer.android.com/studio](https://developer.android.com/studio) |
| **Android SDK Platform-Tools** | Installed via Android Studio → SDK Manager → SDK Tools |
| **Physical device or emulator** | USB debugging enabled for physical devices |

**For local iOS builds only:**

| Requirement | Notes |
|-------------|-------|
| **macOS + Xcode** | Required for `npm run ios` |
| **Apple Developer account** | For physical iOS devices |

---

## 1. Clone and install

```bash
git clone <repository-url>
cd Webuddhist-app-v2
npm install
```

The repo declares Yarn in `package.json`, but npm works fine.

---

## 2. Environment variables

Create a `.env` file from the template:

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set both values (get these from your team or Auth0 dashboard):

```env
EXPO_PUBLIC_AUTH0_DOMAIN=dev-your-tenant.us.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your_native_app_client_id
```

Both variables are **required at startup**. The app reads them in `src/providers/auth0.tsx`. Without them you will see:

```
InitializationError: A valid "domain" is required for the Auth0 client.
```

`.env` is gitignored — never commit real credentials.

---

## 3. Auth0 setup

You need a **Native** application in Auth0 with the domain and client ID matching your `.env`.

### Application identifiers

| Platform | Value |
|----------|-------|
| Android package | `com.webuddhist.app` |
| iOS bundle ID | `com.webuddhist.app` |
| Custom URL scheme | `webuddhist` |

These come from `app.json` (Auth0 plugin `customScheme` and native package/bundle IDs).

### Allowed Callback URLs

Replace `dev-your-tenant.us.auth0.com` with your actual Auth0 domain (must match `EXPO_PUBLIC_AUTH0_DOMAIN`):

```
webuddhist://dev-your-tenant.us.auth0.com/android/com.webuddhist.app/callback
webuddhist://dev-your-tenant.us.auth0.com/ios/com.webuddhist.app/callback
```

### Allowed Logout URLs

```
webuddhist://dev-your-tenant.us.auth0.com/android/com.webuddhist.app/callback
webuddhist://dev-your-tenant.us.auth0.com/ios/com.webuddhist.app/callback
```

### Common Auth0 mistakes

- Callback URLs use an **old tenant domain** while `.env` has a new one — they must match exactly.
- Using a **Web** application client ID instead of a **Native** client ID.
- Forgetting to save Auth0 dashboard changes before testing login.

---

## 4. Get a development build

You need a custom dev client app installed on your device **once**. After that, JS changes reload over the network without rebuilding.

Choose one path:

### Option A — EAS cloud build (recommended)

No local Android SDK required. Builds run on Expo's servers.

```bash
eas login
eas build --profile development --platform android
```

For iOS simulator:

```bash
eas build --profile development --platform ios
```

When the build finishes:

1. Download and install the APK (Android) or use the install link from [expo.dev](https://expo.dev).
2. Continue to [Daily development workflow](#6-daily-development-workflow).

**Useful EAS commands (iOS):**

```bash
# List recent development builds
eas build:list --profile development --platform ios

# Download and run the latest iOS simulator build
eas build:run --profile development --platform ios --latest
```

### Option B — Local Android build

Requires Android Studio and environment variables configured on your machine.

#### B1. Install Android Studio

1. Install [Android Studio](https://developer.android.com/studio).
2. Open **SDK Manager** → **SDK Tools** → enable **Android SDK Platform-Tools**.
3. Note the default SDK path: `%LOCALAPPDATA%\Android\Sdk` (Windows) or `~/Library/Android/sdk` (macOS).

#### B2. Set environment variables (Windows)

Open **Settings → System → About → Advanced system settings → Environment Variables** and add under **User variables**:

| Variable | Value |
|----------|-------|
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jbr` |
| `ANDROID_HOME` | `%LOCALAPPDATA%\Android\Sdk` |

Edit **User `Path`** and add:

```
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
```

**Fully quit and restart your IDE/terminal** after changing environment variables (reload window is not enough).

Verify:

```powershell
java -version
adb devices
```

#### B3. Connect a device or start an emulator

**Physical device:**

1. Enable **Developer options** → **USB debugging** on your phone.
2. Connect via USB and accept the debugging prompt.
3. Run `adb devices` — your device should appear.

**Emulator:**

1. Open Android Studio → **Device Manager** → create/start a virtual device.

#### B4. Build and install

```bash
npm run android
```

This runs `expo run:android`, which prebuilds native code, compiles with Gradle, and installs on the connected device/emulator.

### Option C — Local iOS build (macOS only)

**Simulator** (after EAS simulator build):

```bash
eas build:run --profile development --platform ios --latest
```

**Physical device:**

```bash
npx expo run:ios --device
```

---

## 5. Run on web (optional)

For UI-only development without native Auth0 login:

```bash
npm run web
```

Native Auth0 login flows behave differently on web — use a dev client on a device for full auth testing.

---

## 6. Daily development workflow

After the dev client is installed on your device:

```bash
npx expo start --dev-client
```

1. Start Metro with the command above.
2. Open the **Webuddhist dev client app** on your phone (not Expo Go, not the phone camera/browser).
3. Scan the QR code from inside the dev client app.

If your phone cannot reach your PC over LAN:

```bash
npx expo start --dev-client --tunnel
```

### What reloads automatically

- JavaScript/TypeScript changes hot-reload over Metro.
- Native config changes (plugins, `app.json`, new native modules) require a **new dev build**.

---

## 7. Scripts reference

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Build and run on Android (local SDK required) |
| `npm run ios` | Build and run on iOS (macOS + Xcode required) |
| `npm run web` | Start web dev server |
| `npm run lint` | Run ESLint via Expo |

---

## 8. Troubleshooting

| Problem | Solution |
|---------|----------|
| `'adb' is not recognized` | Set `ANDROID_HOME` and add `%ANDROID_HOME%\platform-tools` to User PATH. Fully restart your IDE. |
| `JAVA_HOME is not set` | Set `JAVA_HOME` to Android Studio JBR (`C:\Program Files\Android\Android Studio\jbr` on Windows). Fully restart your IDE. |
| `InitializationError: domain required` | Create `.env` from `.env.example` with both `EXPO_PUBLIC_*` vars. Restart Metro. |
| Auth0 callback URL mismatch | Callback/logout URLs in Auth0 must use the **same domain** as `EXPO_PUBLIC_AUTH0_DOMAIN`. |
| QR code opens browser / site unreachable | Use the **dev client app**, not Expo Go or the camera app. Ensure phone and PC are on the same Wi‑Fi; disable VPN. Try `--tunnel`. |
| `No Android connected device found` | Connect a USB device with debugging enabled, or start an Android emulator. Run `adb devices`. |
| Expo Go shows errors or won't load | Expected — this project requires a **development build**, not Expo Go. |
| Gradle `IBM_SEMERU` error | Known React Native + Gradle 9 compatibility issue. May require patching `@react-native/gradle-plugin` after `npm install`. See [react-native#55781](https://github.com/facebook/react-native/issues/55781). |
| Env vars work in external terminal but not in Cursor | Windows env changes require a **full IDE restart**, not just window reload. |

---

## 9. Project docs

- [Expo SDK 56 documentation](https://docs.expo.dev/versions/v56.0.0/)
- API base URL: `https://api.webuddhist.com/api/v1/`
