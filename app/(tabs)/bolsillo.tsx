import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

import { HeaderBolsillo } from '@/components/bolsillo/HeaderBolsillo';
import { MainBalanceCard } from '@/components/bolsillo/MainBalanceCard';
import { TabSelector } from '@/components/ui/TabSelector';
import { ResumenTab } from '@/components/bolsillo/ResumenTab';
import { GastosTab } from '@/components/bolsillo/GastosTab';
import { ProyeccionTab } from '@/components/bolsillo/ProyeccionTab';

export default function BolsilloScreen() {
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
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.headerWrapper}>
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
    backgroundColor: Colors.dark.background,
  },
  headerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.dark.background,
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