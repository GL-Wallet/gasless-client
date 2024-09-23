import { useWalletStore } from '../model/store';
import { Wallet } from '../model/types';

export const useWallet = (): Wallet => {
  const { activeIndex, addresses } = useWalletStore((store) => ({
    activeIndex: store.activeIndex,
    addresses: store.addresses
  }));

  const wallet = addresses[activeIndex];

  return wallet;
};
