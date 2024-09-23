import { cloudStorageService } from '@/kernel/cloud-storage';
import { AUTH_STORAGE_KEY } from '../constants';

export const getEncryptedPasscode = async (): Promise<string | null> => {
  try {
    return await cloudStorageService.get<string>(AUTH_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};
