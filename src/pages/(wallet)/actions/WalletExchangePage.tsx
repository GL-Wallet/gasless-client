import { WalletExchangeForm } from '@/features/wallet-actions/exchange'

import AnimatedShinyText from '@/shared/magicui/animated-shiny-text'
import { useTranslation } from 'react-i18next'

export function WalletExchangePage() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center space-y-8">
      <AnimatedShinyText className="mx-0 inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
        <span className="text-3xl">{t('exchange.title')}</span>
      </AnimatedShinyText>

      <WalletExchangeForm />
    </div>
  )
}
