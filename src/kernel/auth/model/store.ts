import { create } from 'zustand';

import { Passcode } from './types';

type State = {
  passcode: Passcode;
  passcodeHash: string | null;
  requiresSetup: boolean;
  isAuthenticated: boolean;
};

type Actions = {
  set(data: Partial<State>): void;
  resetStore(): void;
};

const initialState: State = {
  passcode: null,
  passcodeHash: null,
  requiresSetup: true,
  isAuthenticated: false
};

export const getPasscode = () => useAuthStore.getState().passcode;

export const useAuthStore = create<State & Actions>((set) => ({
  ...initialState,

  set(data) {
    set((state) => ({ ...state, ...data }));
  },

  resetStore() {
    set(initialState);
  }
}));
