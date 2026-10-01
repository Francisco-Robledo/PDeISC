/**
 * Servicio HTTP basado en FETCH API nativa
 * Demuestra el uso de la API Fetch estándar del navegador para comunicarse con el servidor Node.js.
 * Utiliza promesas, async/await y maneja respuestas del servidor.
 */
export const fetchService = {
  // Callback para notificar al monitor de red cada vez que se usa Fetch
  onHttpLog: null,

  /**
   * Helper común para peticiones con FETCH
   */
  async _ejecutar(url, opciones = {}) {
    const inicio = performance.now();
    const metodo = (opciones.method || 'GET').toUpperCase();

    try {
      // Uso de la función nativa fetch()
      const respuesta = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(opciones.headers || {})
        },
        ...opciones
      });

      const fin = performance.now();
      const duracion = Math.round(fin - inicio);
      const data = await respuesta.json();

      if (this.onHttpLog) {
        this.onHttpLog({
          cliente: 'FETCH',
          metodo,
          url,
          status: respuesta.status,
          duracionMs: duracion,
          exito: respuesta.ok,
          mensajeServidor: data.message || (respuesta.ok ? 'OK' : 'Error')
        });
      }

      if (!respuesta.ok) {
        throw data;
      }

      return data;
    } catch (error) {
      const fin = performance.now();
      const duracion = Math.round(fin - inicio);

      if (this.onHttpLog && (!error.statusCode || error.statusCode >= 400)) {
        this.onHttpLog({
          cliente: 'FETCH',
          metodo,
          url,
          status: error.statusCode || 500,
          duracionMs: duracion,
          exito: false,
          mensajeServidor: error.message || 'Error de conexión'
        });
      }

      throw error;
    }
  },

  /**
   * GET /api/resumen (Consulta con FETCH)
   */
  async obtenerResumen() {
    return await this._ejecutar('/api/resumen');
  },

  /**
   * PUT /api/resumen/presupuesto (Actualización con FETCH)
   */
  async actualizarPresupuesto(nuevoPresupuesto) {
    return await this._ejecutar('/api/resumen/presupuesto', {
      method: 'PUT',
      body: JSON.stringify({ presupuesto: Number(nuevoPresupuesto) })
    });
  },

  /**
   * GET /api/resumen/divisas (Consulta de divisas con FETCH)
   */
  async obtenerDivisas() {
    return await this._ejecutar('/api/resumen/divisas');
  },

  /**
   * GET /api/gastos/eventos (Consulta de historial de eventos en el servidor con FETCH)
   */
  async obtenerEventosServidor() {
    return await this._ejecutar('/api/gastos/eventos');
  },

  /**
   * GET /api/estado (Healthcheck con FETCH)
   */
  async verificarEstado() {
    return await this._ejecutar('/api/estado');
  }
};
