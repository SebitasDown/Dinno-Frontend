import { useAppTheme } from '@/hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DinnoLogo } from '../ui/DinnoLogo';
import { Typography } from '../ui/Typography';

interface InsightBoxProps {
  type: 'dinno' | 'impact';
  text: string;
}

export const InsightBox = ({ type, text }: InsightBoxProps) => {
  const isDinno = type === 'dinno';
  const { colors: themeColors, isDark } = useAppTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? themeColors.inputSurface : '#EBF8FF', // Light blue from image
        borderColor: isDark ? themeColors.inputBorder : '#BEE3F8'     // Subtle blue border
      },
    ]}>
      <View style={styles.iconContainer}>
        {isDinno ? (
          <View style={styles.dinnoIconBox}>
            <DinnoLogo scale={0.25} />
          </View>
        ) : (
          <View style={[styles.impactIconBox, { backgroundColor: themeColors.primary + '20' }]}>
            <MaterialCommunityIcons name="flash" size={16} color={themeColors.primary} />
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Typography variant="body" style={{ 
          fontSize: 14, 
          fontWeight: '700', 
          color: isDinno ? themeColors.text : themeColors.primary,
          marginBottom: 2
        }}>
          {isDinno ? 'Análisis de Dinno' : 'Análisis de impacto'}
        </Typography>
        <Typography variant="body" style={{ color: themeColors.subtleText }}>{text}</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  iconContainer: {
    marginRight: 12,
  },
  dinnoIconBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
