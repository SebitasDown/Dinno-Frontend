import { Typography } from '@/components/ui/Typography';
import { View, StyleSheet } from 'react-native';

export default function DespensaScreen() {
  return (
    <View style={styles.container}>
      <Typography variant="h1">Despensa 🍎</Typography>
      <Typography variant="subtitle">Lleva el control de tus alimentos y suministros.</Typography>
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
