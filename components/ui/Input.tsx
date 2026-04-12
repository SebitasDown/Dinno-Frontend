import { Eye, EyeOff, FileText, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

const ICON_MAP = {
  Mail,
  Lock,
  User,
  FileText,
};

export type IconName = keyof typeof ICON_MAP;

interface InputProps extends Omit<TextInputProps, 'style'> {
  iconName?: IconName; // Icono izquierdo
  isPassword?: boolean; // Para ocultar texto
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<InputProps> = ({
  iconName,
  isPassword = false,
  placeholder,
  style,
  inputStyle,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { colors: themeColors } = useAppTheme();

  // Función para renderizar el icono izquierdo dinámicamente
  const renderLeftIcon = () => {
    if (!iconName) return null;
    const IconComponent = ICON_MAP[iconName];
    return (
      <View style={styles.iconContainer}>
        <IconComponent
          color={themeColors.subtleText}
          size={22}
          strokeWidth={1.5}
        />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (!isPassword) return null;
    const EyeIcon = passwordVisible ? EyeOff : Eye;
    return (
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.rightIconContainer}>
        <EyeIcon
          color={themeColors.subtleText}
          size={22}
          strokeWidth={1.5}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {
      backgroundColor: themeColors.inputSurface,
      borderColor: themeColors.inputBorder,
    }, style]}>
      {renderLeftIcon()}

      <TextInput
        style={[styles.textInput, { color: themeColors.text }, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={themeColors.subtleText}
        secureTextEntry={isPassword && !passwordVisible}
        selectionColor={themeColors.primary}
        autoCapitalize="none"
        {...rest}
      />
      {renderRightIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
});