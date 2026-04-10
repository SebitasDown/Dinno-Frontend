import React from 'react';
import { View } from 'react-native';
import { InsightBox } from './InsightBox';
import { CategoryGrid } from './CategoryGrid';

export const ResumenTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <InsightBox 
        type="dinno" 
        text="Tu gasto en ocio subió un 15% este mes. Si mantienes el ritmo, tu margen será de $420."
      />
      <CategoryGrid />
    </View>
  );
};
