import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useUser } from '@/entities/user';
import { useWallet } from '@/entities/wallet';
import {
	ReferralCard, ReferralClaimCard, ReferralList, useFetchReferrals
} from '@/features/referral';
import { api } from '@/kernel/api';
import { Badge } from '@/shared/ui/badge';

export const ReferralPage = () => {
  const [reward, setReward] = useState<number | null>(null);
  const [referralsCount, setReferralsCount] = useState<number | null>(null);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const currentPage = useRef<number>(1);
  const limit = useRef<number>(4);

  const { referralList, hasMoreReferrals, loadingReferrals, fetchReferralList, fetchNextReferrals } = useFetchReferrals(
    { currentPage, pageSize: limit }
  );

  const wallet = useWallet();
  const user = useUser();

  const handleClaimReward = async () => {
    if (!user) return;

    try {
      setIsClaimLoading(true);
      await api.claimReward(user.id, { address: wallet.address });
      await fetchReferralList();
      toast.success('Success!');
      setReward(0);
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsClaimLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    api.getTotalReward(user.id).then((res) => setReward(res));
    api.getReferralsCount(user.id).then((res) => setReferralsCount(res));
    fetchReferralList();
  }, [user, fetchReferralList]);

  const isZeroReward = reward === 0;

  return (
    <div className="h-full flex flex-col space-y-12 pt-12">
      <ReferralCard userId={user?.id} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold primary-gradient">Friends</h3>
          <div className="space-x-2 text-sm text-muted-foreground">
            <span>Referrals invited</span>
            <Badge className="border-none dark:border-neutral-700" variant={'outline'}>
              {referralsCount ?? '...'}
            </Badge>
          </div>
        </div>

        <ReferralClaimCard
          reward={reward}
          isZeroReward={isZeroReward}
          isLoading={isClaimLoading}
          handleClaimReward={handleClaimReward}
        />

        <ReferralList
          referrals={referralList}
          isLoading={loadingReferrals}
          hasMore={hasMoreReferrals}
          fetchReferrals={fetchNextReferrals}
        />
      </div>
    </div>
  );
};
