import { useAuth } from '@/kernel/auth'
import { ROUTES } from '@/shared/constants/routes'

import { ActionItem } from '@/shared/ui/action-item'
import { LinkItem } from '@/shared/ui/link-item'
import { SwitchItem } from '@/shared/ui/switch-item'
import { FilePenLine, Fingerprint, KeyRound, Wallet2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSettingsItems } from '../model/useSettingsItems'
import { LanguageDrawer } from './LanguageDrawer'

export function AppSettingsItems() {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems()

  const { authenticate } = useAuth()

  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg primary-gradient">{t('shared.lang.label')}</h3>
        <LanguageDrawer />
      </div>

      <LinkItem
        title={t('setting.editWalletName')}
        href={ROUTES.WALLET_UPDATE}
        icon={<Wallet2 className="size-5" />}
        className="bg-transparent"
      />

      <SwitchItem
        title={t('setting.useBiometrics')}
        checked={isBiometryEnabled}
        onCheckedChange={handleSwitchBiometry}
        icon={<Fingerprint className="size-5" />}
        className="bg-transparent"
      />

      <ActionItem
        title={t('setting.backupMnemonic')}
        onClick={() => authenticate({ redirectTo: ROUTES.BACKUP_MNEMONIC })}
        icon={<FilePenLine className="size-5" />}
        className="bg-transparent"
      />

      <ActionItem
        title={t('setting.backupPrivateKey')}
        onClick={() => authenticate({ redirectTo: ROUTES.BACKUP_PRIVATE_KEY })}
        icon={<KeyRound className="size-5" />}
        className="bg-transparent"
      />
    </div>
  )
}
