import type { BatchTypesDto } from '@/shared/api/batch'
import type { ReactNode } from 'react'
import { ROUTES } from '@/shared/constants/routes'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function BatchList({ data }: { data: BatchTypesDto.BatchDto[] | undefined }) {
  const { t } = useTranslation()

  const batchStatusLabelMapping: Record<BatchTypesDto.BatchDto['status'], ReactNode> = useMemo(() => ({
    IDLE: <span className="text-muted-foreground">{t('batch.list.item.status.idle')}</span>,
    PENDING: <span className="text-muted-foreground">{t('batch.list.item.status.pending')}</span>,
    PARTIALLY_COMPLETED: <span className="text-orange-400">{t('batch.list.item.status.partially')}</span>,
    SUCCESS: <span className="text-green-500">{t('batch.list.item.status.success')}</span>,
    FAILED: <span className="text-rose-500">{t('batch.list.item.status.failed')}</span>,
  }), [])

  return data
    ? data.length > 0
      ? data.map(batch => (
          <Alert key={batch.id} onClick={() => navigate(ROUTES.BATCH.concat(`/${batch.id}`))}>
            <AlertTitle>
              <div>
                {`${t('batch.list.item.title')}: ${batch.txs.length}`}

              </div>
            </AlertTitle>
            <AlertDescription className="text-xs">
              {batchStatusLabelMapping[batch.status]}
            </AlertDescription>
            <div>
              <ChevronRight className="absolute top-6 right-4 size-5" />

              {(batch.status === 'FAILED' || batch.status === 'PARTIALLY_COMPLETED') && (
                <Button
                  className="absolute top-3 right-4 z-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(ROUTES.UPDATE_BATCH.concat(`/${batch.id}`))
                  }}
                >
                  {t('batch.list.button.retry')}
                </Button>
              )}
            </div>
          </Alert>
        ))
      : (
          <p className="text-muted-foreground text-center">{t('batch.list.empty')}</p>
        )
    : (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton className="h-[58px] w-full" key={index} />
          ))}
        </div>
      )
}
