import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '@/components/profile/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { Typography } from '@/components/ui/Typography';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export default function ConfigurationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userProfile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const fetchAndSyncProfile = useUserStore((state) => state.fetchAndSyncProfile);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const savePendingUpdate = useUserStore((state) => state.savePendingUpdate);

  // Estados locales para el formulario de edición
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Toggles de configuración
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Sincronizar el componente local cuando cambie la información en la base interna
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setBio(userProfile.bio || '');
      setNotificationsEnabled(userProfile.notificationsEnabled ?? true);
      setDarkMode(userProfile.darkMode ?? true);
    }
  }, [userProfile]);

  // Consultar la API cuando cargue la pantalla
  useEffect(() => {
    fetchAndSyncProfile();
  }, []);

  const handleSave = async () => {
    try {
      // 1. Guardar en el servidor a través de la API
      await userService.updateProfile({ name, email, bio });

      // 2. Persistir localmente
      await setProfile({ name, email, bio });
      Alert.alert('Éxito', 'Perfil guardado con éxito');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      Alert.alert('Error', 'Hubo un problema actualizando tu perfil en el servidor');
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
    setDarkMode(value);
    await setProfile({ darkMode: value });
    try {
      await userService.updateAppearance({ darkMode: value }); 
    } catch (e) {
      console.log('Fallo de red detectado, encolando actualización para Apariencia.');
      await savePendingUpdate('darkMode', value);
    }
  };

  const handleLogout = async () => {
    console.log('Saliendo...');
    await clearProfile();

    // Limpiar el token de la sesión real
    const { logout } = useAuthStore.getState();
    await logout();

    // Redirigir a la pantalla inicial
    router.replace('/');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 24) }]}>
      
      {/* Header fijo superior empujado por Insets Manuales para que NUNCA quede pegado a la cámara */}
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, position: 'relative' }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 10, padding: 4, zIndex: 10 }}>
          <Ionicons name="chevron-back" size={28} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '600', color: Colors.dark.text }}>Configuraciones</Text>
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
          <View style={styles.card}>
            <Typography style={styles.sectionTitle}>Editar perfil</Typography>

            <Typography style={styles.label}>Nombre</Typography>
            <Input iconName="User" value={name} onChangeText={setName} />

            <Typography style={styles.label}>Correo (No modificable)</Typography>
            <Input iconName="Mail" value={email} onChangeText={setEmail} keyboardType="email-address" editable={false} style={{ opacity: 0.6 }} />

            <Typography style={styles.label}>Bio</Typography>
            <Input
              iconName="FileText"
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti..."
              multiline={true}
              numberOfLines={4}
              style={{ height: 100 }}
              inputStyle={{ textAlignVertical: 'top' }} // Para que actúe como Text Area
            />

            <View style={styles.buttonWrapper}>
              <Button label="Guardar cambios" onPress={handleSave} />
            </View>
          </View>

          {/* Sección: Opciones */}
          <View style={styles.card}>
            <SettingsRow
              iconName="Bell"
              title="Notificaciones"
              subtitle="Gestiona tus alertas"
              hasSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={handleToggleNotifications}
            />
            <SettingsRow
              iconName="Moon"
              title="Apariencia"
              subtitle="Tema y visualización"
              hasSwitch
              switchValue={darkMode}
              onSwitchChange={handleToggleDarkMode}
            />
            <SettingsRow iconName="Shield" title="Privacidad" subtitle="Seguridad de tu cuenta" isLast onPress={() => { }} />
          </View>

          {/* Componente: Botón de Cerrar Sesión usando el mismo SettingsRow */}
          <SettingsRow
            iconName="LogOut"
            title="Cerrar sesión"
            isDanger
            isLast
            onPress={handleLogout}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 32, alignItems: 'center' },
  headerTitle: { fontSize: 20 },
  card: {
    backgroundColor: '#1A1C1E',
    borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#2C2F36',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 12, color: Colors.dark.subtleText, marginBottom: 8, marginLeft: 4 },
  buttonWrapper: { marginTop: 16 },
});