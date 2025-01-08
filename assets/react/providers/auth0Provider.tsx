import React, { ReactNode } from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithHistory: React.FC<{ children: ReactNode }> = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN ?? '';
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID ?? '';
  
    // console.log('domain : ', domain, 'clientId : ', clientId, process);

  if (!domain || !clientId) {
    console.error('AUTH0_DOMAIN and AUTH0_CLIENT_ID must be defined in your environment variables.');
    //   console.log('bruh');
  }

  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
