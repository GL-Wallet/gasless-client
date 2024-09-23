import { SeedPhraseConfirmation, useSeedPhrase } from '@/features/wallet-setup';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';

export const SeedPhraseConfirmationPage = () => {
  const seedPhrase = useSeedPhrase();

  if (!seedPhrase) navigate(ROUTES.WALLET_SETUP);

  return (
    <div className="h-full flex flex-col items-center">
      <ResponsivePageHeader
        title="Confirm Seed Phrase"
        description="Select each word in the order it was presented to you"
      />

      {seedPhrase && <SeedPhraseConfirmation seedPhrase={seedPhrase} className="mt-3" />}
    </div>
  );
};
