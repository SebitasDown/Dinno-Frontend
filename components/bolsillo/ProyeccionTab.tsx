import React from 'react';
import { View } from 'react-native';
import { ProjectionCard } from './ProjectionCard';
import { InsightBox } from './InsightBox';

export const ProyeccionTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <ProjectionCard />
      <InsightBox 
        type="impact"
        text="Si realizas la compra de $199, tu margen caería a $221.52 — un 47% menos."
      />
    </View>
  );
};
