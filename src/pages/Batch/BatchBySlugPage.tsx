import { BatchTxList } from '@/features/Batch'
import { batch } from '@/shared/api/batch'
import { ROUTES } from '@/shared/constants/routes'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'wouter'

enum EBatchTxTabs {
  All = 'all',
  Success = 'success',
  Failed = 'failed',
  Pending = 'pending',
}

export function BatchBySlugPage() {
  const { t } = useTranslation()

  const [tab, setTab] = useState<string>(EBatchTxTabs.All)
  const { id } = useParams()

  if (!id) {
    return <Redirect to={ROUTES.HOME} />
  }

  const { data } = batch.getBatch.useQuery({
    variables: { batchId: id },
    refetchInterval: 5 * 1000,
  })

  return (
    <div className="flex-1 flex flex-col gap-2">
      <ResponsivePageHeader title={t('batch.items.title')} />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value={EBatchTxTabs.All}>{t('batch.items.tabs.all')}</TabsTrigger>
          <TabsTrigger value={EBatchTxTabs.Success}>{t('batch.items.tabs.success')}</TabsTrigger>
          <TabsTrigger value={EBatchTxTabs.Failed}>{t('batch.items.tabs.failed')}</TabsTrigger>
          <TabsTrigger value={EBatchTxTabs.Pending}>{t('batch.items.tabs.pending')}</TabsTrigger>
        </TabsList>
        {data
          ? (
              <div className="w-full">
                <TabsContent value={EBatchTxTabs.All}>
                  <BatchTxList data={data?.txs ?? []} />
                </TabsContent>
                <TabsContent value={EBatchTxTabs.Success}>
                  <BatchTxList data={data?.txs.filter(tx => tx.status === 'SUCCESS') ?? []} />
                </TabsContent>
                <TabsContent value={EBatchTxTabs.Pending}>
                  <BatchTxList data={data?.txs.filter(tx => tx.status === 'PENDING' || tx.status === 'IDLE') ?? []} />
                </TabsContent>
                <TabsContent value={EBatchTxTabs.Failed}>
                  <BatchTxList data={data?.txs.filter(tx => tx.status === 'FAILED') ?? []} />
                </TabsContent>

              </div>
            )
          : (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton className="h-[54px] w-full" key={index} />
                ))}
              </div>
            )}
      </Tabs>

    </div>
  )
}
