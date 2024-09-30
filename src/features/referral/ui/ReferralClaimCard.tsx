import { AlertCircle, HandCoins } from 'lucide-react';

import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { Button } from '@/shared/ui/button';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { Skeleton } from '@/shared/ui/skeleton';

type Props = {
  reward: number | null;
  minRewardLimit: number | null;
  isZeroReward: boolean;
  isLoading: boolean;
  handleClaimReward: () => void;
};

export const ReferralClaimCard = ({ reward, minRewardLimit, isZeroReward, isLoading, handleClaimReward }: Props) => {
  const isNullishRewardValue = reward === null;

  return (
    <div className="flex justify-between items-start light-border dark:bg-secondary/60 rounded-md shadow-md p-4">
      <div className="flex flex-col space-y-1">
        <span className="text-sm text-muted-foreground">You can claim</span>
        <div className="flex items-center space-x-2">
          <span className="text-lg primary-gradient">{AVAILABLE_TOKENS.TRX}</span>
          {!isNullishRewardValue ? (
            <span className="text-lg font-medium">
              {isZeroReward ? reward.toFixed(2) : <FormattedNumber number={reward} />}
            </span>
          ) : (
            <Skeleton className="h-6 w-10 rounded-sm" />
          )}
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-muted-foreground">
          <AlertCircle className="size-4" />
          <span> Minimum payment limit: {minRewardLimit}</span>
        </div>
      </div>

      <Button
        onClick={handleClaimReward}
        variant={'outline'}
        className={'space-x-2 dark:border-neutral-700'}
        isLoading={isLoading}
        disabled={isZeroReward || isNullishRewardValue || !minRewardLimit || reward < minRewardLimit}
      >
        <span>Claim</span>
        <HandCoins className="size-4" />
      </Button>
    </div>
  );
};
