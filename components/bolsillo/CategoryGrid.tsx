import { useWalletStore } from '@/store/walletStore';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { formatCOP } from './MainBalanceCard';
import { getCategoryIcon } from './TransactionList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from '../ui/Typography';

export const CategoryGrid = () => {
  const { colors: themeColors } = useAppTheme();
  const categories = useWalletStore(state => state.categories);
  const loading = useWalletStore(state => state.isLoadingCategories);
  const fetchCategories = useWalletStore(state => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700', marginBottom: 16 }}>
        Gastos por categoría
      </Typography>

      {loading && categories.length === 0 ? (
        <ActivityIndicator color={themeColors.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.grid}>
          {categories.map((cat) => (
            <View key={cat.category} style={[styles.card, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder }]}>
              <View style={[styles.categoryIconBox, { backgroundColor: getCategoryIcon(cat.category).color + '20' }]}>
                <MaterialCommunityIcons 
                  name={getCategoryIcon(cat.category).name} 
                  size={24} 
                  color={getCategoryIcon(cat.category).color} 
                />
              </View>
              <Typography variant="body" style={{ color: themeColors.text, fontWeight: '700', marginBottom: 4 }} numberOfLines={1}>
                {cat.category.charAt(0).toUpperCase() + cat.category.slice(1).toLowerCase()}
              </Typography>
              <Typography variant="body" style={{ color: themeColors.primary, fontWeight: '700' } as any}>
                {formatCOP(cat.amount)}
              </Typography>
            </View>
          ))}
          {categories.length === 0 && (
            <Typography variant="body" style={{ color: themeColors.subtleText, width: '100%', textAlign: 'center' }}>
              No hay gastos registrados en el mes
            </Typography>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
