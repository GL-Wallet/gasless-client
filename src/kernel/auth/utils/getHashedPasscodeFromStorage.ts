import { cloudStorageService } from '@/kernel/cloud-storage';
import { decrypt } from '@/shared/lib/crypto-js';

import { AUTH_STORAGE_KEY, DEPRECATED_AUTH_STORAGE_KEY } from '../constants';
import { getHashedPasscode } from './getHashedPasscode';

// with backward compatibility
export const getHashedPasscodeFromStorage = async (): Promise<string | null> => {
  try {
    const hashedPasscode = await cloudStorageService.get<string>(AUTH_STORAGE_KEY);
    const encryptedPasscode = await cloudStorageService.get<string>(DEPRECATED_AUTH_STORAGE_KEY);

    if (encryptedPasscode) {
      const decryptedPasscode = decrypt(encryptedPasscode, import.meta.env.VITE_AUTH_SECRET);
      if (decryptedPasscode) {
        return getHashedPasscode(decryptedPasscode);
      }
    }

    if (hashedPasscode) {
      return hashedPasscode;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving passcode:', error);
    return null;
  }
};
