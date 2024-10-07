import { LogoDark } from '../logo/logo-dark';
import { LogoLight } from '../logo/logo-light';
import { useTheme } from '../theme-provider';

export const SplashScreen = () => {
  const { theme } = useTheme();

  const Comp = theme === 'light' ? LogoLight : LogoDark;

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <Comp className="size-72 opacity-50" />
    </div>
  );
};
