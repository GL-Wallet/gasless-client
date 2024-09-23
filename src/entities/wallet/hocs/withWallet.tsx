import { withConditionalRoute } from '@/shared/utils/withConditionalRoute';
import { useWallet } from '../hooks/useWallet';
import { ComponentType } from 'react';

export const withWallet = <P extends object>(Component: ComponentType<P>, redirectTo: string) => {
  return (props: P) => {
    const wallet = useWallet();

    return withConditionalRoute(Component, !!wallet, redirectTo)(props);
  };
};
