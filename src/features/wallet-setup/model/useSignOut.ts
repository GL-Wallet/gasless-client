import { cloudStorageService } from '@/kernel/cloud-storage';
import { useAuthStore } from '@/kernel/auth/model/store';
import { useAppSettingsStore } from '@/entities/app-settings';
import { useWalletStore } from '@/entities/wallet';

export const useSignOut = () => {
  const resetAuth = useAuthStore((store) => store.resetStore);
  const resetSettings = useAppSettingsStore((store) => store.resetStore);
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
