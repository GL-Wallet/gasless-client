import { cloudStorageService } from '@/kernel/cloud-storage';
import { decrypt } from '@/shared/lib/crypto-js';

import { AUTH_STORAGE_KEY, DEPRECATED_AUTH_STORAGE_KEY } from '../constants';
import { getHashedPasscode } from './getHashedPasscode';

// with backward compatibility
export const getPasscodeHashFromStorage = async (): Promise<string | null> => {
  try {
    const encryptedPasscode = await cloudStorageService.get<string>(DEPRECATED_AUTH_STORAGE_KEY);
    const hashedPasscode = await cloudStorageService.get<string>(AUTH_STORAGE_KEY);

    console.log('Retrieved from storage: ', { encryptedPasscode, hashedPasscode });

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
