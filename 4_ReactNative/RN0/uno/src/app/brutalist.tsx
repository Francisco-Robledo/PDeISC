import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrutalistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDE047" />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>UI 3 • NEO-BRUTALISM</Text>
        </View>

        <View style={styles.titleBox}>
          <Text style={styles.title}>¡HOLA MUNDO!</Text>
        </View>

        <Text style={styles.subtitle}>BORDES NEGROS • CONTRASTE MÁXIMO</Text>

        <View style={styles.tagGroup}>
          <View style={styles.tagPink}>
            <Text style={styles.tagText}>⚡ PURO ESTILO</Text>
          </View>
          <View style={styles.tagCyan}>
            <Text style={styles.tagText}>★ REACT NATIVE</Text>
          </View>
        </View>

        <View style={styles.sticker}>
          <Text style={styles.stickerText}>100% RETRO-MODERN</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE047',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badge: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 24,
    transform: [{ rotate: '-2deg' }],
  },
  badgeText: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  tagGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tagPink: {
    backgroundColor: '#FB7185',
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tagCyan: {
    backgroundColor: '#38BDF8',
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tagText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
  },
  sticker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
    transform: [{ rotate: '2deg' }],
  },
  stickerText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
});
