import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ProjectionCard } from './ProjectionCard';
import { InsightBox } from './InsightBox';
import { useIAStore } from '@/store/iaStore';
import { Colors } from '@/constants/Colors';

export const ProyeccionTab = () => {
  const { purchaseImpact, isLoadingImpact, fetchPurchaseImpact } = useIAStore();

  useEffect(() => {
    fetchPurchaseImpact();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ProjectionCard />
      {isLoadingImpact ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator color={Colors.dark.primary} size="small" />
        </View>
      ) : (
        <InsightBox 
          type="impact"
          text={purchaseImpact?.analysis || "Evaluando el mercado para ti..."}
        />
      )}
    </View>
  );
};
