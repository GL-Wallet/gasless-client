import type { Transaction as TransactionType } from '../model/types'
import { getPrivateKey } from '@/entities/wallet'

import { tronService } from '@/kernel/tron'
import { FormattedNumber } from '@/shared/ui/formatted-number'
import { Skeleton } from '@/shared/ui/skeleton'
import { capitalize } from '@/shared/utils/capitalize'
import { truncateString } from '@/shared/utils/truncateString'
import React, { useEffect, useState } from 'react' // Import React

import { useTranslation } from 'react-i18next'
import { TransactionDateOptions } from '../constants'
import { formatDate, getTransactionLink, getTronscanLink, isSentByWallet } from '../model/utils'
import { TransactionLink } from './TransactionLink'

// Wrap TransactionLink with React.memo
const MemoizedTransactionLink = React.memo(TransactionLink)

export function Transaction({ transaction }: { transaction: TransactionType }) {
  const [status, setStatus] = useState<string | null>(null)

  const { t } = useTranslation()

  useEffect(() => {
    const privateKey = getPrivateKey()

    if (!privateKey)
      return

    tronService.getTransactionStatus(transaction.txid, privateKey).then(status => setStatus(status))
  }, [transaction.txid])

  const tronscanLink = getTronscanLink(transaction?.txid)
  const transactionLink = getTransactionLink(transaction?.txid)

  return (
    transaction && (
      <div className="flex flex-col items-center pt-6">
        <h2 className="primary-gradient text-center whitespace-pre-wrap text-3xl font-medium tracking-tighter">
          {isSentByWallet(transaction.from, transaction.from) ? '-' : '+'}
          <FormattedNumber number={transaction.amount} />
          {' '}
          <span className="text-2xl text-muted-foreground">{transaction.token}</span>
        </h2>

        <div className="w-full flex flex-col border dark:bg-card/60 p-4 rounded-md space-y-6 mt-20">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.date')}</span>
            <span>{formatDate(new Date(transaction.timestamp), TransactionDateOptions)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.status')}</span>
            {status ? <span>{capitalize(status)}</span> : <Skeleton className="h-6 w-20" />}
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.sender')}</span>
            <span>{truncateString(transaction.from, 10)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.receiver')}</span>
            <span>{truncateString(transaction.to, 10)}</span>
          </div>
          <MemoizedTransactionLink tronscanLink={tronscanLink} transactionLink={transactionLink} />
        </div>
      </div>
    )
  )
}
