import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

interface BubbleLevelProps {
  x: number;
  y: number;
}

export const BubbleLevel: React.FC<BubbleLevelProps> = ({ x, y }) => {
  const wasLevelRef = useRef<boolean>(false);

  // El radio total del contenedor del nivel es 100 (diámetro 200).
  // La burbuja tiene radio 18 (diámetro 36).
  const maxTravel = 70;

  // Calculamos la posición restringida dentro del círculo
  const posX = Math.max(-maxTravel, Math.min(maxTravel, -x * maxTravel * 1.5));
  const posY = Math.max(-maxTravel, Math.min(maxTravel, y * maxTravel * 1.5));

  const distance = Math.sqrt(posX * posX + posY * posY);
  const isLevel = distance < 8; // Menos de 8px del centro se considera perfectamente nivelado

  useEffect(() => {
    if (isLevel && !wasLevelRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    wasLevelRef.current = isLevel;
  }, [isLevel]);

  return (
    <View style={styles.container}>
      <View style={[styles.outerRing, isLevel && styles.outerRingLevel]}>
        {/* Cruz central */}
        <View style={styles.crosshairH} />
        <View style={styles.crosshairV} />

        {/* Círculo central diana */}
        <View style={[styles.centerTarget, isLevel && styles.centerTargetLevel]} />

        {/* Burbuja móvil */}
        <View
          style={[
            styles.bubble,
            {
              transform: [{ translateX: posX }, { translateY: posY }],
              backgroundColor: isLevel ? colors.accentEmerald : colors.accentAmber,
            },
          ]}
        >
          <View style={styles.bubbleHighlight} />
        </View>
      </View>

      <View style={[styles.levelBadge, isLevel && styles.levelBadgeSuccess]}>
        <Text style={[styles.levelBadgeText, isLevel && styles.levelBadgeTextSuccess]}>
          {isLevel ? 'PERFECTAMENTE NIVELADO (0.0°)' : 'INCLINADO'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.surfaceLight,
    borderWidth: 3,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  outerRingLevel: {
    borderColor: colors.accentEmerald,
  },
  crosshairH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  crosshairV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  centerTarget: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderStyle: 'dashed',
  },
  centerTargetLevel: {
    borderColor: colors.accentEmerald,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  bubbleHighlight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    top: 6,
    left: 8,
  },
  levelBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  levelBadgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  levelBadgeText: {
    color: colors.accentAmber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  levelBadgeTextSuccess: {
    color: colors.accentEmerald,
  },
});
