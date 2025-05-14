/* eslint-disable ts/no-use-before-define */
import type { Passcode } from './types'

import { create } from 'zustand'

interface State {
  passcode: Passcode
  hashedPasscode: string | null
  requiresSetup: boolean
  isAuthenticated: boolean
}

interface Actions {
  set: (data: Partial<State>) => void
  resetStore: () => void
}

const initialState: State = {
  passcode: null,
  hashedPasscode: null,
  requiresSetup: true,
  isAuthenticated: false,
}

export const getPasscode = () => useAuthStore.getState().passcode

export const useAuthStore = create<State & Actions>(set => ({
  ...initialState,

  set(data) {
    set(state => ({ ...state, ...data }))
  },

  resetStore() {
    set(initialState)
  },
}))
