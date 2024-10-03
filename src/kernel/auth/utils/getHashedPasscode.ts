import { md5 } from 'js-md5';

export const getHashedPasscode = (passcode: string) => {
  return md5.create().update(passcode).hex();
};
