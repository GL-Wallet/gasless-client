import { useWalletStore } from '@/entities/wallet';
import { encrypt } from '@/shared/lib/crypto-js';
import { tronService } from '@/kernel/tron';
import { useAuth } from '@/kernel/auth';

export const useImportWallet = () => {
  const addNewWallet = useWalletStore((store) => store.addNewWallet);
  const { authenticate, passcode } = useAuth();

  const importWallet = async (seedPhrase: string) => {
    let currentPasscode = passcode;

    if (!currentPasscode) {
      try {
        currentPasscode = await authenticate({ actionType: 'request' });
      } catch (error) {
        console.error('Authentication failed:', error);
        return;
      }
    }

    const wallet = tronService.restoreWallet(seedPhrase);

    if (!wallet || !wallet.mnemonic?.phrase || !currentPasscode) {
      console.error('Failed to import wallet: Missing required data.');
      return;
    }

    const { address, publicKey } = wallet;
    const encryptedMnemonic = encrypt(wallet.mnemonic.phrase, currentPasscode);

    addNewWallet({
      address,
      publicKey,
      path: undefined,
      encryptedMnemonic
    });
  };

  return {
    importWallet
  };
};
