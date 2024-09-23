import { useWallet, useWalletStore } from '@/entities/wallet';
import { AppSettingsItems } from '@/features/app-settings';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';

export const AppSettingsPage = () => {
  const wallet = useWallet();
  
  const { activeIndex, removeWallet } = useWalletStore((store) => ({
    activeIndex: store.activeIndex,
    removeWallet: store.removeWallet
  }));

  const handleRemoveWallet = () => {
    removeWallet(activeIndex);
    navigate(ROUTES.HOME);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <AppSettingsItems />
      <Button onClick={handleRemoveWallet} variant={'outline'} className='bg-secondary dark:bg-transparent'>
        Sign out of the <span className="underline font-fold ml-1">{wallet.name}</span>
      </Button>
    </div>
  );
};
