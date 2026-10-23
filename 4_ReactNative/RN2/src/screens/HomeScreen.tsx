import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { ToolCard } from '../components/ToolCard';
import { ScreenName } from '../types/navigation';
import { colors } from '../theme/colors';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Device Tools Hub"
        subtitle="Hardware & Sensores Móviles"
        rightAction={{
          icon: 'information-circle-outline',
          onPress: () => onNavigate('sensors'),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Bienvenida y Estado */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.badgeLive}>
              <View style={styles.livePulse} />
              <Text style={styles.liveText}>DISPOSITIVO CONECTADO</Text>
            </View>
            <Ionicons name="hardware-chip-outline" size={24} color={colors.accentCyan} />
          </View>
          <Text style={styles.heroTitle}>Kit de Herramientas Nativas</Text>
          <Text style={styles.heroSubtitle}>
            Prueba en tiempo real las APIs de hardware de tu dispositivo móvil y compila el APK con Expo EAS.
          </Text>
        </View>

        {/* Sección de Tarjetas de Herramientas */}
        <Text style={styles.sectionTitle}>HERRAMIENTAS DISPONIBLES</Text>

        <ToolCard
          title="Cámara HD"
          subtitle="Captura fotos, alterna cámara frontal/trasera y controla el flash."
          category="Multimedia"
          iconName="camera"
          accentColor={colors.cardCamera}
          statusBadge="API v2"
          onPress={() => onNavigate('camera')}
        />

        <ToolCard
          title="Lector de Códigos"
          subtitle="Escaneo instantáneo de códigos QR, EAN-13, Code 128 y más."
          category="Óptico"
          iconName="qr-code"
          accentColor={colors.cardBarcode}
          statusBadge="Detección en vivo"
          onPress={() => onNavigate('barcode')}
        />

        <ToolCard
          title="Ubicación & GPS"
          subtitle="Telemetría satelital, altitud, precisión y dirección inversa."
          category="Geolocalización"
          iconName="location"
          accentColor={colors.cardLocation}
          statusBadge="GPS Activo"
          onPress={() => onNavigate('location')}
        />

        <ToolCard
          title="Acelerómetro & Giroscopio"
          subtitle="Medición de inclinación y aceleración 3D con nivel de burbuja interactivo."
          category="Cinemática"
          iconName="speedometer"
          accentColor={colors.cardSensors}
          statusBadge="3 Ejes"
          onPress={() => onNavigate('sensors')}
        />

        <ToolCard
          title="Biometría & Seguridad"
          subtitle="Autenticación local con huella dactilar, Face ID o PIN seguro."
          category="Seguridad"
          iconName="finger-print"
          accentColor={colors.cardBiometrics}
          statusBadge="Hardware Seguro"
          onPress={() => onNavigate('biometrics')}
        />

        {/* Footer Informativo EAS Build */}
        <View style={styles.easInfoCard}>
          <Ionicons name="logo-android" size={28} color={colors.accentEmerald} />
          <View style={styles.easTextContainer}>
            <Text style={styles.easTitle}>Listo para compilar APK</Text>
            <Text style={styles.easDescription}>
              Configurado con EAS Build en perfil "preview" para generar un instalador .apk independiente.
            </Text>
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
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  livePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accentCyan,
    marginRight: 6,
  },
  liveText: {
    color: colors.accentCyan,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  easInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginTop: 8,
  },
  easTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  easTitle: {
    color: colors.accentEmerald,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  easDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
