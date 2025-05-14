import { useEffect } from 'react'

export function useEffectOnce(cb: () => void) {
  useEffect(() => {
    cb()
  }, [cb])
}
