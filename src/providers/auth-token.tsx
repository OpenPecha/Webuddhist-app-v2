import { setAuthTokenProvider } from '@/lib/http';
import { useGuest } from '@/providers/guest';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from 'react-native-auth0';

interface AuthTokenContextValue {
  isAuthReady: boolean;
}

const AuthTokenContext = createContext<AuthTokenContextValue>({ isAuthReady: false });

export function useAuthTokenReady() {
  return useContext(AuthTokenContext).isAuthReady;
}

/** Syncs Auth0 ID token into the HTTP client (Flutter uses ID token, not access token). */
export function AuthTokenSync({ children }: { children: React.ReactNode }) {
  const { user, getCredentials } = useAuth0();
  const { isGuest } = useGuest();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function syncToken() {
      if (!user || isGuest) {
        setAuthTokenProvider(null);
        if (!cancelled) setIsAuthReady(false);
        return;
      }

      setAuthTokenProvider(async () => {
        try {
          const credentials = await getCredentials();
          return credentials.idToken ?? null;
        } catch {
          return null;
        }
      });

      if (!cancelled) setIsAuthReady(true);
    }

    syncToken();

    return () => {
      cancelled = true;
      setAuthTokenProvider(null);
    };
  }, [user, isGuest, getCredentials]);

  return (
    <AuthTokenContext.Provider value={{ isAuthReady }}>
      {children}
    </AuthTokenContext.Provider>
  );
}
