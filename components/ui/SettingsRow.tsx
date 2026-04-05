import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface SettingsRowProps {
  iconName: keyof typeof LucideIcons;
  title: string;
  subtitle?: string;
  isLast?: boolean;
  onPress?: () => void;
  isDanger?: boolean; // Para el botón de "Cerrar sesión"
  hasSwitch?: boolean; // Activar un Switch en lugar de la flecha
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ 
  iconName, title, subtitle, isLast = false, onPress, isDanger = false, hasSwitch = false, switchValue = false, onSwitchChange 
}) => {
  // Fix typings: use any or React.ElementType since Icon is not directly exported this way in basic typings
  const IconComponent = LucideIcons[iconName] as React.ElementType;
  const mainColor = isDanger ? '#EF4444' : Colors.dark.primary;
  const bgColor = isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 160, 97, 0.1)';

  return (
    <TouchableOpacity 
      style={[
        styles.row, 
        !isLast && styles.border,
        isDanger && styles.dangerContainer
      ]}
      onPress={onPress}
      activeOpacity={hasSwitch ? 1 : 0.7} // Desactivar efecto si es switch para que el usuario toque directo el switch o la row maneja el toggle? Option: On press toggle switch.
      disabled={!onPress && !hasSwitch}
    >
      {/* Icono de la izquierda */}
      <View style={[styles.iconBox, { backgroundColor: isDanger ? 'transparent' : bgColor }]}>
        {IconComponent && <IconComponent size={20} color={mainColor} strokeWidth={2} />}
      </View>

      {/* Textos */}
      <View style={styles.texts}>
        <Text style={[styles.title, isDanger && { color: mainColor }]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Control derecho: Switch o Flecha */}
      {hasSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange}
          trackColor={{ false: Colors.dark.inputBorder, true: Colors.dark.primary }}
          thumbColor={'#fff'} // Always white for contrast
        />
      ) : (
        !isDanger && <ChevronRight size={20} color={Colors.dark.subtleText} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.dark.inputBorder },
  dangerContainer: { 
    justifyContent: 'center', 
    borderWidth: 1, borderColor: '#EF4444', 
    borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginTop: 16,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  texts: { flex: 1 },
  title: { color: Colors.dark.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  subtitle: { color: Colors.dark.subtleText, fontSize: 12 },
});