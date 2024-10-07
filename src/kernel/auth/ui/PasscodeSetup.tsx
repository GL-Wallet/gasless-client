import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/shared/ui/page-header';
import { useCloudStorage } from '@telegram-apps/sdk-react';

import { Passcode } from '../model/types';
import { PasscodeInput } from './PasscodeInput';

type PasscodeSetupStatus = 'initial' | 'confirm';

type Props = {
  onPasscodeSuccess: (newPasscode: Passcode) => void;
};

const statusTitles: Record<PasscodeSetupStatus, string> = {
  initial: 'auth.setup.status.initial',
  confirm: 'auth.setup.status.confirm'
};

export const PasscodeSetup = ({ onPasscodeSuccess }: Props) => {
  const [passcode, setPasscode] = useState<Passcode>(null);
  const [confirmedPasscode, setConfirmedPasscode] = useState<Passcode>(null);
  const [setupStatus, setSetupStatus] = useState<PasscodeSetupStatus>('initial');

  const { t } = useTranslation();

  const cloudStorage = useCloudStorage();

  useEffect(() => {
    if (passcode?.length === 6) {
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
      <PageHeader title={t(statusTitles[setupStatus])} />
      <PasscodeInput passcode={passcode} setPasscode={setPasscode} />
    </div>
  );
};
