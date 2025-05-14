import { CreateBatch } from '@/features/Batch'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'
import { useParams } from 'wouter'
import { useHistoryState } from 'wouter/use-browser-location'

export function CreateBatchPage() {
  const { t } = useTranslation()

  const { id } = useParams()
  const state = useHistoryState()

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center gap-8">
        <ResponsivePageHeader title={t('batch.title')} />
      </div>
      <CreateBatch id={id} txs={state?.txs} />
    </div>
  )
}
