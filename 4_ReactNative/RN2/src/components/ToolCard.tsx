import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

interface ToolCardProps {
  title: string;
  subtitle: string;
  category: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  onPress: () => void;
  statusBadge?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  subtitle,
  category,
  iconName,
  accentColor,
  onPress,
  statusBadge,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: colors.surfaceBorder }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}20` }]}>
          <Ionicons name={iconName} size={26} color={accentColor} />
        </View>
        <View style={styles.badgesContainer}>
          <View style={[styles.categoryBadge, { borderColor: `${accentColor}50` }]}>
            <Text style={[styles.categoryText, { color: accentColor }]}>
              {category.toUpperCase()}
            </Text>
          </View>
          {statusBadge ? (
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{statusBadge}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.actionText, { color: accentColor }]}>Explorar herramienta</Text>
        <Ionicons name="arrow-forward" size={16} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.surfaceLight,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
