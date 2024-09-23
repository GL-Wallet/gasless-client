import { useCreateWallet, WalletCustomizationForm } from '@/features/wallet-setup';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/kernel/auth';

export const WalletCustomizationPage = () => {
  const { passcode } = useAuth();
  const { createWallet } = useCreateWallet();

  const onSubmit = (walletName: string) => {
    if(!passcode) return;
    
    createWallet({ passcode, name: walletName }).then(() => navigate(ROUTES.SEED_PHRASE));
  };

  return (
    <div className="h-full flex flex-col items-center text-center pt-8 space-y-8">
      <ResponsivePageHeader
        title="Customize your wallet"
        description="Wallet name are stored locally on your device."
        className="max-w-64"
      />

      <WalletCustomizationForm onSubmit={onSubmit} />
    </div>
  );
};
