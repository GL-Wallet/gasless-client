import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/kernel/auth';
import { AlertProvider } from '@/shared/ui/alert/Alert';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/react-query';

export const Providers = (props: PropsWithChildren) => {
  return (
    <SDKProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AlertProvider>{props.children}</AlertProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SDKProvider>
  );
};
