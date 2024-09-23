import { PropsWithChildren, useEffect, useRef, useCallback } from 'react';
import { saveEncryptedPasscode } from '../utils/saveEncryptedPasscode';
import { getEncryptedPasscode } from '../utils/getEncryptedPasscode';
import { AuthPromiseCallback, AuthParams } from '../model/types';
import { navigate } from 'wouter/use-browser-location';
import { authContext } from '../model/auth-context';
import { decrypt } from '@/shared/lib/crypto-js';
import { useAuthStore } from '../model/store';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const setAuthStore = useAuthStore((store) => store.set);

  const { passcode, encryptedPasscode, requiresSetup, isAuthenticated, resetStore } = useAuthStore((store) => ({
    passcode: store.passcode,
    encryptedPasscode: store.encryptedPasscode,
    requiresSetup: store.requiresSetup,
    isAuthenticated: store.isAuthenticated,
    resetStore: store.resetStore
  }));

  const authPromiseRef = useRef<AuthPromiseCallback>();
  const authConfigRef = useRef<AuthParams>({});
  const returnPathRef = useRef<string>(location.pathname);

  const authenticate = useCallback(
    ({ actionType = 'request', redirectTo }: AuthParams = {}) => {
      const targetPath = `/passcode-${requiresSetup ? 'setup' : actionType}`;

      returnPathRef.current = location.pathname;
      authConfigRef.current = { redirectTo };

      navigate(targetPath, { replace: true });

      return new Promise<string>((resolve) => {
        authPromiseRef.current = resolve;
      });
    },
    [requiresSetup]
  );

  const handlePasscodeSuccess = useCallback(
    async (enteredPasscode: string) => {
      try {
        const encryptedPasscode = await saveEncryptedPasscode(enteredPasscode);

        setAuthStore({ requiresSetup: false, isAuthenticated: true, passcode: enteredPasscode, encryptedPasscode });

        navigate(authConfigRef.current?.redirectTo ?? returnPathRef.current, { replace: true });
        authPromiseRef.current?.(enteredPasscode);
      } catch (error) {
        console.error('Error saving passcode:', error);
      }
    },
    [setAuthStore]
  );

  useEffect(() => {
    const initializePasscode = async () => {
      try {
        const encryptedPasscode = await getEncryptedPasscode();

        if (encryptedPasscode) {
          const decryptedPasscode = decrypt(encryptedPasscode, import.meta.env.VITE_AUTH_SECRET);

          setAuthStore({ passcode: decryptedPasscode, encryptedPasscode, requiresSetup: false });
        } else {
          setAuthStore({ requiresSetup: true });
        }
      } catch (error) {
        console.error('Error fetching passcode:', error);
        setAuthStore({ requiresSetup: true });
      }
    };

    initializePasscode();
  }, [setAuthStore]);

  return (
    <authContext.Provider
      value={{
        authenticate,
        resetAuth: resetStore,
        passcode,
        encryptedPasscode,
        authenticated: isAuthenticated,
        _actualPasscode: passcode,
        _onPasscodeSuccess: handlePasscodeSuccess
      }}
    >
      {children}
    </authContext.Provider>
  );
};
