import { WalletExchangeForm } from '@/features/wallet-actions';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';

export const WalletExchangePage = () => {
  return (
    <div className="h-full flex flex-col items-center space-y-8">
      <AnimatedShinyText className="mx-0 inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
        <span className="text-3xl">Get TRX</span>
      </AnimatedShinyText>

      <WalletExchangeForm />
    </div>
  );
};
