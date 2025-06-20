import { useCreateWallet, WalletCustomizationForm } from '@/features/wallet-setup'
import { useAuth } from '@/kernel/auth'

import { ROUTES } from '@/shared/constants/routes'
import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function WalletCustomizationPage() {
  const { passcode } = useAuth()
  const { isLoading, createWallet } = useCreateWallet()

  const { t } = useTranslation()

  const onSubmit = (walletName: string) => {
    if (!passcode)
      return

    createWallet({ passcode, name: walletName }).then(() => navigate(ROUTES.SEED_PHRASE))
  }

  return (
    <div className="flex-1 flex flex-col items-center text-center pt-8 space-y-8">
      <ResponsivePageHeader
        title={t('wallet.setup.customize.title')}
        description={t('wallet.setup.customize.description')}
      />

      <WalletCustomizationForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  )
}
