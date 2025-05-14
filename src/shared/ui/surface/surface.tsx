import type { PropsWithChildren } from 'react'
import { cn } from '@/shared/lib/utils'
import styles from './styles.module.css'

export function Surface({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn(styles.outer, className)}>
      <div className={styles.card}>{children}</div>
    </div>
  )
}
