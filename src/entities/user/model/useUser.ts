import { useUserStore } from './store';

export const useUser = () => {
  const user = useUserStore((store) => store.user);

  return user;
};
