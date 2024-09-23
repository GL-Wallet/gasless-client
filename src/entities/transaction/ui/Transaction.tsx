import { formatDate, getTronscanLink, isSentByWallet } from '../model/utils';
import { Transaction as TransactionType } from '../model/types';
import { truncateString } from '@/shared/utils/truncateString';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { capitalize } from '@/shared/utils/capitalize';
import { TransactionDateOptions } from '../constants';
import { useTransactionStore } from '../model/store';
import { useUtils } from '@telegram-apps/sdk-react';
import { getPrivateKey } from '@/entities/wallet';
import { Skeleton } from '@/shared/ui/skeleton';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { tronService } from '@/kernel/tron';

export const Transaction = ({ txid, walletAddress }: { txid: string; walletAddress: string }) => {
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const getTransaction = useTransactionStore((store) => store.getTransaction);

  const utils = useUtils();

  useEffect(() => {
    const transactionFromStore = getTransaction(txid);

    if (!transactionFromStore) return;

    setTransaction(transactionFromStore);
  }, [getTransaction, transaction, txid]);

  useEffect(() => {
    const privateKey = getPrivateKey();

    if (!privateKey) return;

    tronService.getTransactionStatus(txid, privateKey).then((status) => setStatus(status));
  }, [txid]);

  return (
    transaction && (
      <div className="flex flex-col items-center space-y-20 pt-6">
        <h2 className="primary-gradient text-center whitespace-pre-wrap text-3xl font-medium tracking-tighter">
          {isSentByWallet(transaction.from, walletAddress) ? '-' : '+'}<FormattedNumber number={transaction.amount} />{' '}
          <span className="text-2xl text-muted-foreground">{transaction.token}</span>
        </h2>

        <div className="w-full flex flex-col bg-neutral-900 p-4 rounded-md space-y-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{formatDate(new Date(transaction.timestamp), TransactionDateOptions, 'en-GB')}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            {status ? <span>{capitalize(status)}</span> : <Skeleton className="h-6 w-20" />}
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Sender</span>
            <span>{truncateString(transaction.from, 10)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receiver</span>
            <span>{truncateString(transaction.to, 10)}</span>
          </div>
        </div>

        <Button
          onClick={() => utils.openLink(getTronscanLink(transaction.txid))}
          variant={'link'}
          className="underline"
        >
          TronScan Link
        </Button>
      </div>
    )
  );
};
