import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { SeedPhrase, useSeedPhrase } from '@/features/wallet-setup';
import { ROUTES } from '@/shared/constants/routes';
import ShinyButton from '@/shared/magicui/shiny-button';
import { CopyToClipboardButton } from '@/shared/ui/copy-to-clipboard-button';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';

export const SeedPhrasePage = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const { t } = useTranslation();

  const seedPhrase = useSeedPhrase();

  return (
    <div className="h-full flex flex-col justify-between items-center space-y-3">
      <ResponsivePageHeader
        title={t('wallet.setup.seedPhrase.title')}
        description={t('wallet.setup.seedPhrase.description')}
        className="h-[25%]"
      />

      <SeedPhrase seedPhrase={seedPhrase} onHideMask={() => setIsDisabled(false)} />

      <CopyToClipboardButton value={seedPhrase?.join(' ')} disabled={isDisabled} />

      <ShinyButton
        onClick={() => navigate(ROUTES.SEED_PHRASE_CONFIRMATION)}
        disabled={isDisabled}
        animate={false}
        text={t('wallet.setup.seedPhrase.button')}
        className="w-full"
      />
    </div>
  );
};
