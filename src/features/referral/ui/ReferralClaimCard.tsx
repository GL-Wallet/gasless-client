import { FormattedNumber } from '@/shared/ui/formatted-number';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { HandCoins } from 'lucide-react';

type Props = {
  reward: number | null;
  isZeroReward: boolean;
  isLoading: boolean;
  handleClaimReward: () => void;
};

export const ReferralClaimCard = ({ reward, isZeroReward, isLoading, handleClaimReward }: Props) => {
  const isNullishRewardValue = reward === null;

  return (
    <div className="flex justify-between items-center light-border h-20 dark:bg-secondary/60 rounded-md shadow-md p-4">
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
      </div>

      <Button
        onClick={handleClaimReward}
        variant={'outline'}
        className={'space-x-2 dark:border-neutral-700'}
        isLoading={isLoading}
        disabled={isZeroReward || isNullishRewardValue}
      >
        <span>Claim</span>
        <HandCoins className="size-4" />
      </Button>
    </div>
  );
};
