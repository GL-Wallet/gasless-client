import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { urlJoin } from '@/shared/utils/urlJoin';

import { TransactionListDateOptions } from '../constants';
import { Transaction } from '../model/types';
import { formatDate, isSentByWallet } from '../model/utils';

interface Props {
  transaction: Transaction;
  walletAddress: string;
}

export const TransactionListItem = ({ transaction, walletAddress }: Props) => {
  const { txid, amount, from, timestamp } = transaction;

  const isSent = isSentByWallet(from, walletAddress);
  const isShowTransaction = amount > 0.0001

  return (
    isShowTransaction && <Alert
      className="dark:bg-card/80 cursor-pointer rounded-sm"
      onClick={() => navigate(urlJoin(ROUTES.TRANSACTION, txid))}
    >
      <AlertTitle className="primary-gradient font-bold text-lg">
        {isSent ? '-' : '+'}
        <FormattedNumber number={amount} />
      </AlertTitle>
      <AlertDescription>
        <span className="text-sm text-muted-foreground truncate">
          {formatDate(new Date(timestamp), TransactionListDateOptions)}
        </span>
      </AlertDescription>
    </Alert>
  );
};
