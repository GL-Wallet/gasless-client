import { cloudStorageService } from '@/kernel/cloud-storage';

import { AUTH_STORAGE_KEY } from '../constants';

export const getHashedPasscodeFromStorage = async (): Promise<string | null> => {
  try {
    const hashedPasscode = await cloudStorageService.get<string>(AUTH_STORAGE_KEY);

    if (hashedPasscode) {
      return hashedPasscode;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving passcode:', error);
    return null;
  }
};
