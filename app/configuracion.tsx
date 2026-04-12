import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/profile/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { Typography } from '@/components/ui/Typography';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ConfigurationScreen() {
  const { colors: themeColors, isDark, toggleTheme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userProfile = useUserStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const setProfile = useUserStore((state) => state.setProfile);
  const savePendingUpdate = useUserStore((state) => state.savePendingUpdate);

  // Estados locales para el formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Toggles de configuración
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sincronizar el componente local cuando cambie la información en la base interna
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setBio(userProfile.bio || '');
      setNotificationsEnabled(userProfile.notificationsEnabled ?? true);
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const updateData = { name, bio };

    // 1. Actualización inmediata en el Store (Optimistic UI)
    await setProfile(updateData);

    // 2. Intentar actualizar en el Servidor
    try {
      await userService.updateProfile(updateData);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (e) {
      console.log('Fallo de red detectado, encolando actualización para Perfil.');
      // En el store, savePendingUpdate acepta 'darkMode' | 'notificationsEnabled'
      // Si no hay proceso para 'profile', simplemente informamos
      Alert.alert('Modo Offline', 'No hay conexión. Por ahora las actualizaciones de perfil requieren internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await setProfile({ notificationsEnabled: value });
    try {
      await userService.updateNotifications({ notificationsEnabled: value });
    } catch (e) {
      console.log('Fallo de red detectado, encolando actualización para Notificaciones.');
      await savePendingUpdate('notificationsEnabled', value);
    }
  };

  const handleToggleDarkMode = async (value: boolean) => {
    toggleTheme();
    try {
      await userService.updateAppearance({ darkMode: value });
    } catch (e) {
      console.log('Fallo de red detectado, encolando actualización para Apariencia.');
      await savePendingUpdate('darkMode', value);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 24), backgroundColor: themeColors.background }]}>

      {/* Header fijo superior */}
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, position: 'relative' }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 10, padding: 4, zIndex: 10 }}>
          <Ionicons name="chevron-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <Typography variant="h3" style={{ color: themeColors.text }}>Configuraciones</Typography>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Componente: Avatar */}
          <Avatar
            imageUrl={userProfile?.imageUrl}
            initial={name ? name[0].toUpperCase() : "U"}
            email={email}
            size={80}
            onCameraPress={() => console.log('Cambiar foto')}
          />

          {/* Sección: Editar Perfil */}
          <View style={[styles.card, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder, elevation: isDark ? 0 : 2 }]}>
            <Typography variant="h3" style={[styles.sectionTitle, { color: themeColors.primary, marginBottom: 20 }]}>Editar perfil</Typography>

            <Typography variant="body" style={[styles.label, { color: themeColors.subtleText, fontWeight: '700' }]}>Nombre</Typography>
            <Input iconName="User" value={name} onChangeText={setName} />

            <Typography variant="body" style={[styles.label, { color: themeColors.subtleText, fontWeight: '700', marginTop: 12 }]}>Correo (No modificable)</Typography>
            <Input iconName="Mail" value={email} onChangeText={setEmail} keyboardType="email-address" editable={false} style={{ opacity: 0.6 }} />

            <Typography variant="body" style={[styles.label, { color: themeColors.subtleText, fontWeight: '700', marginTop: 12 }]}>Bio</Typography>
            <Input
              iconName="FileText"
              value={bio}
              onChangeText={setBio}
              multiline
              //@ts-ignore
              inputStyle={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }}
            />

            <View style={styles.buttonWrapper}>
              <Button label="Guardar cambios" onPress={handleUpdateProfile} isLoading={isLoading} />
            </View>
          </View>

          {/* Sección: Opciones */}
          <View style={[styles.card, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder, elevation: isDark ? 0 : 2 }]}>
            <SettingsRow
              iconName="Bell"
              title="Notificaciones"
              subtitle="Alertas y recordatorios"
              hasSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={handleToggleNotifications}
            />
            <SettingsRow
              iconName="Eye"
              title="Apariencia"
              subtitle="Tema y visualización"
              hasSwitch
              switchValue={isDark}
              onSwitchChange={handleToggleDarkMode}
            />
            <SettingsRow iconName="Shield" title="Privacidad" subtitle="Seguridad de tu cuenta" isLast onPress={() => { }} />
          </View>

          {/* Botón: Cerrar sesión */}
          <View style={{ marginTop: 8 }}>
            <Button label="Cerrar sesión" variant="outline" onPress={handleLogout} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 32, alignItems: 'center' },
  card: {
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24,
    borderWidth: 1, 
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 12, marginBottom: 8, marginLeft: 4 },
  buttonWrapper: { marginTop: 24 },
});