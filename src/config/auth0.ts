import Constants from 'expo-constants';

export interface Auth0Config {
  domain: string;
  clientId: string;
}

/** Expo v2 dev build — separate Native client from Flutter (u8HNLQDX via /props). */
const DEV_AUTH0: Auth0Config = {
  domain: 'dev-vz6o17motc18g45h.us.auth0.com',
  clientId: '87AXZOsIWFIsjnQX8z3PovGBpEDSu9vZ',
};

/** Production — wire up before org.pecha.app release. */
const PROD_AUTH0: Auth0Config = {
  domain: 'we-buddhist-prod.us.auth0.com',
  clientId: 'AAhvPNisnq6lBDcvpKcNkw5d2nsPZEPD',
};

/**
 * Hardcoded per app id (no GET /props). Flutter keeps loading client id from the API.
 * Dev backend temporarily relaxes JWT aud validation so both clients work.
 */
export function getAuth0Config(): Auth0Config {
  const appId = Constants.expoConfig?.extra?.appId as string | undefined;

  if (appId === 'org.pecha.app.dev') {
    return DEV_AUTH0;
  }

  if (appId === 'org.pecha.app') {
    return PROD_AUTH0;
  }

  const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
  if (domain && clientId) {
    return { domain, clientId };
  }

  return DEV_AUTH0;
}
