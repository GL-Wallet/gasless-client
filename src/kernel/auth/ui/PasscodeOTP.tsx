import type { SetStateAction } from 'react'
import type { Passcode } from '../model/types'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp'

import { REGEXP_ONLY_DIGITS } from 'input-otp'
import React, { useCallback } from 'react'

// Memoize InputOTPSlot
const MemoizedInputOTPSlot = React.memo(InputOTPSlot)

interface Props {
  passcode?: Passcode
  setPasscode: (passcode: SetStateAction<Passcode>) => void
}

export function PasscodeOTP({ passcode, setPasscode }: Props) {
  const handleChange = useCallback((value: string) => {
    setPasscode(value)
  }, [setPasscode])

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
  )
}
