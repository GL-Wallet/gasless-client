import { PropsWithChildren, useEffect, useState } from 'react';

import { useAppSettingsStore } from '@/entities/app-settings';
import { useUserStore } from '@/entities/user';
import { useWalletStore } from '@/entities/wallet';
import { SplashScreen } from '@/shared/ui/splash-screen';
// import { checkForUpdates } from '@/shared/utils/checkForUpdates';
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
      // checkForUpdates()
    ]).then(() => setIsLoading(false));
  }, [initData, settingsLoader, userLoader, walletLoader]);

  if (isLoading) return <SplashScreen />;

  return props.children;
};
