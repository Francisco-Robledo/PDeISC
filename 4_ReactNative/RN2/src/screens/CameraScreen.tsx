import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface CameraScreenProps {
  onBack: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onBack }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const cameraRef = useRef<any>(null);

  const toggleFacing = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setFlashEnabled((prev) => !prev);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (photo && photo.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Estado de permisos no definidos aún
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Header title="Cámara HD" showBack onBack={onBack} />
        <View style={styles.stateContent}>
          <ActivityIndicator size="large" color={colors.accentCyan} />
          <Text style={styles.stateText}>Comprobando permisos de cámara...</Text>
        </View>
      </View>
    );
  }

  // Permiso denegado
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Header title="Cámara HD" showBack onBack={onBack} />
        <View style={styles.stateContent}>
          <View style={styles.permissionIconWrapper}>
            <Ionicons name="camera-outline" size={54} color={colors.accentAmber} />
          </View>
          <Text style={styles.permissionTitle}>Permiso Requerido</Text>
          <Text style={styles.permissionDescription}>
            Para utilizar la cámara y capturar fotos en este ejercicio, debes otorgar el permiso correspondiente.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={20} color="#000" />
            <Text style={styles.permissionButtonText}>Otorgar Permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Cámara HD"
        showBack
        onBack={onBack}
        subtitle={facing === 'back' ? 'Cámara Trasera' : 'Cámara Frontal'}
      />

      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          enableTorch={flashEnabled}
        />

        {/* Overlay Superior de Controles */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={[styles.glassButton, flashEnabled && styles.glassButtonActive]}
            onPress={toggleFlash}
            activeOpacity={0.7}
          >
            <Ionicons
              name={flashEnabled ? 'flash' : 'flash-off'}
              size={22}
              color={flashEnabled ? colors.accentAmber : '#FFF'}
            />
          </TouchableOpacity>

          <View style={styles.cameraModeBadge}>
            <Text style={styles.cameraModeText}>
              {facing === 'back' ? 'TRIPLEX 4K' : 'SELFIE'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.glassButton}
            onPress={toggleFacing}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-reverse" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Overlay Inferior de Disparo */}
        <View style={styles.bottomControls}>
          <View style={styles.bottomPlaceholder} />

          <TouchableOpacity
            style={styles.shutterButtonOuter}
            onPress={handleCapture}
            disabled={isCapturing}
            activeOpacity={0.7}
          >
            <View style={styles.shutterButtonInner}>
              {isCapturing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <View style={styles.shutterDot} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipPreviewButton}
            onPress={toggleFacing}
            activeOpacity={0.7}
          >
            <Ionicons name="sync" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Vista Previa de Foto Capturada */}
      <Modal
        visible={!!capturedPhoto}
        transparent
        animationType="slide"
        onRequestClose={() => setCapturedPhoto(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto Capturada</Text>
              <TouchableOpacity
                onPress={() => setCapturedPhoto(null)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {capturedPhoto ? (
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setCapturedPhoto(null)}
              >
                <Ionicons name="refresh" size={18} color={colors.textPrimary} />
                <Text style={styles.retakeText}>Tomar otra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => setCapturedPhoto(null)}
              >
                <Ionicons name="checkmark" size={18} color="#000" />
                <Text style={styles.acceptText}>Listo</Text>
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
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
    backgroundColor: colors.accentCyan,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  topControls: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  glassButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: colors.accentAmber,
  },
  cameraModeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cameraModeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  bottomPlaceholder: {
    width: 50,
  },
  shutterButtonOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accentCyan,
  },
  flipPreviewButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  previewImage: {
    width: '100%',
    height: 380,
    borderRadius: 14,
    backgroundColor: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  retakeText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentCyan,
    paddingVertical: 12,
    borderRadius: 12,
  },
  acceptText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
});
