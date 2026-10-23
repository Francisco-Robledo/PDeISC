/**
 * Clase GastoModel (Frontend)
 * Modela un gasto en el cliente demostrando el uso de Clases ES6, encapsulamiento con Getters y Setters,
 * validación y exportación ES Modules.
 */
export class GastoModel {
  #id;
  #titulo;
  #monto;
  #categoria;
  #fecha;
  #descripcion;
  #metodoPago;

  constructor({ id = null, titulo, monto, categoria, fecha, descripcion = '', metodoPago = 'Efectivo' }) {
    this.#id = id;
    this.titulo = titulo;         // Invoca setter con validación
    this.monto = monto;           // Invoca setter con validación
    this.categoria = categoria;   // Invoca setter con validación
    this.fecha = fecha;           // Invoca setter con validación
    this.descripcion = descripcion;
    this.metodoPago = metodoPago;
  }

  // --- GETTERS & SETTERS ---
  get id() {
    return this.#id;
  }

  set id(valor) {
    this.#id = valor;
  }

  get titulo() {
    return this.#titulo;
  }

  set titulo(valor) {
    if (!valor || typeof valor !== 'string' || valor.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres.');
    }
    this.#titulo = valor.trim();
  }

  get monto() {
    return this.#monto;
  }

  set monto(valor) {
    const num = Number(valor);
    if (isNaN(num) || num <= 0) {
      throw new Error('El monto debe ser un número positivo.');
    }
    this.#monto = Math.round(num * 100) / 100;
  }

  // Getter de formato monetario
  get montoFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(this.#monto);
  }

  get categoria() {
    return this.#categoria;
  }

  set categoria(valor) {
    if (!valor) throw new Error('La categoría es requerida.');
    this.#categoria = valor;
  }

  get fecha() {
    return this.#fecha;
  }

  set fecha(valor) {
    if (!valor) {
      this.#fecha = new Date().toISOString().split('T')[0];
      return;
    }
    this.#fecha = valor.toString().split('T')[0];
  }

  // Getter de fecha legible DD/MM/YYYY
  get fechaLegible() {
    if (!this.#fecha) return '';
    const [y, m, d] = this.#fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  get descripcion() {
    return this.#descripcion;
  }

  set descripcion(valor) {
    this.#descripcion = valor ? valor.trim() : '';
  }

  get metodoPago() {
    return this.#metodoPago;
  }

  set metodoPago(valor) {
    this.#metodoPago = valor || 'Efectivo';
  }

  // Conversión a objeto plano
  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      monto: this.#monto,
      categoria: this.#categoria,
      fecha: this.#fecha,
      descripcion: this.#descripcion,
      metodoPago: this.#metodoPago
    };
  }
}
