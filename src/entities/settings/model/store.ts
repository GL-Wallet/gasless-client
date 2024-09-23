import { cloudStorageService } from '@/kernel/cloud-storage';
import { USER_STORAGE_KEY } from '../constants';
import { settingsSchema } from './schema';
import { create } from 'zustand';
import { Settings } from './types';

type State = Settings;

type Actions = {
  loadSettings(): Promise<void>;
  updateSettings(data: Partial<State>): void;
  resetStore(): void;
};

const initialState: State = {
  isBiometryEnabled: false
};

export const useSettingsStore = create<State & Actions>((set) => ({
  ...initialState,

  async loadSettings() {
    try {
      const rawDataFromCloudStorage = await cloudStorageService.get<Settings>(USER_STORAGE_KEY);
      const data = settingsSchema.parse(rawDataFromCloudStorage);
      set(data);
    } catch {
      set({ ...initialState });
    }
  },

  updateSettings(data) {
    set((state) => {
      return { ...state, ...data };
    });
  },

  resetStore() {
    set(initialState);
  }
}));

useSettingsStore.subscribe(async (state) => {
  await cloudStorageService.set(USER_STORAGE_KEY, state);
});
