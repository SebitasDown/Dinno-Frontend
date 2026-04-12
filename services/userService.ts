import { useAuthStore } from '@/store/authStore';
import { api } from './api';

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const userService = {

    // Obtener información del perfil
    getProfile: async () => {
        console.log('--- SOLICITANDO PERFIL A SPRING BOOT (GET /api/users/profile) ---');
        try {
            const response = await api.get('/api/users/profile', getAuthHeaders());
            console.log('--- RESPUESTA DEL SERVIDOR (Perfil) ---', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.error(`[UserService] Error en getProfile (${status}):`, message);
            throw error;
        }
    },

    // Actualizar datos principales del perfil
    updateProfile: async (data: { name?: string; email?: string; bio?: string }) => {
        // El frontend usa 'name', pero Java espera 'fullName'. Mapeamos los datos:
        const payload = {
            fullName: data.name,
            bio: data.bio
            // Java al parecer no lee 'email' en el body según tus logs, pero si lo llegara a leer, agrégalo aquí.
        };

        console.log('--- ENVIANDO A SPRING BOOT (PUT /api/users/profile) ---');
        console.log('Payload Original:', data);
        console.log('Payload Mapeado a Java:', JSON.stringify(payload, null, 2));

        try {
            const response = await api.put('/api/users/profile', payload, getAuthHeaders());
            console.log('--- RESPUESTA DEL SERVIDOR ---', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.error(`[UserService] Error en updateProfile (${status}):`, message);
            throw error;
        }
    },

    // Actualizar configuración de apariencia
    updateAppearance: async (data: { darkMode: boolean }) => {
        console.log(`[PATCH] Cambiando Apariencia a darkMode=${data.darkMode}...`);
        try {
            await api.patch('/api/users/profile/appearance', data, getAuthHeaders());
            console.log('[PATCH] Guardado correctamente en el backend (204 No Content)');
            return true;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.error(`[UserService] Error en updateAppearance (${status}):`, message);
            throw error;
        }
    },

    // Actualizar configuración de notificaciones
    updateNotifications: async (data: { notificationsEnabled: boolean }) => {
        console.log(`[PATCH] Cambiando Notificaciones a enabled=${data.notificationsEnabled}...`);
        try {
            await api.patch('/api/users/profile/notifications', data, getAuthHeaders());
            console.log('[PATCH] Notificaciones actualizadas en el backend (204 No Content)');
            return true;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.error(`[UserService] Error en updateNotifications (${status}):`, message);
            throw error;
        }
    }
};
