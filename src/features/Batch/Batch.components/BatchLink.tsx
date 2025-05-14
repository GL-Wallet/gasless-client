import type { PropsWithClassname } from '@/shared/types/react'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function BatchLink({ className }: PropsWithClassname) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'mt-6 relative h-12 w-full p-4 pr-2 bg-card/60 dark:bg-secondary/50 border rounded-lg dark:border-neutral-800 flex items-center justify-between',
        className,
      )}
      onClick={() => navigate(ROUTES.BATCH)}
    >
      <AnimatedShinyText className="mx-0 text-sm text-wrap min-w-2/3">
        {t('batch.list.title')}
      </AnimatedShinyText>
      <ChevronRight className="size-7 text-muted-foreground" />
    </div>
  )
}
