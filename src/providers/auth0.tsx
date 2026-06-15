import { getAuth0Config } from '@/config/auth0';
import Constants from 'expo-constants';
import { Auth0Provider } from 'react-native-auth0';

const { domain, clientId } = getAuth0Config();

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      {children}
    </Auth0Provider>
  );
}

export const AUTH0_CUSTOM_SCHEME =
  (Constants.expoConfig?.extra?.auth0CustomScheme as string | undefined) ??
  'org.pecha.app.dev';
