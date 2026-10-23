import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MinimalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>UI 1 • MINIMAL</Text>
        </View>

        <Text style={styles.title}>Hola Mundo.</Text>
        <Text style={styles.subtitle}>Diseño limpio, sobrio y esencial.</Text>

        <View style={styles.dotIndicator}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>React Native Clean UI</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 52,
    fontWeight: '300',
    color: '#0F172A',
    letterSpacing: -2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '400',
    marginBottom: 32,
  },
  dotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
