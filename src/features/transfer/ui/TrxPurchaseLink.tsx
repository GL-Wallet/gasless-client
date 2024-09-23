import { Coins } from 'lucide-react';

import { Balances } from '@/kernel/tron';
import { ROUTES } from '@/shared/constants/routes';
import { LinkItem } from '@/shared/ui/link-item';

type Props = {
  need?: number;
  balances: Balances;
};

export const TrxPurchaseLink = ({ need, balances }: Props) => {
  if (!need) return null;
  if (balances.TRX >= need) return null;

  return (
    <LinkItem
      icon={<Coins className="size-5" />}
      description="Buy TRX using USDT"
      href={ROUTES.WALLET_EXCHANGE}
      className="bg-secondary/60 dark:border-neutral-500"
    />
  );
};
