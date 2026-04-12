import { Typography } from '@/components/ui/Typography';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function EscudoScreen() {
  const { colors: themeColors } = useAppTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Typography variant="h1">Escudo 🛡️</Typography>
      <Typography variant="subtitle">Configuración de seguridad y privacidad.</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
