import { Colors } from '@/constants/Colors';
import { User, Camera } from 'lucide-react-native';
import React from 'react';
import { View, Image, StyleSheet, useColorScheme, Text, TouchableOpacity } from 'react-native';

interface AvatarProps {
  imageUrl?: string;
  size?: number;
  style?: object;
  initial?: string;
  email?: string;
  onCameraPress?: () => void;
}

export function Avatar({ imageUrl, size = 50, style, initial, email, onCameraPress }: AvatarProps) {
  const theme = useColorScheme() ?? 'dark';
  const themeColors = Colors[theme as keyof typeof Colors];

  // Dynamic styles based on size Prop
  const containerSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, { backgroundColor: themeColors.inputSurface, borderColor: themeColors.inputBorder }, containerSize]}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={[styles.image, containerSize]} 
            resizeMode="cover" 
          />
        ) : initial ? (
          <Text style={[{ color: themeColors.text, fontSize: size * 0.4, fontWeight: 'bold' }]}>
            {initial}
          </Text>
        ) : (
          <User size={size * 0.5} color={themeColors.subtleText} strokeWidth={1.5} />
        )}

        {onCameraPress && (
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: themeColors.primary }]}
            onPress={onCameraPress}
            activeOpacity={0.8}
          >
            <Camera size={size * 0.25} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {email && (
        <Text style={[styles.email, { color: themeColors.subtleText }]}>{email}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // When using overlapping positioning we need relative container
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  email: {
    marginTop: 12,
    fontSize: 14,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.dark.background,
  }
});
