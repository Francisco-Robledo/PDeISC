import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CyberpunkScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050814" />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ UI 2 // CYBERPUNK</Text>
        </View>

        <Text style={styles.glitchText}>&gt; SYSTEM_READY</Text>

        <Text style={styles.title}>HOLA MUNDO</Text>
        <Text style={styles.version}>VERSIÓN_2077 // NEON_OVERLOAD</Text>

        <View style={styles.energyCard}>
          <Text style={styles.energyLabel}>ESTADO DEL SISTEMA</Text>
          <Text style={styles.energyValue}>100% OPERACIONAL ⚡</Text>
        </View>

        <View style={styles.terminalLine}>
          <Text style={styles.terminalPrompt}>usr@expo:~$</Text>
          <Text style={styles.terminalCmd}> render --vibe=cyberpunk</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  badge: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderWidth: 1.5,
    borderColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  badgeText: {
    color: '#F472B6',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  glitchText: {
    color: '#06B6D4',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 46,
    fontWeight: '900',
    color: '#F43F5E',
    letterSpacing: 4,
    textShadowColor: '#EC4899',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 32,
  },
  energyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 320,
  },
  energyLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  energyValue: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },
  terminalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  terminalPrompt: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
  },
  terminalCmd: {
    color: '#E2E8F0',
    fontSize: 12,
  },
});
