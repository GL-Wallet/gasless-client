import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';

export const SplashScreen = () => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <AnimatedShinyText className="text-4xl inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
        <span>Gasless Wallet</span>
      </AnimatedShinyText>
    </div>
  );
};
