/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable node/prefer-global/buffer */
import { Buffer } from 'buffer'
import { axiosInstance } from '@/shared/lib/axios'

import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import '@/shared/lib/i18n'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

// TEMP: was !==
if (import.meta.env.MODE !== 'development') {
  Sentry.init({
    dsn: 'https://1f49a6e04d591834453bd50acf107971@o4509326915141632.ingest.de.sentry.io/4509326917369936',
    integrations: [Sentry.replayIntegration()],
    sendDefaultPii: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })

  axiosInstance.interceptors.response.use(
    res => res,
    (error) => {
      Sentry.captureException(error)
      return Promise.reject(error)
    },
  )
}

createRoot(document.getElementById('root')!).render(<App />)
