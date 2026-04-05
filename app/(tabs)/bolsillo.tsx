import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function BolsilloScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <Typography variant="h1">Bolsillo 💰</Typography>
      <Typography variant="subtitle">Aquí podrás gestionar tus ahorros y gastos.</Typography>

      <View style={styles.buttonWrapper}>
        <Button
          label="Ir a Configuración"
          variant="secondary"
          onPress={() => router.push('/configuracion')}
        />
      </View>
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
  buttonWrapper: {
    marginTop: 40,
    width: '80%',
  }
});
