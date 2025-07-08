import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { UserResponse } from './interfaces/user/user.interface';

interface AuthState {
  user: UserResponse | null;
  login: (userData: UserResponse, newRepoLoginValue?: boolean) => void;
  logout: () => void;
}

// Adaptación de localStorage a PersistStorage
const localStorageAdapter: PersistStorage<AuthState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      login: (userData) =>
        set(() => ({
          user: userData,
        })),
      logout: () => set(() => ({ user: null })),
    }),
    {
      name: 'auth-store',
      storage: localStorageAdapter, // Usando el adaptador para localStorage
    }
  )
);

interface RegistrationState {
  registered: boolean;
  setRegistered: (value: boolean) => void;
  clearRegistration: () => void;
}

const localStorageAdap: PersistStorage<RegistrationState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useRegistrationStore = create(
  persist<RegistrationState>(
    (set) => ({
      registered: false,
      setRegistered: (value: boolean) => set(() => ({ registered: value })),
      clearRegistration: () => set(() => ({ registered: false })),
    }),
    {
      name: 'registration-store',
      storage: localStorageAdap,
    }
  )
);
