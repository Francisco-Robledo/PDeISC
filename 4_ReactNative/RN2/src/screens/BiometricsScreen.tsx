import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface BiometricsScreenProps {
  onBack: () => void;
}

interface AuthLog {
  id: string;
  timestamp: string;
  success: boolean;
  message: string;
}

export const BiometricsScreen: React.FC<BiometricsScreenProps> = ({ onBack }) => {
  const [hasHardware, setHasHardware] = useState<boolean | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [authTypes, setAuthTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [logs, setLogs] = useState<AuthLog[]>([]);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      setHasHardware(hardware);

      if (hardware) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setAuthTypes(types);
      } else {
        setIsEnrolled(false);
      }
    } catch (error) {
      console.error('Error al consultar biometría:', error);
    }
  };

  const handleAuthenticate = async () => {
    if (isAuthenticating) return;

    try {
      setIsAuthenticating(true);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verificación de Identidad Biométrica',
        fallbackLabel: 'Ingresar PIN / Contraseña',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      const now = new Date().toLocaleTimeString();

      if (result.success) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setLogs((prev) => [
          {
            id: Date.now().toString(),
            timestamp: now,
            success: true,
            message: 'Autenticación exitosa (Identidad confirmada)',
          },
          ...prev,
        ]);
      } else {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch {}
        setLogs((prev) => [
          {
            id: Date.now().toString(),
            timestamp: now,
            success: false,
            message:
              result.error === 'user_cancel'
                ? 'Operación cancelada por el usuario'
                : `Fallo en verificación (${result.error})`,
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          success: false,
          message: err.message || 'Excepción en el sensor biométrico',
        },
        ...prev,
      ]);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getTypeName = (type: LocalAuthentication.AuthenticationType) => {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Huella Dactilar';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Reconocimiento Facial (Face ID)';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Escáner de Iris';
      default:
        return 'Biometría Genérica';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Biometría & Seguridad"
        showBack
        onBack={onBack}
        subtitle="Autenticación Local"
        rightAction={{
          icon: 'refresh-outline',
          onPress: checkBiometrics,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Central de Sensor */}
        <View style={styles.heroSensorCard}>
          <View style={styles.sensorIconOuter}>
            <Ionicons name="finger-print" size={56} color={colors.accentRose} />
          </View>
          <Text style={styles.heroSensorTitle}>Módulo Criptográfico Local</Text>
          <Text style={styles.heroSensorSub}>
            Validación de autenticidad y seguridad mediante el enclave seguro del hardware móvil.
          </Text>
        </View>

        {/* Diagnóstico de Capacidades */}
        <View style={styles.diagnosticsCard}>
          <Text style={styles.cardHeaderTitle}>DIAGNÓSTICO DEL HARDWARE</Text>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Sensor Biométrico Presente:</Text>
            <View
              style={[
                styles.diagBadge,
                hasHardware ? styles.badgeSuccess : styles.badgeDanger,
              ]}
            >
              <Ionicons
                name={hasHardware ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={hasHardware ? colors.accentEmerald : colors.danger}
              />
              <Text
                style={[
                  styles.diagBadgeText,
                  { color: hasHardware ? colors.accentEmerald : colors.danger },
                ]}
              >
                {hasHardware === null ? '...' : hasHardware ? 'COMPATIBLE' : 'NO DISPONIBLE'}
              </Text>
            </View>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagLabel}>Credenciales Enroladas:</Text>
            <View
              style={[
                styles.diagBadge,
                isEnrolled ? styles.badgeSuccess : styles.badgeAmber,
              ]}
            >
              <Ionicons
                name={isEnrolled ? 'shield-checkmark' : 'alert-circle'}
                size={14}
                color={isEnrolled ? colors.accentEmerald : colors.accentAmber}
              />
              <Text
                style={[
                  styles.diagBadgeText,
                  { color: isEnrolled ? colors.accentEmerald : colors.accentAmber },
                ]}
              >
                {isEnrolled === null ? '...' : isEnrolled ? 'CONFIGURADAS' : 'NO REGISTRADAS'}
              </Text>
            </View>
          </View>

          <View style={styles.typesContainer}>
            <Text style={styles.typesTitle}>MÉTODOS SOPORTADOS:</Text>
            {authTypes.length > 0 ? (
              authTypes.map((type, idx) => (
                <View key={idx} style={styles.typeItem}>
                  <Ionicons name="hardware-chip" size={14} color={colors.accentCyan} />
                  <Text style={styles.typeItemText}>{getTypeName(type)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noTypesText}>
                {hasHardware === false
                  ? 'No hay sensores biométricos en este dispositivo/emulador.'
                  : 'PIN o Contraseña del dispositivo.'}
              </Text>
            )}
          </View>
        </View>

        {/* Botón de Autenticación */}
        <TouchableOpacity
          style={[styles.authButton, isAuthenticating && styles.authButtonDisabled]}
          onPress={handleAuthenticate}
          disabled={isAuthenticating}
          activeOpacity={0.8}
        >
          {isAuthenticating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="finger-print" size={22} color="#FFF" />
              <Text style={styles.authButtonText}>Probar Autenticación Biométrica</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Historial de Intentos */}
        {logs.length > 0 ? (
          <View style={styles.logsCard}>
            <Text style={styles.cardHeaderTitle}>REGISTRO DE AUDITORÍA RECIENTE</Text>
            {logs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View
                  style={[
                    styles.logDot,
                    { backgroundColor: log.success ? colors.accentEmerald : colors.danger },
                  ]}
                />
                <View style={styles.logContent}>
                  <Text style={styles.logMsg}>{log.message}</Text>
                  <Text style={styles.logTime}>{log.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
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
  heroSensorCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  sensorIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  heroSensorTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSensorSub: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  diagnosticsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  cardHeaderTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  diagLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  diagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  diagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  typesContainer: {
    marginTop: 14,
  },
  typesTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  typeItemText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  noTypesText: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accentRose,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.accentRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  logsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  logContent: {
    flex: 1,
  },
  logMsg: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  logTime: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
