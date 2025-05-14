import { getPasscode } from '@/kernel/auth'
import { decryptAndGetWallet } from '@/kernel/tron'
import { getWallet } from './store'

export function getPrivateKey() {
  const wallet = getWallet()
  const passcode = getPasscode()

  if (!passcode || !wallet)
    return null

  return decryptAndGetWallet(wallet.encryptedMnemonic, passcode).privateKey
}

export function getPrivateKeyFromPasscode(encryptedMnemonic: string, passcode: string) {
  try {
    const walletData = decryptAndGetWallet(encryptedMnemonic, passcode)
    return walletData.privateKey
  }
  catch (error) {
    console.error('Error decrypting wallet:', error)
    throw new Error('Failed to get private key')
  }
}
