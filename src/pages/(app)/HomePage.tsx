import { useCallback, useEffect } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

import { useWallet, useWalletStore } from '@/entities/wallet';
import { AppSettingsLink, FinishSettingUp } from '@/features/app-settings';
import { ReferralLink } from '@/features/referral';
import { WalletActionsCard } from '@/features/wallet-actions';
import { WalletAssets } from '@/features/wallet-assets';
import { WalletManagerDrawer } from '@/features/wallet-setup';
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
        <ModeToggle className="absolute top-1 left-0" />
        <AppSettingsLink className="absolute top-1 right-0" />
        <WalletManagerDrawer />

        <WalletActionsCard className="mt-8" />
        <ReferralLink className="mt-2" />

        <WalletAssets className="mt-8" />

        <FinishSettingUp className="mt-8" />
      </div>
    </PullToRefresh>
  );
};
