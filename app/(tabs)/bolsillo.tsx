import { HeaderBolsillo } from '@/components/bolsillo/HeaderBolsillo';
import { MainBalanceCard } from '@/components/bolsillo/MainBalanceCard';
import { ResumenTab } from '@/components/bolsillo/ResumenTab';
import { GastosTab } from '@/components/bolsillo/GastosTab';
import { ProyeccionTab } from '@/components/bolsillo/ProyeccionTab';
import { TabSelector } from '@/components/ui/TabSelector';
import { useAppTheme } from '@/hooks/useAppTheme';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BolsilloScreen() {
  const { colors: themeColors } = useAppTheme();
  const [activeTab, setActiveTab] = useState('Resumen');
  const tabs = ['Resumen', 'Movimientos', 'Proyección'];
  const insets = useSafeAreaInsets();

  const renderContent = () => {
    switch (activeTab) {
      case 'Resumen': return <ResumenTab />;
      case 'Movimientos': return <GastosTab />;
      case 'Proyección': return <ProyeccionTab />;
      default: return <ResumenTab />;
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 20), backgroundColor: themeColors.background }]}>
      <View style={[styles.headerWrapper, { backgroundColor: themeColors.background }]}>
        <HeaderBolsillo />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MainBalanceCard />
        <TabSelector 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <View style={styles.tabContentContainer}>
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  tabContentContainer: {
    flex: 1,
    marginTop: 8,
  },
});