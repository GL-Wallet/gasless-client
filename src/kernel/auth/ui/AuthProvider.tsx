import { PropsWithChildren, useCallback, useMemo, useRef } from 'react'; // Add useMemo
import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';
import { useEffectOnce } from '@/shared/hooks/useEffectOnce';

import { authContext } from '../model/auth-context';
import { useAuthStore } from '../model/store';
import { AuthParams, AuthPromiseCallback } from '../model/types';
import { getHashedPasscodeFromStorage } from '../utils/getHashedPasscodeFromStorage';
import { saveHashedPasscodeToStorage } from '../utils/savePasscodeHash';

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
      await saveHashedPasscodeToStorage(enteredPasscode);

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

  const initializePasscode = useCallback(async () => {
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
  }, [setAuthStore]);

  useEffectOnce(initializePasscode);

  const value = useMemo(() => ({
    authenticate,
    resetAuth: resetStore,
    passcode,
    authenticated: isAuthenticated,
    _passcodeHash: passcodeHash,
    _onPasscodeSuccess: handlePasscodeSuccess
  }), [authenticate, resetStore, passcode, isAuthenticated, passcodeHash, handlePasscodeSuccess]);

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};
