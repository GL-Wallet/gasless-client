import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export const isDesktop = () => {
  const lp = retrieveLaunchParams();

  if (['macos', 'tdesktop', 'weba', 'web', 'webk'].includes(lp.platform)) {
    return true;
  }

  return false;
};
