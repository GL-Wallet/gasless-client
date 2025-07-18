import type { ReactNode } from 'react'

import type { PropsWithClassname } from '../types/react'
import { cn } from '../lib/utils'

interface Props {
  title?: ReactNode
  description?: ReactNode
}

export function PageHeader({ title, description, className }: PropsWithClassname<Props>) {
  return (
    <header className={cn('w-full space-y-2 text-center', className)}>
      <h2 className="text-xl primary-gradient font-semibold">{title}</h2>
      <p className="text-[14px] text-muted-foreground">{description}</p>
    </header>
  )
}
