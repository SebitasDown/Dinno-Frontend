import { useAuthStore } from '@/store/authStore';
import { api } from './api';

// Helper para decodificar JWT de forma segura en React Native (base64url aware)
export const decodeJWT = (token: string | null): any => {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const decoded = atob(base64);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
};

const getIAHeaders = () => {
    const token = useAuthStore.getState().token;
    const decoded = decodeJWT(token);
    const userId = decoded?.sub || '';
    
    console.log('--- IA SERVICE: Sending User ID (Ready for UUID):', userId);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-User-ID': userId
        }
    };
};

export const iaService = {
    getDailyInsight: async () => {
        const response = await api.get('/api/wallet/daily-insight', getIAHeaders());
        return response.data;
    },

    getPurchaseImpact: async () => {
        const response = await api.get('/api/wallet/purchase-impact', getIAHeaders());
        return response.data;
    }
};
