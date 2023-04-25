import React, { PropsWithChildren } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { useRouter } from 'next/router';
import { routeNames } from '../routes';

export const NotAuthRedirectWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useGetIsLoggedIn();
  const router = useRouter();

  if (!isLoggedIn) {
    router.push(routeNames.login);
    return null;
  }

  return <>{children}</>;
};
