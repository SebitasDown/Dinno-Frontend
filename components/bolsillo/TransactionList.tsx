import { useWalletStore } from '@/store/walletStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatCOP } from './MainBalanceCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from '../ui/Typography';

export const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const map: Record<string, { name: any, color: string }> = {
    'alimentacion': { name: 'food', color: '#FF8C67' },
    'comida': { name: 'food', color: '#FF8C67' },
    'transporte': { name: 'car', color: '#57A6A1' },
    'vivienda': { name: 'home', color: '#7E63B8' },
    'servicios': { name: 'flash', color: '#F4D35E' },
    'salud': { name: 'medical-bag', color: '#EE6C4D' },
    'educacion': { name: 'book-open-variant', color: '#2F80ED' },
    'entretenimiento': { name: 'movie', color: '#F25C54' },
    'compras': { name: 'cart', color: '#43AA8B' },
    'ahorro': { name: 'piggy-bank', color: '#1498B0' },
    'nomina': { name: 'bank', color: '#27AE60' },
    'freelance': { name: 'laptop', color: '#4F5D75' },
    'inversiones': { name: 'trending-up', color: '#118AB2' },
    'regalos': { name: 'gift', color: '#EF476F' },
    'otros': { name: 'dots-horizontal', color: '#707070' },
  };

  return map[normalized] || { name: 'cash', color: '#707070' };
};

const formatDateDayMonth = (dateString?: string) => {
  if (!dateString) return 'Hoy';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};

export const TransactionList = () => {
  const router = useRouter();
  const { colors: themeColors } = useAppTheme();
  const transactions = useWalletStore((state) => state.recentTransactions);
  const loading = useWalletStore((state) => state.isLoadingTransactions);
  const fetchTransactions = useWalletStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700' }}>Transacciones recientes</Typography>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.primary + '20' }]} 
          onPress={() => router.push('/nuevo-movimiento')}
        >
          <MaterialCommunityIcons name="plus" size={14} color={themeColors.primary} />
          <Typography variant="body" style={{ color: themeColors.primary, fontSize: 12, fontWeight: '600' }}>Añadir</Typography>
        </TouchableOpacity>
      </View>

      {loading && transactions.length === 0 ? (
        <ActivityIndicator color={themeColors.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.list}>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            // Background suave para el icono: Verde traslúcido para ingresos, Pizarra muy suave para gastos
            const catInfo = getCategoryIcon(tx.category);
            const iconBg = catInfo.color + '15';

            return (
              <View key={tx.id || Math.random().toString()} style={[styles.transactionItem, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder }]}>
                <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                  <MaterialCommunityIcons name={catInfo.name} size={22} color={catInfo.color} />
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Typography variant="body" style={{ fontSize: 14, fontWeight: '700', color: themeColors.text }}>{tx.description}</Typography>
                    {tx.isFixed && (
                      <View style={[styles.fixedBadge, { backgroundColor: themeColors.primary + '20' }]}>
                        <Typography variant="body" style={{ fontSize: 9, fontWeight: 'bold', color: themeColors.primary }}>FIJO</Typography>
                      </View>
                    )}
                  </View>
                  <Typography variant="body" style={{ fontSize: 12, color: themeColors.subtleText }}>{formatDateDayMonth(tx.createdAt)}</Typography>
                </View>
                <Typography variant="body" style={[styles.amount, { color: isIncome ? '#4CAF50' : themeColors.text }]}>
                  {isIncome ? '+' : '-'}{formatCOP(tx.amount)}
                </Typography>
              </View>
            );
          })}
          {transactions.length === 0 && (
            <Typography variant="body" style={{ color: themeColors.subtleText, textAlign: 'center', marginTop: 10 }}>No hay movimientos recientes</Typography>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  list: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  fixedBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
