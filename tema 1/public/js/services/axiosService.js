/**
 * Servicio HTTP basado en AXIOS
 * Demuestra el uso de la biblioteca Axios para operaciones asíncronas con el servidor Node.js.
 * Registra métricas de respuesta para el monitor visual en el frontend.
 */
export const axiosService = {
  // Callback para notificar al monitor de red cada vez que se usa Axios
  onHttpLog: null,

  /**
   * Helper para medir tiempo de respuesta y registrar en el monitor
   */
  async _ejecutar(metodo, url, data = null, params = null) {
    const inicio = performance.now();
    try {
      // Llamada directa con la biblioteca AXIOS
      const respuesta = await window.axios({
        method: metodo,
        url: url,
        data: data,
        params: params
      });
      const fin = performance.now();
      const duracion = Math.round(fin - inicio);

      if (this.onHttpLog) {
        this.onHttpLog({
          cliente: 'AXIOS',
          metodo: metodo.toUpperCase(),
          url,
          status: respuesta.status,
          duracionMs: duracion,
          exito: true,
          mensajeServidor: respuesta.data?.message || 'OK'
        });
      }

      return respuesta.data;
    } catch (error) {
      const fin = performance.now();
      const duracion = Math.round(fin - inicio);
      const status = error.response ? error.response.status : 500;
      const dataServidor = error.response ? error.response.data : null;

      if (this.onHttpLog) {
        this.onHttpLog({
          cliente: 'AXIOS',
          metodo: metodo.toUpperCase(),
          url,
          status,
          duracionMs: duracion,
          exito: false,
          mensajeServidor: dataServidor?.message || error.message
        });
      }

      throw dataServidor || error;
    }
  },

  /**
   * GET /api/gastos (Consulta con AXIOS)
   */
  async obtenerGastos(filtros = {}) {
    return await this._ejecutar('GET', '/api/gastos', null, filtros);
  },

  /**
   * GET /api/gastos/:id (Consulta con AXIOS)
   */
  async obtenerGastoPorId(id) {
    return await this._ejecutar('GET', `/api/gastos/${id}`);
  },

  /**
   * POST /api/gastos (Envío de datos JSON con AXIOS)
   */
  async crearGasto(datosGasto) {
    return await this._ejecutar('POST', '/api/gastos', datosGasto);
  },

  /**
   * PUT /api/gastos/:id (Actualización con AXIOS)
   */
  async actualizarGasto(id, datosActualizados) {
    return await this._ejecutar('PUT', `/api/gastos/${id}`, datosActualizados);
  },

  /**
   * DELETE /api/gastos/:id (Eliminación con AXIOS)
   */
  async eliminarGasto(id) {
    return await this._ejecutar('DELETE', `/api/gastos/${id}`);
  }
};
