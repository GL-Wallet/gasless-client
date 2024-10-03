import { PropsWithChildren, useEffect, useState } from 'react';
import { navigate, usePathname } from 'wouter/use-browser-location';

import { useAuth } from '@/kernel/auth';
import { ROUTES } from '@/shared/constants/routes';
import { useTheme } from '@/shared/ui/theme-provider';
import {
	initNavigator, postEvent, RGB, useBackButton, useSettingsButton
} from '@telegram-apps/sdk-react';

const Config = {
  COLOR: { light: '#ffffff', dark: '#000000' },
  MAIN_BUTTON_VISIBLE: false,
  BACK_BUTTON_VISIBLE: true,
  SETTINGS_BUTTON_VISIBLE: true,
  ALLOW_VERTICAL_SWIPE: false
};

const BackButtonVisibleConfig: Record<ROUTES, boolean> = {
  [ROUTES.HOME]: false,
  [ROUTES.APP_SETTINGS]: true,
  [ROUTES.WALLET_IMPORT]: true,
  [ROUTES.WALLET_SETUP]: false,
  [ROUTES.WALLET_UPDATE]: true,
  [ROUTES.WALLET_CUSTOMIZATION]: true,
  [ROUTES.WALLET_CREATION_SUCCESS]: false,
  [ROUTES.SEED_PHRASE]: true,
  [ROUTES.SEED_PHRASE_CONFIRMATION]: false,
  [ROUTES.PASSCODE_STARTUP]: false,
  [ROUTES.PASSCODE_REQUEST]: true,
  [ROUTES.PASSCODE_SETUP]: true,
  [ROUTES.PASSCODE_UPDATE]: true,
  [ROUTES.WALLET_TRANSFER]: true,
  [ROUTES.WALLET_EXCHANGE]: true,
  [ROUTES.WALLET_TRANSFER_PARAMS]: true,
  [ROUTES.TRANSACTION]: true,
  [ROUTES.TRANSACTION_PARAMS]: true,
  [ROUTES.TRANSACTIONS]: true,
  [ROUTES.TRANSACTIONS_PARAMS]: true,
  [ROUTES.TRANSACTION_RESULT]: false,
  [ROUTES.TRANSACTION_RESULT_PARAMS]: false,
  [ROUTES.TRANSACTION_IN_PROGRESS]: false,
  [ROUTES.REFERRAL]: true,
  [ROUTES.BACKUP_MNEMONIC]: true,
  [ROUTES.BACKUP_PRIVATE_KEY]: true
};

const getColorBasedOnTheme = (theme: string): RGB => {
  return (Config.COLOR[theme as keyof typeof Config.COLOR] ?? Config.COLOR.dark) as RGB;
};

export const MiniAppConfig = (props: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { passcode } = useAuth();

  const navigator = initNavigator('app-navigator-state');

  const sb = useSettingsButton();
  const bb = useBackButton();

  useEffect(() => {
    postEvent('web_app_set_header_color', {
      color: getColorBasedOnTheme(theme)
    });
    postEvent('web_app_set_background_color', {
      color: getColorBasedOnTheme(theme)
    });

    postEvent('web_app_setup_main_button', { is_visible: Config.MAIN_BUTTON_VISIBLE });
    postEvent('web_app_setup_back_button', { is_visible: Config.BACK_BUTTON_VISIBLE });
    postEvent('web_app_setup_settings_button', { is_visible: Config.SETTINGS_BUTTON_VISIBLE });
    postEvent('web_app_setup_swipe_behavior', {
      allow_vertical_swipe: Config.ALLOW_VERTICAL_SWIPE
    });

    postEvent('iframe_ready');
    postEvent('web_app_ready');

    postEvent('web_app_expand');

    setIsLoading(false);
  }, [theme]);

  useEffect(() => {
    const handleClick = () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigator.back();
      }
    };

    if (
      BackButtonVisibleConfig[pathname as ROUTES] ||
      pathname.split('/').some((path) => BackButtonVisibleConfig[('/' + path) as ROUTES])
    ) {
      bb.show();
    } else {
      bb.hide();
    }

    bb.on('click', handleClick);

    return () => {
      bb.off('click', handleClick);
    };
  }, [bb, pathname, navigator]);

  useEffect(() => {
    sb.on('click', () => {
      ![ROUTES.WALLET_SETUP, ROUTES.PASSCODE_SETUP, ROUTES.PASSCODE_STARTUP, ROUTES.PASSCODE_REQUEST].includes(
        pathname as ROUTES
      ) &&
        passcode &&
        navigate(ROUTES.APP_SETTINGS);
    });
  }, [passcode, pathname, sb]);

  return !isLoading && props.children;
};
