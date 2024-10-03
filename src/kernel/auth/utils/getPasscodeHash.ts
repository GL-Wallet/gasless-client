import { cloudStorageService } from '@/kernel/cloud-storage';
import { decrypt } from '@/shared/lib/crypto-js';

import { AUTH_STORAGE_KEY } from '../constants';
import { getHashedPasscode } from './getHashedPasscode';

// with backward compatibility
export const getPasscodeHash = async (): Promise<string | null> => {
  const rawData = await cloudStorageService.get<string>(AUTH_STORAGE_KEY);
  try {
    const decryptedPasscode = decrypt(rawData!, import.meta.env.VITE_AUTH_SECRET);
    if (decryptedPasscode) return getHashedPasscode(decryptedPasscode);

    return rawData;
  } catch (error) {
    return null;
  }
};
