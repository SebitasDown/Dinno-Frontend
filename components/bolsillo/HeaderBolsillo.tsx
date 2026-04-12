import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DinnoLogo } from '../ui/DinnoLogo';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from '../ui/Typography';
import { Settings } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';

export const HeaderBolsillo = () => {
  const router = useRouter();
  const { colors: themeColors } = useAppTheme();
  const profile = useUserStore((state) => state.profile);
  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';

  return (
    <View style={[styles.headerContainer, { borderBottomColor: themeColors.inputBorder }]}>
      <View style={styles.userInfo}>
        <View style={styles.userIconBox}>
          <DinnoLogo scale={0.35} />
        </View>
        <View>
          <Typography variant="h3">Bolsillo</Typography>
          <Typography variant="body" style={{ color: themeColors.subtleText }}>Auditor financiero</Typography>
        </View>
      </View>

      <View style={[styles.headerIcons, { borderColor: themeColors.inputBorder }]}>
        <TouchableOpacity style={styles.iconButton}>
          <View style={[styles.initialCircle, { backgroundColor: themeColors.primary + '20' }]}>
            <Typography variant="body" style={{ color: themeColors.primary, fontWeight: 'bold', fontSize: 12 }}>{initial}</Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/configuracion')}>
          <Settings size={22} color={themeColors.text} strokeWidth={1.5} />
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
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userIconBox: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  iconButton: { padding: 4 },
  initialCircle: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
});