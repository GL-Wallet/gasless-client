import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';

import { authContext } from '../model/auth-context';
import { useAuthStore } from '../model/store';
import { AuthParams, AuthPromiseCallback } from '../model/types';
import { getHashedPasscodeFromStorage } from '../utils/getHashedPasscodeFromStorage';
import { savePasscodeHash } from '../utils/savePasscodeHash';

const actions = ['setup', 'startup', 'required', 'update'].map((action) => `/passcode-${action}`);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const setAuthStore = useAuthStore((store) => store.set);

  const { passcode, passcodeHash, requiresSetup, isAuthenticated, resetStore } = useAuthStore((store) => ({
    passcode: store.passcode,
    passcodeHash: store.hashedPasscode,
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
      await savePasscodeHash(enteredPasscode);

      try {
        setAuthStore({
          requiresSetup: false,
          isAuthenticated: true,
          passcode: enteredPasscode
        });

        navigate(
          authConfigRef.current?.redirectTo ??
            (actions.includes(returnPathRef.current) ? ROUTES.HOME : returnPathRef.current),
          { replace: true }
        );
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
        const hashedPasscode = await getHashedPasscodeFromStorage();

        if (hashedPasscode) {
          setAuthStore({ hashedPasscode, requiresSetup: false });
        } else {
          setAuthStore({ requiresSetup: true });
        }
      } catch (error) {
        console.error('Error fetching passcode:', error);
        setAuthStore({ requiresSetup: true });
      }
    };

    initializePasscode();
  }, [passcodeHash, setAuthStore]);

  return (
    <authContext.Provider
      value={{
        authenticate,
        resetAuth: resetStore,
        passcode,
        authenticated: isAuthenticated,
        _passcodeHash: passcodeHash,
        _onPasscodeSuccess: handlePasscodeSuccess
      }}
    >
      {children}
    </authContext.Provider>
  );
};
