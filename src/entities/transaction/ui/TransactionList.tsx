import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { TransactionListItem } from './TransactionListItem';
import { fetchTransactionList } from '../model/queries';
import { useTransactionStore } from '../model/store';
import { Skeleton } from '@/shared/ui/skeleton';
import { useWallet } from '@/entities/wallet';
import { useEffect, useState } from 'react';

interface TransactionListProps {
  token: AVAILABLE_TOKENS;
}

export const TransactionList: React.FC<TransactionListProps> = ({ token }) => {
  const { transactions, setTransactions } = useTransactionStore((store) => ({
    transactions: store.transactions,
    setTransactions: store.setTransactions
  }));

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const wallet = useWallet();

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      setIsLoading(true);
      try {
        const fetchedTransactions = await fetchTransactionList(wallet.address, token);

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetTransactions();
  }, [setTransactions, token, wallet.address]);

  return (
    <div className="space-y-2 py-4">
      {isLoading
        ? Array.from({ length: 7 }, (_, idx) => <Skeleton className="h-[74px] w-full rounded-sm" key={idx} />)
        : transactions.map((transaction, idx) => (
            <TransactionListItem key={idx} transaction={transaction} walletAddress={wallet.address} />
          ))}

      {!isLoading && transactions.length === 0 && (
        <div className="flex items-center justify-center w-full py-4 border border-dashed rounded-sm text-muted-foreground">
          Empty
        </div>
      )}
    </div>
  );
};
