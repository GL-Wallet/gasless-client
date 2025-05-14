import type { ComponentProps } from 'react'

import { cn } from '../lib/utils'
import { PageHeader } from './page-header'

export function ResponsivePageHeader({ className, ...props }: ComponentProps<typeof PageHeader>) {
  return (
    <div className={cn('w-full flex justify-center items-center', className)}>
      <PageHeader {...props} />
    </div>
  )
}
