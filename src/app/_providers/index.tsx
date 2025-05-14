import type { PropsWithChildren } from 'react'

import { AuthProvider } from '@/kernel/auth'
import { ControlledDialogEmitter } from '@/shared/lib/dialog-promise'
import { queryClient } from '@/shared/lib/react-query'
import { AlertProvider } from '@/shared/ui/alert/Alert'
import { ThemeProvider } from '@/shared/ui/theme-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { SDKProvider } from '@telegram-apps/sdk-react'

export function Providers(props: PropsWithChildren) {
  return (
    <SDKProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AlertProvider>{props.children}</AlertProvider>
            <ControlledDialogEmitter />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SDKProvider>
  )
}
