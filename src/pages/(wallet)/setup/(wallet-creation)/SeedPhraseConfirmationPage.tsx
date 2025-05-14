import { SeedPhraseConfirmation, useSeedPhrase } from '@/features/wallet-setup'
import { ROUTES } from '@/shared/constants/routes'

import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function SeedPhraseConfirmationPage() {
  const seedPhrase = useSeedPhrase()

  const { t } = useTranslation()

  if (!seedPhrase)
    navigate(ROUTES.WALLET_SETUP)

  return (
    <div className="flex-1 flex flex-col items-center">
      <ResponsivePageHeader
        title={t('wallet.setup.confirmSeedPhrase.title')}
        description={t('wallet.setup.confirmSeedPhrase.description')}
      />

      {seedPhrase && <SeedPhraseConfirmation seedPhrase={seedPhrase} className="mt-3" />}
    </div>
  )
}
