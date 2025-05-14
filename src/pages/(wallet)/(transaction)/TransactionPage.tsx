import { Transaction } from '@/entities/transaction'
import { useWallet } from '@/entities/wallet'

import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/button'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function TransactionPage({ txid }: { txid: string }) {
  const wallet = useWallet()

  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col justify-between">
      <Transaction txid={txid} walletAddress={wallet.address} />
      <Button onClick={() => navigate(ROUTES.HOME)} variant="outline" className="w-full">
        {t('transaction.button')}
      </Button>
    </div>
  )
}
