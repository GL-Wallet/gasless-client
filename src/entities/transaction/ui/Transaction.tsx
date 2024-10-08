import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getPrivateKey } from '@/entities/wallet';
import { tronService } from '@/kernel/tron';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { Skeleton } from '@/shared/ui/skeleton';
import { capitalize } from '@/shared/utils/capitalize';
import { truncateString } from '@/shared/utils/truncateString';

import { TransactionDateOptions } from '../constants';
import { useTransactionStore } from '../model/store';
import { Transaction as TransactionType } from '../model/types';
import { formatDate, getTronscanLink, isSentByWallet } from '../model/utils';
import { TransactionLink } from './TransactionLink';

export const Transaction = ({ txid, walletAddress }: { txid: string; walletAddress: string }) => {
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const { t } = useTranslation();

  const getTransaction = useTransactionStore((store) => store.getTransaction);

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

  const tronscanLink = getTronscanLink(transaction?.txid);

  return (
    transaction && (
      <div className="flex flex-col items-center pt-6">
        <h2 className="primary-gradient text-center whitespace-pre-wrap text-3xl font-medium tracking-tighter">
          {isSentByWallet(transaction.from, walletAddress) ? '-' : '+'}
          <FormattedNumber number={transaction.amount} />{' '}
          <span className="text-2xl text-muted-foreground">{transaction.token}</span>
        </h2>

        <div className="w-full flex flex-col border dark:bg-card/60 p-4 rounded-md space-y-6 mt-20">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.date')}</span>
            <span>{formatDate(new Date(transaction.timestamp), TransactionDateOptions)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.status')}</span>
            {status ? <span>{capitalize(status)}</span> : <Skeleton className="h-6 w-20" />}
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.sender')}</span>
            <span>{truncateString(transaction.from, 10)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('transaction.receiver')}</span>
            <span>{truncateString(transaction.to, 10)}</span>
          </div>
          <TransactionLink link={tronscanLink} />
        </div>
      </div>
    )
  );
};
