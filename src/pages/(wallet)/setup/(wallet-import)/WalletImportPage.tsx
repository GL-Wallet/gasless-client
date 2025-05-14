import { WalletImportForm } from '@/features/wallet-setup'

import { ResponsivePageHeader } from '@/shared/ui/responsive-page-header'
import { useTranslation } from 'react-i18next'

export function WalletImportPage() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col space-y-8">
      <ResponsivePageHeader title={t('wallet.setup.import.title')} />

      <WalletImportForm />
    </div>
  )
}
