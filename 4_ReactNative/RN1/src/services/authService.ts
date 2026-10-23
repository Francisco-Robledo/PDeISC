// src/services/authService.ts
import { LoginResponse } from '../types/usuario';

export async function peticionLogin(
  identificador: string,
  contrasena: string,
  urlServicio: string
): Promise<LoginResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout

  try {
    const respuesta = await fetch(urlServicio, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: identificador.trim(),
        correo: identificador.trim(),
        usuario: identificador.trim(),
        password: contrasena,
        contrasena: contrasena,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const datos: LoginResponse = await respuesta.json();

    if (!respuesta.ok && !datos.mensaje) {
      return {
        success: false,
        mensaje: `Error del servidor HTTP ${respuesta.status}`,
      };
    }

    return datos;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return {
        success: false,
        mensaje: 'Tiempo de espera agotado. Verifica que el servidor backend esté encendido.',
      };
    }

    return {
      success: false,
      mensaje: `No se pudo conectar al backend (${urlServicio}). ¿Está el servidor iniciado?`,
      error: error.message,
    };
  }
}
