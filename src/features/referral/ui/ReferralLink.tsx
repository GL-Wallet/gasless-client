import { ChevronRight } from 'lucide-react';
import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { PropsWithClassname } from '@/shared/types/react';

export const ReferralLink = ({ className }: PropsWithClassname) => {
  return (
    <div
      className={cn(
        'relative h-16 w-full p-4 pr-2 bg-card/60 dark:bg-card/30 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-md flex items-center justify-between',
        className
      )}
      onClick={() => navigate(ROUTES.REFERRAL)}
    >
      <AnimatedShinyText className="mx-0 text-[14px] text-nowrap">Get 10% of your friends transaction fees</AnimatedShinyText>
      <ChevronRight className="size-7 text-muted-foreground" />
    </div>
  );
};
