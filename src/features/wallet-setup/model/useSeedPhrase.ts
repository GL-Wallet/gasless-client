import { useWallet } from '@/entities/wallet'
import { useAuth } from '@/kernel/auth'
import { decrypt } from '@/shared/lib/crypto-js'

export function useSeedPhrase() {
  const wallet = useWallet()
  const { passcode } = useAuth()

  if (!passcode || !wallet) {
    return null
  }

  const seedPhrase = decrypt(wallet.encryptedMnemonic, passcode).split(' ')

  return seedPhrase
}
