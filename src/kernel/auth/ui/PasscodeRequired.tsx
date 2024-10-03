import { useCallback, useEffect, useState } from 'react';

import { useBiometry } from '@/shared/hooks/useBiometry';
import { useEffectOnce } from '@/shared/hooks/useEffectOnce';
import { PageHeader } from '@/shared/ui/page-header';

import { Passcode } from '../model/types';
import { getHashedPasscode } from '../utils/getHashedPasscode';
import { getPasscodeHash } from '../utils/getPasscodeHash';
import { PasscodeInput } from './PasscodeInput';

type Props = {
  isBiometryEnabled: boolean;
  passcodeHash: Passcode;
  onPasscodeSuccess(newPasscode: string): void;
};

export const PasscodeRequired = ({ isBiometryEnabled, passcodeHash, onPasscodeSuccess }: Props) => {
  const [enteredPasscode, setEnteredPasscode] = useState<Passcode>(null);
  const { authenticate } = useBiometry();

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
    console.log(
      'getHashedPasscode',
      enteredPasscode && getHashedPasscode(enteredPasscode!),
      '\npasscodeHash',
      passcodeHash
    );
    getPasscodeHash();
    
    if (enteredPasscode && getHashedPasscode(enteredPasscode) === passcodeHash) {
      onPasscodeSuccess(enteredPasscode);
    }
  }, [enteredPasscode, passcodeHash, onPasscodeSuccess]);

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
