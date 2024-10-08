import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { useCreateWallet } from '@/features/wallet-setup/model/useCreateWallet';
import { useAuth } from '@/kernel/auth';
import { ROUTES } from '@/shared/constants/routes';
import ShinyButton from '@/shared/magicui/shiny-button';
import { Button } from '@/shared/ui/button';
import { LogoDark } from '@/shared/ui/logo/logo-dark';
import { LogoLight } from '@/shared/ui/logo/logo-light';
import { useTheme } from '@/shared/ui/theme-provider';

export const WalletSetupPage = () => {
  const { authenticate } = useAuth();
  const { createWallet } = useCreateWallet();

  const { theme } = useTheme();

  const { t } = useTranslation();

  const handleCreateWallet = () => {
    authenticate({ actionType: 'setup' })
      .then((passcode) => createWallet({ passcode }))
      .then(() => navigate(ROUTES.SEED_PHRASE));
  };

  const handleImportWallet = () => {
    authenticate({ actionType: 'setup' }).then(() => navigate(ROUTES.WALLET_IMPORT));
  };

  const Comp = theme === 'light' ? LogoLight : LogoDark;

  return (
    <div className="relative h-full flex flex-col items-center justify-end">
      {/* Content Section */}
      <div className="grow flex flex-col justify-between">
        {/* Heading and Description */}
        <div className="grow flex flex-col justify-center items-center">
          <Comp className="size-72 opacity-75" />
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button onClick={() => handleImportWallet()} className="w-full" variant="outline">
            {t('wallet.setup.import.button.import')}
          </Button>

          <ShinyButton
            onClick={() => handleCreateWallet()}
            text={t('wallet.setup.create.button')}
            className="w-full py-4"
          />
        </div>
      </div>
    </div>
  );
};
