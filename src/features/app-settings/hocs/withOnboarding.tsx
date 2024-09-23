import { useAppSettingsStore } from '@/entities/app-settings';
import { ComponentType, ReactNode } from 'react';

export const withOnboarding = <P extends object>(Component: ComponentType<P>, page: ReactNode) => {
  return (props: P) => {
    const isNewest = useAppSettingsStore((store) => store.isNewest);

    if (isNewest) return page;

    return <Component {...props} />;
  };
};
