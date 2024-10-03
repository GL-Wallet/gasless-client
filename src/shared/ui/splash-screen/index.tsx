import { useTheme } from '../theme-provider';

export const SplashScreen = () => {
  const { theme } = useTheme();

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <img src={`/icons/logo-${theme}.svg`} className="size-96" />
    </div>
  );
};
