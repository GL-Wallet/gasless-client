import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { PropsWithClassname } from '@/shared/types/react';

export const ReferralLink = ({ className }: PropsWithClassname) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'relative h-16 w-full p-4 pr-2 bg-card/60 dark:bg-secondary/50 border rounded-lg dark:border-neutral-800 flex items-center justify-between',
        className
      )}
      onClick={() => navigate(ROUTES.REFERRAL)}
    >
      <AnimatedShinyText className="mx-0 text-[13px] text-wrap min-w-2/3">{t('referral.link')}</AnimatedShinyText>
      <ChevronRight className="size-7 text-muted-foreground" />
    </div>
  );
};
