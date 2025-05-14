import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

export function Updates({ children }: PropsWithChildren) {
  useEffect(() => {}, [])

  return children
}
