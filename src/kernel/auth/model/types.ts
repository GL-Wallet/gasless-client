export type Passcode = string | null
export type EncryptedPasscode = string | null

export type AuthPromiseCallback = (passcode: string) => void

export interface AuthContext {
  authenticate: (params?: AuthParams) => Promise<string>
  resetAuth: () => void
  passcode: Passcode
  authenticated: boolean
  _passcodeHash: string | null
  _onPasscodeSuccess: (newPasscode: Passcode) => void
}

export interface AuthParams {
  actionType?: 'startup' | 'request' | 'setup' | 'update'
  redirectTo?: string
}
