import { Typography } from '@/components/ui/Typography';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DespensaScreen() {
  const { colors: themeColors } = useAppTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
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
    padding: 24,
  },
});
