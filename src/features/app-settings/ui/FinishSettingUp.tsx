import type { PropsWithClassname } from '@/shared/types/react'
import { cn } from '@/shared/lib/utils'

import { SwitchItem } from '@/shared/ui/switch-item'
import { Fingerprint } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSettingsItems } from '../model/useSettingsItems'

export function FinishSettingUp({ className }: PropsWithClassname) {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems()

  const { t } = useTranslation()

  const isShowFinishSettingUp = !isBiometryEnabled

  return (
    isShowFinishSettingUp && (
      <div className={cn('w-full space-y-3', className)}>
        <h3 className="primary-gradient text-md font-bold">{t('setting.finishSettingUp')}</h3>
        <div className="space-y-4">
          {!isBiometryEnabled && (
            <SwitchItem
              title={t('setting.useBiometrics')}
              checked={isBiometryEnabled}
              onCheckedChange={handleSwitchBiometry}
              className="dark:bg-secondary/60"
              icon={<Fingerprint className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    )
  )
}
