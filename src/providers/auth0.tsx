import { Auth0Provider } from 'react-native-auth0';

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN as string;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      {children}
    </Auth0Provider>
  );
}

export const AUTH0_CUSTOM_SCHEME = 'webuddhist';
