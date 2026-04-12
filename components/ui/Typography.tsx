import React from 'react';
import { Text, TextStyle, TextProps, StyleProp } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'button' | 'placeholder';

export interface TypographyProps extends TextProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  style,
  color,
  ...rest
}) => {
  const { theme, colors: themeColors } = useAppTheme();

  // Definimos estilos basados en el diseño
  const baseStyle: TextStyle = {
    color: color ?? themeColors.text, // Usar el color del tema si no se pasa uno
    includeFontPadding: false,
  };

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { fontSize: 28, fontWeight: '800' };
      case 'h2':
        return { fontSize: 20, fontWeight: '700' };
      case 'h3':
        return { fontSize: 18, fontWeight: '600' };
      case 'subtitle':
        return { fontSize: 16, color: themeColors.subtleText, fontWeight: '400' };
      case 'body':
        return { fontSize: 14 };
      case 'button':
        return { fontSize: 16, fontWeight: '600', color: theme === 'dark' ? '#1A1C1E' : '#FFFFFF' };
      case 'placeholder':
        return { fontSize: 14, color: themeColors.subtleText };
      default:
        return {};
    }
  };

  return <Text style={[baseStyle, getVariantStyle(), style]} {...rest}>{children}</Text>;
};