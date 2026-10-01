import { Gasto } from '../models/Gasto.js';
import { GestorGastos } from '../models/GestorGastos.js';
import { emisorEventos } from '../utils/eventos.js';

// Instancia global del GestorGastos que administra el Vector de Clases
export const gestorGastos = new GestorGastos(200000);

// Precargar datos iniciales de demostración en el Vector de Clases
const datosIniciales = [
  { titulo: 'Supermercado Coto', monto: 45200, categoria: 'Alimentación', fecha: '2026-09-28', descripcion: 'Compra mensual de despensa y verduras', metodoPago: 'Tarjeta de Débito' },
  { titulo: 'Factura de Luz y Gas', monto: 18500, categoria: 'Servicios', fecha: '2026-09-29', descripcion: 'Edenor y Metrogas vencimiento mensual', metodoPago: 'Transferencia Bancaria' },
  { titulo: 'Abono Gimnasio', monto: 14000, categoria: 'Salud', fecha: '2026-09-30', descripcion: 'Cuota mensual club deportivo', metodoPago: 'Billetera Virtual' },
  { titulo: 'Cena con amigos', monto: 22000, categoria: 'Entretenimiento', fecha: '2026-10-01', descripcion: 'Restaurante italiano', metodoPago: 'Tarjeta de Crédito' },
  { titulo: 'Carga de Combustible', monto: 28000, categoria: 'Transporte', fecha: '2026-10-01', descripcion: 'Tanque lleno YPF Infinia', metodoPago: 'Tarjeta de Débito' }
];

datosIniciales.forEach(dato => gestorGastos.agregarGasto(dato));

/**
 * Controlador de Gastos
 * Maneja las peticiones y elabora respuestas estructuradas del lado del servidor.
 */
