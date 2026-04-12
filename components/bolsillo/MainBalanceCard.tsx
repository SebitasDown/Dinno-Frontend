import { useWalletStore } from '@/store/walletStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from '../ui/Typography';
import { LinearGradient } from 'expo-linear-gradient';

export const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const MainBalanceCard = () => {
  const { colors: themeColors, isDark } = useAppTheme();
  const summary = useWalletStore((state) => state.summary);
  const loading = useWalletStore((state) => state.isLoadingSummary);
  const fetchSummary = useWalletStore((state) => state.fetchSummary);
  useEffect(() => {
    fetchSummary();
  }, []);

  const gradientColors: [string, string] = isDark 
    ? [themeColors.inputSurface, themeColors.inputSurface] 
    : ['#1498B0', '#42B7B0']; // Teal/Cyan from image

  return (
    <LinearGradient 
      colors={gradientColors} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      style={[styles.container, isDark ? { borderColor: themeColors.inputBorder } : styles.containerLight]}
    >
      <Typography variant="body" style={[styles.title, !isDark ? styles.textWhite : { color: themeColors.subtleText }] as any}>Saldo disponible</Typography>

      {loading ? (
        <ActivityIndicator size="small" color={isDark ? themeColors.primary : '#FFFFFF'} style={{ alignSelf: 'flex-start', marginBottom: 20 }} />
      ) : (
        <Typography variant="h1" style={[styles.balance, !isDark ? styles.textWhite : { color: '#FFFFFF' }] as any}>
            {summary ? formatCOP(summary.balance) : '$0'}
        </Typography>
      )}

      <View style={styles.pillsContainer}>
        <View style={[styles.pill, !isDark ? styles.pillLight : { borderColor: themeColors.inputBorder }]}>
          <MaterialCommunityIcons name="arrow-top-right" size={16} color={isDark ? themeColors.primary : '#FFFFFF'} />
          <Typography variant="body" style={[styles.pillText, !isDark ? styles.textWhite : { color: themeColors.text }] as any}>
            {summary ? '+' + formatCOP(summary.totalIncome) : '$0'}
          </Typography>
        </View>
        <View style={[styles.pill, !isDark ? styles.pillLight : { borderColor: themeColors.inputBorder }]}>
          <MaterialCommunityIcons name="arrow-bottom-right" size={16} color={isDark ? '#F97316' : '#FFFFFF'} />
          <Typography variant="body" style={[styles.pillText, !isDark ? styles.textWhite : { color: themeColors.text }] as any}>
            {summary ? '-' + formatCOP(summary.totalExpense) : '$0'}
          </Typography>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBarBackground, isDark ? { backgroundColor: 'rgba(255,255,255,0.1)' } : styles.progressBackLight]}>
          <View style={[
            styles.progressBarFill, 
            { width: `${summary ? summary.monthProgress : 0}%` },
            !isDark ? styles.progressFillLight : { backgroundColor: themeColors.primary }
          ]} />
        </View>
        <Typography variant="body" style={[styles.progressText, !isDark ? styles.textWhite : { color: themeColors.subtleText }] as any}>
            {summary ? Math.round(summary.monthProgress) : 0}% del mes restante
        </Typography>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  containerLight: {
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#1498B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  balance: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  pillLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pillText: {
    fontWeight: '600',
    fontSize: 13,
  },
  progressContainer: {
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBarFill: {
    height: '100%',
  },
  progressFillLight: {
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 12,
  },
});
