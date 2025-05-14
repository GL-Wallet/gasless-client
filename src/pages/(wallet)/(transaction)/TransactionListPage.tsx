import type { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

import { TransactionList } from '@/entities/transaction'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'

export function TransactionListPage({ token }: { token: string }) {
  const { t } = useTranslation()

  return (
    <div className="flex-1">
      <ResponsivePageHeader title={`${token} ${t('transaction.list.title')}`} />
      <TransactionList token={token as AVAILABLE_TOKENS} />
    </div>
  )
}
