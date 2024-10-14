import { UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';

import { User } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { PropsWithClassname } from '@/shared/types/react';
import { Badge } from '@/shared/ui/badge';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { Skeleton } from '@/shared/ui/skeleton';

type ReferralListProps = {
  referrals: User[];
  isLoading: boolean;
  hasMore: boolean;
  fetchReferrals(): void;
};

export const ReferralList = ({
  referrals,
  isLoading,
  hasMore,
  fetchReferrals,
  className
}: PropsWithClassname<ReferralListProps>) => {
  const { t } = useTranslation();

  if (referrals.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-14 text-lg primary-gradient border dark:border-neutral-600 border-dashed rounded-lg">
        {t('referral.list.empty')}
      </div>
    );
  }

  return (
    <div className={cn('h-full', className)} style={{ overflowY: 'auto' }}>
      <InfiniteScroll
        className="space-y-2"
        pageStart={0}
        hasMore={hasMore}
        loadMore={fetchReferrals}
        loader={<Loader key={0} />}
        useWindow={false}
      >
        {referrals?.map((user) => <ReferralItem key={user.id} user={user} />)}
        {isLoading && <Loader />}
      </InfiniteScroll>
    </div>
  );
};

interface ReferralItemProps {
  user: User;
}

const ReferralItem: React.FC<ReferralItemProps> = ({ user }) => {
  const { userName, currentReward, currentPartnerReward, totalReward, totalPartnerReward } = user;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-2 border dark:bg-inherit dark:border-neutral-600 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-fit h-fit rounded-full bg-secondary p-2">
          <UserIcon className="size-5" />
        </div>
        <div className="flex flex-col">
          {userName && <span>@{userName}</span>}
          <span className="text-[12px] text-muted-foreground">
            {t('referral.list.item.totalReward')}:{' '}
            <FormattedNumber number={user.isPartner ? totalPartnerReward : totalReward} />
          </span>
        </div>
      </div>
      <Badge className="border-neutral-600" variant="outline">
        +<FormattedNumber number={user.isPartner ? currentPartnerReward : currentReward} />
      </Badge>
    </div>
  );
};

const Loader = () => <Skeleton className="w-full h-16 rounded-lg" />;
