import axios from 'axios';
import { gestorGastos } from './gastosController.js';
import { emisorEventos } from '../utils/eventos.js';

/**
 * Controlador de Resumen, Estadísticas y Divisas
 * Demuestra:
 * - Reducciones y mapeos de vectores
 * - Respuestas elaboradas del lado del servidor
 * - Uso de AXIOS en el backend para consultar servicios externos
 */
export const resumenController = {
  /**
   * Obtiene métricas consolidadas del sistema
   */
  obtenerResumen(req, res) {
    try {
      const estadisticas = gestorGastos.obtenerEstadisticas();
      const distribucionCategorias = gestorGastos.obtenerDistribucionPorCategoria();

      // Métodos de pago agrupados con reduce
      const distribucionPagos = gestorGastos.vectorGastos.reduce((acc, gasto) => {
        const metodo = gasto.metodoPago || 'Efectivo';
        acc[metodo] = (acc[metodo] || 0) + gasto.monto;
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Resumen financiero calculado exitosamente en el servidor.',
        data: {
          estadisticas,
          distribucionCategorias,
          distribucionPagos,
          alertaPresupuesto: estadisticas.estaExcedido
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error al procesar el resumen financiero.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Actualiza el límite del presupuesto mensual
   */
  actualizarPresupuesto(req, res) {
    try {
      const { presupuesto } = req.body;

      if (presupuesto === undefined || isNaN(Number(presupuesto)) || Number(presupuesto) < 0) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'El presupuesto debe ser un número válido mayor o igual a 0.',
          timestamp: new Date().toISOString()
        });
      }

      gestorGastos.presupuestoMensual = Number(presupuesto);
      emisorEventos.emit('presupuestoActualizado', gestorGastos.presupuestoMensual);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Presupuesto mensual actualizado exitosamente en el servidor.',
        data: {
          nuevoPresupuesto: gestorGastos.presupuestoMensual,
          saldoRestante: gestorGastos.saldoRestante,
          porcentajeConsumido: gestorGastos.porcentajeConsumido,
          estaExcedido: gestorGastos.estaPresupuestoExcedido
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Error al actualizar el presupuesto.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Obtiene cotizaciones de divisas
   * Utiliza la librería AXIOS en el entorno Node.js para conectar con un servicio o simulación
   */
  async obtenerCotizaciones(req, res) {
    try {
      let cotizaciones = null;
      let fuente = 'API Externa (Axios Node.js)';

      try {
        // Intento de conexión con API de divisas usando Axios en Node.js
        const respuesta = await axios.get('https://open.er-api.com/v6/latest/USD', {
          timeout: 2500
        });

        if (respuesta.data && respuesta.data.rates) {
          const ars = respuesta.data.rates.ARS || 1150;
          const eur = respuesta.data.rates.EUR || 0.92;
          const brl = respuesta.data.rates.BRL || 5.6;

          cotizaciones = {
            base: 'ARS',
            USD: Math.round((1 / ars) * 100000) / 100000,
            EUR: Math.round((eur / ars) * 100000) / 100000,
            BRL: Math.round((brl / ars) * 100000) / 100000,
            valoresDirectos: {
              dolarOficial: Math.round(ars * 100) / 100,
              euro: Math.round((ars / eur) * 100) / 100
            }
          };
        }
      } catch (axiosError) {
        // En caso de estar sin internet o timeout, se usa cotización de contingencia calculada con Axios local
        fuente = 'Cotización de Referencia Local (Servidor Node.js)';
        cotizaciones = {
          base: 'ARS',
          USD: 0.00087,  // Aprox 1 USD = 1150 ARS
          EUR: 0.00080,  // Aprox 1 EUR = 1250 ARS
          BRL: 0.0048,   // Aprox 1 BRL = 208 ARS
          valoresDirectos: {
            dolarOficial: 1150,
            euro: 1250
          }
        };
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Cotizaciones de divisas obtenidas por el servidor con Axios.',
        fuente,
        libreriaUtilizada: 'Axios en Node.js',
        data: cotizaciones,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'No fue posible obtener las cotizaciones de divisas.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};
