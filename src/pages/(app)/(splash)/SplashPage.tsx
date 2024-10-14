import { Clock, Lock, LucideCircleCheck } from 'lucide-react';
import { memo } from 'react';

import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { LogoDark } from '@/shared/ui/logo/logo-dark';
import { LogoLight } from '@/shared/ui/logo/logo-light';
import { useTheme } from '@/shared/ui/theme-provider';

export const Roadmap = memo(() => {
  return (
    <div className="relative grow w-full h-fit rounded-xl py-8 px-4 flex flex-col space-y-4">
      <h2 className="pl-4 text-3xl primary-gradient">Roadmap</h2>

      <div className="relative flex flex-col space-y-2">
        <div className="flex items-center space-x-2 p-4 bg-card rounded-xl">
          <LucideCircleCheck className="text-green-500 size-5" />
          <span className="text-xl font-medium primary-gradient">Goal 1</span>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-card rounded-xl">
          <LucideCircleCheck className="text-green-500 size-5" />
          <span className="text-xl font-medium primary-gradient">Goal 2</span>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-card rounded-xl border border-neutral-700">
          <Clock className="text-neutral-500 size-5" />
          <AnimatedShinyText className="text-xl font-medium transition ease-out">Goal 3</AnimatedShinyText>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-card rounded-xl">
          <Lock className="text-neutral-500 size-5" />
          <AnimatedShinyText className="text-xl font-medium transition ease-out">Goal 4</AnimatedShinyText>
        </div>
      </div>
    </div>
  );
});

export const SplashPage = memo(() => {
  const { theme } = useTheme();

  const Comp = theme === 'light' ? LogoLight : LogoDark;

  return (
    <div className="relative h-full flex flex-col justify-center items-center">
      <Comp className="size-72" />
      {/* <Roadmap /> */}
    </div>
  );
});
