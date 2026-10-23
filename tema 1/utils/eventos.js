import { EventEmitter } from 'events';

/**
 * Emisor de Eventos del Servidor (Node.js EventEmitter)
 * Demuestra el tema "EVENTOS" aplicado en la arquitectura del backend.
 */
class GestorEventosServidor extends EventEmitter {
  #historialEventos = [];

  constructor() {
    super();
    this.#configurarListeners();
  }

  get historialEventos() {
    return [...this.#historialEventos];
  }

  registrarEvento(tipo, detalle) {
    const evento = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      tipo,
      detalle,
      timestamp: new Date().toISOString(),
      origen: 'Servidor Node.js'
    };

    this.#historialEventos.unshift(evento);
    // Limitar a los últimos 50 eventos en memoria
    if (this.#historialEventos.length > 50) {
      this.#historialEventos.pop();
    }
    return evento;
  }

  #configurarListeners() {
    this.on('gastoCreado', (gasto) => {
      this.registrarEvento('GASTO_CREADO', {
        id: gasto.id,
        titulo: gasto.titulo,
        monto: gasto.monto,
        categoria: gasto.categoria
      });
      console.log(`[EVENTO SERVIDOR: gastoCreado] Gasto registrado: "${gasto.titulo}" por ${gasto.montoFormateado}`);
    });

    this.on('gastoActualizado', (gasto) => {
      this.registrarEvento('GASTO_ACTUALIZADO', {
        id: gasto.id,
        titulo: gasto.titulo,
        monto: gasto.monto
      });
      console.log(`[EVENTO SERVIDOR: gastoActualizado] Gasto ID "${gasto.id}" actualizado.`);
    });

    this.on('gastoEliminado', (gasto) => {
      this.registrarEvento('GASTO_ELIMINADO', {
        id: gasto.id,
        titulo: gasto.titulo,
        monto: gasto.monto
      });
      console.log(`[EVENTO SERVIDOR: gastoEliminado] Gasto eliminado: "${gasto.titulo}"`);
    });

    this.on('presupuestoActualizado', (nuevoPresupuesto) => {
      this.registrarEvento('PRESUPUESTO_ACTUALIZADO', { nuevoPresupuesto });
      console.log(`[EVENTO SERVIDOR: presupuestoActualizado] Nuevo límite fijado: $${nuevoPresupuesto}`);
    });

    this.on('alertaPresupuestoExcedido', (datos) => {
      this.registrarEvento('ALERTA_PRESUPUESTO', datos);
      console.warn(`[EVENTO SERVIDOR: ALERTA] ¡Presupuesto superado! Total: $${datos.total}, Límite: $${datos.presupuesto}`);
    });
  }
}

export const emisorEventos = new GestorEventosServidor();
