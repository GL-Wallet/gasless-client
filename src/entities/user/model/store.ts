import { createUser as createUserQuery, getUser as getUserQuery } from './queries';
import { User as TelegramUser } from '@telegram-apps/sdk-react';
import { CreateUser, User } from './types';
import { create } from 'zustand';

type State = {
  user: User | null;
  loading: boolean;
};

type Actions = {
  loadUser(telegramUser: TelegramUser, referrerId?: string): Promise<void>;
  createUser(data: CreateUser): Promise<void>;
};

const initialState: State = {
  user: null,
  loading: false
};

export const useUserStore = create<State & Actions>((set) => ({
  ...initialState,

  async loadUser(telegramUser, referrerId) {
    set({ loading: true });

    try {
      const existingUser = await getUserQuery();

      if (existingUser) {
        set({ user: existingUser });
      } else {
        const newUserData: CreateUser = {
          name: [telegramUser.firstName, telegramUser.lastName].join(' ').trim(),
          referrerId
        };
        const newUser = await createUserQuery(newUserData);
        set({ user: newUser });
      }
    } finally {
      set({ loading: false });
    }
  },

  async createUser(data) {
    set({ loading: true });

    try {
      const newUser = await createUserQuery(data);
      set({ user: newUser });
    } catch (error) {
      throw new Error('Error creating user');
    } finally {
      set({ loading: false });
    }
  }
}));
