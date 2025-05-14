import type { Passcode } from '../model/types'
import { useBiometry } from '@/shared/hooks/useBiometry'

import { useEffectOnce } from '@/shared/hooks/useEffectOnce'
import { PageHeader } from '@/shared/ui/page-header'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PASSCODE_LENGTH } from '../constants'
import { getHashedPasscode } from '../utils/getHashedPasscode'
import { PasscodeInput } from './PasscodeInput'

// Memoize the PageHeader component
const MemoizedPageHeader = React.memo(PageHeader)

interface Props {
  isBiometryEnabled: boolean
  passcodeHash: Passcode
  onPasscodeSuccess: (newPasscode: string) => void
}

export function PasscodeRequired({ isBiometryEnabled, passcodeHash, onPasscodeSuccess }: Props) {
  const [enteredPasscode, setEnteredPasscode] = useState<Passcode>(null)

  const { authenticate } = useBiometry()

  const { t } = useTranslation()

  const requestBiometry = useCallback(() => {
    if (!isBiometryEnabled)
      return

    authenticate().then((passcode) => {
      if (passcode) {
        onPasscodeSuccess(passcode)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffectOnce(requestBiometry)

  useEffect(() => {
    if (!enteredPasscode || enteredPasscode.length !== PASSCODE_LENGTH)
      return

    if (getHashedPasscode(enteredPasscode) === passcodeHash) {
      onPasscodeSuccess(enteredPasscode)
    }
    else {
      setEnteredPasscode(null)
    }
  }, [enteredPasscode, passcodeHash, onPasscodeSuccess])

  const title = useMemo(() => t('auth.required.title'), [t])

  const MemoizedPasscodeInput = React.memo(PasscodeInput)

  return (
    <div className="grow flex flex-col justify-center items-center space-y-8">
      <MemoizedPageHeader title={title} />

      <MemoizedPasscodeInput
        passcode={enteredPasscode}
        setPasscode={setEnteredPasscode}
        isBiometryEnabled={isBiometryEnabled}
        handleBiometry={requestBiometry}
      />
    </div>
  )
}
