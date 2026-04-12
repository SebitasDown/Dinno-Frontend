import { useAppTheme } from '@/hooks/useAppTheme';
import { useIAStore } from '@/store/iaStore';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CategoryGrid } from './CategoryGrid';
import { InsightBox } from './InsightBox';

export const ResumenTab = () => {
  const { colors: themeColors } = useAppTheme();
  const { dailyInsight, isLoadingDaily, fetchDailyInsight } = useIAStore();

  useEffect(() => {
    fetchDailyInsight();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoadingDaily ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator color={themeColors.primary} size="small" />
        </View>
      ) : (
        <InsightBox 
          type="dinno" 
          text={dailyInsight?.insight || "Analizando tus finanzas..."}
        />
      )}
      <CategoryGrid />
    </View>
  );
};
