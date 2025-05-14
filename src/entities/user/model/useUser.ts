import { useUserStore } from './store'

export function useUser() {
  const user = useUserStore(store => store.user)

  return user
}
