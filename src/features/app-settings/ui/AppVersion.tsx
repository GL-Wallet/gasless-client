import { useTranslation } from 'react-i18next'

import { version } from '../../../../package.json'

export function AppVersion() {
  const { t } = useTranslation()

  return (
    <p className="text-sm text-muted-foreground">
      {t('setting.appVersion')}
      :
      {version}
    </p>
  )
}
