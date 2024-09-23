import { ReferralCard, ReferralClaimCard, ReferralList } from '@/features/referral';
import { useUser } from '@/entities/user';
import { useWallet } from '@/entities/wallet';
import { useEffect, useState } from 'react';
import { Badge } from '@/shared/ui/badge';
import { api } from '@/kernel/api';
import toast from 'react-hot-toast';

export const ReferralPage = () => {
  const [reward, setReward] = useState<number | null>(null);
  const [referralsCount, setReferralsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const user = useUser();

  useEffect(() => {
    api.getTotalReward().then((res) => setReward(res));
    api.getReferralsCount().then((res) => setReferralsCount(res));
  }, []);

  const handleClaimReward = async () => {
    try {
      setIsLoading(true);
      await api.claimReward({ address: wallet.address });
      toast.success('Success!');
      setReward(0);
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

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
          isLoading={isLoading}
          handleClaimReward={handleClaimReward}
        />

        <ReferralList />
      </div>
    </div>
  );
};
