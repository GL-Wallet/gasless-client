import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBiometry } from '@/shared/hooks/useBiometry';
import { useEffectOnce } from '@/shared/hooks/useEffectOnce';
import { PageHeader } from '@/shared/ui/page-header';

import { PASSCODE_LENGTH } from '../constants';
import { Passcode } from '../model/types';
import { getHashedPasscode } from '../utils/getHashedPasscode';
import { PasscodeInput } from './PasscodeInput';

type Props = {
  isBiometryEnabled: boolean;
  passcodeHash: Passcode;
  onPasscodeSuccess(newPasscode: string): void;
};

export const PasscodeRequired = ({ isBiometryEnabled, passcodeHash, onPasscodeSuccess }: Props) => {
  const [enteredPasscode, setEnteredPasscode] = useState<Passcode>(null);

  const { authenticate } = useBiometry();

  const { t } = useTranslation();

  const requestBiometry = useCallback(() => {
    if (!isBiometryEnabled) return;

    authenticate().then((passcode) => {
      if (passcode) {
        onPasscodeSuccess(passcode);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnce(requestBiometry);

  useEffect(() => {
    if (!enteredPasscode || enteredPasscode.length !== PASSCODE_LENGTH) return;

    if (getHashedPasscode(enteredPasscode) === passcodeHash) {
      onPasscodeSuccess(enteredPasscode);
    } else {
      setEnteredPasscode(null);
    }
  }, [enteredPasscode, passcodeHash, onPasscodeSuccess]);

  return (
    <div className="grow flex flex-col justify-center items-center space-y-8">
      <PageHeader title={t('auth.required.title')} />

      <PasscodeInput
        passcode={enteredPasscode}
        isBiometryEnabled={isBiometryEnabled}
        handleBiometry={requestBiometry}
        setPasscode={setEnteredPasscode}
      />
    </div>
  );
};
