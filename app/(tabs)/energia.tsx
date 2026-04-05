import { Typography } from '@/components/ui/Typography';
import { View, StyleSheet } from 'react-native';

export default function EnergiaScreen() {
  return (
    <View style={styles.container}>
      <Typography variant="h1">Energía ⚡</Typography>
      <Typography variant="subtitle">Monitoriza tu consumo energético y eficiencia.</Typography>
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
