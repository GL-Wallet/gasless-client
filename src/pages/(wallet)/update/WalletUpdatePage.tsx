import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { useWallet, useWalletStore } from '@/entities/wallet';
import { WalletCustomizationForm } from '@/features/wallet-setup';
import { ROUTES } from '@/shared/constants/routes';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';

export const WalletUpdatePage = () => {
  const wallet = useWallet();
  const updateWalletDetails = useWalletStore((store) => store.updateWalletDetails);

  const { t } = useTranslation();

  const onSubmit = (walletName: string) => {
    updateWalletDetails({ name: walletName });
    navigate(ROUTES.HOME);
  };

  return (
    <div className="h-full flex flex-col items-center text-center pt-8 space-y-8">
      <ResponsivePageHeader
        title={t('wallet.setup.customize.title')}
        description={t('wallet.setup.customize.description')}
        className="max-w-64"
      />

      <WalletCustomizationForm defaultValues={{ name: wallet.name! }} onSubmit={onSubmit} />
    </div>
  );
};
