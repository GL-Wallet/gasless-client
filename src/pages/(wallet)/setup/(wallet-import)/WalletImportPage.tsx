import { useTranslation } from 'react-i18next';

import { WalletImportForm } from '@/features/wallet-setup';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';

export const WalletImportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col space-y-8">
      <ResponsivePageHeader title={t('wallet.setup.import.title')} />

      <WalletImportForm />
    </div>
  );
};
