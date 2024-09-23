import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { WalletCustomizationForm } from '@/features/wallet-setup';
import { useWallet, useWalletStore } from '@/entities/wallet';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';

export const WalletUpdatePage = () => {
  const wallet = useWallet();
  const updateWalletDetails = useWalletStore((store) => store.updateWalletDetails);

  const onSubmit = (walletName: string) => {
    updateWalletDetails({ name: walletName });
    navigate(ROUTES.HOME);
  };

  return (
    <div className="h-full flex flex-col items-center text-center pt-8 space-y-8">
      <ResponsivePageHeader
        title="Customize your wallet"
        description="Wallet name are stored locally on your device."
        className="max-w-64"
      />

      <WalletCustomizationForm defaultValues={{ name: wallet.name! }} onSubmit={onSubmit} />
    </div>
  );
};
