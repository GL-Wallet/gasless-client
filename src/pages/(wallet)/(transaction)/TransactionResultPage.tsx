import { Link } from 'wouter';

import { getTronscanLink, TransactionLink } from '@/entities/transaction';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';

const StatusHeader = ({ type }: { type: 'pending' | 'failed' }) => {
  const title = type === 'pending' ? 'Transaction submitted' : 'Transaction Failed';

  return <h2 className="primary-gradient text-3xl font-medium">{title}</h2>;
};

export const TransactionResultPage = ({ txid }: { txid: string }) => {
  const isPending = txid !== 'no-txid';

  return (
    <div className="relative h-full flex flex-col items-center justify-center space-y-10">
      <div className="space-y-8">
        <StatusHeader type={isPending ? 'pending' : 'failed'} />
        {isPending && <TransactionLink link={getTronscanLink(txid)} />}
      </div>

      <Link href={ROUTES.HOME} className="block">
        <Button variant={'outline'} className="absolute bottom-0 left-0 w-full">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
