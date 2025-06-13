import type { Transaction } from '../model/types'

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard'

import { FormattedNumber } from '@/shared/ui/formatted-number'
import { useUtils } from '@telegram-apps/sdk-react'
import { Share } from 'lucide-react'
import { TransactionListDateOptions } from '../constants'
import { formatDate, getTransactionLink, isSentByWallet } from '../model/utils'

interface Props {
  transaction: Transaction
  walletAddress: string
}

export function TransactionListItem({ transaction, walletAddress }: Props) {
  const { amount, from, timestamp } = transaction

  const utils = useUtils()

  const isSent = isSentByWallet(from, walletAddress)
  const isShowTransaction = amount > 0.0001

  const transactionLink = getTransactionLink(transaction?.txid)

  return (
    isShowTransaction && (
      <Alert
        className="dark:bg-card/80 cursor-pointer rounded-sm"
      >
        <div className="flex justify-between items-center">
          <div>
            <AlertTitle className="primary-gradient font-bold text-lg">
              {isSent ? '-' : '+'}
              <FormattedNumber number={amount} />
            </AlertTitle>
            <AlertDescription>
              <span className="text-sm text-muted-foreground truncate">
                {formatDate(new Date(timestamp), TransactionListDateOptions)}
              </span>
            </AlertDescription>
          </div>
          <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
            <CopyToClipboard value={transactionLink} />
            <Share className="size-5" onClick={() => utils.shareURL(transactionLink)} />
          </div>
        </div>
      </Alert>
    )
  )
}
