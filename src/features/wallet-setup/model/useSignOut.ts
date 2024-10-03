import { useWalletStore } from '@/entities/wallet';
import { useAuthStore } from '@/kernel/auth/model/store';
import { cloudStorageService } from '@/kernel/cloud-storage';

export const useSignOut = () => {
  const resetAuth = useAuthStore((store) => store.resetStore);
  const resetWallets = useWalletStore((store) => store.resetStore);

  const signOut = () => {
    resetAuth();
    resetWallets();

    cloudStorageService.reset();
  };

  return {
    signOut
  };
};
