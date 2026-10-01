import { Gasto } from './Gasto.js';

/**
 * Clase GestorGastos
 * Representa el gestor del Vector de Clases (colección de instancias de Gasto).
 * Demuestra el uso intensivo de Vectores/Arrays en JavaScript:
 * - push, splice, map, filter, reduce, find, findIndex, sort, some.
 * - Getters y Setters para cálculos agregados y presupuesto mensual.
 */
export class GestorGastos {
  // Vector de instancias de la clase Gasto (Vector de Clases)
  #vectorGastos;
  #presupuestoMensual;

  constructor(presupuestoInicial = 150000) {
    this.#vectorGastos = []; // Inicialización del Vector de Clases
    this.#presupuestoMensual = presupuestoInicial;
  }

  // --- GETTERS & SETTERS ---

  // Getter del Vector de Clases completo (retorna copias o toJSON para inmutabilidad externa)
  get vectorGastos() {
    return [...this.#vectorGastos];
  }

  // Getter de la cantidad de elementos en el vector
  get cantidadGastos() {
    return this.#vectorGastos.length;
  }

  // Getter del Presupuesto Mensual
  get presupuestoMensual() {
    return this.#presupuestoMensual;
  }

  // Setter del Presupuesto Mensual con validación
  set presupuestoMensual(valor) {
    const nuevoPresupuesto = Number(valor);
    if (isNaN(nuevoPresupuesto) || nuevoPresupuesto < 0) {
      throw new Error('El presupuesto mensual debe ser un valor numérico mayor o igual a 0.');
    }
    this.#presupuestoMensual = Math.round(nuevoPresupuesto * 100) / 100;
  }

  // Getter computado: Total de gastos acumulados usando Array.prototype.reduce()
  get totalGastos() {
    return this.#vectorGastos.reduce((acumulador, gasto) => acumulador + gasto.monto, 0);
  }

  // Getter computado: Saldo restante del presupuesto
  get saldoRestante() {
    return this.#presupuestoMensual - this.totalGastos;
  }

  // Getter computado: Porcentaje consumido del presupuesto
  get porcentajeConsumido() {
    if (this.#presupuestoMensual <= 0) return 0;
    const porcentaje = (this.totalGastos / this.#presupuestoMensual) * 100;
    return Math.round(porcentaje * 10) / 10;
  }

  // Getter computado: Determina si el presupuesto ha sido excedido
  get estaPresupuestoExcedido() {
    return this.totalGastos > this.#presupuestoMensual;
  }

  // --- MÉTODOS DE MANIPULACIÓN DEL VECTOR DE CLASES ---

  /**
   * Agrega una nueva instancia de Gasto al vector
   * @param {Gasto|Object} gasto 
   * @returns {Gasto} la instancia agregada
   */
  agregarGasto(gasto) {
    let instanciaGasto;
    if (gasto instanceof Gasto) {
      instanciaGasto = gasto;
    } else {
      instanciaGasto = new Gasto(gasto);
    }
    this.#vectorGastos.push(instanciaGasto);
    return instanciaGasto;
  }

  /**
   * Busca un gasto en el vector por su identificador único (Array.prototype.find)
   * @param {string} id 
   * @returns {Gasto|null}
   */
  buscarPorId(id) {
    const encontrado = this.#vectorGastos.find(gasto => gasto.id === id);
    return encontrado || null;
  }

  /**
   * Actualiza los datos de un gasto existente en el vector (Array.prototype.findIndex)
   * @param {string} id 
   * @param {Object} nuevosDatos 
   * @returns {Gasto}
   */
  actualizarGasto(id, nuevosDatos) {
    const indice = this.#vectorGastos.findIndex(gasto => gasto.id === id);
    if (indice === -1) {
      throw new Error(`No se encontró ningún gasto con el ID: ${id}`);
    }
    const gasto = this.#vectorGastos[indice];
    gasto.actualizar(nuevosDatos);
    return gasto;
  }

  /**
   * Elimina un gasto del vector de clases según su ID (Array.prototype.splice)
   * @param {string} id 
   * @returns {Gasto} el gasto eliminado
   */
  eliminarGasto(id) {
    const indice = this.#vectorGastos.findIndex(gasto => gasto.id === id);
    if (indice === -1) {
      throw new Error(`No se encontró ningún gasto con el ID: ${id}`);
    }
    const [gastoEliminado] = this.#vectorGastos.splice(indice, 1);
    return gastoEliminado;
  }

  /**
   * Filtra el vector por categoría (Array.prototype.filter)
   * @param {string} categoria 
   * @returns {Array<Gasto>}
   */
  filtrarPorCategoria(categoria) {
    if (!categoria || categoria === 'Todas') {
      return this.vectorGastos;
    }
    return this.#vectorGastos.filter(gasto => gasto.categoria.toLowerCase() === categoria.toLowerCase());
  }

  /**
   * Filtra el vector por rango de fechas (Array.prototype.filter)
   * @param {string} desde YYYY-MM-DD
   * @param {string} hasta YYYY-MM-DD
   * @returns {Array<Gasto>}
   */
  filtrarPorRangoFechas(desde, hasta) {
    return this.#vectorGastos.filter(gasto => {
      if (desde && gasto.fecha < desde) return false;
      if (hasta && gasto.fecha > hasta) return false;
      return true;
    });
  }

  /**
   * Búsqueda dinámica en el vector por término en título o descripción (Array.prototype.filter)
   * @param {string} termino 
   * @returns {Array<Gasto>}
   */
  buscarPorTexto(termino) {
    if (!termino || termino.trim() === '') return this.vectorGastos;
    const busqueda = termino.trim().toLowerCase();
    return this.#vectorGastos.filter(gasto => 
      gasto.titulo.toLowerCase().includes(busqueda) || 
      gasto.descripcion.toLowerCase().includes(busqueda)
    );
  }

