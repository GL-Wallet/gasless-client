import { md5 } from 'js-md5';

import { cloudStorageService } from '@/kernel/cloud-storage';

import { AUTH_STORAGE_KEY } from '../constants';

export const savePasscodeHash = async (passcode: string) => {
  try {
    const hash = md5.create().update(passcode);

    await cloudStorageService.set(AUTH_STORAGE_KEY, hash.hex());

    return hash.hex();
  } catch (error) {
    console.error('Error saving passcode:', error);
  }
};
