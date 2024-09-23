import { ComponentType, useLayoutEffect } from 'react';
import { AuthParams } from '../model/types';
import { useAuth } from '../model/useAuth';

export const withAuth = <P extends object>(Component: ComponentType<P>, authParams?: AuthParams) => {
  return (props: P) => {
    const { authenticated, authenticate } = useAuth();

    useLayoutEffect(() => {
      if (!authenticated) {
        authenticate(authParams);
      }
    }, [authenticated, authenticate]);

    return <Component {...props} />;
  };
};
