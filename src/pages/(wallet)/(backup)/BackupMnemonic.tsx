import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { useWallet } from '@/entities/wallet';
import { SeedPhrase } from '@/features/wallet-setup';
import { useAuth } from '@/kernel/auth';
import { ROUTES } from '@/shared/constants/routes';
import { decrypt } from '@/shared/lib/crypto-js';
import { Button } from '@/shared/ui/button';
import { CopyToClipboardButton } from '@/shared/ui/copy-to-clipboard-button';

export const BackupMnemonic = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const { passcode } = useAuth();
  const { encryptedMnemonic } = useWallet();

  const { t } = useTranslation();

  useEffect(() => {
    if (!mnemonic) {
      const decryptedMnemonic = decrypt(encryptedMnemonic, passcode!);
      setMnemonic(decryptedMnemonic);
    }
  }, [encryptedMnemonic, mnemonic, passcode]);

  return (
    <div className="flex flex-col h-full w-full">
      {mnemonic && <SeedPhrase seedPhrase={mnemonic.split(' ')} />}

      <div className="space-y-2">
        <CopyToClipboardButton value={mnemonic!} />
        <Button variant={'outline'} className="w-full" onClick={() => navigate(ROUTES.HOME)}>
          {t('setting.backup.button')}
        </Button>
      </div>
    </div>
  );
};
