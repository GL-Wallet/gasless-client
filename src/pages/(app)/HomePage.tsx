import React, { memo, useCallback, useEffect } from 'react'; // Import React
import PullToRefresh from 'react-simple-pull-to-refresh';

import { useWallet, useWalletStore } from '@/entities/wallet';
import { AppSettingsLink, FinishSettingUp } from '@/features/app-settings';
import { ReferralLink } from '@/features/referral';
import { WalletActionsCard } from '@/features/wallet-actions';
import { WalletAssets } from '@/features/wallet-assets';
import { WalletManagerDrawer } from '@/features/wallet-setup';
import { ModeToggle } from '@/shared/ui/mode-toggle';

// Wrap FinishSettingUp with React.memo
const MemoizedFinishSettingUp = React.memo(FinishSettingUp);

// Wrap WalletAssets with React.memo
const MemoizedWalletAssets = memo(WalletAssets);

// Wrap WalletManagerDrawer with React.memo
const MemoizedWalletManagerDrawer = React.memo(WalletManagerDrawer);

// Wrap ReferralLink with React.memo
const MemoizedReferralLink = memo(ReferralLink);

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
        <MemoizedWalletManagerDrawer />
        <WalletActionsCard className="mt-8" />
        <MemoizedReferralLink className="mt-2" />
        <MemoizedWalletAssets className="mt-8" />
        <MemoizedFinishSettingUp className="mt-8" />
      </div>
    </PullToRefresh>
  );
};
