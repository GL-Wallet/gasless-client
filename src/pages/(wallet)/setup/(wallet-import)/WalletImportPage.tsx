import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { WalletImportForm } from '@/features/wallet-setup';

export const WalletImportPage = () => {
  return (
    <div className="h-full flex flex-col space-y-8">
      <ResponsivePageHeader title="Import from Seed Phrase" />

      <WalletImportForm />
    </div>
  );
};
