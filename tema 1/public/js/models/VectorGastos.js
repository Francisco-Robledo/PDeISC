import { GastoModel } from './GastoModel.js';

/**
 * Clase VectorGastos (Frontend)
 * Administra el Vector de Clases en la memoria del navegador, sincronizado con las respuestas del servidor.
 * Aplica intensivamente los métodos de Vectores/Arrays de JavaScript:
 * - map, filter, reduce, find, findIndex, sort, some, forEach.
 */
export class VectorGastos {
  #elementos; // Vector que almacena instancias de GastoModel

  constructor() {
    this.#elementos = []; // Inicialización del vector vacío
  }

  // --- GETTERS ---
  get elementos() {
    return [...this.#elementos];
  }

  get longitud() {
    return this.#elementos.length;
  }

  // Uso de Array.prototype.reduce() para calcular el total
  get totalAcumulado() {
    return this.#elementos.reduce((total, gasto) => total + gasto.monto, 0);
  }

  // Getter del promedio de gasto
  get promedioGasto() {
    if (this.#elementos.length === 0) return 0;
    return this.totalAcumulado / this.#elementos.length;
  }

  // --- MÉTODOS DEL VECTOR ---

  /**
   * Carga masiva de elementos al Vector de Clases instanciando cada elemento como GastoModel
   * @param {Array<Object>} datosArray 
   */
  cargarDesdeArray(datosArray) {
    // Uso de Array.prototype.map() para convertir objetos planos en instancias de la Clase
    this.#elementos = datosArray.map(dato => new GastoModel(dato));
    return this.#elementos;
  }

  /**
   * Agrega una instancia al vector (push)
   * @param {GastoModel|Object} gasto 
   */
  agregar(gasto) {
    const instancia = gasto instanceof GastoModel ? gasto : new GastoModel(gasto);
    this.#elementos.unshift(instancia); // Agregar al inicio para visualización reciente
    return instancia;
  }

  /**
   * Busca un elemento en el vector por ID usando find()
   * @param {string} id 
   * @returns {GastoModel|null}
   */
  buscarPorId(id) {
    return this.#elementos.find(item => item.id === id) || null;
  }

  /**
   * Actualiza un elemento en el vector usando findIndex()
   * @param {string} id 
   * @param {Object} nuevosDatos 
   */
  actualizar(id, nuevosDatos) {
    const idx = this.#elementos.findIndex(item => item.id === id);
    if (idx !== -1) {
      if (nuevosDatos.titulo !== undefined) this.#elementos[idx].titulo = nuevosDatos.titulo;
      if (nuevosDatos.monto !== undefined) this.#elementos[idx].monto = nuevosDatos.monto;
      if (nuevosDatos.categoria !== undefined) this.#elementos[idx].categoria = nuevosDatos.categoria;
      if (nuevosDatos.fecha !== undefined) this.#elementos[idx].fecha = nuevosDatos.fecha;
      if (nuevosDatos.descripcion !== undefined) this.#elementos[idx].descripcion = nuevosDatos.descripcion;
      if (nuevosDatos.metodoPago !== undefined) this.#elementos[idx].metodoPago = nuevosDatos.metodoPago;
      return this.#elementos[idx];
    }
    return null;
  }

  /**
   * Elimina un elemento del vector usando findIndex() y splice()
   * @param {string} id 
   */
  eliminar(id) {
    const idx = this.#elementos.findIndex(item => item.id === id);
    if (idx !== -1) {
      const [eliminado] = this.#elementos.splice(idx, 1);
      return eliminado;
    }
    return null;
  }

  /**
   * Filtra el vector en tiempo real usando Array.prototype.filter()
   * @param {Object} opciones { texto, categoria, desde, hasta, orden }
   * @returns {Array<GastoModel>}
   */
  filtrar({ texto = '', categoria = 'Todas', desde = '', hasta = '', orden = 'fecha_desc' }) {
    let filtrados = this.#elementos.filter(item => {
      // Filtro por texto en título o descripción
      if (texto && texto.trim() !== '') {
        const busqueda = texto.toLowerCase().trim();
        const coincideTitulo = item.titulo.toLowerCase().includes(busqueda);
        const coincideDesc = item.descripcion.toLowerCase().includes(busqueda);
        if (!coincideTitulo && !coincideDesc) return false;
      }

      // Filtro por categoría
      if (categoria && categoria !== 'Todas') {
        if (item.categoria.toLowerCase() !== categoria.toLowerCase()) return false;
      }

      // Filtro por fechas
      if (desde && item.fecha < desde) return false;
      if (hasta && item.fecha > hasta) return false;

      return true;
    });

    // Ordenamiento usando Array.prototype.sort()
    return this.ordenar(filtrados, orden);
  }

  /**
   * Ordena un arreglo de instancias usando sort()
   * @param {Array<GastoModel>} vector 
   * @param {string} criterio 
   */
  ordenar(vector, criterio) {
    const copia = [...vector];
    switch (criterio) {
      case 'monto_desc':
        return copia.sort((a, b) => b.monto - a.monto);
      case 'monto_asc':
        return copia.sort((a, b) => a.monto - b.monto);
      case 'fecha_asc':
        return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      case 'fecha_desc':
      default:
        return copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
  }

  /**
   * Agrupa los gastos por categoría para gráficos o barras usando reduce()
   */
  obtenerDistribucionCategorias() {
    const total = this.totalAcumulado;
    const agrupado = this.#elementos.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
      return acc;
    }, {});

    return Object.entries(agrupado).map(([cat, subtotal]) => ({
      categoria: cat,
      monto: subtotal,
      porcentaje: total > 0 ? Math.round((subtotal / total) * 100) : 0
    })).sort((a, b) => b.monto - a.monto);
  }
}
