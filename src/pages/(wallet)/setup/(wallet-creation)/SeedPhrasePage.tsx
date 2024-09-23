import { CopyToClipboardButton } from '@/shared/ui/copy-to-clipboard-button';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { SeedPhrase, useSeedPhrase } from '@/features/wallet-setup';
import ShinyButton from '@/shared/magicui/shiny-button';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { useState } from 'react';

export const SeedPhrasePage = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const seedPhrase = useSeedPhrase();

  return (
    <div className="h-full flex flex-col justify-between items-center space-y-3">
      <ResponsivePageHeader
        title="Write Down Your Seed Phrase"
        description="This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll be asked to re-enter this phrase (in order) on the next step."
        className="h-[25%]"
      />

      <SeedPhrase seedPhrase={seedPhrase} onHideMask={() => setIsDisabled(false)} />

      <CopyToClipboardButton value={seedPhrase?.join(' ')} disabled={isDisabled} />

      <ShinyButton
        onClick={() => navigate(ROUTES.SEED_PHRASE_CONFIRMATION)}
        disabled={isDisabled}
        animate={false}
        text="Continue"
        className="w-full"
      />
    </div>
  );
};
