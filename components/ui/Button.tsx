import React from 'react';
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    useColorScheme,
    View,
    Text
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    label: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    isLoading = false,
    variant = 'primary'
}) => {
    const theme = useColorScheme() ?? 'dark';
    const themeColors = Colors[theme as keyof typeof Colors] || Colors.dark;
    const isPrimary = variant === 'primary';
    
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            style={[
                styles.container,
                {
                    backgroundColor: isPrimary ? themeColors.primary : 'transparent',
                    borderColor: isPrimary ? 'transparent' : themeColors.subtleText,
                    borderWidth: isPrimary ? 0 : 1,
                }         
            ]}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? '#1A1C1E' : themeColors.primary} />
            ) : (
                <View style={styles.content}>
                    <Text style={[styles.label, { color: isPrimary ? '#1A1C1E' : themeColors.primary }]}>
                        {label}
                    </Text>
                    <ArrowRight
                        color={isPrimary ? '#1A1C1E' : themeColors.primary}
                        size={20}
                        strokeWidth={1.5}
                        style={styles.icon}
                    />
                </View>
            )}
        </TouchableOpacity>
    )
}
    
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
    }
});
