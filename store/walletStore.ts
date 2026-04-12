import { create } from 'zustand';
import { walletService, transactionService, WalletSummary, WalletProjection, Transaction, CategorySummary } from '@/services/walletService';
import * as SecureStore from 'expo-secure-store';

interface WalletState {
  summary: WalletSummary | null;
  projection: WalletProjection | null;
  recentTransactions: Transaction[];
  categories: CategorySummary[];
  isLoadingSummary: boolean;
  isLoadingProjection: boolean;
  isLoadingTransactions: boolean;
  isLoadingCategories: boolean;
  
  fetchSummary: () => Promise<void>;
  fetchProjection: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearWalletData: () => void;
  loadWalletData: () => Promise<void>;
}

const WALLET_CACHE_KEY = 'wallet_cache_data';

export const useWalletStore = create<WalletState>((set, get) => ({
  summary: null,
  projection: null,
  recentTransactions: [],
  categories: [],
  isLoadingSummary: false,
  isLoadingProjection: false,
  isLoadingTransactions: false,
  isLoadingCategories: false,

  loadWalletData: async () => {
    try {
      const stored = await SecureStore.getItemAsync(WALLET_CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          summary: data.summary || null,
          projection: data.projection || null,
          recentTransactions: data.recentTransactions || [],
          categories: data.categories || []
        });
      }
    } catch (e) {
      console.error('Error loading wallet cache:', e);
    }
  },

  fetchSummary: async () => {
    if (!get().summary) {
      set({ isLoadingSummary: true });
    }
    
    try {
      const data = await walletService.getSummary();
      set({ summary: data });
      
      // Persistir
      const current = await SecureStore.getItemAsync(WALLET_CACHE_KEY);
      const cache = current ? JSON.parse(current) : {};
      await SecureStore.setItemAsync(WALLET_CACHE_KEY, JSON.stringify({ ...cache, summary: data }));
    } catch (error) {
      console.log('Error al cargar summary en store');
    } finally {
      set({ isLoadingSummary: false });
    }
  },

  fetchProjection: async () => {
    if (!get().projection) {
      set({ isLoadingProjection: true });
    }
    
    try {
      const data = await walletService.getProjection();
      set({ projection: data });

      const current = await SecureStore.getItemAsync(WALLET_CACHE_KEY);
      const cache = current ? JSON.parse(current) : {};
      await SecureStore.setItemAsync(WALLET_CACHE_KEY, JSON.stringify({ ...cache, projection: data }));
    } catch (error) {
      console.log('Error al cargar projection en store');
    } finally {
      set({ isLoadingProjection: false });
    }
  },

  fetchTransactions: async () => {
    if (get().recentTransactions.length === 0) {
      set({ isLoadingTransactions: true });
    }
    
    try {
      const data = await transactionService.getRecentTransactions();
      set({ recentTransactions: data });

      const current = await SecureStore.getItemAsync(WALLET_CACHE_KEY);
      const cache = current ? JSON.parse(current) : {};
      await SecureStore.setItemAsync(WALLET_CACHE_KEY, JSON.stringify({ ...cache, recentTransactions: data }));
    } catch (error) {
      console.log('Error al cargar transacciones en store');
    } finally {
      set({ isLoadingTransactions: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length === 0) {
      set({ isLoadingCategories: true });
    }
    try {
      const data = await transactionService.getCategorySummary();
      const sorted = data.sort((a,b) => b.amount - a.amount);
      set({ categories: sorted });

      const current = await SecureStore.getItemAsync(WALLET_CACHE_KEY);
      const cache = current ? JSON.parse(current) : {};
      await SecureStore.setItemAsync(WALLET_CACHE_KEY, JSON.stringify({ ...cache, categories: sorted }));
    } catch (error) {
      console.log('Error al cargar categorias en store');
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  clearWalletData: async () => {
    set({ summary: null, projection: null, recentTransactions: [], categories: [] });
    await SecureStore.deleteItemAsync(WALLET_CACHE_KEY);
  }
}));
