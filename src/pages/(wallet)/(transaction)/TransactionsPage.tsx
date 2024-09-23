import { TransactionList } from '@/entities/transaction';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';

export const TransactionsPage = ({ token }: { token: string }) => {
  return (
    <div className="max-w-sm overflow-x-hidden">
      <ResponsivePageHeader title={`${token} Transactions`} />
      <TransactionList token={token as AVAILABLE_TOKENS} />
    </div>
  );
};
