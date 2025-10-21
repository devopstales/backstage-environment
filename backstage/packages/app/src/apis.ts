import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  BackstageIdentityApi,
  configApiRef,
  createApiFactory,
  createApiRef,
  OpenIdConnectApi, 
  oauthRequestApiRef,
  discoveryApiRef,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';

import { OAuth2 } from '@backstage/core-app-api';

export const kcOIDCAuthApiRef = createApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>({
  id: 'auth.keycloak',
});

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: kcOIDCAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        configApi,
        provider: {
          id: 'keycloak', // must match auth.providers.keycloak in config
          title: 'Keycloak',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment') ?? 'development',
        defaultScopes: ['openid', 'profile', 'email'],
      }),
  }),

  createApiFactory({
   api: scmIntegrationsApiRef,
   deps: { configApi: configApiRef },
   factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),

  ScmAuth.createDefaultApiFactory(),
];
