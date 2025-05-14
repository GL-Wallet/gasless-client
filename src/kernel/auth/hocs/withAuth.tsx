import type { ComponentType } from 'react'
import type { AuthParams } from '../model/types'
import { useLayoutEffect } from 'react'
import { useAuth } from '../model/useAuth'

export function withAuth<P extends object>(Component: ComponentType<P>, authParams?: AuthParams) {
  return (props: P) => {
    const { authenticated, authenticate } = useAuth()

    useLayoutEffect(() => {
      if (!authenticated) {
        authenticate(authParams)
      }
    }, [authenticated, authenticate])

    return <Component {...props} />
  }
}
