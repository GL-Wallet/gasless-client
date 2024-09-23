export type Passcode = string | null;
export type EncryptedPasscode = string | null;

export type AuthPromiseCallback = (passcode: string) => void;

export type AuthContext = {
  authenticate(params?: AuthParams): Promise<string>;
  resetAuth(): void;
  passcode: Passcode;
  encryptedPasscode: EncryptedPasscode;
  authenticated: boolean;
  _actualPasscode: Passcode;
  _onPasscodeSuccess(newPasscode: Passcode): void;
};

export type AuthParams = {
  actionType?: 'startup' | 'request' | 'setup' | 'update';
  redirectTo?: string;
};
