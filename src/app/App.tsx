import { MainLayout } from '@/pages/(layouts)/MainLayout'

import { Toaster } from '@/shared/ui/toaster'
import * as Sentry from '@sentry/react'
import TelegramAnalytics from '@telegram-apps/analytics'
import { Configs } from './_configs'

import { Loaders } from './_loaders'
import { Providers } from './_providers'
import { Routes } from './_routes'
import './_styles/globals.css'

TelegramAnalytics.init({
  token: import.meta.env.VITE_TELEGRAM_ANALYTICS_TOKEN,
  appName: 'gasless_wallet',
})

export function App() {
  return (
    <MainLayout>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <Providers>
          <Configs>
            <Loaders>
              <Routes />
            </Loaders>
          </Configs>
        </Providers>
      </Sentry.ErrorBoundary>
      <Toaster />
    </MainLayout>
  )
}
