import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/kernel/auth';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import { SDKProvider } from '@telegram-apps/sdk-react';

export const Providers = (props: PropsWithChildren) => {
  return (
    <SDKProvider>
      <ThemeProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </ThemeProvider>
    </SDKProvider>
  );
};
