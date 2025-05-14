import type { SetStateAction } from 'react'

import type { Passcode } from '../model/types'

import { isDesktop } from '@/shared/utils/isDesktop'
import { PasscodeOTP } from './PasscodeOTP'
import { PasscodePad } from './PasscodePad'

interface Props {
  passcode: Passcode
  isBiometryEnabled?: boolean
  setPasscode: (passcode: SetStateAction<Passcode>) => void
  handleBiometry?: () => void
}

export function PasscodeInput(props: Props) {
  const isDt = isDesktop()

  if (isDt) {
    return <PasscodeOTP passcode={props.passcode} setPasscode={props.setPasscode} />
  }

  return <PasscodePad {...props} />
}
