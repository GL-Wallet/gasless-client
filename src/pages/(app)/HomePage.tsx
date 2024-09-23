import { useWallet, useWalletStore } from '@/entities/wallet';
import { WalletManagerDrawer } from '@/features/wallet-setup';
import { WalletActionsCard } from '@/features/wallet-actions';
import { AppSettingsLink } from '@/features/app-settings';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { WalletAssets } from '@/features/wallet-assets';
import { ReferralLink } from '@/features/referral';
import { useCallback, useEffect } from 'react';
import { ModeToggle } from '@/shared/ui/mode-toggle';

export const HomePage = () => {
  const wallet = useWallet();
  const fetchWalletBalances = useWalletStore((store) => store.fetchWalletBalances);

  const handleUpdateBalance = useCallback(async () => {
    await fetchWalletBalances(wallet.address);
  }, [fetchWalletBalances, wallet.address]);

  useEffect(() => {
    handleUpdateBalance();
  }, [handleUpdateBalance]);

  return (
    <PullToRefresh onRefresh={handleUpdateBalance} pullingContent="">
      <div className="relative h-full flex flex-col items-center">
        <ModeToggle className='absolute top-1 left-0'/>
        <AppSettingsLink className="absolute top-1 right-0" />
        <WalletManagerDrawer />

        <WalletActionsCard className="mt-8" />
        <ReferralLink className="mt-2" />

        <WalletAssets className="mt-8" />
      </div>
    </PullToRefresh>
  );
};
