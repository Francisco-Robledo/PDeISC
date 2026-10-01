import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RetroScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.content}>
        <View style={styles.arcadeHeader}>
          <Text style={styles.scoreText}>SCORE: 009990</Text>
          <Text style={styles.livesText}>❤️❤️❤️</Text>
        </View>

        <View style={styles.screenBorder}>
          <Text style={styles.retroTag}>★ 8-BIT ARCADE ★</Text>
          <Text style={styles.title}>HOLA MUNDO</Text>
          <Text style={styles.stage}>STAGE 1-1 // LEVEL UP</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.creditsText}>CREDITS: 04</Text>
          <Text style={styles.readyText}>READY PLAYER 1</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const monoFont = Platform.OS === 'ios' ? 'Courier' : 'monospace';

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
  },
  arcadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  scoreText: {
    color: '#FACC15',
    fontFamily: monoFont,
    fontSize: 16,
    fontWeight: '900',
  },
  livesText: {
    fontSize: 16,
  },
  screenBorder: {
    backgroundColor: '#022C22',
    borderWidth: 3,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 28,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  retroTag: {
    color: '#34D399',
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: '#A7F3D0',
    fontFamily: monoFont,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
    textAlign: 'center',
  },
  stage: {
    color: '#6EE7B7',
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 2,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: 12,
  },
  creditsText: {
    color: '#94A3B8',
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: '700',
  },
  readyText: {
    color: '#F87171',
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
