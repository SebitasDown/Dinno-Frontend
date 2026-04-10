import { create } from 'zustand';
import { walletService, transactionService, WalletSummary, WalletProjection, Transaction, CategorySummary } from '@/services/walletService';

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
}

export const useWalletStore = create<WalletState>((set, get) => ({
  summary: null,
  projection: null,
  recentTransactions: [],
  categories: [],
  isLoadingSummary: false,
  isLoadingProjection: false,
  isLoadingTransactions: false,
  isLoadingCategories: false,

  fetchSummary: async () => {
    // Si ya hay datos, evitamos mostrar el spinner de carga inicial
    if (!get().summary) {
      set({ isLoadingSummary: true });
    }
    
    try {
      const data = await walletService.getSummary();
      set({ summary: data });
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
      // Se muestran todas, incluso si están en 0
      set({ categories: data.sort((a,b) => b.amount - a.amount) });
    } catch (error) {
      console.log('Error al cargar categorias en store');
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  clearWalletData: () => {
    set({ summary: null, projection: null, recentTransactions: [], categories: [] });
  }
}));
