// App.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaginaLogin } from './src/screens/PaginaLogin';
import { PaginaBienvenida } from './src/screens/PaginaBienvenida';
import { Usuario, TipoPagina } from './src/types/usuario';

export default function App() {
  // -----------------------------------------------------------------------
  // REQUISITO 1: Paginación - Página principal con formulario de ingreso
  // y cambio a la página de bienvenida si los datos son correctos.
  // -----------------------------------------------------------------------
  const [paginaActual, setPaginaActual] = useState<TipoPagina>('login');
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);

  // Callback ejecutado cuando el backend valida exitosamente las credenciales
  const handleLoginExitoso = (usuario: Usuario) => {
    setUsuarioActivo(usuario);
    // Transición / Paginación a la pantalla de bienvenida
    setPaginaActual('bienvenida');
  };

  // Callback para cerrar sesión y regresar al formulario principal
  const handleCerrarSesion = () => {
    setUsuarioActivo(null);
    setPaginaActual('login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Paginación de pantallas */}
      {paginaActual === 'login' ? (
        <PaginaLogin onLoginExitoso={handleLoginExitoso} />
      ) : (
        // -------------------------------------------------------------------
        // REQUISITO 2: Por medio de PROPS debe de pasar los datos
        // a la página de bienvenida.
        // Aquí pasamos el objeto `usuario` completo y el callback mediante props.
        // -------------------------------------------------------------------
        usuarioActivo && (
          <PaginaBienvenida
            usuario={usuarioActivo}
            onCerrarSesion={handleCerrarSesion}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});
