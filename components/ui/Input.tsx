import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react-native';

const ICON_MAP = {
  Mail,
  Lock,
  User,
};

export type IconName = keyof typeof ICON_MAP;

import { StyleProp, ViewStyle, TextStyle } from 'react-native';

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
    const theme = useColorScheme() ?? 'dark';
    const themeColors = Colors[theme as keyof typeof Colors] || Colors.dark;

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