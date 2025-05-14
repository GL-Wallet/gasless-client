import { useAppSettingsStore } from '@/entities/app-settings'
import { PasscodeRequired, useAuth } from '@/kernel/auth'

export function PasscodeRequestPage() {
  const isBiometryEnabled = useAppSettingsStore(store => store.isBiometryEnabled)
  const { _passcodeHash, _onPasscodeSuccess } = useAuth()

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-8">
      <PasscodeRequired
        isBiometryEnabled={isBiometryEnabled}
        passcodeHash={_passcodeHash}
        onPasscodeSuccess={_onPasscodeSuccess}
      />
    </div>
  )
}
