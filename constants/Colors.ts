const backgroundDeep = '#0F1115'; 
const surfaceDark = '#1A1C1E'; 
const primaryOrange = '#F9A061'; 
const accentBlue = '#4A90E2'; 
const borderDark = '#2C2F36'; 
const grayPlaceholder = '#6B7280';
const white = '#FFFFFF'; 

export const Colors = {
  light: {
    text: '#1E293B',
    subtleText: '#64748B',
    background: '#F2F7FB',
    inputSurface: white,
    inputBorder: '#E2E8F0',
    primary: '#1498B0',
    accent: '#0EA5E9',
    tabInactiveText: '#94A3B8',
  },
  dark: {
    text: white,
    subtleText: grayPlaceholder,
    background: backgroundDeep,
    inputSurface: surfaceDark,
    inputBorder: borderDark,
    primary: primaryOrange,
    accent: accentBlue,
    tabInactiveText: '#9CA3AF',
  },
};