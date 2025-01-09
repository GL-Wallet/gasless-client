import { useAppSettingsStore } from '@/entities/app-settings';
import { useCloudStorage } from '@telegram-apps/sdk-react';
import { useUserStore } from '@/entities/user';
import { useWalletStore } from '@/entities/wallet';

export const useSignOut = () => {
  const cloudStorage = useCloudStorage();
  const resetWalletStore = useWalletStore((store) => store.resetStore);
  const resetUserStore = useUserStore((store) => store.resetStore);
  const resetAppSettingsStore = useAppSettingsStore((store) => store.resetStore);

  const signOut = async () => {
    resetWalletStore();
    resetUserStore();
    resetAppSettingsStore({ isNewest: false });

    const keys = await cloudStorage.getKeys();

    await Promise.all(keys.map((key) => cloudStorage.delete(key)));
  };

  return {
    signOut
  };
};
