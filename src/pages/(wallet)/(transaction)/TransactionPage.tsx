import { navigate } from 'wouter/use-browser-location';
import { Transaction } from '@/entities/transaction';
import { ROUTES } from '@/shared/constants/routes';
import { useWallet } from '@/entities/wallet';
import { Button } from '@/shared/ui/button';

export const TransactionPage = ({ txid }: { txid: string }) => {
  const wallet = useWallet();

  return (
    <div className="h-full flex flex-col justify-between">
      <Transaction txid={txid} walletAddress={wallet.address} />
      <Button onClick={() => navigate(ROUTES.HOME)} variant={'outline'} className="w-full">
        Back to Home
      </Button>
    </div>
  );
};
