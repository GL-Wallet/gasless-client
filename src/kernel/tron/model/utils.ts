import { stripPrivateKeyPrefix } from '@/shared/utils/normalizePrivateKey';
import { decrypt } from '@/shared/lib/crypto-js';
import { tronService } from '@/kernel/tron';

export const decryptAndGetWallet = (encryptedMnemonic: string, passcode: string) => {
  try {
    const { address, privateKey } = tronService.restoreWallet(decrypt(encryptedMnemonic, passcode));
    return { address, privateKey: stripPrivateKeyPrefix(privateKey) };
  } catch (error) {
    console.error('Error decrypting mnemonic or generating wallet:', error);
    return { address: '', privateKey: '' };
  }
};