  /**
   * Ordena una copia del vector según el criterio (Array.prototype.sort)
   * @param {'fecha_desc'|'fecha_asc'|'monto_desc'|'monto_asc'} criterio 
   * @returns {Array<Gasto>}
   */
  ordenarVector(criterio = 'fecha_desc') {
    const copia = [...this.#vectorGastos];
    switch (criterio) {
      case 'fecha_asc':
        return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      case 'monto_desc':
        return copia.sort((a, b) => b.monto - a.monto);
      case 'monto_asc':
        return copia.sort((a, b) => a.monto - b.monto);
      case 'fecha_desc':
      default:
        return copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
  }

  /**
   * Genera el resumen y distribución de gastos por categoría usando reduce() y map()
   * @returns {Array<{ categoria: string, total: number, porcentaje: number, cantidad: number }>}
   */
  obtenerDistribucionPorCategoria() {
    const totalGeneral = this.totalGastos;

    // Agrupación usando reduce
    const agrupado = this.#vectorGastos.reduce((acumulador, gasto) => {
      const cat = gasto.categoria;
      if (!acumulador[cat]) {
        acumulador[cat] = { total: 0, cantidad: 0 };
      }
      acumulador[cat].total += gasto.monto;
      acumulador[cat].cantidad += 1;
      return acumulador;
    }, {});

    // Transformación usando Object.entries y map
    return Object.entries(agrupado).map(([categoria, datos]) => {
      const porcentaje = totalGeneral > 0 ? (datos.total / totalGeneral) * 100 : 0;
      return {
        categoria,
        total: Math.round(datos.total * 100) / 100,
        porcentaje: Math.round(porcentaje * 10) / 10,
        cantidad: datos.cantidad
      };
    }).sort((a, b) => b.total - a.total);
  }

  /**
   * Obtiene métricas estadísticas del vector: mayor gasto, menor gasto, promedio
   * @returns {Object}
   */
  obtenerEstadisticas() {
    if (this.#vectorGastos.length === 0) {
      return {
        total: 0,
        cantidad: 0,
        promedio: 0,
        gastoMayor: null,
        gastoMenor: null,
        presupuesto: this.#presupuestoMensual,
        saldoRestante: this.#presupuestoMensual,
        porcentajeConsumido: 0,
        estaExcedido: false
      };
    }

    const total = this.totalGastos;
    const cantidad = this.cantidadGastos;
    const promedio = Math.round((total / cantidad) * 100) / 100;

    // Reducción para encontrar el mayor gasto
    const mayor = this.#vectorGastos.reduce((prev, curr) => (curr.monto > prev.monto ? curr : prev));
    
    // Reducción para encontrar el menor gasto
    const menor = this.#vectorGastos.reduce((prev, curr) => (curr.monto < prev.monto ? curr : prev));

    return {
      total,
      cantidad,
      promedio,
      gastoMayor: mayor.toJSON(),
      gastoMenor: menor.toJSON(),
      presupuesto: this.#presupuestoMensual,
      saldoRestante: this.saldoRestante,
      porcentajeConsumido: this.porcentajeConsumido,
      estaExcedido: this.estaPresupuestoExcedido
    };
  }

  /**
   * Retorna una representación serializable en Array JSON de todo el Vector de Clases
   * @returns {Array<Object>}
   */
  toJSON() {
    return this.#vectorGastos.map(gasto => gasto.toJSON());
  }
}
