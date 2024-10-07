import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import { getTronscanLink, TransactionLink } from '@/entities/transaction';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';

export const TransactionResultPage = ({ txid }: { txid: string }) => {
  const { t } = useTranslation();

  const isPending = txid !== 'no-txid';
  const title = t(`transaction.result.${isPending ? 'submitted' : 'failed'}`);

  return (
    <div className="relative h-full flex flex-col items-center justify-center space-y-10">
      <div className="space-y-8">
        <h2 className="primary-gradient text-3xl font-medium">{title}</h2>
        {isPending && <TransactionLink link={getTronscanLink(txid)} />}
      </div>

      <Link href={ROUTES.HOME} className="block">
        <Button variant={'outline'} className="absolute bottom-0 left-0 w-full">
          {t('transaction.result.button')}
        </Button>
      </Link>
    </div>
  );
};
