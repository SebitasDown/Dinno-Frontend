import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { transactionService } from '@/services/walletService';
import { useWalletStore } from '@/store/walletStore';
import { Typography } from '@/components/ui/Typography';
import { getCategoryIcon } from '@/components/bolsillo/TransactionList';

export default function NuevoMovimientoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useAppTheme();
  const [type, setType] = useState<'gasto' | 'ingreso'>('gasto');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Comida');
  const [isFixed, setIsFixed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim()) {
      setErrorMsg('Por favor llena los campos de nombre y monto');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await transactionService.registerTransaction({
        description: name.trim(),
        amount: parseFloat(amount),
        category: category.toUpperCase(),
        type: type === 'gasto' ? 'EXPENSE' : 'INCOME',
        isFixed: isFixed
      });
      
      const { fetchSummary, fetchProjection, fetchTransactions, fetchCategories } = useWalletStore.getState();
      fetchSummary();
      fetchProjection();
      fetchTransactions();
      fetchCategories();

      router.back();
    } catch (e: any) {
      console.log('Error registranto transaccion', e.response?.data || e.message);
      const msg = e.response?.data?.detail || e.response?.data?.message || 'Ocurrió un error guardando el movimiento';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = [
    { id: '1', name: 'Vivienda' },
    { id: '2', name: 'Comida' },
    { id: '3', name: 'Transporte' },
    { id: '4', name: 'Servicios' },
    { id: '5', name: 'Compras' },
    { id: '6', name: 'Otros' },
  ];

  const incomeCategories = [
    { id: '1', name: 'Nomina' },
    { id: '2', name: 'Freelance' },
    { id: '3', name: 'Inversiones' },
    { id: '4', name: 'Regalos' },
    { id: '5', name: 'Otros' },
  ];

  const currentCategories = type === 'gasto' ? expenseCategories : incomeCategories;

  React.useEffect(() => {
    const exists = currentCategories.find(c => c.name === category);
    if (!exists) {
      setCategory(currentCategories[0].name);
    }
  }, [type, category, currentCategories]);

  return (
    <KeyboardAvoidingView 
      style={styles.backdrop} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.backdropPressable} onPress={() => router.back()} />
      
      <View style={[styles.bottomSheet, { 
        backgroundColor: themeColors.inputSurface,
        paddingBottom: Math.max(insets.bottom, 20) 
      }]}>
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: themeColors.inputBorder }]} />
        </View>

        <View style={styles.header}>
          <Typography variant="h2" style={{ color: themeColors.text }}>Nuevo movimiento</Typography>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color={themeColors.subtleText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.typeSelector, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                type === 'gasto' && { backgroundColor: themeColors.inputSurface, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }
              ]}
              onPress={() => setType('gasto')}
            >
              <MaterialCommunityIcons 
                name="arrow-bottom-right" 
                size={16} 
                color={type === 'gasto' ? themeColors.text : themeColors.subtleText} 
              />
              <Typography variant="body" style={{ 
                color: type === 'gasto' ? themeColors.text : themeColors.subtleText,
                fontWeight: type === 'gasto' ? '700' : '400'
              }}>
                Gasto
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.typeButton, 
                type === 'ingreso' && { backgroundColor: themeColors.inputSurface, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }
              ]}
              onPress={() => setType('ingreso')}
            >
              <MaterialCommunityIcons 
                name="arrow-top-right" 
                size={16} 
                color={type === 'ingreso' ? themeColors.text : themeColors.subtleText} 
              />
              <Typography variant="body" style={{ 
                color: type === 'ingreso' ? themeColors.text : themeColors.subtleText,
                fontWeight: type === 'ingreso' ? '700' : '400'
              }}>
                Ingreso
              </Typography>
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <Typography variant="body" style={{ color: '#ef4444', marginBottom: 12, fontWeight: '700' }}>{errorMsg}</Typography>
          ) : null}

          <View style={styles.inputGroup}>
            <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700', marginBottom: 8 }}>Nombre</Typography>
            <TextInput
              style={[styles.input, { 
                backgroundColor: themeColors.background, 
                borderColor: themeColors.inputBorder,
                color: themeColors.text
              }]}
              placeholder="ej: Supermercado"
              placeholderTextColor={themeColors.subtleText}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700', marginBottom: 8 }}>Monto</Typography>
            <TextInput
              style={[styles.input, { 
                backgroundColor: themeColors.background, 
                borderColor: themeColors.inputBorder,
                color: themeColors.text
              }]}
              placeholder="0.00"
              placeholderTextColor={themeColors.subtleText}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography variant="body" style={{ color: themeColors.subtleText, fontWeight: '700', marginBottom: 8 }}>Categoría</Typography>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesGrid}
            >
              {currentCategories.map((cat) => {
                const isActive = category === cat.name;
                const catInfo = getCategoryIcon(cat.name);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPill,
                      { backgroundColor: themeColors.background, borderColor: themeColors.inputBorder },
                      isActive && { backgroundColor: themeColors.primary, borderColor: themeColors.primary }
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <MaterialCommunityIcons 
                      name={catInfo.name} 
                      size={18} 
                      color={isActive ? (isDark ? '#000' : '#FFF') : catInfo.color} 
                    />
                    <Typography variant="body" style={{ 
                      color: isActive ? (isDark ? '#000' : '#FFF') : themeColors.text,
                      fontWeight: '700',
                      fontSize: 13
                    }}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.fixedGroup, { backgroundColor: themeColors.background, borderColor: themeColors.inputBorder }]}>
            <View style={styles.switchWrapper}>
              <Switch
                value={isFixed}
                onValueChange={setIsFixed}
                trackColor={{ false: themeColors.inputBorder, true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View>
              <Typography variant="body" style={{ color: themeColors.text, fontWeight: '700' }}>
                {type === 'gasto' ? 'Gasto fijo' : 'Ingreso fijo'}
              </Typography>
              <Typography variant="body" style={{ color: themeColors.subtleText, fontSize: 12 }}>Se repite cada mes</Typography>
            </View>
          </View>

        </ScrollView>

        <View style={[styles.footer, { borderTopColor: themeColors.inputBorder }]}>
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: themeColors.primary }, isLoading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="check" size={20} color={isDark ? '#000' : '#FFF'} />
            <Typography variant="body" style={{ 
              color: isDark ? '#000' : '#FFF', 
              fontWeight: '700',
              fontSize: 16
            }}>
              {isLoading ? 'Registrando...' : `Registrar ${type}`}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  fixedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  switchWrapper: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
