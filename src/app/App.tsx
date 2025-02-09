import './_styles/globals.css';

import TelegramAnalytics from '@telegram-apps/analytics';
import { MainLayout } from '@/pages/(layouts)/MainLayout';
import ErrorBoundary from '@/shared/ui/error-boundary';
import { Toaster } from '@/shared/ui/toaster';

import { Configs } from './_configs';
import { Loaders } from './_loaders';
import { Providers } from './_providers';
import { Routes } from './_routes';

console.log(import.meta.env.VITE_TELEGRAM_ANALYTICS_TOKEN)

TelegramAnalytics.init({
  token: import.meta.env.VITE_TELEGRAM_ANALYTICS_TOKEN,
  appName: 'gasless_wallet'
});

export const App = () => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <Providers>
          <Configs>
            <Loaders>
              <Routes />
            </Loaders>
          </Configs>
        </Providers>
      </ErrorBoundary>
      <Toaster />
    </MainLayout>
  );
};
