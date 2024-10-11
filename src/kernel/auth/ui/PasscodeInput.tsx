import { SetStateAction } from 'react';

import { isDesktop } from '@/shared/utils/isDesktop';

import { Passcode } from '../model/types';
import { PasscodeOTP } from './PasscodeOTP';
import { PasscodePad } from './PasscodePad';

type Props = {
  passcode: Passcode;
  isBiometryEnabled?: boolean;
  setPasscode(passcode: SetStateAction<Passcode>): void;
  handleBiometry?: () => void;
};

export const PasscodeInput = (props: Props) => {
  const isDt = isDesktop();

  if (isDt) {
    return <PasscodeOTP passcode={props.passcode} setPasscode={props.setPasscode} />;
  }

  return <PasscodePad {...props} />;
};
