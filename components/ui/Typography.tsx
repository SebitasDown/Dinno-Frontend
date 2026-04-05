import React from 'react';
import { Text, TextStyle, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'button' | 'placeholder';

interface TypographyProps {
    children: React.ReactNode;
    variant?: TypographyVariant;
    style?: TextStyle | TextStyle[];
    color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    style,
    color,
}) => {
    const theme = useColorScheme() ?? 'dark';
    const themeColors = Colors[theme as keyof typeof Colors];

  // Definimos estilos basados en el diseño
  const baseStyle: TextStyle = {
    color: color ?? themeColors.text, // Usar el color del tema si no se pasa uno
    includeFontPadding: false,
  };

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1': 
        return { fontSize: 36, fontWeight: '800', textAlign: 'center' };
      case 'h2': 
        return { fontSize: 28, fontWeight: '700' };
      case 'h3': 
        return { fontSize: 22, fontWeight: '600' };
      case 'subtitle': 
        return { fontSize: 16, color: themeColors.subtleText, textAlign: 'center', fontWeight: '400' };
      case 'body': 
        return { fontSize: 16 };
      case 'button': 
        return { fontSize: 18, fontWeight: '600', color: theme === 'dark' ? '#1A1C1E' : '#FFFFFF' };
      case 'placeholder': 
        return { fontSize: 16, color: themeColors.subtleText };
      default:
        return {};
    }
  };

  return <Text style={[baseStyle, getVariantStyle(), style]}>{children}</Text>;
};