import type { BatchTypesDto } from '@/shared/api/batch'
import type { ReactNode } from 'react'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { truncateString } from '@/shared/utils/truncateString'
import { Check, Timer, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface BatchTxListProps {
  data: BatchTypesDto.BatchTxDto[]
  withStatus?: boolean
}

const StatusToIconMap: Record<string, ReactNode> = {
  IDLE: <Timer className="size-5 text-muted-foreground" />,
  PENDING: <Timer className="size-5 text-muted-foreground" />,
  SUCCESS: <Check className="size-5 text-green-500" />,
  FAILED: <X className="size-5 text-rose-500" />,
}

export function BatchTxList({ data, withStatus = true }: BatchTxListProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      {data.length > 0
        ? (
            data?.map((tx, index) => (
              <BatchTxListItem tx={tx} withStatus={withStatus} key={index} />
            ))
          )
        : (
            <p className="text-center mt-10">{t('batch.items.empty')}</p>
          )}
    </div>
  )
}

interface TxListItemProps {
  tx: BatchTypesDto.BatchTxDto
  withStatus: boolean
}

export function BatchTxListItem({ tx, withStatus }: TxListItemProps) {
  return (
    <Alert>
      <AlertDescription className="flex items-center gap-2 justify-between text-[12px]">
        <div className="w-full flex items-center justify-between space-x-4">
          <span>{truncateString(tx.address, 16)}</span>
          <span className="text-[11px] font-semibold text-nowrap">
            {tx.amount}
            {' '}
            USDT
          </span>
        </div>
        {tx.status && withStatus && (
          <>
            {StatusToIconMap[tx.status] ?? tx.status}
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
