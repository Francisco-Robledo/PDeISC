/**
 * Clase Gasto (Model)
 * Representa un gasto individual con encapsulamiento estricto mediante Getters y Setters.
 * Demuestra el uso de Clases ES6, atributos privados, validación y exportación de módulos.
 */
export class Gasto {
  // Atributos privados
  #id;
  #titulo;
  #monto;
  #categoria;
  #fecha;
  #descripcion;
  #metodoPago;
  #creadoEn;

  // Lista de categorías válidas permitidas
  static CATEGORIAS_VALIDAS = [
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Otros'
  ];

  // Lista de métodos de pago válidos
  static METODOS_PAGO = [
    'Efectivo',
    'Tarjeta de Débito',
    'Tarjeta de Crédito',
    'Transferencia Bancaria',
    'Billetera Virtual'
  ];

  /**
   * Constructor de la clase Gasto
   * @param {Object} param0 
   */
  constructor({ id = null, titulo, monto, categoria, fecha, descripcion = '', metodoPago = 'Efectivo' }) {
    this.#id = id || Gasto.generarId();
    this.titulo = titulo;         // Invoca setter
    this.monto = monto;           // Invoca setter
    this.categoria = categoria;   // Invoca setter
    this.fecha = fecha;           // Invoca setter
    this.descripcion = descripcion;// Invoca setter
    this.metodoPago = metodoPago; // Invoca setter
    this.#creadoEn = new Date().toISOString();
  }

  // --- GETTERS & SETTERS (Requisito fundamental) ---

  // ID (Solo lectura)
  get id() {
    return this.#id;
  }

  // Título
  get titulo() {
    return this.#titulo;
  }

  set titulo(valor) {
    if (!valor || typeof valor !== 'string' || valor.trim().length < 3) {
      throw new Error('El título es obligatorio y debe tener al menos 3 caracteres.');
    }
    this.#titulo = valor.trim();
  }

  // Monto
  get monto() {
    return this.#monto;
  }

  set monto(valor) {
    const numero = Number(valor);
    if (isNaN(numero) || numero <= 0) {
      throw new Error('El monto debe ser un número positivo mayor a 0.');
    }
    this.#monto = Math.round(numero * 100) / 100; // 2 decimales
  }

  // Monto Formateado (Getter computado)
  get montoFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(this.#monto);
  }

  // Categoría
  get categoria() {
    return this.#categoria;
  }

  set categoria(valor) {
    if (!valor) {
      throw new Error(`La categoría es obligatoria.`);
    }
    const valorNorm = valor.toString().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const encontrada = Gasto.CATEGORIAS_VALIDAS.find(c => 
      c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === valorNorm
    );
    if (!encontrada) {
      throw new Error(`Categoría inválida. Debe ser una de: ${Gasto.CATEGORIAS_VALIDAS.join(', ')}`);
    }
    this.#categoria = encontrada;
  }

  // Fecha
  get fecha() {
    return this.#fecha;
  }

  set fecha(valor) {
    if (!valor) {
      // Si no se especifica, se asigna la fecha actual en formato YYYY-MM-DD
      this.#fecha = new Date().toISOString().split('T')[0];
      return;
    }
    const fechaObj = new Date(valor);
    if (isNaN(fechaObj.getTime())) {
      throw new Error('La fecha proporcionada no es válida.');
    }
    // Formato estándar YYYY-MM-DD
    this.#fecha = valor.toString().split('T')[0];
  }

  // Fecha Formateada (Getter computado)
  get fechaFormateada() {
    if (!this.#fecha) return '';
    const partes = this.#fecha.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return this.#fecha;
  }

  // Descripción
  get descripcion() {
    return this.#descripcion;
  }

  set descripcion(valor) {
    this.#descripcion = valor ? valor.trim() : '';
  }

  // Método de Pago
  get metodoPago() {
    return this.#metodoPago;
  }

  set metodoPago(valor) {
    if (!valor || !Gasto.METODOS_PAGO.includes(valor)) {
      this.#metodoPago = 'Efectivo';
      return;
    }
    this.#metodoPago = valor;
  }

  // Creado En (Solo lectura)
  get creadoEn() {
    return this.#creadoEn;
  }

  // --- MÉTODOS DE INSTANCIA ---

  /**
   * Actualiza las propiedades de la instancia pasando por las validaciones de los setters
   * @param {Object} nuevosDatos 
   */
  actualizar(nuevosDatos = {}) {
    if (nuevosDatos.titulo !== undefined) this.titulo = nuevosDatos.titulo;
    if (nuevosDatos.monto !== undefined) this.monto = nuevosDatos.monto;
    if (nuevosDatos.categoria !== undefined) this.categoria = nuevosDatos.categoria;
    if (nuevosDatos.fecha !== undefined) this.fecha = nuevosDatos.fecha;
    if (nuevosDatos.descripcion !== undefined) this.descripcion = nuevosDatos.descripcion;
    if (nuevosDatos.metodoPago !== undefined) this.metodoPago = nuevosDatos.metodoPago;
  }

  /**
   * Convierte la instancia en un objeto plano para serialización JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      monto: this.#monto,
      montoFormateado: this.montoFormateado,
      categoria: this.#categoria,
      fecha: this.#fecha,
      fechaFormateada: this.fechaFormateada,
      descripcion: this.#descripcion,
      metodoPago: this.#metodoPago,
      creadoEn: this.#creadoEn
    };
  }

  // --- MÉTODOS ESTÁTICOS ---

  /**
   * Generador de identificador único simple
   * @returns {string}
   */
  static generarId() {
    return 'gst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  }
}
