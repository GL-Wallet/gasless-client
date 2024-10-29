import { produce } from 'immer';
import { create } from 'zustand';

import { cloudStorageService } from '@/kernel/cloud-storage';
import { tronService } from '@/kernel/tron';

import { WALLET_STORAGE_KEY } from '../constants';
import { walletStoreSchema } from './schema';
import { CreateWallet, Wallet } from './types';
import { getPrivateKey } from './utils';

type State = {
  activeIndex: number;
  addresses: Wallet[];
};

type Actions = {
  loadWallets(): Promise<void>;
  setActiveWallet(index: number): void;
  addNewWallet(data: CreateWallet): Promise<void>;
  updateWalletDetails(data: Partial<Wallet>): void;
  removeWallet(walletIndex: number): Promise<void>;
  fetchWalletBalances(address: string): Promise<void>;
  getNextWalletName(): string;
  resetStore(): void;
};

const initialState: State = {
  activeIndex: 0,
  addresses: []
};

export const useWalletStore = create<State & Actions>((set, get) => ({
  ...initialState,

  async loadWallets() {
    try {
      const rawData = await cloudStorageService.get(WALLET_STORAGE_KEY);
      const data = walletStoreSchema.parse(rawData);
      set(data);
    } catch {
      set(initialState);
    }
  },

  async addNewWallet(data) {
    set(
      produce((draft) => {
        const name = data.name ?? get().getNextWalletName();
        draft.addresses.push({ ...data, name, balances: { TRX: 0, USDT: 0 } });
        draft.activeIndex = draft.addresses.length - 1;
      })
    );

    // temporary

    // try {
    //   await api.subscribe(data.address);
    // } catch (error) {
    //   console.warn(`Failed to subscribe to wallet ${data.address}:`, error);
    // }
  },

  updateWalletDetails(data) {
    set(
      produce((draft) => {
        const activeWallet = draft.addresses[draft.activeIndex];
        if (activeWallet) {
          Object.assign(activeWallet, data);
        }
      })
    );
  },

  async removeWallet(walletIndex: number) {
    // temporary

    // try {
    //   const { addresses } = get();
    //   const wallet = addresses[walletIndex];

    //   if (!wallet) return;

    //   await api.unsubscribe(wallet.address);
    // } catch (error) {
    //   console.warn(`Failed to unsubscribe to wallet`, error);
    // }

    set(
      produce((draft) => {
        draft.addresses.splice(walletIndex, 1);
        draft.activeIndex = Math.max(draft.activeIndex - 1, 0);
      })
    );
  },

  async fetchWalletBalances(address) {
    const privateKey = getPrivateKey();
    if (!privateKey) return;

    const balances = await tronService.getBalances(address, privateKey);
    if (!balances) return;

    set(
      produce<State>((draft) => {
        draft.addresses[draft.activeIndex].balances = balances;
      })
    );
  },

  setActiveWallet(index: number) {
    set((state) => ({ ...state, activeIndex: index }));
  },

  getNextWalletName() {
    const { addresses } = get();
    return `Wallet ${addresses.length + 1}`;
  },

  resetStore() {
    set(initialState);
  }
}));

useWalletStore.subscribe((state) => {
  cloudStorageService.set(WALLET_STORAGE_KEY, state);
});

export const getWallet = () => {
  const { activeIndex, addresses } = useWalletStore.getState();
  return addresses[activeIndex];
};
