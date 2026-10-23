import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GlassScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Orbes luminosos difuminados detrás del cristal */}
      <View style={styles.orbPurple} />
      <View style={styles.orbCyan} />

      <View style={styles.content}>
        {/* Tarjeta de cristal frosted glass */}
        <View style={styles.glassCard}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>✨ UI 5 • GLASSMORPHISM</Text>
          </View>

          <Text style={styles.title}>Hola Mundo</Text>
          <Text style={styles.subtitle}>Efecto traslúcido y luz difusa</Text>

          <View style={styles.divider} />

          <View style={styles.glassBadge}>
            <Text style={styles.glassBadgeText}>VisionOS & Modern Blur Design</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  orbPurple: {
    position: 'absolute',
    top: '25%',
    left: '12%',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#8B5CF6',
    opacity: 0.45,
  },
  orbCyan: {
    position: 'absolute',
    bottom: '25%',
    right: '12%',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#06B6D4',
    opacity: 0.45,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    paddingVertical: 38,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  pillText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '400',
    marginBottom: 24,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 22,
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassBadgeText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
