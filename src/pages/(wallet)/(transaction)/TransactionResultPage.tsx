import { getTronscanLink, TransactionLink } from '@/entities/transaction'
import { getTransactionLink } from '@/entities/transaction/model/utils'

import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/button'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'

export function TransactionResultPage({ txid }: { txid: string }) {
  const { t } = useTranslation()

  const isPending = txid !== 'no-txid'
  const title = t(`transaction.result.${isPending ? 'submitted' : 'failed'}`)

  const tronscanLink = getTronscanLink(txid)
  const transactionLink = getTransactionLink(txid)

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center space-y-10">
      <div className="space-y-8">
        <h2 className="primary-gradient text-3xl font-medium">{title}</h2>
        {isPending && <TransactionLink tronscanLink={tronscanLink} transactionLink={transactionLink} />}
      </div>

      <Link href={ROUTES.HOME} className="block">
        <Button variant="outline" className="absolute bottom-0 left-0 w-full">
          {t('transaction.result.button')}
        </Button>
      </Link>
    </div>
  )
}
