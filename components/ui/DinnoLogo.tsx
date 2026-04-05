import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

export type DinnoMood = 'normal' | 'surprised' | 'sad';

interface DinnoLogoProps {
  mood?: DinnoMood;
}

export const DinnoLogo: React.FC<DinnoLogoProps> = ({ mood = 'normal' }) => {
  const bgColor = '#0F1115';
  const pixelColor = '#38bdf8';
  const p = 9;

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
      backgroundColor: bgColor,
      width: p * 10,
      height: p * 10,
      borderRadius: p * 2.2,
    }]}>

      {/* Ojos Animados */}
      <View style={[styles.eyesWrapper, { gap: p * 2.2, marginBottom: p * 1.5 }]}>
        <Animated.View style={[styles.eye, eyeAnimatedStyle, { backgroundColor: pixelColor, width: p * 2, height: p * 2 }]} />
        <Animated.View style={[styles.eye, eyeAnimatedStyle, { backgroundColor: pixelColor, width: p * 2, height: p * 2 }]} />
      </View>

      {/* Boca Dinámica */}
      {renderMouth()}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#38bdf8',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
    height: 18, // Altura fija para evitar saltos de layout
  },
  pixel: {
    borderRadius: 0,
  }
});
