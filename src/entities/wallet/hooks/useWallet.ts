import type { Wallet } from '../model/types'
import { useWalletStore } from '../model/store'

export function useWallet(): Wallet {
  const { activeIndex, addresses } = useWalletStore(store => ({
    activeIndex: store.activeIndex,
    addresses: store.addresses,
  }))

  const wallet = addresses[activeIndex]

  return wallet
}
