// src/screens/PaginaLogin.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Usuario } from '../types/usuario';
import { peticionLogin } from '../services/authService';
import { getApiUrlPorDefecto, PHP_XAMPP_URL, LOCAL_IP } from '../config/constants';

export interface PaginaLoginProps {
  onLoginExitoso: (usuario: Usuario) => void;
}

export const PaginaLogin: React.FC<PaginaLoginProps> = ({ onLoginExitoso }) => {
  const [identificador, setIdentificador] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [advertencia, setAdvertencia] = useState<string | null>(null);

  // Configuración de API
  const [apiUrl, setApiUrl] = useState<string>(getApiUrlPorDefecto());
  const [mostrarConfigApi, setMostrarConfigApi] = useState(false);

  const ejecutarLogin = async () => {
    setMensajeError(null);
    setAdvertencia(null);

    if (!identificador.trim()) {
      setMensajeError('Por favor, ingresa tu correo electrónico o usuario.');
      return;
    }
    if (!contrasena) {
      setMensajeError('Por favor, ingresa tu contraseña.');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await peticionLogin(identificador, contrasena, apiUrl);

      if (respuesta.success && respuesta.usuario) {
        if (respuesta.advertencia) {
          Alert.alert('Aviso del Servidor', respuesta.advertencia);
        }
        // Se llama al callback pasando el usuario para cambiar de página
        onLoginExitoso(respuesta.usuario);
      } else {
        setMensajeError(respuesta.mensaje || 'Error en las credenciales.');
      }
    } catch (err: any) {
      setMensajeError('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  // Botones de ayuda con credenciales de prueba de database.sql
  const autollenarCredenciales = (correo: string, pass: string) => {
    setIdentificador(correo);
    setContrasena(pass);
    setMensajeError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconTexto}>🔐</Text>
          </View>
          <Text style={styles.titulo}>Acceso de Usuarios</Text>
          <Text style={styles.subtitulo}>Sistema RN1 - React Native Expo + MySQL</Text>
        </View>

        {/* Mensaje de Error si ocurre */}
        {mensajeError && (
          <View style={styles.cajaError}>
            <Text style={styles.textoError}>⚠️ {mensajeError}</Text>
          </View>
        )}

        {/* Formulario */}
        <View style={styles.formularioCard}>
          {/* Campo Correo / Usuario */}
          <View style={styles.campoGrupo}>
            <Text style={styles.label}>Correo o Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="admin@correo.com"
              placeholderTextColor="#9CA3AF"
              value={identificador}
              onChangeText={setIdentificador}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!cargando}
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.campoGrupo}>
            <View style={styles.filaLabel}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
                <Text style={styles.togglePassword}>
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!mostrarPassword}
              value={contrasena}
              onChangeText={setContrasena}
              autoCapitalize="none"
              editable={!cargando}
            />
          </View>

          {/* Botón Principal de Ingreso */}
          <TouchableOpacity
            style={[styles.botonIngreso, cargando && styles.botonDeshabilitado]}
            onPress={ejecutarLogin}
            disabled={cargando}
            activeOpacity={0.8}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotonIngreso}>Ingresar al Sistema</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Credenciales de Prueba Rápidas */}
        <View style={styles.seccionPruebas}>
          <Text style={styles.seccionPruebasTitulo}>Cuentas de prueba (MySQL):</Text>
          <View style={styles.filaBotonesPrueba}>
            <TouchableOpacity
              style={styles.chipPrueba}
              onPress={() => autollenarCredenciales('admin@correo.com', 'admin123')}
            >
              <Text style={styles.chipTexto}>👤 Admin (admin123)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chipPrueba}
              onPress={() => autollenarCredenciales('maria@correo.com', '123456')}
            >
              <Text style={styles.chipTexto}>👤 María (123456)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Configuración de API / Backend (Desplegable) */}
        <View style={styles.configContainer}>
          <TouchableOpacity
            style={styles.toggleConfig}
            onPress={() => setMostrarConfigApi(!mostrarConfigApi)}
          >
            <Text style={styles.toggleConfigTexto}>
              ⚙️ {mostrarConfigApi ? 'Ocultar configuración API' : 'Configuración de Backend (IP / Servidor)'}
            </Text>
          </TouchableOpacity>

          {mostrarConfigApi && (
            <View style={styles.panelConfig}>
              <Text style={styles.configLabel}>URL de la API Actual:</Text>
              <TextInput
                style={styles.configInput}
                value={apiUrl}
                onChangeText={setApiUrl}
                autoCapitalize="none"
              />

              <Text style={styles.configSugerenciaTitulo}>Accesos directos rápidos:</Text>
              <View style={styles.filaBotonesConfig}>
                <TouchableOpacity
                  style={styles.botonUrlRapida}
                  onPress={() => setApiUrl(`http://${LOCAL_IP}:3000/api/login`)}
                >
                  <Text style={styles.botonUrlTexto}>Node.js ({LOCAL_IP})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonUrlRapida}
                  onPress={() => setApiUrl('http://localhost:3000/api/login')}
                >
                  <Text style={styles.botonUrlTexto}>Node.js (localhost)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonUrlRapida}
                  onPress={() => setApiUrl(PHP_XAMPP_URL)}
                >
                  <Text style={styles.botonUrlTexto}>PHP XAMPP</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIconTexto: {
    fontSize: 32,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitulo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  cajaError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  textoError: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
  },
  formularioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  campoGrupo: {
    marginBottom: 16,
  },
  filaLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  togglePassword: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  botonIngreso: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonIngreso: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  seccionPruebas: {
    marginTop: 20,
    width: '100%',
  },
  seccionPruebasTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  filaBotonesPrueba: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  chipPrueba: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipTexto: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  configContainer: {
    marginTop: 24,
    width: '100%',
  },
  toggleConfig: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleConfigTexto: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  panelConfig: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  configLabel: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 4,
  },
  configInput: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#1F2937',
    marginBottom: 10,
  },
  configSugerenciaTitulo: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  filaBotonesConfig: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  botonUrlRapida: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  botonUrlTexto: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});
