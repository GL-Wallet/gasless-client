import { initBiometryManager } from '@telegram-apps/sdk-react'
import { useCallback, useEffect, useState } from 'react'

type BiometryAction = 'requestAccess' | 'authenticate' | 'updateToken'

interface Options {
  reason?: string
}

export function useBiometry() {
  const [bm, cleanup] = initBiometryManager()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    bm.then((biometryManager) => {
      if (biometryManager.accessGranted)
        setIsEnabled(true)
    }).catch(() => { })
  }, [bm])

  const executeBiometryAction = useCallback(
    async (action: BiometryAction, options: object) => {
      try {
        const biometryManager = await bm

        const result = await biometryManager[action](options)

        return result
      }
      catch {
        return null
      }
    },
    [bm],
  )

  const requestAccess = useCallback(
    async ({ reason }: Options = {}) => executeBiometryAction('requestAccess', { reason }) as Promise<boolean | null>,
    [executeBiometryAction],
  )

  const authenticate = useCallback(
    async ({ reason }: Options = {}) => executeBiometryAction('authenticate', { reason }) as Promise<string | null>,
    [executeBiometryAction],
  )

  const updateToken = useCallback(
    async (token: string | null) => executeBiometryAction('updateToken', { token }) as Promise<string | null>,
    [executeBiometryAction],
  )

  return { isEnabled, requestAccess, authenticate, updateToken, cleanup }
}