export const gastosController = {
  /**
   * Obtiene la lista de gastos aplicando filtros y ordenamiento en el Vector de Clases
   */
  listarGastos(req, res) {
    try {
      const { categoria, desde, hasta, buscar, orden } = req.query;

      // Obtener el vector completo como punto de partida
      let resultado = gestorGastos.vectorGastos;

      // Aplicar filtros utilizando métodos de arrays/vectores
      if (categoria && categoria !== 'Todas') {
        resultado = resultado.filter(g => g.categoria.toLowerCase() === categoria.toLowerCase());
      }

      if (desde || hasta) {
        resultado = resultado.filter(g => {
          if (desde && g.fecha < desde) return false;
          if (hasta && g.fecha > hasta) return false;
          return true;
        });
      }

      if (buscar && buscar.trim() !== '') {
        const termino = buscar.toLowerCase().trim();
        resultado = resultado.filter(g => 
          g.titulo.toLowerCase().includes(termino) || 
          g.descripcion.toLowerCase().includes(termino)
        );
      }

      // Ordenamiento del vector
      if (orden) {
        switch (orden) {
          case 'monto_desc':
            resultado.sort((a, b) => b.monto - a.monto);
            break;
          case 'monto_asc':
            resultado.sort((a, b) => a.monto - b.monto);
            break;
          case 'fecha_asc':
            resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            break;
          case 'fecha_desc':
          default:
            resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            break;
        }
      } else {
        // Orden por defecto: fecha más reciente primero
        resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      }

      // Convertir instancias a objetos serializables
      const gastosJSON = resultado.map(g => g.toJSON());

      // Respuesta estructurada del lado del servidor
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Lista de gastos obtenida con éxito desde el servidor.',
        totalElementos: gastosJSON.length,
        data: gastosJSON,
        meta: {
          totalAcumulado: gestorGastos.totalGastos,
          presupuesto: gestorGastos.presupuestoMensual,
          filtrosAplicados: { categoria, desde, hasta, buscar, orden }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error interno en el servidor al obtener los gastos.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Obtiene un gasto individual por su ID
   */
  obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const gasto = gestorGastos.buscarPorId(id);

      if (!gasto) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: `El gasto con ID '${id}' no fue encontrado en el servidor.`,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Gasto recuperado exitosamente.',
        data: gasto.toJSON(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error al procesar la búsqueda del gasto.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Crea un nuevo gasto y lo almacena en el Vector de Clases
   */
  crearGasto(req, res) {
    try {
      const { titulo, monto, categoria, fecha, descripcion, metodoPago } = req.body;

      // Validación estricta en servidor
      const errores = [];
      if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
        errores.push('El campo "titulo" es obligatorio y debe tener al menos 3 caracteres.');
      }
      if (monto === undefined || monto === null || isNaN(Number(monto)) || Number(monto) <= 0) {
        errores.push('El campo "monto" debe ser un número mayor a 0.');
      }
      let categoriaNormalizada = null;
      if (categoria) {
        const valNorm = categoria.toString().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        categoriaNormalizada = Gasto.CATEGORIAS_VALIDAS.find(c => 
          c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === valNorm
        );
      }

      if (!categoriaNormalizada) {
        errores.push(`La categoría debe ser una de las siguientes: ${Gasto.CATEGORIAS_VALIDAS.join(', ')}.`);
      }

      if (errores.length > 0) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Fallo de validación en los datos enviados al servidor.',
          errors: errores,
          timestamp: new Date().toISOString()
        });
      }

      // Creación de la instancia de la clase Gasto (invoca sus Setters)
      const nuevoGasto = new Gasto({
        titulo,
        monto: Number(monto),
        categoria: categoriaNormalizada,
        fecha,
        descripcion,
        metodoPago
      });

      // Se agrega al Vector de Clases
      gestorGastos.agregarGasto(nuevoGasto);

      // Disparar evento del servidor
      emisorEventos.emit('gastoCreado', nuevoGasto);

      // Si el presupuesto fue excedido, emitir alerta
      if (gestorGastos.estaPresupuestoExcedido) {
        emisorEventos.emit('alertaPresupuestoExcedido', {
          total: gestorGastos.totalGastos,
          presupuesto: gestorGastos.presupuestoMensual
        });
      }

      // Respuesta exitosa del servidor
      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: '¡Gasto registrado con éxito en el servidor!',
        data: nuevoGasto.toJSON(),
        alertaPresupuesto: gestorGastos.estaPresupuestoExcedido,
        saldoRestante: gestorGastos.saldoRestante,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No se pudo crear el gasto debido a datos inválidos.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Actualiza un gasto existente en el Vector de Clases
   */
  actualizarGasto(req, res) {
    try {
      const { id } = req.params;
      const { titulo, monto, categoria, fecha, descripcion, metodoPago } = req.body;

      const gastoExistente = gestorGastos.buscarPorId(id);
      if (!gastoExistente) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: `No se encontró ningún gasto con el ID '${id}' para actualizar.`,
          timestamp: new Date().toISOString()
        });
      }

      // Actualizar usando el método del Gestor que valida mediante Setters
      gestorGastos.actualizarGasto(id, {
        titulo,
        monto: monto !== undefined ? Number(monto) : undefined,
        categoria,
        fecha,
        descripcion,
        metodoPago
      });

      emisorEventos.emit('gastoActualizado', gastoExistente);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Gasto actualizado correctamente en el servidor.',
        data: gastoExistente.toJSON(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Error al actualizar el gasto.',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Elimina un gasto del Vector de Clases
   */
  eliminarGasto(req, res) {
    try {
      const { id } = req.params;
      const gastoEliminado = gestorGastos.eliminarGasto(id);

      emisorEventos.emit('gastoEliminado', gastoEliminado);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `El gasto "${gastoEliminado.titulo}" fue eliminado exitosamente del servidor.`,
        data: gastoEliminado.toJSON(),
        saldoRestante: gestorGastos.saldoRestante,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Obtiene la auditoría de eventos ocurridos en el servidor
   */
  obtenerHistorialEventos(req, res) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Historial de eventos del servidor obtenido.',
      total: emisorEventos.historialEventos.length,
      data: emisorEventos.historialEventos,
      timestamp: new Date().toISOString()
    });
  }
};
