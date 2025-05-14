import { useTranslation } from 'react-i18next'

interface BatchSummaryProps {
  balance: number
  totalAmount: number
  estimatedFee: number
  additionalFee: number
  totalFee: number
}

export function BatchSummary({ balance, totalAmount, estimatedFee, additionalFee, totalFee }: BatchSummaryProps) {
  const { t } = useTranslation()

  return (
    <div className="p-4 bg-secondary/40 border rounded-md space-y-2 text-sm text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>{t('batch.summary.balance')}</span>
        <span className="text-foreground">
          {`${balance} USDT`}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>{t('batch.summary.totalAmount')}</span>
        <span className="text-foreground">
          {`${totalAmount} USDT`}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>{t('batch.summary.fee')}</span>
        <span className="text-foreground">
          {`${estimatedFee.toFixed(2)} TRX`}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>{t('batch.summary.additionalFee')}</span>
        <span className="text-foreground">
          {`~${additionalFee.toFixed(2)} TRX`}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>{t('batch.summary.totalFee')}</span>
        <span className="text-foreground">
          {`~${totalFee.toFixed(2)} TRX`}
        </span>
      </div>
    </div>
  )
}
