import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export const HeaderBolsillo = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfo}>
        <View style={styles.userIconBox}>
           <MaterialCommunityIcons name="robot" size={24} color={Colors.dark.primary} />
        </View>
        <View>
          <Text style={styles.userName}>Bolsillo</Text>
          <Text style={styles.userRole}>Auditor financiero</Text>
        </View>
      </View>
      
      <View style={styles.headerIcons}>
         <TouchableOpacity style={styles.avatarCircle}>
            <Text style={styles.avatarText}>M</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => router.push('/configuracion')}>
            <Ionicons name="settings-outline" size={20} color={Colors.dark.subtleText} />
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingBottom: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBorder
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userIconBox: { width: 42, height: 42, backgroundColor: Colors.dark.inputSurface, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  userName: { fontSize: 18, fontWeight: '700', color: Colors.dark.text },
  userRole: { fontSize: 13, color: Colors.dark.subtleText },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.dark.inputBorder, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  avatarCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.dark.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 12, color: Colors.dark.background, fontWeight: 'bold' },
});