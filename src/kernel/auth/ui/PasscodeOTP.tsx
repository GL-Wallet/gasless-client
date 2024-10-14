import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React, { SetStateAction, useCallback } from 'react';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

import { Passcode } from '../model/types';

// Memoize InputOTPSlot
const MemoizedInputOTPSlot = React.memo(InputOTPSlot);

type Props = {
  passcode?: Passcode;
  setPasscode(passcode: SetStateAction<Passcode>): void;
};

export const PasscodeOTP = ({ passcode, setPasscode }: Props) => {
  const handleChange = useCallback((value: string) => {
    setPasscode(value);
  }, [setPasscode]);

  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={passcode === null ? '' : passcode}
      onChange={handleChange}
      autoFocus
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, idx) => (
          <MemoizedInputOTPSlot index={idx} key={idx} type="password" />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
