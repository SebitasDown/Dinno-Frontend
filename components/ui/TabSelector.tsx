import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';


// Definimos los props que van a recibir
interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const TabSelector = ({
    tabs, 
    activeTab, 
    onTabChange
}: TabSelectorProps) => {
    const { colors: themeColors, isDark } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: isDark ? themeColors.background : '#E1E8ED' }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab, 
                            isActive && [styles.activeTab, { backgroundColor: isDark ? themeColors.inputSurface : themeColors.primary }]
                        ]}
                        onPress={() => onTabChange(tab)}
                    >
                        <Text style={[
                            styles.tabText, 
                            { color: isDark ? themeColors.subtleText : '#64748B' },
                            isActive && { color: isDark ? themeColors.text : '#FFFFFF' }
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8
    },
    activeTab: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
    },
});