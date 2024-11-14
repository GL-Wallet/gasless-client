import { Share } from 'lucide-react';
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

export const TransactionLink = ({ transactionLink, className }: PropsWithClassname<Props>) => {
  const utils = useUtils();
  const { t } = useTranslation();

  return (
    <div className={cn('w-full flex items-center justify-between space-x-6', className)}>
      <Button
        onClick={() => utils.shareURL(transactionLink)}
        variant={'outline'}
        className="w-full space-x-2 dark:border-neutral-700 text-xl"
      >
        <span>{t('transaction.link')}</span>
        <Share className="size-5" />
      </Button>

      <div className="flex items-center space-x-5">
        <CopyToClipboard size={5} value={transactionLink} />
      </div>
    </div>
  );
};
