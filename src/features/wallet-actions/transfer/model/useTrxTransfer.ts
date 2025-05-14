import { getPrivateKeyFromPasscode, useWallet } from '@/entities/wallet'
import { tronService } from '@/kernel/tron'
import { useCallback } from 'react'

interface TransferTrxProps {
  recipientAddress: string
  transferAmount: number
  userPasscode: string
}

export function useTrxTransfer() {
  const wallet = useWallet()

  const transferTrx = useCallback(
    async ({ recipientAddress, transferAmount, userPasscode }: TransferTrxProps) => {
      try {
        const privateKey = getPrivateKeyFromPasscode(wallet.encryptedMnemonic, userPasscode)
        return await tronService.sendTrx(recipientAddress, transferAmount, privateKey)
      }
      catch (error) {
        console.error('Error transferring TRX:', error)
      }
    },
    [wallet.encryptedMnemonic],
  )

  return {
    transferTrx,
  }
}
