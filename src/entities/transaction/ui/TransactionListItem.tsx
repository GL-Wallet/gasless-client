import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { formatDate, isSentByWallet } from '../model/utils';
import { TransactionListDateOptions } from '../constants';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { urlJoin } from '@/shared/utils/urlJoin';
import { Transaction } from '../model/types';

interface Props {
  transaction: Transaction;
  walletAddress: string;
}

export const TransactionListItem = ({ transaction, walletAddress }: Props) => {
  const { txid, amount, from, timestamp } = transaction;
  const isSent = isSentByWallet(from, walletAddress);

  return (
    <Alert className="bg-card/80 cursor-pointer rounded-sm" onClick={() => navigate(urlJoin(ROUTES.TRANSACTION, txid))}>
      <AlertTitle className="primary-gradient font-bold text-lg">
        <span className="text-muted-foreground">{isSent ? '-' : '+'}</span>
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
