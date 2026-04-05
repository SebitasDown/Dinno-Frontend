import { AuthMode, AuthTabs } from '@/components/ui/AuthTabs';
import { Button } from '@/components/ui/Button';
import { DinnoLogo, DinnoMood } from '@/components/ui/DinnoLogo';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/Colors';
import { authService } from '@/services/authService';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBox } from '@/components/ui/AlertBox';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  // Estado de modo
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Estado de humor para Dinno
  const [mood, setMood] = useState<DinnoMood>('normal');

  // Estado para la alerta personalizada
  const [alertInfo, setAlertInfo] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Estados del formulario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (authMode === 'login') {
      try {
        console.log('Iniciando sesión con:', { email, password });
        const data = await authService.login(email, password);
        console.log('Datos completos recibidos:', data);

        // Buscar el token en las diferentes variables que tu DTO de Java pueda tener
        const token = data.token || data.accessToken || data.jwt;

        if (!token) {
          throw new Error("No se ha recibido el token desde tu Spring Boot.");
        }

        await setToken(token);
        router.push('/home'); // Navegar a pantalla de prueba
      } catch (error: any) {
        console.error('Error al iniciar sesión:', error.response?.data || error.message);
        
        const status = error.response?.status;

        if (status === 503) {
          setAlertInfo({ type: 'error', msg: 'El servidor está despertando. Por favor, espera unos segundos e intenta de nuevo.' });
        } else if (status === 401 || status === 403) {
          setAlertInfo({ type: 'error', msg: 'El usuario o la contraseña son incorrectos.' });
          setMood('surprised');
        } else {
          setAlertInfo({ type: 'error', msg: 'No pudimos conectarnos al servidor. Inténtalo más tarde.' });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        console.log('Creando cuenta con:', { username, email, password });
        await authService.register(username, email, password);

        setAlertInfo({ type: 'success', msg: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.' });
        setAuthMode('login'); // Volver a pestaña de login para que ingresen el token real
      } catch (error: any) {
        console.error('Error al registrarse:', error.response?.data || error.message);

        // Obtener el mensaje devuelto por Spring Boot (usualmente viene en data.message o data directamente)
        let serverMessage = '';
        if (error.response?.data) {
          serverMessage = typeof error.response.data === 'string'
            ? error.response.data
            : (error.response.data.message || JSON.stringify(error.response.data));
        }

        const msgLower = serverMessage.toLowerCase();

        const status = error.response?.status;
        
        if (status === 503) {
          setAlertInfo({ type: 'error', msg: 'El servidor está despertando. Por favor, espera unos segundos e intenta de nuevo.' });
        } else if (msgLower.includes('username') || msgLower.includes('usuario')) {
          setAlertInfo({ type: 'error', msg: 'Ese nombre de usuario ya está registrado. Por favor intenta con otro.' });
          setMood('sad');
        } else if (msgLower.includes('email') || msgLower.includes('correo')) {
          setAlertInfo({ type: 'error', msg: 'Ese correo electrónico ya tiene una cuenta asociada.' });
          setMood('sad');
        } else if (status === 409 || status === 400) {
          setAlertInfo({ type: 'error', msg: serverMessage || 'El nombre de usuario o correo ya existen. Revisa tus datos e intenta nuevamente.' });
          setMood('sad');
        } else {
          setAlertInfo({ type: 'error', msg: 'Hubo un problema de conexión al crear la cuenta. Inténtalo de nuevo.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header: Logo y Títulos */}
          <View style={styles.header}>
            <DinnoLogo mood={mood} />

            <Typography variant="h1" style={styles.title}>Dinno</Typography>
            <Typography variant="subtitle">Tu asistente inteligente</Typography>
          </View>

          {/* Selector de Modo */}
          <AuthTabs
            activeMode={authMode}
            onChangeMode={(mode) => {
              setAuthMode(mode);
              setAlertInfo(null); // Limpiar error si cambian de pestaña
              setMood('normal'); // Resetear humor
            }}
          />

          {/* Formulario Dinámico */}
          <View style={styles.formContainer}>

            {/* Custom Premium Alert Box */}
            <AlertBox
              type={alertInfo?.type || 'error'}
              message={alertInfo?.msg || null}
              onClose={() => {
                setAlertInfo(null);
                setMood('normal'); // Resetear humor al cerrar alerta
              }}
            />

            {/* El campo Username SOLO aparece si estamos en modo registro */}
            {authMode === 'register' && (
              <Input
                iconName="User"
                placeholder="Nombre de usuario"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            )}

            <Input
              iconName="Mail"
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              iconName="Lock"
              placeholder="Contraseña"
              isPassword={true}
              value={password}
              onChangeText={setPassword}
            />

            <Button
              label={authMode === 'login' ? 'Entrar' : 'Crear cuenta'}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>

          {/* Footer (Texto pequeño de IA) */}
          <View style={styles.footer}>
            <Typography variant="placeholder" style={styles.footerText}>
              ✨ Potenciado por inteligencia artificial
            </Typography>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 8,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  }
});
