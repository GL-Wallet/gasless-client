import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { useWallet, useWalletStore } from '@/entities/wallet';
import { AppSettingsItems, AppVersion } from '@/features/app-settings';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';

export const AppSettingsPage = () => {
  const wallet = useWallet();

  const { t } = useTranslation();

  const { activeIndex, removeWallet } = useWalletStore((store) => ({
    activeIndex: store.activeIndex,
    removeWallet: store.removeWallet
  }));

  const handleRemoveWallet = async () => {
    await removeWallet(activeIndex);
    navigate(ROUTES.HOME);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <AppSettingsItems />

      <div className="flex flex-col items-center space-y-3">
        <Button onClick={handleRemoveWallet} variant={'outline'} className="w-full bg-transparent">
          {t('setting.signOut.button.signOutWallet')} <span className="underline font-fold ml-1">{wallet.name}</span>
        </Button>
        <AppVersion />
      </div>
    </div>
  );
};
