import { ThemeProvider } from '@/shared/ui/theme-provider';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { AuthProvider } from '@/kernel/auth';
import { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

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
