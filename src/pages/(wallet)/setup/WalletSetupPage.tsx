import { useCreateWallet } from '@/features/wallet-setup/model/useCreateWallet';
import ShinyButton from '@/shared/magicui/shiny-button';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/kernel/auth';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';

export const WalletSetupPage = () => {
  const { authenticate } = useAuth();
  const { createWallet } = useCreateWallet();

  const handleCreateWallet = () => {
    authenticate({ actionType: 'setup' })
      .then((passcode) => createWallet({ passcode }))
      .then(() => navigate(ROUTES.SEED_PHRASE));
  };

  const handleImportWallet = () => {
    authenticate({ actionType: 'setup' }).then(() => navigate(ROUTES.WALLET_IMPORT));
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-end">
      {/* Content Section */}
      <div className="grow flex flex-col justify-between">
        {/* Heading and Description */}
        <div className="grow flex flex-col justify-center items-center">
          <AnimatedShinyText className="text-4xl inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>Gasless Wallet</span>
          </AnimatedShinyText>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleImportWallet()}
            className="w-full"
            variant="outline"
          >
            Import Using Seed Phrase
          </Button>

          <ShinyButton onClick={() => handleCreateWallet()} text="Create A Gasless Wallet" className="w-full py-4" />
        </div>
      </div>
    </div>
  );
};
