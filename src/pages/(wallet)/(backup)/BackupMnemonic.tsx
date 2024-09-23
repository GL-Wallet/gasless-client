import { CopyToClipboardButton } from '@/shared/ui/copy-to-clipboard-button';
import { navigate } from 'wouter/use-browser-location';
import { SeedPhrase } from '@/features/wallet-setup';
import { ROUTES } from '@/shared/constants/routes';
import { decrypt } from '@/shared/lib/crypto-js';
import { useWallet } from '@/entities/wallet';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/kernel/auth';

export const BackupMnemonic = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const { passcode } = useAuth();
  const { encryptedMnemonic } = useWallet();

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
          Back To Home
        </Button>
      </div>
    </div>
  );
};
