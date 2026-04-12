import { AuthMode, AuthTabs } from '@/components/auth/AuthTabs';
import { Button } from '@/components/ui/Button';
import { DinnoLogo, DinnoMood } from '@/components/ui/DinnoLogo';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { authService } from '@/services/authService';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBox } from '@/components/ui/AlertBox';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function LoginScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);

  // Estado de modo
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Estado de humor para Dinno
  const [mood, setMood] = useState<DinnoMood>('normal');

  // Estado para la alerta personalizada
  const [alertInfo, setAlertInfo] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (authMode === 'register' && !name)) {
      setAlertInfo({ type: 'error', msg: 'Por favor, completa todos los campos.' });
      return;
    }

    setIsLoading(true);
    setAlertInfo(null);

    try {
      if (authMode === 'login') {
        const data = await authService.login(email, password);
        const token = data.accessToken || data.token || data.jwt;
        const refreshToken = data.refreshToken;
        
        if (!token) throw new Error("Token no recibido");
        
        await setTokens(token, refreshToken || '');
        console.log('Login exitoso');
        router.replace('/(tabs)/bolsillo');
      } else {
        await authService.register(name, email, password);
        setAlertInfo({ type: 'success', msg: 'Cuenta creada con éxito. Ahora puedes iniciar sesión.' });
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error('Error al procesar autenticación:', error.response?.data || error.message);
      const status = error.response?.status;
      const serverMessage = error.response?.data?.detail || error.response?.data?.message || 'Algo salió mal. Inténtalo de nuevo.';

      if (status === 503) {
        setAlertInfo({ type: 'error', msg: 'El servidor está despertando. Por favor, espera unos segundos e intenta de nuevo.' });
      } else if (status === 401 || status === 403) {
        setAlertInfo({ type: 'error', msg: 'El usuario o la contraseña son incorrectos.' });
        setMood('surprised');
      } else {
        setAlertInfo({ type: 'error', msg: serverMessage });
        setMood('sad');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header con Dinno */}
          <View style={styles.header}>
            <DinnoLogo mood={mood} showBorder showShadow />

            <Typography variant="h1" style={[styles.title, { color: themeColors.text }]}>Dinno</Typography>
            <Typography variant="subtitle" style={[styles.subtitle, { color: themeColors.subtleText }]}>Tu asistente inteligente</Typography>
          </View>

          {/* Selector de Modo */}
          <AuthTabs 
            activeMode={authMode} 
            onChangeMode={(mode) => {
                setAuthMode(mode);
                setAlertInfo(null);
                setMood('normal');
            }} 
          />

          {/* Alert Box */}
          {alertInfo && (
            <AlertBox
              type={alertInfo.type}
              message={alertInfo.msg}
              onClose={() => setAlertInfo(null)}
            />
          )}

          {/* Formulario */}
          <View style={styles.formContainer}>
            {authMode === 'register' && (
              <Input
                placeholder="Usuario"
                iconName="User"
                value={name}
                onChangeText={setName}
              />
            )}

            <Input
              placeholder="Correo electrónico"
              iconName="Mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              placeholder="Contraseña"
              iconName="Lock"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <Button
              label={authMode === 'login' ? 'Entrar' : 'Registrarse'}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>

          {/* Footer (Texto pequeño de IA) */}
          <View style={styles.footer}>
            <Typography variant="placeholder" style={[styles.footerText, { color: themeColors.subtleText }]}>
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
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  }
});
