import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { navigate } from 'wouter/use-browser-location';

import { authContext } from '../model/auth-context';
import { useAuthStore } from '../model/store';
import { AuthParams, AuthPromiseCallback } from '../model/types';
import { getPasscodeHash } from '../utils/getPasscodeHash';
import { savePasscodeHash } from '../utils/savePasscodeHash';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const setAuthStore = useAuthStore((store) => store.set);

  const { passcode, passcodeHash, requiresSetup, isAuthenticated, resetStore } = useAuthStore((store) => ({
    passcode: store.passcode,
    passcodeHash: store.passcodeHash,
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
      savePasscodeHash(enteredPasscode);
      
      try {
        setAuthStore({
          requiresSetup: false,
          isAuthenticated: true,
          passcode: enteredPasscode
        });

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
        const passcodeHash = await getPasscodeHash();

        if (passcodeHash) {
          setAuthStore({ passcodeHash, requiresSetup: false });
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
        authenticated: isAuthenticated,
        _passcodeHash: passcodeHash,
        _onPasscodeSuccess: handlePasscodeSuccess
      }}
    >
      {children}
    </authContext.Provider>
  );
};
