import { useWalletStore } from '@/store/walletStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from '../ui/Typography';

export const ProjectionCard = () => {
  const { colors: themeColors } = useAppTheme();
  const projection = useWalletStore((state) => state.projection);
  const loading = useWalletStore((state) => state.isLoadingProjection);
  const fetchProjection = useWalletStore((state) => state.fetchProjection);

  useEffect(() => {
    fetchProjection();
  }, []);

  if (loading && !projection) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder }]}>
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  const margin = projection?.maneuverMargin || 0;
  const variation = projection?.savingsVariation || 0;
  const isPositive = variation >= 0;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder }]}>
      <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700', letterSpacing: 0.5, marginBottom: 12 }}>
        PROYECCIÓN FIN DE MES
      </Typography>

      <Typography variant="h1" style={{ color: themeColors.text, marginBottom: 8, textAlign: 'left' }}>
        ${new Intl.NumberFormat('es-CO').format(Math.abs(margin))}
      </Typography>

      <View style={styles.warningRow}>
        <MaterialCommunityIcons
          name={isPositive ? "trending-up" : "alert-outline"}
          size={14}
          color={isPositive ? themeColors.primary : "#F59E0B"}
        />
        <Typography variant="body" style={{ fontSize: 12, color: isPositive ? themeColors.primary : "#F59E0B", fontWeight: '600' }}>
          ${Math.abs(variation)} {isPositive ? 'más' : 'menos'} que la meta de ahorro
        </Typography>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Typography variant="body" style={{ fontSize: 13, color: themeColors.subtleText }}>Gastos fijos restantes</Typography>
          <Typography variant="body" style={{ fontSize: 13, fontWeight: '700', color: themeColors.text }}>
            ${new Intl.NumberFormat('es-CO').format(projection?.remainingFixedExpenses || 0)}
          </Typography>
        </View>
        <View style={styles.detailRow}>
          <Typography variant="body" style={{ fontSize: 13, color: themeColors.subtleText }}>Gastos variables estimados</Typography>
          <Typography variant="body" style={{ fontSize: 13, fontWeight: '700', color: themeColors.text }}>
            ${new Intl.NumberFormat('es-CO').format(projection?.estimatedVariables || 0)}
          </Typography>
        </View>

        <View style={[styles.divider, { backgroundColor: themeColors.inputBorder }]} />

        <View style={styles.detailRow}>
          <Typography variant="body" style={{ fontSize: 14, fontWeight: 'bold', color: themeColors.text }}>Margen de maniobra</Typography>
          <Typography variant="body" style={{ fontSize: 14, fontWeight: 'bold', color: themeColors.primary }}>
            ${new Intl.NumberFormat('es-CO').format(margin)}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
