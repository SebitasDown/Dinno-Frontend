import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export type AuthMode = 'login' | 'register';

interface AuthTabsProps {
    activeMode: AuthMode;
    onChangeMode: (mode: AuthMode) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
    activeMode,
    onChangeMode
}) => {
    const theme = useColorScheme() ?? 'dark';
    const themeColors = Colors[theme as keyof typeof Colors] || Colors.dark;
 
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeMode === 'login' && { backgroundColor: themeColors.primary }
                ]}
                onPress={() => onChangeMode('login')}
            >
                <Text
                    style={[
                        styles.tabText,
                        { color: activeMode === 'login' ? '#1A1C1E' : themeColors.subtleText }
                    ]}
                >
                    Iniciar sesión
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.tab,
                    activeMode === 'register' && { backgroundColor: themeColors.primary }
                ]}
                onPress={() => onChangeMode('register')}
            >
                <Text
                    style={[
                        styles.tabText,
                        { color: activeMode === 'register' ? '#1A1C1E' : themeColors.subtleText }
                    ]}
                >
                    Registrarse
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
        width: '100%'
    },
    tab: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    }
});