import { decrypt } from '@/shared/lib/crypto-js';
import { useWallet } from '@/entities/wallet';
import { useAuth } from '@/kernel/auth';

export const useSeedPhrase = () => {
  const wallet = useWallet();
  const { passcode } = useAuth();

  if (!passcode || !wallet) {
    return null;
  }

  const seedPhrase = decrypt(wallet.encryptedMnemonic, passcode).split(' ');

  return seedPhrase;
};
