import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export type AuthMode = 'login' | 'register';

interface AuthTabsProps {
    activeMode: AuthMode;
    onChangeMode: (mode: AuthMode) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
    activeMode,
    onChangeMode
}) => {
    const { colors: themeColors, theme } = useAppTheme();

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
                        { color: activeMode === 'login' ? (theme === 'dark' ? '#1A1C1E' : '#FFFFFF') : themeColors.subtleText }
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
                        { color: activeMode === 'register' ? (theme === 'dark' ? '#1A1C1E' : '#FFFFFF') : themeColors.subtleText }
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