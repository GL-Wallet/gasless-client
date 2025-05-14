import { PrepareBatch } from '@/features/Batch'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'

export function PrepareBatchPage() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col gap-2">
      <ResponsivePageHeader title={t('batch.title')} />

      <PrepareBatch />
    </div>
  )
}
