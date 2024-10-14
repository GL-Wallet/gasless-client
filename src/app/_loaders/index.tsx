import React, { PropsWithChildren, useEffect, useState } from 'react';

import { useAppSettingsStore } from '@/entities/app-settings';
import { useUserStore } from '@/entities/user';
import { useWalletStore } from '@/entities/wallet';
import { SplashPage } from '@/pages/(app)/(splash)/SplashPage';
import { handleNewRelease } from '@/shared/utils/handleNewRelease';
import { useInitData } from '@telegram-apps/sdk-react';

export const Loaders = (props: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const initData = useInitData();

  const userLoader = useUserStore((store) => store.loadUser);
  const walletLoader = useWalletStore((store) => store.loadWallets);
  const settingsLoader = useAppSettingsStore((store) => store.loadSettings);

  useEffect(() => {
    if (!initData?.user) return;
    // This is where your store loaders are located
    Promise.all([
      userLoader(initData.user, initData?.startParam),
      walletLoader(),
      settingsLoader(),
      handleNewRelease()
    ]).then(() => setIsLoading(false));
  }, [initData, settingsLoader, userLoader, walletLoader]);

  if (isLoading) return <SplashPage />;

  const MemoizedChildren = React.memo(() => <>{props.children}</>);

  return <MemoizedChildren />;
};
