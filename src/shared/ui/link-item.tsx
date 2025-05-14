import type { PropsWithClassname } from '@/shared/types/react'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'wouter'
import { cn } from '../lib/utils'

interface Props {
  href: string
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
}

export function LinkItem({ href, title, description, icon, className }: PropsWithClassname<Props>) {
  return (
    <Link
      href={href}
      className={cn('flex items-center justify-between w-full pl-4 pr-2 py-2 border rounded-md', className)}
    >
      <div className="flex items-center space-x-4">
        {icon}
        <div className="flex flex-col">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </div>

      <ChevronRight className="h-8 w-8 text-muted-foreground" />
    </Link>
  )
}
