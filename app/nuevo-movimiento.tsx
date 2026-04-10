import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { transactionService } from '@/services/walletService';
import { useWalletStore } from '@/store/walletStore';

export default function NuevoMovimientoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      
      // Actualizar billetera en segundo plano mágicamente
      const { fetchSummary, fetchProjection, fetchTransactions, fetchCategories } = useWalletStore.getState();
      fetchSummary();
      fetchProjection();
      fetchTransactions();
      fetchCategories();

      router.back();
    } catch (e) {
      console.log('Error registranto transaccion', e);
      setErrorMsg('Ocurrió un error guardando el movimiento');
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = [
    { id: '1', name: 'Vivienda', icon: '🏠' },
    { id: '2', name: 'Comida', icon: '🍕' },
    { id: '3', name: 'Transporte', icon: '🚗' },
    { id: '4', name: 'Ocio', icon: '🎮' },
    { id: '5', name: 'Compras', icon: '🛒' },
    { id: '6', name: 'Otros', icon: '📦' },
  ];

  const incomeCategories = [
    { id: '1', name: 'Nómina', icon: '💰' },
    { id: '2', name: 'Ventas', icon: '📈' },
    { id: '3', name: 'Inversiones', icon: '🏦' },
    { id: '4', name: 'Regalos', icon: '🎁' },
    { id: '5', name: 'Freelance', icon: '💻' },
    { id: '6', name: 'Otros', icon: '💎' },
  ];

  const currentCategories = type === 'gasto' ? expenseCategories : incomeCategories;

  // Actualizar la categoría si cambian de tab y la actual no pertenece
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
      
      <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Top Handle / Drag Indicator */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo movimiento</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color={Colors.dark.subtleText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'gasto' && styles.typeButtonActive]}
              onPress={() => setType('gasto')}
            >
              <MaterialCommunityIcons 
                name="arrow-bottom-right" 
                size={16} 
                color={type === 'gasto' ? Colors.dark.text : Colors.dark.subtleText} 
              />
              <Text style={[styles.typeText, type === 'gasto' && styles.typeTextActive]}>
                Gasto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.typeButton, type === 'ingreso' && styles.typeButtonActive]}
              onPress={() => setType('ingreso')}
            >
              <MaterialCommunityIcons 
                name="arrow-top-right" 
                size={16} 
                color={type === 'ingreso' ? Colors.dark.text : Colors.dark.subtleText} 
              />
              <Text style={[styles.typeText, type === 'ingreso' && styles.typeTextActive]}>
                Ingreso
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorMsg ? (
            <Text style={{ color: '#ef4444', marginBottom: 12, fontWeight: '500' }}>{errorMsg}</Text>
          ) : null}

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="ej: Supermercado"
              placeholderTextColor={Colors.dark.subtleText}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.dark.subtleText}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Categories */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesGrid}
            >
              {currentCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    category === cat.name && styles.categoryPillActive
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    category === cat.name && styles.categoryTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Gasto fijo switch */}
          <View style={styles.fixedGroup}>
            <View style={styles.switchWrapper}>
              <Switch
                value={isFixed}
                onValueChange={setIsFixed}
                trackColor={{ false: Colors.dark.inputBorder, true: Colors.dark.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.fixedLabel}>{type === 'gasto' ? 'Gasto fijo' : 'Ingreso fijo'}</Text>
              <Text style={styles.fixedSubLabel}>Se repite cada mes</Text>
            </View>
          </View>

        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="check" size={16} color="#0F1115" />
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Registrando...' : `Registrar ${type}`}
            </Text>
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
    backgroundColor: Colors.dark.inputSurface,
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
    backgroundColor: Colors.dark.inputBorder,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.background,
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
  typeButtonActive: {
    backgroundColor: Colors.dark.inputSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.subtleText,
  },
  typeTextActive: {
    color: Colors.dark.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.subtleText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark.text,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20, // Agregado para que no se corte al final del scroll horizontal
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.subtleText,
  },
  categoryTextActive: {
    color: '#0F1115', // Dark background color to provide high contrast with primary orange background
  },
  fixedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  switchWrapper: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  fixedLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  fixedSubLabel: {
    fontSize: 13,
    color: Colors.dark.subtleText,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.inputBorder,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#0F1115', // using deep background dark for good contrast with the bright primary orange
    fontSize: 16,
    fontWeight: 'bold',
  },
});
