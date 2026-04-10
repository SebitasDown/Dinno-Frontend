import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useWalletStore } from '@/store/walletStore';
import { formatCOP } from './MainBalanceCard';

export const getCategoryIcon = (category: string) => {
  const map: Record<string, string> = {
    'VIVIENDA': '🏠',
    'COMIDA': '🍕',
    'TRANSPORTE': '🚗',
    'OCIO': '🎮',
    'COMPRAS': '🛒',
    'NÓMINA': '💰',
    'NOMINA': '💰',
    'VENTAS': '📈',
    'INVERSIONES': '🏦',
    'REGALOS': '🎁',
    'FREELANCE': '💻',
    'OTROS': '📦'
  };
  return map[category?.toUpperCase()] || '📦';
};

const formatDateDayMonth = (dateStr?: string) => {
  if (!dateStr) return 'Reciente';
  const d = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('es-CO', { month: 'short', day: 'numeric' });
  return formatter.format(d);
};

export const TransactionList = () => {
  const router = useRouter();
  const transactions = useWalletStore((state) => state.recentTransactions);
  const loading = useWalletStore((state) => state.isLoadingTransactions);
  const fetchTransactions = useWalletStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>TRANSACCIONES RECIENTES</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/nuevo-movimiento')}>
          <MaterialCommunityIcons name="plus" size={14} color={Colors.dark.primary} />
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      {loading && transactions.length === 0 ? (
        <ActivityIndicator color={Colors.dark.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.list}>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            const iconBg = isIncome ? 'rgba(76, 175, 80, 0.1)' : Colors.dark.background;

            return (
              <View key={tx.id || Math.random().toString()} style={styles.transactionItem}>
                <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                  <Text style={styles.icon}>{getCategoryIcon(tx.category)}</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{tx.description}</Text>
                    {tx.isFixed && (
                      <View style={styles.fixedBadge}>
                        <Text style={styles.fixedText}>FIJO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.date}>{formatDateDayMonth(tx.createdAt)}</Text>
                </View>
                <Text style={[styles.amount, isIncome && styles.incomeAmount]}>
                  {isIncome ? '+' : '-'}{formatCOP(tx.amount)}
                </Text>
              </View>
            );
          })}
          {transactions.length === 0 && (
             <Text style={{color: Colors.dark.subtleText, textAlign: 'center', marginTop: 10}}>No hay movimientos recientes</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.subtleText,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 160, 97, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputSurface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
  },
  iconBox: {
    width: 40,
    height: 40,
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
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  fixedBadge: {
    backgroundColor: 'rgba(249, 160, 97, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fixedText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
  date: {
    fontSize: 12,
    color: Colors.dark.subtleText,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  incomeAmount: {
    color: '#4CAF50',
  },
});
