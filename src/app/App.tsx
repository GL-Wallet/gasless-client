import './_styles/globals.css';

import { Toaster } from 'react-hot-toast';

import { MainLayout } from '@/pages/(layouts)/MainLayout';
import ErrorBoundary from '@/shared/ui/error-boundary';

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
      <Toaster toastOptions={{ style: { background: '#000000', color: '#ffffff' } }} />
    </MainLayout>
  );
};
