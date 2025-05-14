import type { Settings } from './types'

import { cloudStorageService } from '@/kernel/cloud-storage'
import i18n from '@/shared/lib/i18n'

import { create } from 'zustand'
import { USER_STORAGE_KEY } from '../constants'
import { settingsSchema } from './schema'

type State = Settings

interface Actions {
  loadSettings: () => Promise<void>
  updateSettings: (data: Partial<State>) => void
  updateLanguage: (language: string | undefined) => void
  resetStore: (keep?: Partial<State>) => void
}

const initialState: State = {
  isBiometryEnabled: false,
  isNewest: true,
  language: undefined,
}

export const useAppSettingsStore = create<State & Actions>((set, get) => ({
  ...initialState,

  async loadSettings() {
    const { updateLanguage } = get()

    try {
      const rawDataFromCloudStorage = await cloudStorageService.get<Settings>(USER_STORAGE_KEY)
      const data = settingsSchema.parse(rawDataFromCloudStorage)

      updateLanguage(data.language)

      set(data)
    }
    catch {
      set({ ...initialState })
    }
  },

  updateLanguage(language) {
    if (language)
      i18n.changeLanguage(language)
  },

  updateSettings(data) {
    set((state) => {
      return { ...state, ...data }
    })
  },

  resetStore(keep) {
    set({ ...initialState, ...keep })
  },
}))

useAppSettingsStore.subscribe(async (state) => {
  await cloudStorageService.set(USER_STORAGE_KEY, state)
})
