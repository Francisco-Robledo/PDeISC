import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface LocationScreenProps {
  onBack: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({ onBack }) => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [locationData, setLocationData] = useState<Location.LocationObject | null>(null);
  const [addressData, setAddressData] = useState<Location.LocationGeocodedAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage('El permiso de localización en primer plano fue denegado.');
        setIsLoading(false);
        return;
      }

      // Obtener posición de alta precisión
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocationData(position);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      // Geocodificación inversa
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocoded && geocoded.length > 0) {
        setAddressData(geocoded[0]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al obtener la ubicación del GPS.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    fetchLocation();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Ubicación & GPS"
        showBack
        onBack={onBack}
        subtitle="Telemetría Satelital"
        rightAction={{
          icon: 'refresh',
          onPress: handleRefresh,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner de Estado GPS */}
        <View style={styles.statusBanner}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.pulseIndicator,
                {
                  backgroundColor:
                    permissionStatus === Location.PermissionStatus.GRANTED
                      ? colors.accentEmerald
                      : colors.accentAmber,
                },
              ]}
            />
            <Text style={styles.statusTitle}>
              {permissionStatus === Location.PermissionStatus.GRANTED
                ? 'SEÑAL GPS FIJADA'
                : 'BUSCANDO SATÉLITES'}
            </Text>
          </View>
          <Ionicons
            name="navigate-circle-outline"
            size={24}
            color={colors.accentEmerald}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.accentEmerald} />
            <Text style={styles.loadingText}>Adquiriendo coordenadas de alta precisión...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={44} color={colors.danger} />
            <Text style={styles.errorTitle}>Error de Ubicación</Text>
            <Text style={styles.errorDesc}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLocation}>
              <Ionicons name="reload" size={18} color="#FFF" />
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : locationData ? (
          <>
            {/* Tarjeta de Coordenadas Principales */}
            <View style={styles.coordsCard}>
              <Text style={styles.cardHeaderTitle}>COORDENADAS GEOGRÁFICAS</Text>

              <View style={styles.coordRow}>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>LATITUD</Text>
                  <Text style={styles.coordValue}>
                    {locationData.coords.latitude.toFixed(6)}°
                  </Text>
                </View>
                <View style={styles.coordDivider} />
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>LONGITUD</Text>
                  <Text style={styles.coordValue}>
                    {locationData.coords.longitude.toFixed(6)}°
                  </Text>
                </View>
              </View>

              <View style={styles.telemetryGrid}>
                <View style={styles.telemetryItem}>
                  <Ionicons name="speedometer-outline" size={20} color={colors.accentCyan} />
                  <View style={styles.telemetryDetails}>
                    <Text style={styles.telemetryLabel}>Precisión</Text>
                    <Text style={styles.telemetryValue}>
                      ± {locationData.coords.accuracy?.toFixed(1) ?? 'N/A'} m
                    </Text>
                  </View>
                </View>

                <View style={styles.telemetryItem}>
                  <Ionicons name="trending-up-outline" size={20} color={colors.accentViolet} />
                  <View style={styles.telemetryDetails}>
                    <Text style={styles.telemetryLabel}>Altitud</Text>
                    <Text style={styles.telemetryValue}>
                      {locationData.coords.altitude
                        ? `${locationData.coords.altitude.toFixed(1)} m`
                        : 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.telemetryItem}>
                  <Ionicons name="compass-outline" size={20} color={colors.accentAmber} />
                  <View style={styles.telemetryDetails}>
                    <Text style={styles.telemetryLabel}>Rumbo (Heading)</Text>
                    <Text style={styles.telemetryValue}>
                      {locationData.coords.heading
                        ? `${locationData.coords.heading.toFixed(0)}°`
                        : '0°'}
                    </Text>
                  </View>
                </View>

                <View style={styles.telemetryItem}>
                  <Ionicons name="car-outline" size={20} color={colors.accentRose} />
                  <View style={styles.telemetryDetails}>
                    <Text style={styles.telemetryLabel}>Velocidad</Text>
                    <Text style={styles.telemetryValue}>
                      {locationData.coords.speed && locationData.coords.speed > 0
                        ? `${(locationData.coords.speed * 3.6).toFixed(1)} km/h`
                        : '0.0 km/h'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Dirección Geocodificada Inversa */}
            {addressData ? (
              <View style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Ionicons name="business-outline" size={20} color={colors.accentEmerald} />
                  <Text style={styles.addressHeaderTitle}>DIRECCIÓN APROXIMADA</Text>
                </View>

                <Text style={styles.streetText}>
                  {addressData.street || addressData.name || 'Calle sin denominar'}
                  {addressData.streetNumber ? ` #${addressData.streetNumber}` : ''}
                </Text>

                <Text style={styles.cityText}>
                  {[addressData.district, addressData.city, addressData.region, addressData.country]
                    .filter(Boolean)
                    .join(', ')}
                </Text>

                {addressData.postalCode ? (
                  <View style={styles.postalBadge}>
                    <Text style={styles.postalText}>CP: {addressData.postalCode}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Botón de Actualizar */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.8}
            >
              <Ionicons name="sync" size={20} color="#000" />
              <Text style={styles.refreshButtonText}>Actualizar Coordenadas Ahora</Text>
            </TouchableOpacity>
          </>
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
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  coordsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  coordBox: {
    flex: 1,
    alignItems: 'center',
  },
  coordDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.surfaceBorder,
  },
  coordLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordValue: {
    color: colors.accentEmerald,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  telemetryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 10,
  },
  telemetryDetails: {
    flex: 1,
  },
  telemetryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  telemetryValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  addressHeaderTitle: {
    color: colors.accentEmerald,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  streetText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cityText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  postalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  postalText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accentEmerald,
    paddingVertical: 14,
    borderRadius: 14,
  },
  refreshButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
});
