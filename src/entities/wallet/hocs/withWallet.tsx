import type { ComponentType } from 'react'
import { withConditionalRoute } from '@/shared/utils/withConditionalRoute'
import { useWallet } from '../hooks/useWallet'

export function withWallet<P extends object>(Component: ComponentType<P>, redirectTo: string) {
  return (props: P) => {
    const wallet = useWallet()

    return withConditionalRoute(Component, !!wallet, redirectTo)(props)
  }
}
