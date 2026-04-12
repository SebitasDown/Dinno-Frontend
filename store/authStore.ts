import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { useWalletStore } from './walletStore';
import { useIAStore } from './iaStore';
import { useUserStore } from './userStore';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  setTokens: async (token: string, refreshToken: string) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ token, refreshToken });
  },
  logout: async () => {
    // Limpiar storage
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    
    // Limpiar todos los stores
    await useWalletStore.getState().clearWalletData();
    await useIAStore.getState().resetIAData();
    await useUserStore.getState().clearProfile();
    
    set({ token: null, refreshToken: null });
  },
}));

// Helper function to load token on app boot
export const loadTokenFromStorage = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (token || refreshToken) {
    useAuthStore.setState({ token, refreshToken });
  }
};
