import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { loadTokenFromStorage, useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useWalletStore } from '@/store/walletStore';
import { useIAStore } from '@/store/iaStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/bolsillo',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load session info
        await loadTokenFromStorage();
        // Global load of profile settings (like dark mode and ids)
        const { loadProfile, fetchAndSyncProfile } = useUserStore.getState();
        const { loadWalletData } = useWalletStore.getState();
        const { loadIAData } = useIAStore.getState();
        
        await Promise.all([
          loadProfile(),
          loadWalletData(),
          loadIAData()
        ]);
        
        fetchAndSyncProfile(); // Llama a sync en segundo plano
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (!appIsReady) return;

    // Si no hay token y no intenta entrar al login, redirigir al login
    if (!token && pathname !== '/') {
      router.replace('/');
    }
    // Si hay token y está en el login, redirigir a la primera pestaña
    else if (token && pathname === '/') {
      router.replace('/(tabs)/bolsillo');
    }
  }, [token, pathname, appIsReady]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Determinar tema (Preferencia usuario > Sistema)
  const { isDark } = useAppTheme();

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bot" options={{ headerShown: false }} />
        <Stack.Screen name="configuracion" options={{ headerShown: false }} />
        <Stack.Screen name="nuevo-movimiento" options={{ presentation: 'transparentModal', headerShown: false, animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
