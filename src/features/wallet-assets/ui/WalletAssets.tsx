import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { PropsWithClassname } from '@/shared/types/react';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { urlJoin } from '@/shared/utils/urlJoin';
import { useWallet } from '@/entities/wallet';
import { Button } from '@/shared/ui/button';
import { Send } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/shared/lib/utils';

const Icons: Record<AVAILABLE_TOKENS, string> = {
  TRX: '/icons/tron.png',
  USDT: '/icons/usdt.png'
};

export const WalletAssets = ({ className }: PropsWithClassname) => {
  const wallet = useWallet();

  return (
    <div className={cn('w-full space-y-3', className)}>
      <h3 className="text-neutral-600 text-md font-bold dark:text-muted-foreground mb-1">Assets</h3>

      <div className="w-full flex flex-col space-y-2">
        {Object.keys(AVAILABLE_TOKENS).map((token, idx) => (
          <Link
            href={[ROUTES.TRANSACTIONS, token].join('/')}
            className="border bg-card/60 dark:bg-secondary/60 dark:border-neutral-700 relative flex h-full w-full items-center justify-between overflow-hidden rounded-md p-3 dark:shadow-md"
            key={idx}
          >
            <div className="flex items-center space-x-4">
              <img src={Icons[token as AVAILABLE_TOKENS]} className="size-8" />
              <div className="z-10 whitespace-pre-wrap text-center text-lg font-medium tracking-tighter text-black dark:text-white">
                <AnimatedShinyText className="transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  {token}
                </AnimatedShinyText>
              </div>
            </div>
            <div className="space-x-4">
              <span className="primary-gradient">
                <FormattedNumber number={wallet.balances[token as AVAILABLE_TOKENS]} />
              </span>

              <Button
                variant={'outline'}
                size={'icon'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(urlJoin(ROUTES.WALLET_TRANSFER, token));
                }}
                className="border border-gray-300 dark:border-neutral-700"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
