import { PasscodeUpdate, useAuth } from '@/kernel/auth'

export function PasscodeUpdatePage() {
  const { _passcodeHash, _onPasscodeSuccess } = useAuth()

  return (
    <div className="flex-1 flex justify-center items-center">
      <PasscodeUpdate passcodeHash={_passcodeHash} onPasscodeSuccess={_onPasscodeSuccess} />
    </div>
  )
}
