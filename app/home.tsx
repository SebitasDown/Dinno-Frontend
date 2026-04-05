import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/'); // Vuelve al layout principal donde está el login
  };

  return (
    <View style={styles.container}>
      <Typography variant="h1">Home de Prueba 🚀</Typography>
      <View style={styles.textContainer}>
        <Typography variant="subtitle">¡Has iniciado sesión con éxito y tu token está guardado de forma segura!</Typography>
      </View>
      <Button label="Cerrar sesión" onPress={handleLogout} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0F1115',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    marginTop: 24, 
    marginBottom: 40,
    width: '100%',
    alignItems: 'center'
  }
});
