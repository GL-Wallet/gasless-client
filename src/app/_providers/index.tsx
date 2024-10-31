import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/kernel/auth';
import { AlertProvider } from '@/shared/ui/alert/Alert';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import { SDKProvider } from '@telegram-apps/sdk-react';

export const Providers = (props: PropsWithChildren) => {
  return (
    <SDKProvider>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>{props.children}</AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </SDKProvider>
  );
};
