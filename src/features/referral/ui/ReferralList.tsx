import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { UserIcon } from 'lucide-react';
import { User } from '@/entities/user';
import { api } from '@/kernel/api';

export const ReferralList = () => {
  const [referrals, setReferrals] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const page = useRef<number>(1);
  const limit = useRef<number>(4);

  const fetchReferrals = useCallback(async () => {
    setHasMore(false);
    setIsLoading(true);

    try {
      const res = await api.getReferrals({ page: page.current, limit: limit.current });
      setReferrals((prev) => [...prev, ...res]);
      setHasMore(res.length === limit.current);
      page.current++;
    } catch (error) {
      console.error('Failed to fetch referrals: ', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  if (referrals.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-14 text-lg primary-gradient border dark:border-neutral-600 border-dashed rounded-lg">
        Empty
      </div>
    );
  }

  return (
    <div style={{ height: 250, overflowY: 'auto' }}>
      <InfiniteScroll
        className="space-y-2"
        pageStart={0}
        loadMore={fetchReferrals}
        hasMore={hasMore}
        loader={<Loader key={0} />}
        useWindow={false}
      >
        {referrals.map((user) => (
          <ReferralItem key={user.id} user={user} />
        ))}
        {isLoading && <Loader />}
      </InfiniteScroll>
    </div>
  );
};

interface ReferralItemProps {
  user: User;
}

const ReferralItem: React.FC<ReferralItemProps> = ({ user }) => {
  const { name, currentReward, currentPartnerReward, totalReward, totalPartnerReward } = user;

  return (
    <div className="flex items-center justify-between px-4 py-2 border dark:bg-inherit dark:border-neutral-600 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-fit h-fit rounded-full bg-secondary p-2">
          <UserIcon className="size-5" />
        </div>
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-sm text-muted-foreground">Total reward: {totalPartnerReward || totalReward}</span>
        </div>
      </div>
      <Badge className="border-neutral-600" variant="outline">
        +{currentPartnerReward || currentReward}
      </Badge>
    </div>
  );
};

const Loader = () => <Skeleton className="w-full h-16 rounded-lg" />;
