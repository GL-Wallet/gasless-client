import { useState } from 'react';
import toast from 'react-hot-toast';
import { navigate } from 'wouter/use-browser-location';

import { useWalletStore } from '@/entities/wallet';
import { useAuth } from '@/kernel/auth';
import { tronService } from '@/kernel/tron';
import { ROUTES } from '@/shared/constants/routes';
import { encrypt } from '@/shared/lib/crypto-js';

export const useImportWallet = () => {
  const addNewWallet = useWalletStore((store) => store.addNewWallet);
  const { authenticate, passcode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const importWallet = async (seedPhrase: string) => {
    try {
      setIsLoading(true);

      let currentPasscode = passcode;

      if (!currentPasscode) {
        currentPasscode = await authenticate({ actionType: 'request' });
      }

      const wallet = tronService.restoreWallet(seedPhrase);

      if (!wallet || !wallet.mnemonic?.phrase || !currentPasscode) {
        console.error('Failed to import wallet: Missing required data.');
        return;
      }

      const { address, publicKey } = wallet;
      const encryptedMnemonic = encrypt(wallet.mnemonic.phrase, currentPasscode);

      await addNewWallet({
        address,
        publicKey,
        path: undefined,
        encryptedMnemonic
      });
    } catch {
      toast.error('Something went wrong.');
      navigate(ROUTES.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    importWallet
  };
};
