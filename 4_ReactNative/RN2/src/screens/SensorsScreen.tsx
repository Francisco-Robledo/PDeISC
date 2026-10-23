import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { BubbleLevel } from '../components/BubbleLevel';
import { colors } from '../theme/colors';

interface SensorsScreenProps {
  onBack: () => void;
}

export const SensorsScreen: React.FC<SensorsScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'accelerometer' | 'gyroscope'>('accelerometer');
  const [updateInterval, setUpdateInterval] = useState<number>(100);

  const [accelData, setAccelData] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [gyroData, setGyroData] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(updateInterval);
    Gyroscope.setUpdateInterval(updateInterval);

    const accelSubscription = Accelerometer.addListener((data) => {
      setAccelData(data);
    });

    const gyroSubscription = Gyroscope.addListener((data) => {
      setGyroData(data);
    });

    return () => {
      accelSubscription.remove();
      gyroSubscription.remove();
    };
  }, [updateInterval]);

  const handleTabChange = (tab: 'accelerometer' | 'gyroscope') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setActiveTab(tab);
  };

  const handleIntervalChange = (ms: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setUpdateInterval(ms);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sensores Físicos"
        showBack
        onBack={onBack}
        subtitle="Acelerómetro & Giroscopio"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selector de Pestañas */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'accelerometer' && styles.tabButtonActive]}
            onPress={() => handleTabChange('accelerometer')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="speedometer-outline"
              size={18}
              color={activeTab === 'accelerometer' ? colors.accentAmber : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'accelerometer' && styles.tabTextActive,
              ]}
            >
              Acelerómetro (G)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'gyroscope' && styles.tabButtonActive]}
            onPress={() => handleTabChange('gyroscope')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sync-circle-outline"
              size={18}
              color={activeTab === 'gyroscope' ? colors.accentCyan : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'gyroscope' && styles.tabTextActive,
              ]}
            >
              Giroscopio (rad/s)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nivel de Burbuja Interactivo (con datos de Acelerómetro) */}
        <View style={styles.bubbleCard}>
          <Text style={styles.cardHeaderTitle}>NIVEL DE BURBUJA FÍSICO</Text>
          <Text style={styles.cardSubText}>
            Inclina tu teléfono para comprobar la gravedad y nivelación en los ejes X e Y.
          </Text>
          <BubbleLevel x={accelData.x} y={accelData.y} />
        </View>

        {/* Telemetría 3 Ejes */}
        <View style={styles.telemetryCard}>
          <Text style={styles.cardHeaderTitle}>
            LECTURA VECTORIAL EN TIEMPO REAL ({activeTab.toUpperCase()})
          </Text>

          {/* Eje X */}
          <View style={styles.axisRow}>
            <View style={styles.axisHeader}>
              <View style={[styles.axisDot, { backgroundColor: colors.accentRose }]} />
              <Text style={styles.axisLabel}>EJE X (Lateral):</Text>
              <Text style={styles.axisVal}>
                {(activeTab === 'accelerometer' ? accelData.x : gyroData.x).toFixed(3)}
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.accentRose,
                    width: `${Math.min(
                      100,
                      Math.abs(activeTab === 'accelerometer' ? accelData.x : gyroData.x) * 80
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Eje Y */}
          <View style={styles.axisRow}>
            <View style={styles.axisHeader}>
              <View style={[styles.axisDot, { backgroundColor: colors.accentCyan }]} />
              <Text style={styles.axisLabel}>EJE Y (Longitudinal):</Text>
              <Text style={styles.axisVal}>
                {(activeTab === 'accelerometer' ? accelData.y : gyroData.y).toFixed(3)}
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.accentCyan,
                    width: `${Math.min(
                      100,
                      Math.abs(activeTab === 'accelerometer' ? accelData.y : gyroData.y) * 80
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Eje Z */}
          <View style={styles.axisRow}>
            <View style={styles.axisHeader}>
              <View style={[styles.axisDot, { backgroundColor: colors.accentEmerald }]} />
              <Text style={styles.axisLabel}>EJE Z (Vertical):</Text>
              <Text style={styles.axisVal}>
                {(activeTab === 'accelerometer' ? accelData.z : gyroData.z).toFixed(3)}
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.accentEmerald,
                    width: `${Math.min(
                      100,
                      Math.abs(activeTab === 'accelerometer' ? accelData.z : gyroData.z) * 80
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Selector de Frecuencia / Intervalo de Muestreo */}
        <View style={styles.intervalCard}>
          <Text style={styles.cardHeaderTitle}>FRECUENCIA DE MUESTREO</Text>
          <View style={styles.intervalRow}>
            {[50, 100, 250, 500].map((ms) => (
              <TouchableOpacity
                key={ms}
                style={[
                  styles.intervalBtn,
                  updateInterval === ms && styles.intervalBtnActive,
                ]}
                onPress={() => handleIntervalChange(ms)}
              >
                <Text
                  style={[
                    styles.intervalText,
                    updateInterval === ms && styles.intervalTextActive,
                  ]}
                >
                  {ms} ms
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: colors.surfaceLight,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  bubbleCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardHeaderTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  cardSubText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
    lineHeight: 17,
  },
  telemetryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  axisRow: {
    marginTop: 14,
  },
  axisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  axisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  axisLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  axisVal: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  intervalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  intervalRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  intervalBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  intervalBtnActive: {
    backgroundColor: colors.accentAmber,
    borderColor: colors.accentAmber,
  },
  intervalText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  intervalTextActive: {
    color: '#000',
    fontWeight: '800',
  },
});
