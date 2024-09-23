import ErrorBoundary from '@/shared/ui/error-boundary';
import { Toaster } from 'react-hot-toast';
import { Providers } from './_providers';
import { Loaders } from './_loaders';
import { Configs } from './_configs';
import { Routes } from './_routes';

import './_styles/globals.css';
import { MainLayout } from '@/pages/(layouts)/MainLayout';

export const App = () => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <Providers>
          <Configs>
            <Loaders>
              <Routes />
              <Toaster toastOptions={{ style: { background: '#000000', color: '#ffffff' } }} />
            </Loaders>
          </Configs>
        </Providers>
      </ErrorBoundary>
    </MainLayout>
  );
};
