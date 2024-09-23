import { useCallback, useEffect, useState } from 'react';

import { useBiometry } from '@/shared/hooks/useBiometry';
import { useEffectOnce } from '@/shared/hooks/useEffectOnce';
import { decrypt } from '@/shared/lib/crypto-js';
import { PageHeader } from '@/shared/ui/page-header';

import { Passcode } from '../model/types';
import { PasscodeInput } from './PasscodeInput';

type Props = {
  isBiometryEnabled: boolean;
  actualPasscode: Passcode;
  onPasscodeSuccess(newPasscode: string): void;
};

export const PasscodeRequired = ({ isBiometryEnabled, actualPasscode, onPasscodeSuccess }: Props) => {
  const [enteredPasscode, setEnteredPasscode] = useState<Passcode>(null);
  const { authenticate } = useBiometry();

  const requestBiometry = useCallback(() => {
    if (!isBiometryEnabled) return;

    authenticate().then((token) => {
      if (token) {
        const decryptedPasscode = decrypt(token, import.meta.env.VITE_AUTH_SECRET);
        onPasscodeSuccess(decryptedPasscode);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnce(requestBiometry);

  useEffect(() => {
    if (enteredPasscode && enteredPasscode === actualPasscode) {
      onPasscodeSuccess(enteredPasscode);
    }
  }, [enteredPasscode, actualPasscode, onPasscodeSuccess]);

  return (
    <div className="grow flex flex-col justify-center items-center space-y-8">
      <PageHeader title={'Enter passcode'} />

      <PasscodeInput
        isBiometryEnabled={isBiometryEnabled}
        handleBiometry={requestBiometry}
        setPasscode={setEnteredPasscode}
      />
    </div>
  );
};
