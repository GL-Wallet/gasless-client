import { create } from 'zustand';

import { cloudStorageService } from '@/kernel/cloud-storage';
import { User as TelegramUser } from '@telegram-apps/sdk-react';

import { USER_STORAGE_KEY } from '../constants';
import { createUser as createUserQuery, getUser } from './queries';
import { CreateUser, User } from './types';

type State = {
  user: User | null;
  loading: boolean;
};

type Actions = {
  loadUser(telegramUser: TelegramUser, referrerId?: string): Promise<void>;
  createUser(data: CreateUser): Promise<void>;
  resetStore(): void;
};

const initialState: State = {
  user: null,
  loading: false
};

export const useUserStore = create<State & Actions>((set, get) => ({
  ...initialState,

  async loadUser(telegramUser, referrerId) {
    set({ loading: true });

    try {
      const userFromDb = await getUser();

      if (userFromDb?.id) {
        set({ user: { id: userFromDb?.id } });
      } else {
        const { createUser } = get();
        const newUserData: CreateUser = {
          userName: telegramUser.username!,
          referrerId
        };

        await createUser(newUserData);
      }
    } catch {
      const userId = await cloudStorageService.get<string>(USER_STORAGE_KEY);
      if (userId) return set({ user: { id: userId } });
    } finally {
      set({ loading: false });
    }
  },

  // TODO: refactoring
  async createUser(data) {
    set({ loading: true });

    try {
      const newUser = await createUserQuery(data);
      if (!newUser?.id) return;

      set({ user: { id: newUser.id } });
    } catch (error) {
      throw new Error('Error creating user');
    } finally {
      set({ loading: false });
    }
  },

  resetStore() {
    set(initialState);
  }
}));

useUserStore.subscribe((state) => {
  const { user } = state;
  cloudStorageService.set(USER_STORAGE_KEY, user?.id);
});
