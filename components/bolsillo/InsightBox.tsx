import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface InsightBoxProps {
  type: 'dinno' | 'impact';
  text: string;
}

export const InsightBox = ({ type, text }: InsightBoxProps) => {
  const isDinno = type === 'dinno';
  
  return (
    <View style={[styles.container, isDinno ? styles.borderDinno : styles.borderImpact]}>
      <View style={styles.iconContainer}>
        {isDinno ? (
          <View style={styles.dinnoIconBox}>
             <MaterialCommunityIcons name="robot" size={16} color={Colors.dark.primary} />
          </View>
        ) : (
          <View style={styles.impactIconBox}>
             <MaterialCommunityIcons name="flash" size={16} color={Colors.dark.primary} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isDinno ? styles.titleDinno : styles.titleImpact]}>
          {isDinno ? 'Análisis de Dinno' : 'Análisis de impacto'}
        </Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.dark.inputSurface,
    borderWidth: 1,
    marginBottom: 24,
  },
  borderDinno: {
    borderColor: Colors.dark.inputBorder,
  },
  borderImpact: {
    borderColor: Colors.dark.primary,
  },
  iconContainer: {
    marginRight: 12,
  },
  dinnoIconBox: {
    width: 32,
    height: 32,
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactIconBox: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(249, 160, 97, 0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  titleDinno: {
    color: Colors.dark.text,
  },
  titleImpact: {
    color: Colors.dark.primary,
  },
  text: {
    fontSize: 13,
    color: Colors.dark.subtleText,
    lineHeight: 18,
  },
});
