import './_styles/globals.css';

import { Toaster } from 'react-hot-toast';

import { MainLayout } from '@/pages/(layouts)/MainLayout';
import ErrorBoundary from '@/shared/ui/error-boundary';
import { SplashScreen } from '@/shared/ui/splash-screen';
import { CacheBuster } from '@piplup/cache-buster';

import { Configs } from './_configs';
import { Loaders } from './_loaders';
import { Providers } from './_providers';
import { Routes } from './_routes';

export const App = () => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <Providers>
          <Configs>
            <Loaders>
              <CacheBuster loading={<SplashScreen />} verbose={false} enabled={process.env.NODE_ENV === 'production'}>
                <Routes />
                <Toaster toastOptions={{ style: { background: '#000000', color: '#ffffff' } }} />
              </CacheBuster>
            </Loaders>
          </Configs>
        </Providers>
      </ErrorBoundary>
    </MainLayout>
  );
};
