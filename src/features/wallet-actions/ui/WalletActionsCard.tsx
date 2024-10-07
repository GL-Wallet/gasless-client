import { ArrowDownUp, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { useWallet } from '@/entities/wallet';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { PropsWithClassname } from '@/shared/types/react';
import { Button } from '@/shared/ui/button';
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard';
import { truncateString } from '@/shared/utils/truncateString';

import { WalletReceiveDrawer } from './WalletReceiveDrawer';

export const WalletActionsCard = ({ className }: PropsWithClassname) => {
  const wallet = useWallet();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between light-border bg-card/60 dark:bg-card/40 p-4 h-fit w-full rounded-lg dark:border border-neutral-700 shadow-md',
        className
      )}
    >
      <div className="hidden dark:block absolute top-0 z-[-1] bottom-0 left-0 right-0 rounded-lg bg-secondary/60 bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,#505050,rgba(255,255,255,0))]" />

      <div className="flex items-center justify-between">
        <p className="dark:text-muted-foreground">{truncateString(wallet.address, 12)}</p>

        <div className="flex items-center space-x-2">
          <CopyToClipboard value={wallet.address} />
          <WalletReceiveDrawer address={wallet.address} />
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          className="p-0 w-full space-x-2 dark:border border-neutral-600 dark:bg-transparent"
          variant={'ghost'}
          onClick={() => navigate(ROUTES.WALLET_TRANSFER)}
        >
          <AnimatedShinyText className="text-black text-sm inline-flex items-center justify-center py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>{t('wallet.button.send')}</span>
            <ChevronRight className="ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </Button>

        <Button
          className="p-0 w-full dark:border border-neutral-600 dark:bg-transparent"
          variant={'ghost'}
          onClick={() => navigate(ROUTES.WALLET_EXCHANGE)}
        >
          <AnimatedShinyText className="text-black text-sm inline-flex items-center justify-center transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>{t('wallet.button.getTrx')}</span>
            <ArrowDownUp className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </Button>
      </div>
    </div>
  );
};
