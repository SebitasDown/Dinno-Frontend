import { Colors } from '@/constants/Colors';
import { useWalletStore } from '@/store/walletStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const MainBalanceCard = () => {
  const summary = useWalletStore((state) => state.summary);
  const loading = useWalletStore((state) => state.isLoadingSummary);
  const fetchSummary = useWalletStore((state) => state.fetchSummary);

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saldo disponible</Text>

      {loading ? (
        <ActivityIndicator size="small" color={Colors.dark.primary} style={{ marginBottom: 20 }} />
      ) : (
        <Text style={styles.balance}>{summary ? formatCOP(summary.balance) : '$0'}</Text>
      )}

      <View style={styles.pillsContainer}>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="arrow-top-right" size={16} color={Colors.dark.primary} />
          <Text style={styles.pillText}>{summary ? formatCOP(summary.totalIncome) : '$0'}</Text>
        </View>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="arrow-bottom-right" size={16} color={Colors.dark.subtleText} />
          <Text style={styles.pillText}>{summary ? formatCOP(summary.totalExpense) : '$0'}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${summary ? summary.monthProgress : 0}%` }]} />
        </View>
        <Text style={styles.progressText}>{summary ? Math.round(summary.monthProgress) : 0}% del mes restante</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.inputSurface,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    color: Colors.dark.subtleText,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  balance: {
    color: Colors.dark.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  pillText: {
    color: Colors.dark.text,
    fontWeight: '600',
    fontSize: 13,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  progressText: {
    color: Colors.dark.subtleText,
    fontSize: 12,
  },
});
