import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useWalletStore } from '@/store/walletStore';
import { getCategoryIcon } from './TransactionList';
import { formatCOP } from './MainBalanceCard';

export const CategoryGrid = () => {
  const categories = useWalletStore(state => state.categories);
  const loading = useWalletStore(state => state.isLoadingCategories);
  const fetchCategories = useWalletStore(state => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>GASTOS POR CATEGORÍA</Text>
      
      {loading && categories.length === 0 ? (
         <ActivityIndicator color={Colors.dark.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.grid}>
          {categories.map((cat) => (
            <View key={cat.category} style={styles.card}>
              <Text style={styles.icon}>{getCategoryIcon(cat.category)}</Text>
              <Text style={styles.name} numberOfLines={1}>{cat.category}</Text>
              <Text style={styles.amount}>{formatCOP(cat.amount)}</Text>
            </View>
          ))}
          {categories.length === 0 && (
             <Text style={{color: Colors.dark.subtleText, width: '100%', textAlign: 'center'}}>No hay gastos registrados en el mes</Text>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.subtleText,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    backgroundColor: Colors.dark.inputSurface,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.primary,
  },
});
