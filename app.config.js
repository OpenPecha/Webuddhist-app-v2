const IS_PRODUCTION = process.env.APP_VARIANT === 'production';

const APP_ID = IS_PRODUCTION ? 'org.pecha.app' : 'org.pecha.app.dev';

// Must match EXPO_PUBLIC_AUTH0_DOMAIN in .env / EAS env — native deep links use this host
const AUTH0_DOMAIN =

  process.env.EXPO_PUBLIC_AUTH0_DOMAIN ??
  (IS_PRODUCTION ? 'we-buddhist-prod.us.auth0.com' : 'dev-vz6o17motc18g45h.us.auth0.com');

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: IS_PRODUCTION ? 'WeBuddhist' : 'WeBuddhist Dev',
  slug: 'webuddhist-expo-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/webuddhist_icon.png',
  scheme: 'webuddhistapp',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: APP_ID,
    icon: './assets/images/webuddhist_icon.png',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: APP_ID,
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/webuddhist_icon.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/webuddhist_icon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#FFFFFF',
        image: './assets/images/webuddhist_icon.png',
        imageWidth: 150,
        android: {
          image: './assets/images/webuddhist_icon.png',
          imageWidth: 150,
        },
      },
    ],
    [
      'react-native-auth0',
      {
        domain: AUTH0_DOMAIN,
        customScheme: APP_ID,
      },
    ],
    'expo-font',
    'expo-image',
    'expo-secure-store',
    'expo-asset',
    '@react-native-community/datetimepicker',
    [
      'expo-notifications',
      {
        icon: './assets/images/webuddhist_icon.png',
        color: '#000000',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'a2b8d034-7594-4d47-8760-4f4989d706d1',
    },
    appVariant: IS_PRODUCTION ? 'production' : 'development',
    appId: APP_ID,
    auth0Domain: AUTH0_DOMAIN,
    auth0CustomScheme: APP_ID,
  },
  owner: 'webuddhist-app-v1',
};
