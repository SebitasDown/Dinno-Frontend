import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  imageUrl?: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  fetchAndSyncProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;

  // Soporte Offline-First para Ajustes
  savePendingUpdate: (key: 'darkMode' | 'notificationsEnabled', value: boolean) => Promise<void>;
  syncPendingUpdates: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  bio: '',
  notificationsEnabled: true,
  darkMode: true,
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: defaultProfile,
  setProfile: async (updates: Partial<UserProfile>) => {
    // Simula guardar en la 'base de datos interna'
    const newProfile = { ...get().profile, ...updates } as UserProfile;
    await SecureStore.setItemAsync('userProfile', JSON.stringify(newProfile));
    set({ profile: newProfile });
  },
  loadProfile: async () => {
    const stored = await SecureStore.getItemAsync('userProfile');
    if (stored) {
      set({ profile: JSON.parse(stored) });
    }
  },
  fetchAndSyncProfile: async () => {
    try {
      // 1. Intentar enviar cambios encolados sin internet antes de descargar todo de nuevo
      await get().syncPendingUpdates();

      const data = await userService.getProfile();

      // Intentar extraer el email desde el Token guardado
      let tokenEmail = '';
      const token = useAuthStore.getState().token;
      if (token) {
        try {
          const payload = token.split('.')[1];
          let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
          const decoded = atob(base64);
          const jsonPayload = JSON.parse(decoded);
          tokenEmail = jsonPayload.email || '';
        } catch (e) {
        }
      }

      // Adaptar el mapeo
      const updatedProfile: UserProfile = {
        name: data.fullName || data.name || data.username || '',
        email: data.email || tokenEmail || '',
        bio: data.bio || '',
        imageUrl: data.profilePictureUrl || undefined,
        notificationsEnabled: data.notificationsEnabled ?? true,
        darkMode: data.darkMode ?? true,
      };

      set({ profile: updatedProfile });
      await SecureStore.setItemAsync('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      // Usar caché local
    }
  },
  clearProfile: async () => {
    await SecureStore.deleteItemAsync('userProfile');
    set({ profile: null });
  },

  savePendingUpdate: async (key: 'darkMode' | 'notificationsEnabled', value: boolean) => {
    // Guarda el intento de configuración fallida para reintentar luego
    await SecureStore.setItemAsync(`pending_${key}`, value ? 'true' : 'false');
  },
  syncPendingUpdates: async () => {
    try {
      const pendingDark = await SecureStore.getItemAsync('pending_darkMode');
      if (pendingDark !== null) {
        await userService.updateAppearance({ darkMode: pendingDark === 'true' });
        await SecureStore.deleteItemAsync('pending_darkMode');
      }

      const pendingNotif = await SecureStore.getItemAsync('pending_notificationsEnabled');
      if (pendingNotif !== null) {
        await userService.updateNotifications({ notificationsEnabled: pendingNotif === 'true' });
        await SecureStore.deleteItemAsync('pending_notificationsEnabled');
      }
    } catch (e) {
      console.log('Sigue sin haber internet o backend apagado, los datos permanecen en cola...');
    }
  },
}));
