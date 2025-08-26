import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/types';
interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);