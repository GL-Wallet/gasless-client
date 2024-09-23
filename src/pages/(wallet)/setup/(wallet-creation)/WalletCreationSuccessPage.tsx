import ShinyButton from '@/shared/magicui/shiny-button';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';

export const WalletCreationSuccessPage = () => {
  return (
    <div className="h-full flex flex-col justify-between items-center">
      <div>
        <h3 className="text-center text-2xl font-bold mt-16 primary-gradient">Congratulations</h3>
        <div className="mt-3 text-muted-foreground max-w-72 space-y-5">
          <p>
            You've successfully protected your wallet. Remember to keep your seed phrase safe, it's your responsibility!
          </p>
          <p>Gasless Wallet cannot recover your wallet if you lose it.</p>
        </div>
      </div>

      <ShinyButton onClick={() => navigate(ROUTES.HOME)} animate={false} text="Continue" className='w-full' />
    </div>
  );
};
