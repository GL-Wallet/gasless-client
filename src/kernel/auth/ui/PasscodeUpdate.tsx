import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/shared/ui/page-header';

import { PASSCODE_LENGTH } from '../constants';
import { Passcode } from '../model/types';
import { getHashedPasscode } from '../utils/getHashedPasscode';
import { PasscodeInput } from './PasscodeInput';
import { PasscodeSetup } from './PasscodeSetup';

type Props = {
  passcodeHash: string | null;
  onPasscodeSuccess(newPasscode: Passcode): void;
};

export const PasscodeUpdate = ({ passcodeHash, onPasscodeSuccess }: Props) => {
  const [enteredPasscode, setEnteredPasscode] = useState<Passcode>(null);
  const [confirmed, setConfirmed] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!enteredPasscode || enteredPasscode.length !== PASSCODE_LENGTH) return;

    if (passcodeHash === getHashedPasscode(enteredPasscode)) {
      setConfirmed(true);
    }
  }, [enteredPasscode, onPasscodeSuccess, passcodeHash]);

  return !confirmed ? (
    <div className="flex flex-col justify-center items-center space-y-8">
      <PageHeader title={t('auth.update.title')} />
      <PasscodeInput passcode={enteredPasscode} setPasscode={setEnteredPasscode} />
    </div>
  ) : (
    <PasscodeSetup onPasscodeSuccess={onPasscodeSuccess} />
  );
};
