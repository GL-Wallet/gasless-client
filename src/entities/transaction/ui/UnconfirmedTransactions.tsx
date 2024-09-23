import { truncateString } from '@/shared/utils/truncateString';
import { PropsWithClassname } from '@/shared/types/react';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { fetchTransactionList } from '../model/queries';
import { isSentByWallet } from '../model/utils';
import { useWallet } from '@/entities/wallet';
import { Transaction } from '../model/types';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';

const PingIcon = () => (
  <span className="relative flex size-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full size-2 bg-orange-500"></span>
  </span>
);

export const UnconfirmedTransactions = ({ className }: PropsWithClassname) => {
  const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<Transaction[]>([]);
  const wallet = useWallet();

  useEffect(() => {
    const fetchTransactions = async () => {
      const [trc20UnconfirmedTransactions, trxUnconfirmedTransactions] = await Promise.all([
        fetchTransactionList(wallet.address, AVAILABLE_TOKENS.USDT, { only_unconfirmed: true, limit: 3 }),
        fetchTransactionList(wallet.address, AVAILABLE_TOKENS.TRX, { only_unconfirmed: true, limit: 3 })
      ]);

      setUnconfirmedTransactions([...trc20UnconfirmedTransactions.concat(trxUnconfirmedTransactions)]);
    };

    const intervalId = setInterval(fetchTransactions, 2500);

    const firstTimeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 15 * 1000);

    const secondTimeoutId = setTimeout(fetchTransactions, 70 * 1000);

    return () => {
      clearInterval(intervalId);

      clearTimeout(firstTimeoutId);
      clearTimeout(secondTimeoutId);
    };
  }, [wallet.address]);

  return (
    <div className={cn('w-full space-y-3', className)}>
      <h3 className="text-neutral-600 text-md font-bold dark:text-muted-foreground mb-1">Pending Transactions</h3>

      <div className="space-y-2">
        {unconfirmedTransactions.length > 0 ? (
          unconfirmedTransactions.slice(0, 2).map(({ token, amount, txid, from }, idx) => (
            <div
              className="flex items-center px-4 py-2 space-x-4 bg-secondary/60 border dark:border-neutral-700 rounded-md"
              key={idx}
            >
              <PingIcon />

              <div className="flex flex-col">
                <div className="text-md primary-gradient space-x-1">
                  <span>
                    {isSentByWallet(from, wallet.address) ? '-' : '+'}
                    {amount}
                  </span>
                  <span className="text-sm text-muted-foreground">{token}</span>
                </div>
                <span className="text-sm text-muted-foreground">{truncateString(txid, 12)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full py-4 border border-dashed rounded-md text-muted-foreground">
            Empty
          </div>
        )}
      </div>
    </div>
  );
};
