import { useWalletStore, Wallet } from '@/entities/wallet';
import { encrypt } from '@/shared/lib/crypto-js';
import { tronService } from '@/kernel/tron';

export const useCreateWallet = () => {
  const addNewWallet = useWalletStore((store) => store.addNewWallet);

  const createWallet = async (data: Partial<Wallet> & { passcode: string }) => {
    const wallet = tronService.createWallet();

    if (!wallet || !wallet.mnemonic?.phrase || !data.passcode) {
      console.error('Failed to create wallet: Missing required data.');
      return;
    }

    const { passcode } = data;

    const { address, publicKey, path, mnemonic } = wallet;
    const encryptedMnemonic = encrypt(mnemonic.phrase, passcode);

    addNewWallet({
      address,
      publicKey,
      path: path ?? undefined,
      encryptedMnemonic,
      ...data
    });
  };

  return { createWallet };
};
