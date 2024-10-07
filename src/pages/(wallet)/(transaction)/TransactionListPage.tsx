import { useTranslation } from 'react-i18next';

import { TransactionList } from '@/entities/transaction';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header';

export const TransactionListPage = ({ token }: { token: string }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-sm overflow-x-hidden">
      <ResponsivePageHeader title={`${token} ${t('transaction.list.title')}`} />
      <TransactionList token={token as AVAILABLE_TOKENS} />
    </div>
  );
};
