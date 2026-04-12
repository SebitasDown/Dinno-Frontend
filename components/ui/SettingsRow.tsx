import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Typography } from './Typography';

interface SettingsRowProps {
  iconName: keyof typeof LucideIcons;
  title: string;
  subtitle?: string;
  isLast?: boolean;
  onPress?: () => void;
  isDanger?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ 
  iconName, title, subtitle, isLast = false, onPress, isDanger = false, hasSwitch = false, switchValue = false, onSwitchChange 
}) => {
  const { colors: themeColors } = useAppTheme();
  const IconComponent = LucideIcons[iconName] as React.ElementType;
  const mainColor = isDanger ? '#EF4444' : themeColors.primary;
  const bgColor = isDanger ? 'rgba(239, 68, 68, 0.1)' : themeColors.primary + '20';

  return (
    <TouchableOpacity 
      style={[
        styles.row, 
        !isLast && { borderBottomWidth: 1, borderBottomColor: themeColors.inputBorder },
        isDanger && [styles.dangerContainer, { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]
      ]}
      onPress={onPress}
      activeOpacity={hasSwitch ? 1 : 0.7}
      disabled={!onPress && !hasSwitch}
    >
      <View style={[styles.iconBox, { backgroundColor: isDanger ? 'transparent' : bgColor }]}>
        {IconComponent && <IconComponent size={20} color={mainColor} strokeWidth={2} />}
      </View>

      <View style={styles.texts}>
        <Typography variant="body" style={[{ fontWeight: '600' }, isDanger ? { color: mainColor } : { color: themeColors.text }]}>{title}</Typography>
        {subtitle && <Typography variant="body" style={{ fontSize: 12, color: themeColors.subtleText }}>{subtitle}</Typography>}
      </View>

      {hasSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange}
          trackColor={{ false: themeColors.inputBorder, true: themeColors.primary }}
          thumbColor={'#fff'}
        />
      ) : (
        !isDanger && <ChevronRight size={20} color={themeColors.subtleText} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  dangerContainer: { 
    justifyContent: 'center', 
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  texts: { flex: 1 },
});