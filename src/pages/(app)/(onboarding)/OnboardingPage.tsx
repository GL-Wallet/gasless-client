import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { useAppSettingsStore } from '@/entities/app-settings';
import ShinyButton from '@/shared/magicui/shiny-button';
import { navigate } from 'wouter/use-browser-location';
import BoxReveal from '@/shared/magicui/box-reveal';
import { ROUTES } from '@/shared/constants/routes';
import { useWallet } from '@/entities/wallet';
import Stories from 'react-insta-stories';
import { MouseEvent } from 'react';

const FinalStory = () => {
  const wallet = useWallet();
  const updateAppSettings = useAppSettingsStore((store) => store.updateSettings);

  const handleContinue = (e: MouseEvent) => {
    e.stopPropagation();

    navigate(wallet ? ROUTES.HOME : ROUTES.WALLET_SETUP);
    updateAppSettings({ isNewest: false });
  };

  return (
    <div className="h-full w-full flex flex-col justify-between pt-28">
      <div className="space-y-8">
        <BoxReveal boxColor={'#37373790'} duration={0.5}>
          <h1 className="text-4xl font-semibold primary-gradient">Fast and Easy</h1>
        </BoxReveal>

        <BoxReveal boxColor={'#37373790'} duration={0.5}>
          <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            🚀 Make transactions in just a few clicks! A simple and intuitive interface for maximum convenience.
          </AnimatedShinyText>
        </BoxReveal>
      </div>

      <ShinyButton text="Continue" onClick={handleContinue} className="w-full" style={{ zIndex: 1000 }} />
    </div>
  );
};

const stories = [
  {
    content: () => {
      return (
        <div className="h-full w-full flex flex-col pt-28 items-center space-y-8">
          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <h1 className="text-4xl font-semibold primary-gradient">Welcome to Gasless Wallet!</h1>
          </BoxReveal>

          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              💼 Your decentralized wallet on Tron. Convenient, secure, and cost-effective transactions in your.
            </AnimatedShinyText>
          </BoxReveal>
        </div>
      );
    }
  },
  {
    content: () => {
      return (
        <div className="h-full w-full flex flex-col pt-28 space-y-8">
          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <h1 className="text-4xl font-semibold primary-gradient">Gas Optimization</h1>
          </BoxReveal>

          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              ⚡️ Save up to 40% on fees! With our innovations, you can make transactions with minimal gas costs.
            </AnimatedShinyText>
          </BoxReveal>
        </div>
      );
    }
  },
  {
    content: () => {
      return (
        <div className="h-full w-full flex flex-col pt-28 space-y-8">
          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <h1 className="text-3xl font-semibold primary-gradient">Buy TRX without gas</h1>
          </BoxReveal>

          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              💸 Top up your TRX balance even if you have no TRX! Purchase TRX with USDT, even when you have no TRX in
              your account.
            </AnimatedShinyText>
          </BoxReveal>
        </div>
      );
    }
  },
  {
    content: () => {
      return (
        <div className="h-full w-full flex flex-col pt-28 space-y-8">
          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <h1 className="text-4xl font-semibold primary-gradient">
              Earn with the <br /> referral program
            </h1>
          </BoxReveal>

          <BoxReveal boxColor={'#37373790'} duration={0.5}>
            <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              🤝 Get 10% from your friends' transaction fees! Invite friends to Gasless Wallet and earn on their
              transactions.
            </AnimatedShinyText>
          </BoxReveal>
        </div>
      );
    }
  },
  {
    duration: 25000,
    content: FinalStory
  }
];

export const OnboardingPage = () => {
  return (
    <Stories
      loop
      stories={stories}
      defaultInterval={5000}
      height="100%"
      width="100%"
      storyContainerStyles={{
        background: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        padding: '16px 24px 44px 24px'
      }}
    />
  );
};
