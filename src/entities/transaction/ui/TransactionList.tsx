import type { AVAILABLE_TOKENS } from '@/shared/enums/tokens'
import type { Transaction as TransactionType } from '../model/types'

import { useWallet } from '@/entities/wallet'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { Skeleton } from '@/shared/ui/skeleton'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchTransactionList } from '../model/queries'

import { useTransactionStore } from '../model/store'
import { Transaction } from './Transaction'
import { TransactionListItem } from './TransactionListItem'

interface TransactionListProps {
  token: AVAILABLE_TOKENS
}

export const TransactionList: React.FC<TransactionListProps> = ({ token }) => {
  const [transaction, setTransaction] = useState<TransactionType | null>(null)
  const [isOpened, setIsOpened] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useTranslation()
  const wallet = useWallet()

  const { transactions, setTransactions } = useTransactionStore(store => ({
    transactions: store.transactions,
    setTransactions: store.setTransactions,
  }))

  const handleSelectListItem = (transaction: TransactionType) => {
    setIsOpened(true)
    setTransaction(transaction)
  }

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      setIsLoading(true)
      try {
        const fetchedTransactions = await fetchTransactionList(wallet.address, token)

        setTransactions(fetchedTransactions)
      }
      catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchAndSetTransactions()
  }, [setTransactions, token, wallet.address])

  return (
    <div className="space-y-2 py-4">
      {isLoading
        ? Array.from({ length: 7 }, (_, idx) => <Skeleton className="h-[74px] w-full rounded-sm" key={idx} />)
        : transactions.map((transaction, idx) => (
            <div
              className="w-full"
              onClick={() => handleSelectListItem(transaction)}
              key={idx}
            >
              <TransactionListItem transaction={transaction} walletAddress={wallet.address} />
            </div>
          ))}

      {!isLoading && transactions.length === 0 && (
        <div className="flex items-center justify-center w-full py-4 border border-dashed rounded-sm text-muted-foreground">
          {t('transaction.list.empty')}
        </div>
      )}

      <Drawer open={isOpened} onOpenChange={setIsOpened}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only" />
            <DrawerDescription className="sr-only" />
          </DrawerHeader>
          <div className="p-4">
            {transaction && <Transaction transaction={transaction} />}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
