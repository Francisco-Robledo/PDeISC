import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface BarcodeScannerScreenProps {
  onBack: () => void;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({ onBack }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<BarcodeScanningResult | null>(null);
  const [torch, setTorch] = useState<boolean>(false);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    setScanResult(result);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  };

  const resetScanner = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setScanned(false);
    setScanResult(null);
  };

  const toggleTorch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setTorch((prev) => !prev);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Header title="Lector de Códigos" showBack onBack={onBack} />
        <View style={styles.stateContent}>
          <ActivityIndicator size="large" color={colors.accentViolet} />
          <Text style={styles.stateText}>Verificando permisos...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Header title="Lector de Códigos" showBack onBack={onBack} />
        <View style={styles.stateContent}>
          <View style={styles.permissionIconWrapper}>
            <Ionicons name="qr-code-outline" size={54} color={colors.accentViolet} />
          </View>
          <Text style={styles.permissionTitle}>Permiso de Cámara Requerido</Text>
          <Text style={styles.permissionDescription}>
            El lector necesita acceso a la cámara para decodificar códigos QR y de barras en tiempo real.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
            <Text style={styles.permissionButtonText}>Habilitar Cámara</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Lector de Códigos"
        showBack
        onBack={onBack}
        subtitle="QR, EAN-13, Code 128"
        rightAction={{
          icon: torch ? 'flash' : 'flash-off',
          onPress: toggleTorch,
        }}
      />

      <View style={styles.scannerWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'ean13',
              'ean8',
              'code128',
              'code39',
              'upc_a',
              'upc_e',
              'pdf417',
              'aztec',
              'datamatrix',
            ],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />

        {/* Retícula de Escaneo */}
        <View style={styles.overlayMask}>
          <View style={styles.topMask} />
          <View style={styles.middleRow}>
            <View style={styles.sideMask} />
            <View style={styles.targetFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <View style={styles.laserLine} />
            </View>
            <View style={styles.sideMask} />
          </View>
          <View style={styles.bottomMask}>
            <Text style={styles.instructionText}>
              Apunta con la cámara hacia el código QR o código de barras
            </Text>
          </View>
        </View>
      </View>

      {/* Modal de Resultado */}
      <Modal
        visible={!!scanResult}
        transparent
        animationType="fade"
        onRequestClose={resetScanner}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.accentEmerald} />
                <Text style={styles.resultBadgeText}>
                  {scanResult?.type?.toUpperCase() || 'CÓDIGO DETECTADO'}
                </Text>
              </View>
              <TouchableOpacity onPress={resetScanner} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.dataLabel}>Contenido del Código:</Text>
            <View style={styles.dataBox}>
              <Text style={styles.dataText} selectable>
                {scanResult?.data}
              </Text>
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={resetScanner}
                activeOpacity={0.8}
              >
                <Ionicons name="scan-outline" size={20} color="#FFF" />
                <Text style={styles.rescanButtonText}>Escanear de Nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 16,
  },
  permissionIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  permissionDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentViolet,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlayMask: {
    ...StyleSheet.absoluteFill,
  },
  topMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 280,
  },
  sideMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  targetFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.accentViolet,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  laserLine: {
    width: '90%',
    height: 2,
    backgroundColor: colors.accentViolet,
    shadowColor: colors.accentViolet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  resultBadgeText: {
    color: colors.accentEmerald,
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  dataLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataBox: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
    maxHeight: 180,
  },
  dataText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  resultActions: {
    flexDirection: 'row',
  },
  rescanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentViolet,
    paddingVertical: 14,
    borderRadius: 14,
  },
  rescanButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
