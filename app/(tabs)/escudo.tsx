import { Typography } from '@/components/ui/Typography';
import { View, StyleSheet } from 'react-native';

export default function EscudoScreen() {
  return (
    <View style={styles.container}>
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
    backgroundColor: '#0F1115',
  },
});
