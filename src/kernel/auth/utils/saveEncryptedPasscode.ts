import { cloudStorageService } from '@/kernel/cloud-storage';
import { AUTH_STORAGE_KEY } from '../constants';
import { encrypt } from '@/shared/lib/crypto-js';

export const saveEncryptedPasscode = async (passcode: string) => {
  try {
    const encryptedPasscode = encrypt(passcode, import.meta.env.VITE_AUTH_SECRET);
    await cloudStorageService.set(AUTH_STORAGE_KEY, encryptedPasscode);

    return encryptedPasscode;
  } catch (error) {
    console.error('Error saving passcode:', error);
  }
};
