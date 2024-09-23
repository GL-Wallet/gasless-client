import { useCloudStorage } from '@telegram-apps/sdk-react';
import { PageHeader } from '@/shared/ui/page-header';
import { PasscodePad } from '../ui/PasscodePad';
import { useEffect, useState } from 'react';
import { Passcode } from '../model/types';

type PasscodeSetupStatus = 'initial' | 'confirm';

type Props = {
  onPasscodeSuccess: (newPasscode: Passcode) => void;
};

const statusTitles: Record<PasscodeSetupStatus, string> = {
  initial: 'Create New Passcode',
  confirm: 'Re-enter Passcode'
};

export const PasscodeSetup = ({ onPasscodeSuccess }: Props) => {
  const [passcode, setPasscode] = useState<Passcode>(null);
  const [confirmedPasscode, setConfirmedPasscode] = useState<Passcode>(null);
  const [setupStatus, setSetupStatus] = useState<PasscodeSetupStatus>('initial');

  const cloudStorage = useCloudStorage();

  useEffect(() => {
    if (passcode) {
      if (setupStatus === 'initial') {
        setPasscode(null);
        setConfirmedPasscode(passcode);
        setSetupStatus('confirm');
      } else if (setupStatus === 'confirm' && passcode === confirmedPasscode) {
        onPasscodeSuccess(confirmedPasscode);
      }
    }
  }, [passcode, confirmedPasscode, setupStatus, cloudStorage, onPasscodeSuccess]);

  return (
    <div className="flex flex-col justify-center items-center space-y-8">
      <PageHeader title={statusTitles[setupStatus]} />
      <PasscodePad passcode={passcode} setPasscode={setPasscode} />
    </div>
  );
};
