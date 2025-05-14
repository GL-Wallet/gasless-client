import { useAppSettingsStore } from '@/entities/app-settings'
import { useUserStore } from '@/entities/user'
import { useWalletStore } from '@/entities/wallet'
import { useCloudStorage } from '@telegram-apps/sdk-react'

export function useSignOut() {
  const cloudStorage = useCloudStorage()
  const resetWalletStore = useWalletStore(store => store.resetStore)
  const resetUserStore = useUserStore(store => store.resetStore)
  const resetAppSettingsStore = useAppSettingsStore(store => store.resetStore)

  const signOut = async () => {
    resetWalletStore()
    resetUserStore()
    resetAppSettingsStore({ isNewest: false })

    const keys = await cloudStorage.getKeys()

    await Promise.all(keys.map(key => cloudStorage.delete(key)))
  }

  return {
    signOut,
  }
}
