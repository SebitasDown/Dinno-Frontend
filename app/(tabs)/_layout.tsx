import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Wallet, ChefHat, Bot, Zap, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Componente para el botón central elevado
const CustomTabBarButton = ({ children, onPress }: any) => (
  <View style={styles.customButtonContainer}>
    <View style={styles.customButtonWrapper} onTouchEnd={onPress}>
      {children}
    </View>
  </View>
);

export default function TabLayout() {
  const theme = useColorScheme() ?? 'dark';
  const themeColors = Colors[theme as keyof typeof Colors];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Oculta el header superior si no lo necesitas
        tabBarShowLabel: true,
        tabBarActiveTintColor: themeColors.primary, // Naranja para el tab activo
        tabBarInactiveTintColor: themeColors.subtleText, // Gris para inactivos
        tabBarStyle: {
          backgroundColor: themeColors.inputSurface, // Fondo oscuro de la barra
          borderTopWidth: 1,
          borderTopColor: themeColors.inputBorder,
          height: 80, // Altura para acomodar los labels
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* 1. Bolsillo */}
      <Tabs.Screen
        name="bolsillo"
        options={{
          title: 'Bolsillo',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} strokeWidth={1.5} />,
        }}
      />

      {/* 2. Despensa */}
      <Tabs.Screen
        name="despensa"
        options={{
          title: 'Despensa',
          tabBarIcon: ({ color }) => <ChefHat size={24} color={color} strokeWidth={1.5} />,
        }}
      />

      {/* 3. Botón Central (Dinno) */}
      <Tabs.Screen
        name="bot" // Redirige al dummy `bot.tsx` pero interceptaremos el clic
        options={{
          title: '', // Sin título para el botón central
          tabBarIcon: ({ focused }) => (
            <Bot 
              size={32} 
              color={focused ? themeColors.primary : themeColors.text} 
              strokeWidth={1.5} 
            />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton 
              {...props} 
              onPress={() => router.push('/chat' as any)} 
            />
          ),
        }}
      />

      {/* 4. Energía */}
      <Tabs.Screen
        name="energia"
        options={{
          title: 'Energia',
          tabBarIcon: ({ color }) => <Zap size={24} color={color} strokeWidth={1.5} />,
        }}
      />

      {/* 5. Escudo */}
      <Tabs.Screen
        name="escudo"
        options={{
          title: 'Escudo',
          tabBarIcon: ({ color }) => <Shield size={24} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -20, // Eleva el botón por encima de la barra
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20, // Forma de 'squircle' como en tu diseño
    backgroundColor: '#1A1C1E', // Fondo oscuro del botón central
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2F36', // Borde sutil
    // Sombra para darle profundidad
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
