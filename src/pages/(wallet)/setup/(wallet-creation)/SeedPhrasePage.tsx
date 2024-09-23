import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { SeedPhrase } from '@/features/wallet-setup';

export const SeedPhrasePage = () => {
  return (
    <div className="h-full flex flex-col justify-between items-center space-y-3">
      <ResponsivePageHeader
        title="Write Down Your Seed Phrase"
        description="This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll be asked to re-enter this phrase (in order) on the next step."
        className="h-[25%]"
      />

      <SeedPhrase />
    </div>
  );
};
