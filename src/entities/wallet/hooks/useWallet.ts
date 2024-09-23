import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { useWalletStore } from '../model/store';
import { Wallet } from '../model/types';

export const useWallet = (): Wallet => {
  const { activeIndex, addresses } = useWalletStore((store) => ({
    activeIndex: store.activeIndex,
    addresses: store.addresses
  }));

  const wallet = addresses[activeIndex];

  if (!wallet) navigate(ROUTES.WALLET_SETUP);

  return wallet;
};
