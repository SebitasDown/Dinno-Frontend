import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useWalletStore } from '@/store/walletStore';

export const ProjectionCard = () => {
  const projection = useWalletStore((state) => state.projection);
  const loading = useWalletStore((state) => state.isLoadingProjection);
  const fetchProjection = useWalletStore((state) => state.fetchProjection);

  useEffect(() => {
    // Solo hace fectch si no hay datos o si queremos forzar refresh
    fetchProjection();
  }, []);

  if (loading && !projection) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator color={Colors.dark.primary} size="large" />
      </View>
    );
  }

  // Valores por defecto en caso de fallo (o para que el usuario empiece)
  const margin = projection?.maneuverMargin || 0;
  const variation = projection?.savingsVariation || 0;
  const isPositive = variation >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PROYECCIÓN FIN DE MES</Text>
      
      <Text style={styles.mainValue}>
         ${new Intl.NumberFormat('es-CO').format(Math.abs(margin))}
      </Text>
      
      <View style={styles.warningRow}>
        <MaterialCommunityIcons 
          name={isPositive ? "trending-up" : "alert-outline"} 
          size={14} 
          color={isPositive ? Colors.dark.primary : "#F59E0B"} 
        />
        <Text style={[styles.warningText, isPositive && { color: Colors.dark.primary }]}>
          ${Math.abs(variation)} {isPositive ? 'más' : 'menos'} que la meta de ahorro
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gastos fijos restantes</Text>
          <Text style={styles.detailValue}>
            ${new Intl.NumberFormat('es-CO').format(projection?.remainingFixedExpenses || 0)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gastos variables estimados</Text>
          <Text style={styles.detailValue}>
             ${new Intl.NumberFormat('es-CO').format(projection?.estimatedVariables || 0)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Margen de maniobra</Text>
          <Text style={styles.totalValue}>
            ${new Intl.NumberFormat('es-CO').format(margin)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.inputSurface,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dark.subtleText,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.dark.subtleText,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.inputBorder,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
});
