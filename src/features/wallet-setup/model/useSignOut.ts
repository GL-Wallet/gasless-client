import { cloudStorageService } from '@/kernel/cloud-storage';

export const useSignOut = () => {
  const signOut = () => {
    cloudStorageService.reset();
  };

  return {
    signOut
  };
};
