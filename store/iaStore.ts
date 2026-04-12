import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { iaService, decodeJWT } from '@/services/iaService';
import * as SecureStore from 'expo-secure-store';

interface IAState {
    dailyInsight: {
        insight: string;
        categories: any[];
    } | null;
    purchaseImpact: {
        analysis: string;
        currentMargin: string;
    } | null;
    isLoadingDaily: boolean;
    isLoadingImpact: boolean;
    currentUserId: string | null;
    lastFetchDaily: number | null;
    lastFetchImpact: number | null;
    fetchDailyInsight: (force?: boolean) => Promise<void>;
    fetchPurchaseImpact: (force?: boolean) => Promise<void>;
    loadIAData: () => Promise<void>;
    resetIAData: () => void;
}

const IA_CACHE_KEY = 'ia_cache_data';
const REFRESH_THRESHOLD = 3 * 60 * 60 * 1000; // 3 hours in ms

export const useIAStore = create<IAState>((set, get) => ({
    dailyInsight: null,
    purchaseImpact: null,
    isLoadingDaily: false,
    isLoadingImpact: false,
    currentUserId: null,
    lastFetchDaily: null,
    lastFetchImpact: null,

    loadIAData: async () => {
        try {
            const stored = await SecureStore.getItemAsync(IA_CACHE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                set({
                    dailyInsight: data.dailyInsight || null,
                    purchaseImpact: data.purchaseImpact || null,
                    currentUserId: data.currentUserId || null,
                    lastFetchDaily: data.lastFetchDaily || null,
                    lastFetchImpact: data.lastFetchImpact || null,
                });
            }
        } catch (e) {
            console.error('Error loading IA cache:', e);
        }
    },

    fetchDailyInsight: async (force = false) => {
        const token = useAuthStore.getState().token;
        const decoded = decodeJWT(token);
        const userId = decoded?.sub || null;
        const now = Date.now();
        
        const shouldRefresh = force || 
                             !get().dailyInsight || 
                             userId !== get().currentUserId || 
                             !get().lastFetchDaily || 
                             (now - (get().lastFetchDaily || 0)) > REFRESH_THRESHOLD;

        if (!shouldRefresh) return;

        // Si el usuario cambió, resetear
        if (userId !== get().currentUserId) {
            set({ dailyInsight: null, purchaseImpact: null, currentUserId: userId, lastFetchDaily: null, lastFetchImpact: null });
        }

        set({ isLoadingDaily: true });
        try {
            const response = await iaService.getDailyInsight();
            if (response.success) {
                const newState = { 
                    dailyInsight: response.data, 
                    currentUserId: userId, 
                    lastFetchDaily: now 
                };
                set(newState);
                
                // Persistir
                const current = await SecureStore.getItemAsync(IA_CACHE_KEY);
                const cache = current ? JSON.parse(current) : {};
                await SecureStore.setItemAsync(IA_CACHE_KEY, JSON.stringify({ ...cache, ...newState }));
            }
        } catch (error: any) {
            console.error('Error fetching daily insight:', error.message);
        } finally {
            set({ isLoadingDaily: false });
        }
    },

    fetchPurchaseImpact: async (force = false) => {
        const token = useAuthStore.getState().token;
        const decoded = decodeJWT(token);
        const userId = decoded?.sub || null;
        const now = Date.now();

        const shouldRefresh = force || 
                             !get().purchaseImpact || 
                             userId !== get().currentUserId || 
                             !get().lastFetchImpact || 
                             (now - (get().lastFetchImpact || 0)) > REFRESH_THRESHOLD;

        if (!shouldRefresh) return;

        if (userId !== get().currentUserId) {
            set({ dailyInsight: null, purchaseImpact: null, currentUserId: userId, lastFetchDaily: null, lastFetchImpact: null });
        }

        set({ isLoadingImpact: true });
        try {
            const response = await iaService.getPurchaseImpact();
            if (response.success) {
                const newState = { 
                    purchaseImpact: response.data, 
                    currentUserId: userId, 
                    lastFetchImpact: now 
                };
                set(newState);

                const current = await SecureStore.getItemAsync(IA_CACHE_KEY);
                const cache = current ? JSON.parse(current) : {};
                await SecureStore.setItemAsync(IA_CACHE_KEY, JSON.stringify({ ...cache, ...newState }));
            }
        } catch (error: any) {
            console.error('Error fetching purchase impact:', error.message);
        } finally {
            set({ isLoadingImpact: false });
        }
    },

    resetIAData: () => {
        set({ dailyInsight: null, purchaseImpact: null, isLoadingDaily: false, isLoadingImpact: false, currentUserId: null, lastFetchDaily: null, lastFetchImpact: null });
        SecureStore.deleteItemAsync(IA_CACHE_KEY);
    }
}));
