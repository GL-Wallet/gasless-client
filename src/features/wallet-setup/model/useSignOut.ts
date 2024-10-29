import { useAppSettingsStore } from '@/entities/app-settings';
import { useUserStore } from '@/entities/user';
import { useWalletStore } from '@/entities/wallet';

export const useSignOut = () => {
  const resetWalletStore = useWalletStore((store) => store.resetStore);
  const resetUserStore = useUserStore((store) => store.resetStore);
  const resetAppSettingsStore = useAppSettingsStore((store) => store.resetStore);

  const signOut = (): void => {
    resetWalletStore();
    resetUserStore();
    resetAppSettingsStore({ isNewest: false });
  };

  return {
    signOut
  };
};
