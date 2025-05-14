import { BatchList } from '@/features/Batch'
import { batch } from '@/shared/api/batch'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'

export function BatchPage() {
  const { t } = useTranslation()

  const { data } = batch.getBatches.useQuery({
    refetchInterval: 30 * 1000,
  })

  return (
    <div className="flex-1 flex flex-col gap-2">
      <ResponsivePageHeader title={t('batch.list.title')} className="min-h-1/6" />

      <BatchList data={data} />
    </div>
  )
}
