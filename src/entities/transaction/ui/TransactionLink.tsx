import { ChevronRight, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/lib/utils';
import { PropsWithClassname } from '@/shared/types/react';
import { Button } from '@/shared/ui/button';
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard';
import { useUtils } from '@telegram-apps/sdk-react';

type Props = {
  tronscanLink: string;
  transactionLink: string;
};

export const TransactionLink = ({ tronscanLink, transactionLink, className }: PropsWithClassname<Props>) => {
  const utils = useUtils();
  const { t } = useTranslation();

  return (
    <div className={cn('w-full flex items-center justify-between space-x-6', className)}>
      <Button
        onClick={() => utils.openLink(tronscanLink)}
        variant={'outline'}
        className="w-full space-x-1 dark:border-neutral-700"
      >
        <span>{t('transaction.link')}</span>
        <ChevronRight className="size-5" />
      </Button>

      <div className="flex items-center space-x-5">
        <Share className="size-5" onClick={() => utils.shareURL(transactionLink)} />
        <CopyToClipboard size={5} value={transactionLink} />
      </div>
    </div>
  );
};
