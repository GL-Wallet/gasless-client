import './_styles/globals.css';

import { MainLayout } from '@/pages/(layouts)/MainLayout';
import ErrorBoundary from '@/shared/ui/error-boundary';
import { Toaster } from '@/shared/ui/toaster';

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
              <Routes />
            </Loaders>
          </Configs>
        </Providers>
      </ErrorBoundary>
      <Toaster />
    </MainLayout>
  );
};
