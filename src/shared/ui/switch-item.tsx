import type { ReactNode } from 'react'
import type { PropsWithClassname } from '../types/react'
import { cn } from '../lib/utils'
import { Switch } from './switch'

interface Props {
  title?: string
  description?: string
  icon?: ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function SwitchItem({
  title,
  description,
  icon,
  checked,
  onCheckedChange,
  className,
}: PropsWithClassname<Props>) {
  return (
    <div className={cn('flex items-center justify-between w-full pl-4 pr-2 py-4 border rounded-md', className)}>
      <div className="flex items-center space-x-4">
        {icon}
        <div className="flex flex-col">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
