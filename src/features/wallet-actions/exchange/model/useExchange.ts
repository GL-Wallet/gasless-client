import { useWallet } from '@/entities/wallet'

import { api } from '@/kernel/api'
import { useAuth } from '@/kernel/auth'
import { decryptAndGetWallet, tronService } from '@/kernel/tron'
import { ROUTES } from '@/shared/constants/routes'
import { urlJoin } from '@/shared/utils/urlJoin'
import { navigate } from 'wouter/use-browser-location'

export function useExchange() {
  const { authenticate } = useAuth()
  const wallet = useWallet()

  const exchange = async (amount: number) => {
    try {
      const passcode = await authenticate({ redirectTo: ROUTES.TRANSACTION_IN_PROGRESS })

      const { privateKey } = decryptAndGetWallet(wallet.encryptedMnemonic, passcode)
      const address = await api.getBankAddress()

      const signedTx = await tronService.createAndSignTrc20Transaction(address, amount, privateKey)
      const { txid } = await api.exchange(signedTx)

      navigate(urlJoin(ROUTES.TRANSACTION_RESULT, txid ?? 'no-txid'))
    }
    catch {
      navigate(urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid'))
    }
  }

  return {
    exchange,
  }
}
