import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { PropsWithClassname } from '@/shared/types/react';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const ReferralLink = ({ className }: PropsWithClassname) => {
  return (
    <div
      className={cn(
        'relative h-16 w-full p-4 bg-card/60 dark:bg-card/30 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-md flex items-center justify-between',
        className
      )}
      onClick={() => navigate(ROUTES.REFERRAL)}
    >
      <AnimatedShinyText className="mx-0 text-md text-nowrap">Get 10% of your friends savings</AnimatedShinyText>
      <ChevronRight className="size-8 text-muted-foreground" />
    </div>
  );
};
