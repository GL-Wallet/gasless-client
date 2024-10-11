import { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

import { AuthProvider } from '@/kernel/auth';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import { SDKProvider } from '@telegram-apps/sdk-react';

export const Providers = (props: PropsWithChildren) => {
  return (
    <SDKProvider>
      <ThemeProvider>
        <AuthProvider>
          <IntlProvider locale="en">{props.children}</IntlProvider>
        </AuthProvider>
      </ThemeProvider>
    </SDKProvider>
  );
};
