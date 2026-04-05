import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { AlertCircle, CheckCircle2, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AlertBoxProps {
    type: 'error' | 'success';
    message: string | null;
    onClose: () => void;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ type, message, onClose }) => {
    if (!message) return null;

    const isError = type === 'error';
    const bgColor = isError ? 'rgba(255, 76, 76, 0.15)' : 'rgba(76, 175, 80, 0.15)';
    const borderColor = isError ? 'rgba(255, 76, 76, 0.4)' : 'rgba(76, 175, 80, 0.4)';
    const iconColor = isError ? '#FF5C5C' : '#4CAF50';

    return (
        <Animated.View 
            entering={FadeIn.duration(300)} 
            exiting={FadeOut.duration(200)}
            style={[styles.container, { backgroundColor: bgColor, borderColor }]}
        >
            <View style={styles.iconWrapper}>
                {isError ? <AlertCircle color={iconColor} size={20} /> : <CheckCircle2 color={iconColor} size={20} />}
            </View>
            <View style={styles.textContainer}>
                <Typography variant="body" style={{ color: iconColor, fontSize: 14, fontWeight: '500' }}>
                    {message}
                </Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={iconColor} size={18} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 20,
        width: '100%'
    },
    iconWrapper: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    }
});
