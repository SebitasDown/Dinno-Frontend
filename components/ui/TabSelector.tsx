import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';


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
    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => onTabChange(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container : {
        flexDirection: 'row',
        backgroundColor: Colors.dark.background,
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
        backgroundColor: Colors.dark.inputSurface,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.subtleText
    },
    activeTabText: {
        color: Colors.dark.text
    }

})