import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: async (token: string) => {
    await SecureStore.setItemAsync('userToken', token);
    set({ token });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ token: null });
  },
}));

// Helper function to load token on app boot
export const loadTokenFromStorage = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    useAuthStore.setState({ token });
  }
};
