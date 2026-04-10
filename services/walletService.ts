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

export interface WalletSummary {
  id: string;
  userId: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthProgress: number;
}

export interface WalletProjection {
  id: string;
  balanceAtMoment: number;
  remainingFixedExpenses: number;
  estimatedVariables: number;
  targetSavings: number;
  projectionDate: string;
  maneuverMargin: number;
  savingsVariation: number;
}

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  isFixed?: boolean;
  createdAt?: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
}

export const walletService = {
  getSummary: async (): Promise<WalletSummary> => {
    console.log('--- SOLICITANDO RESUMEN BILLETERA (GET /api/wallets/summary) ---');
    try {
      const response = await api.get('/api/wallets/summary', getAuthHeaders());
      // console.log('--- RESPUESTA DEL SERVIDOR (Billetera) ---', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('--- ERROR EN PETICION GET BILLETERA ---');
      const status = error.response?.status;
      if (status === 404 || status === 502 || status === 503 || status === 401) {
        console.error('Problema en el Gateway o Token. Status:', status);
      } else {
        console.error('Mensaje de error:', error.message);
      }
      throw error;
    }
  },

  getProjection: async (): Promise<WalletProjection> => {
    console.log('--- SOLICITANDO PROYECCIÓN (GET /api/wallets/projection) ---');
    try {
      const response = await api.get('/api/wallets/projection', getAuthHeaders());
      return response.data;
    } catch (error: any) {
      console.error('Error GET /api/wallets/projection:', error.message);
      throw error;
    }
  }
};

export const transactionService = {
  registerTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    console.log('--- ENVIANDO TRANSACCIÓN (POST /api/transactions) ---', data);
    try {
      const response = await api.post('/api/transactions', data, getAuthHeaders());
      return response.data;
    } catch (error: any) {
      console.error('Error POST /api/transactions:', error.message);
      throw error;
    }
  },

  getRecentTransactions: async (): Promise<Transaction[]> => {
    console.log('--- SOLICITANDO TRANSACCIONES RECIENTES (GET /api/transactions/recent) ---');
    try {
      const response = await api.get('/api/transactions/recent', getAuthHeaders());
      return response.data;
    } catch (error: any) {
      console.error('Error GET /api/transactions/recent:', error.message);
      throw error;
    }
  },

  getCategorySummary: async (): Promise<CategorySummary[]> => {
    console.log('--- SOLICITANDO CATEGORÍAS (GET /api/transactions/categories) ---');
    try {
      const response = await api.get('/api/transactions/categories', getAuthHeaders());
      const categories: CategorySummary[] = Object.entries(response.data).map(([key, value]) => ({
        category: key,
        amount: value as number,
      }));
      return categories;
    } catch (error: any) {
      console.error('Error GET /api/transactions/categories:', error.message);
      throw error;
    }
  }
};
