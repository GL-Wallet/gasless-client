import { PasscodeSetup, useAuth } from '@/kernel/auth'

export function PasscodeSetupPage() {
  const { _onPasscodeSuccess } = useAuth()

  return (
    <div className="flex-1 flex justify-center items-center">
      <PasscodeSetup onPasscodeSuccess={_onPasscodeSuccess} />
    </div>
  )
}
