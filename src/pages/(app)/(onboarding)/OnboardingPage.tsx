import type { MouseEvent } from 'react'
import { useAppSettingsStore } from '@/entities/app-settings'
import { useWallet } from '@/entities/wallet'
import { ROUTES } from '@/shared/constants/routes'

import AnimatedShinyText from '@/shared/magicui/animated-shiny-text'
import BoxReveal from '@/shared/magicui/box-reveal'
import ShinyButton from '@/shared/magicui/shiny-button'
import { useTranslation } from 'react-i18next'
import Stories from 'react-insta-stories'
import { navigate } from 'wouter/use-browser-location'

function FirstStory() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col pt-28 items-center space-y-8">
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <h1 className="text-4xl font-semibold primary-gradient">{t('onBoarding.story.first.title')}</h1>
      </BoxReveal>
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          {t('onBoarding.story.first.description')}
        </AnimatedShinyText>
      </BoxReveal>
    </div>
  )
}

function SecondStory() {
  const { t } = useTranslation()

  return (
    <div className="h-full w-full flex flex-col pt-28 space-y-8">
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <h1 className="text-4xl font-semibold primary-gradient">
          {' '}
          {t('onBoarding.story.second.title')}
        </h1>
      </BoxReveal>
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          {t('onBoarding.story.second.description')}
        </AnimatedShinyText>
      </BoxReveal>
    </div>
  )
}

function ThirdStory() {
  const { t } = useTranslation()

  return (
    <div className="h-full w-full flex flex-col pt-28 space-y-8">
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <h1 className="text-3xl font-semibold primary-gradient">{t('onBoarding.story.third.title')}</h1>
      </BoxReveal>
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          {t('onBoarding.story.third.description')}
        </AnimatedShinyText>
      </BoxReveal>
    </div>
  )
}

function FourthStory() {
  const { t } = useTranslation()

  return (
    <div className="h-full w-full flex flex-col pt-28 space-y-8">
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <h1 className="text-4xl font-semibold primary-gradient">{t('onBoarding.story.fourth.title')}</h1>
      </BoxReveal>
      <BoxReveal boxColor="#37373790" duration={0.5}>
        <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          {t('onBoarding.story.fourth.description')}
        </AnimatedShinyText>
      </BoxReveal>
    </div>
  )
}

function FifthStory() {
  const wallet = useWallet()
  const updateAppSettings = useAppSettingsStore(store => store.updateSettings)

  const { t } = useTranslation()

  const handleContinue = (e: MouseEvent) => {
    e.stopPropagation()

    navigate(wallet ? ROUTES.HOME : ROUTES.WALLET_SETUP)
    updateAppSettings({ isNewest: false })
  }

  return (
    <div className="h-full w-full flex flex-col justify-between pt-28">
      <div className="space-y-8">
        <BoxReveal boxColor="#37373790" duration={0.5}>
          <h1 className="text-4xl font-semibold primary-gradient">{t('onBoarding.story.fifth.title')}</h1>
        </BoxReveal>

        <BoxReveal boxColor="#37373790" duration={0.5}>
          <AnimatedShinyText className="inline-block pr-8 text-xl transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            {t('onBoarding.story.fifth.description')}
          </AnimatedShinyText>
        </BoxReveal>
      </div>

      <ShinyButton text={t('onBoarding.story.fifth.button')} onClick={handleContinue} className="w-full" style={{ zIndex: 1000 }} />
    </div>
  )
}

const stories = [
  {
    content: FirstStory,
  },
  {
    content: SecondStory,
  },
  {
    content: ThirdStory,
  },
  {
    content: FourthStory,
  },
  {
    duration: 25000,
    content: FifthStory,
  },
]

export function OnboardingPage() {
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
        padding: '16px 24px 44px 24px',
      }}
    />
  )
}
