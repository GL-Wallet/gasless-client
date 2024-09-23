import { PageHeader } from '@/shared/ui/page-header';
import { PasscodeSetup } from './PasscodeSetup';
import { PasscodePad } from './PasscodePad';
import { useEffect, useState } from 'react';
import { Passcode } from '../model/types';

type Props = {
  actualPasscode: Passcode;
  onPasscodeSuccess(newPasscode: Passcode): void;
};

export const PasscodeUpdate = ({ actualPasscode, onPasscodeSuccess }: Props) => {
  const [passcode, setPasscode] = useState<Passcode>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (passcode === actualPasscode) {
      setConfirmed(true);
    }
  }, [passcode, onPasscodeSuccess, actualPasscode]);

  return !confirmed ? (
    <div className="flex flex-col justify-center items-center space-y-8">
      <PageHeader title="Enter current passcode" />
      <PasscodePad passcode={passcode} setPasscode={setPasscode} />
    </div>
  ) : (
    <PasscodeSetup onPasscodeSuccess={onPasscodeSuccess} />
  );
};
