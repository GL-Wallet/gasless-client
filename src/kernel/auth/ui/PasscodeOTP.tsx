import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { SetStateAction } from 'react';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

import { Passcode } from '../model/types';

type Props = {
  passcode?: Passcode;
  setPasscode(passcode: SetStateAction<Passcode>): void;
};

export const PasscodeOTP = ({ passcode, setPasscode }: Props) => {
  const handleChange = (value: string) => {
    setPasscode(value);
  };

  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={passcode!} onChange={handleChange} autoFocus>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};