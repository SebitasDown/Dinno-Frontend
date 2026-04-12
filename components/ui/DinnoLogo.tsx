import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

export type DinnoMood = 'normal' | 'surprised' | 'sad';

interface DinnoLogoProps {
  mood?: DinnoMood;
  scale?: number;
  showBorder?: boolean;
  showShadow?: boolean;
}

export const DinnoLogo: React.FC<DinnoLogoProps> = ({ 
  mood = 'normal', 
  scale = 1,
  showBorder = false,
  showShadow = false
}) => {
  const bgColor = '#0F1115';
  const pixelColor = '#38bdf8';
  const p = 9 * scale;

  // Valores de animación
  const eyeScaleY = useSharedValue(1);
  const mouthScaleY = useSharedValue(1);
  const eyeTranslateY = useSharedValue(0);

  useEffect(() => {
    if (mood === 'normal') {
      // Reiniciar y activar parpadeo en modo normal
      eyeScaleY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3500 }),
          withTiming(0.1, { duration: 120 }),
          withTiming(1, { duration: 120 })
        ),
        -1
      );
      eyeTranslateY.value = withTiming(0);
    } else if (mood === 'surprised') {
      // Ojos bien abiertos y fijos
      eyeScaleY.value = withTiming(1.3, { duration: 200, easing: Easing.out(Easing.back(1.5)) });
      eyeTranslateY.value = withTiming(-2, { duration: 200 });
    } else if (mood === 'sad') {
      // Ojos entrecerrados y fijos
      eyeScaleY.value = withTiming(0.6, { duration: 300 });
      eyeTranslateY.value = withTiming(1, { duration: 300 });
    }
  }, [mood]);

  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
        { translateY: eyeTranslateY.value },
        { scaleY: eyeScaleY.value }
    ]
  }));

  // Renderizado dinámico de la boca basado en el mood
  const renderMouth = () => {
    if (mood === 'surprised') {
      return (
        <View style={[styles.mouthWrapper, { alignItems: 'center', justifyContent: 'center' }]}>
          <View style={[styles.pixel, { backgroundColor: pixelColor, width: p * 2.5, height: p * 2.5, borderRadius: p / 2 }]} />
        </View>
      );
    }

    if (mood === 'sad') {
      return (
        <View style={styles.mouthWrapper}>
          <View style={[styles.pixel, { backgroundColor: pixelColor, width: p, height: p, marginTop: p }]} />
          <View style={[styles.pixel, { backgroundColor: pixelColor, width: p * 2, height: p }]} />
          <View style={[styles.pixel, { backgroundColor: pixelColor, width: p, height: p, marginTop: p }]} />
        </View>
      );
    }

    // Normal (Sonrisa)
    return (
      <View style={styles.mouthWrapper}>
        <View style={[styles.pixel, { backgroundColor: pixelColor, width: p, height: p }]} />
        <View style={[styles.pixel, { backgroundColor: pixelColor, width: p * 2, height: p, marginTop: p }]} />
        <View style={[styles.pixel, { backgroundColor: pixelColor, width: p, height: p }]} />
      </View>
    );
  };

  return (
    <View style={[styles.container, {
      width: p * 10,
      height: p * 10,
      borderRadius: p * 2.2,
      borderWidth: showBorder ? 1 : 0,
      borderColor: '#1F2937',
      // Shadow (iOS)
      shadowColor: '#38bdf8',
      shadowOpacity: showShadow ? 0.15 : 0,
      shadowRadius: 12,
      // Elevation (Android)
      elevation: showShadow ? 4 : 0,
    }]}>

      {/* Ojos Animados */}
      <Animated.View style={[styles.eyesWrapper, { gap: p * 2.2 }]}>
        <Animated.View style={[styles.eye, eyeAnimatedStyle, { backgroundColor: pixelColor, width: p * 2, height: p * 2 }]} />
        <Animated.View style={[styles.eye, eyeAnimatedStyle, { backgroundColor: pixelColor, width: p * 2, height: p * 2 }]} />
      </Animated.View>

      <View style={{ height: p * 1.5 }} />

      {/* Boca Dinámica */}
      {renderMouth()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesWrapper: {
    flexDirection: 'row',
  },
  eye: {
    borderRadius: 1,
  },
  mouthWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pixel: {
    borderRadius: 0,
  }
});
