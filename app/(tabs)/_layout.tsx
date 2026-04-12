import { Tabs, useRouter } from 'expo-router';
import { Bot, ChefHat, Shield, Wallet, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

// Componente para el botón central elevado
const CustomTabBarButton = ({ children, onPress }: any) => {
  const { colors: themeColors, isDark } = useAppTheme();
  
  return (
    <View style={styles.customButtonContainer}>
      <View style={[
        styles.customButtonWrapper, 
        { 
          backgroundColor: themeColors.inputSurface, 
          borderColor: themeColors.inputBorder,
          shadowColor: isDark ? '#000' : '#4A90E2',
        }
      ]} onTouchEnd={onPress}>
        {children}
      </View>
    </View>
  );
};

export default function TabLayout() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.subtleText,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopWidth: 1,
          borderTopColor: themeColors.inputBorder,
          height: 90,
          paddingTop: 10,
          paddingBottom: 25,
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
        name="bot"
        options={{
          title: '',
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
          title: 'Energía',
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
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
