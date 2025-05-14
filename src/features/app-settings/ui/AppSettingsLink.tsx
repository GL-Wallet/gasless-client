import type { PropsWithClassname } from '@/shared/types/react'
import { ROUTES } from '@/shared/constants/routes'
import { Settings } from 'lucide-react'
import { Link } from 'wouter'

export function AppSettingsLink(props: PropsWithClassname) {
  return (
    <Link href={ROUTES.APP_SETTINGS} className={props.className}>
      <Settings className="size-6 text-muted-foreground" />
    </Link>
  )
}
