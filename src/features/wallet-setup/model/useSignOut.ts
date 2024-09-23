import { cloudStorageService } from '@/kernel/cloud-storage';
import { useAuthStore } from '@/kernel/auth/model/store';
import { useSettingsStore } from '@/entities/settings';
import { useWalletStore } from '@/entities/wallet';

export const useSignOut = () => {
  const resetAuth = useAuthStore((store) => store.resetStore);
  const resetSettings = useSettingsStore((store) => store.resetStore);
  const resetWallets = useWalletStore((store) => store.resetStore);

  const signOut = () => {
    resetAuth();
    resetSettings();
    resetWallets();

    cloudStorageService.reset();
  };

  return {
    signOut
  };
};
