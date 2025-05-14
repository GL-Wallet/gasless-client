import type { Wallet } from '@/entities/wallet'
import { useWalletStore } from '@/entities/wallet'
import { tronService } from '@/kernel/tron'
import { ROUTES } from '@/shared/constants/routes'

import { encrypt } from '@/shared/lib/crypto-js'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { navigate } from 'wouter/use-browser-location'

export function useCreateWallet() {
  const [isLoading, setIsLoading] = useState(false)

  const addNewWallet = useWalletStore(store => store.addNewWallet)

  const createWallet = async (data: Partial<Wallet> & { passcode: string }) => {
    try {
      setIsLoading(true)

      const wallet = tronService.createWallet()

      if (!wallet || !wallet.mnemonic?.phrase || !data.passcode) {
        console.error('Failed to create wallet: Missing required data.')
        return
      }

      const { passcode } = data

      const { address, publicKey, path, mnemonic } = wallet
      const encryptedMnemonic = encrypt(mnemonic.phrase, passcode)

      await addNewWallet({
        address,
        publicKey,
        path: path ?? undefined,
        encryptedMnemonic,
        ...data,
      })
    }
    catch {
      toast.error('Something went wrong.')
      navigate(ROUTES.HOME)
    }
    finally {
      setIsLoading(false)
    }
  }

  return { isLoading, createWallet }
}
