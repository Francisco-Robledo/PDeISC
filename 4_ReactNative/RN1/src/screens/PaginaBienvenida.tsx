// src/screens/PaginaBienvenida.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Usuario } from '../types/usuario';

// -------------------------------------------------------------------------
// REQUISITO 2: Por medio de Props debe de pasar los datos a la página de bienvenida
// Definimos la interfaz con los props requeridos: usuario y callback onCerrarSesion
// -------------------------------------------------------------------------
export interface PaginaBienvenidaProps {
  usuario: Usuario;
  onCerrarSesion: () => void;
}

export const PaginaBienvenida: React.FC<PaginaBienvenidaProps> = (props) => {
  const { usuario, onCerrarSesion } = props;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado Superior */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.saludoTexto}>¡Hola, Bienvenido/a!</Text>
          <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
          <View style={styles.badgeRol}>
            <Text style={styles.badgeRolTexto}>{usuario.rol || 'Usuario'}</Text>
          </View>
        </View>

        {/* Notificación informativa sobre la recepción por Props */}
        <View style={styles.propsInfoBox}>
          <Text style={styles.propsInfoTitulo}>📦 Datos Recibidos vía Props</Text>
          <Text style={styles.propsInfoDesc}>
            Este componente (PaginaBienvenida) recibió la información del usuario
            exclusivamente a través de sus <Text style={styles.boldText}>props</Text> desde
            el componente padre (App.tsx).
          </Text>
        </View>

        {/* Tarjeta de Detalles del Usuario */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Información de la Cuenta</Text>
          
          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Identificador (ID):</Text>
            <Text style={styles.valor}>#{usuario.id}</Text>
          </View>

          <View style={styles.separador} />

          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Correo Electrónico:</Text>
            <Text style={styles.valor}>{usuario.email}</Text>
          </View>

          <View style={styles.separador} />

          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Nombre Completo:</Text>
            <Text style={styles.valor}>{usuario.nombre}</Text>
          </View>

          <View style={styles.separador} />

          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Rol en el Sistema:</Text>
            <Text style={styles.valorDestacado}>{usuario.rol}</Text>
          </View>

          {usuario.telefono && (
            <>
              <View style={styles.separador} />
              <View style={styles.filaDetalle}>
                <Text style={styles.etiqueta}>Teléfono:</Text>
                <Text style={styles.valor}>{usuario.telefono}</Text>
              </View>
            </>
          )}

          {usuario.fechaRegistro && (
            <>
              <View style={styles.separador} />
              <View style={styles.filaDetalle}>
                <Text style={styles.etiqueta}>Fecha Registro:</Text>
                <Text style={styles.valor}>
                  {new Date(usuario.fechaRegistro).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}

          <View style={styles.separador} />

          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Estado de Sesión:</Text>
            <View style={styles.estadoActivoContainer}>
              <View style={styles.puntoVerde} />
              <Text style={styles.estadoActivoTexto}>Autenticado</Text>
            </View>
          </View>
        </View>

        {/* Botón para Cerrar Sesión y Regresar */}
        <TouchableOpacity
          style={styles.botonCerrarSesion}
          onPress={onCerrarSesion}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonCerrar}>Cerrar Sesión / Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  saludoTexto: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  nombreUsuario: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  badgeRol: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeRolTexto: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },
  propsInfoBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 20,
  },
  propsInfoTitulo: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  propsInfoDesc: {
    color: '#047857',
    fontSize: 13,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  separador: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  etiqueta: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  valor: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  valorDestacado: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  estadoActivoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  puntoVerde: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#31C48D',
    marginRight: 6,
  },
  estadoActivoTexto: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: '600',
  },
  botonCerrarSesion: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  textoBotonCerrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
