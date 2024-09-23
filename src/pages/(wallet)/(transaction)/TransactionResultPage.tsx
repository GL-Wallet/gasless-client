import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';
import { getTronscanLink } from '@/entities/transaction';
import { useUtils } from '@telegram-apps/sdk-react';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';
import { Link } from 'wouter';

const StatusHeader = ({ type }: { type: 'initiated' | 'failed' }) => {
  const title = type === 'initiated' ? 'Transaction Initiated' : 'Transaction Failed';
  // const description =
  //   type === 'initiated'
  //     ? 'Your transaction has been successfully submitted. Please check back later for confirmation of its status.'
  //     : 'We encountered an issue processing your transaction.';

  return <ResponsivePageHeader className="h-fit w-72" title={title} />;
};

export const TransactionResultPage = ({ txid }: { txid: string }) => {
  const utils = useUtils();
  const isInitiated = txid !== 'no-txid';

  return (
    <div className="relative h-full flex flex-col justify-center items-center space-y-10">
      <StatusHeader type={isInitiated ? 'initiated' : 'failed'} />

      {isInitiated && (
        <Button onClick={() => utils.openLink(getTronscanLink(txid))} variant={'link'} className="underline">
          Tronscan Link
        </Button>
      )}

      <Link href={ROUTES.HOME} className="absolute bottom-0 w-full">
        <Button variant={'outline'} className="w-full">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
