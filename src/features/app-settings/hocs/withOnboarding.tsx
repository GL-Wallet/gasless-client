import type { ComponentType, ReactNode } from 'react'
import { useAppSettingsStore } from '@/entities/app-settings'

export function withOnboarding<P extends object>(Component: ComponentType<P>, page: ReactNode) {
  return (props: P) => {
    const isNewest = useAppSettingsStore(store => store.isNewest)

    if (isNewest)
      return page

    return <Component {...props} />
  }
}
