import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { getPrivateKey } from '@/entities/wallet';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';
import { CopyToClipboardButton } from '@/shared/ui/copy-to-clipboard-button';
import { Mask } from '@/shared/ui/mask';

export const BackupPrivateKey = () => {
  const privateKey = getPrivateKey();

  const { t } = useTranslation();

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="grow flex flex-col justify-center">
        <div className="relative flex items-center justify-center bg-secondary/20 rounded-md p-4 h-32 border">
          <p className="w-64 break-words text-md">{privateKey}</p>
          <Mask />
        </div>
      </div>

      <div className="space-y-2">
        <CopyToClipboardButton value={privateKey!} />
        <Button variant={'outline'} className="w-full" onClick={() => navigate(ROUTES.HOME)}>
          {t('setting.backup.button')}
        </Button>
      </div>
    </div>
  );
};
