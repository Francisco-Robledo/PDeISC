/**
 * Aplicación Principal (Frontend Controller)
 * Diseñado con Bootstrap 5, Clases, Vectores, ES Modules, Fetch, Axios y Eventos.
 */

import { GastoModel } from './models/GastoModel.js';
import { VectorGastos } from './models/VectorGastos.js';
import { axiosService } from './services/axiosService.js';
import { fetchService } from './services/fetchService.js';
import { UI } from './components/ui.js';

// --- ESTADO GLOBAL DE LA APLICACIÓN CLIENTE ---
const vectorCliente = new VectorGastos(); // Vector de Clases en el cliente
let gastoSeleccionadoId = null; // ID del gasto actualmente visualizado en el popup de detalle
let resumenServidor = null;
let divisasServidor = null;

// Instancias de Modales Bootstrap 5
let bsModalGasto = null;
let bsModalPresupuesto = null;
let bsModalDetalle = null;

// --- SELECTORES DEL DOM ---
const DOM = {
  // Contenedores
  listaGastos: document.getElementById('listaGastos'),
  desgloseCategorias: document.getElementById('desgloseCategorias'),

  // Filtros y Búsqueda (EVENTOS input, change, click)
  inputBusqueda: document.getElementById('inputBusqueda'),
  filtroCategoria: document.getElementById('filtroCategoria'),
  filtroOrden: document.getElementById('filtroOrden'),
  filtroDesde: document.getElementById('filtroDesde'),
  filtroHasta: document.getElementById('filtroHasta'),
  btnLimpiarFiltros: document.getElementById('btnLimpiarFiltros'),
  contadorResultados: document.getElementById('contadorResultados'),

  // Modal y Formulario de Añadir Gasto
  modalGasto: document.getElementById('modalGasto'),
  formGasto: document.getElementById('formGasto'),
  modalTitulo: document.getElementById('modalTitulo'),
  btnNuevoGasto: document.getElementById('btnNuevoGasto'),
  campoTitulo: document.getElementById('campoTitulo'),
  campoMonto: document.getElementById('campoMonto'),
  campoCategoria: document.getElementById('campoCategoria'),
  campoFecha: document.getElementById('campoFecha'),
  campoMetodoPago: document.getElementById('campoMetodoPago'),
  campoDescripcion: document.getElementById('campoDescripcion'),
  btnGuardarGasto: document.getElementById('btnGuardarGasto'),

  // Modal de Detalle (Popup al tocar un gasto)
  modalDetalleGasto: document.getElementById('modalDetalleGasto'),
  btnDetalleEliminar: document.getElementById('btnDetalleEliminar'),

  // Presupuesto (Ver más, Editar/Fijar, Sumar, Restar)
  cardPresupuesto: document.getElementById('cardPresupuesto'),
  modalPresupuesto: document.getElementById('modalPresupuesto'),
  formFijarPresupuesto: document.getElementById('formFijarPresupuesto'),
  inputFijarPresupuesto: document.getElementById('inputFijarPresupuesto'),
  formSumarPresupuesto: document.getElementById('formSumarPresupuesto'),
  inputSumarPresupuesto: document.getElementById('inputSumarPresupuesto'),
  formRestarPresupuesto: document.getElementById('formRestarPresupuesto'),
  inputRestarPresupuesto: document.getElementById('inputRestarPresupuesto'),

  // Botón Exportar JSON
  btnExportarJSON: document.getElementById('btnExportarJSON'),

  // Botones Flotantes
  btnModoTema: document.getElementById('btnModoTema'),
  btnScrollTop: document.getElementById('btnScrollTop')
};

// =========================================================================
// INICIALIZACIÓN DE LA APLICACIÓN (EVENTO DOMContentLoaded)
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('⚡ [EVENTO DOMContentLoaded] Inicializando aplicación web...');

  // Inicializar Modales Bootstrap
  if (window.bootstrap) {
    if (DOM.modalGasto) bsModalGasto = new window.bootstrap.Modal(DOM.modalGasto);
    if (DOM.modalPresupuesto) bsModalPresupuesto = new window.bootstrap.Modal(DOM.modalPresupuesto);
    if (DOM.modalDetalleGasto) bsModalDetalle = new window.bootstrap.Modal(DOM.modalDetalleGasto);
  }

  // Inicializar tema oscuro / claro
  inicializarTema();

  // Registrar listeners de eventos de usuario
  configurarEventosUI();

  // Configurar listeners de Eventos Personalizados (CustomEvent)
  configurarEventosPersonalizados();

  // Carga inicial coordinada con el servidor Node.js
  await cargarGastosDesdeServidor();
  await cargarResumenYDivisas();
});

// =========================================================================
// GESTIÓN DEL TEMA OSCURO / CLARO (Botón Flotante Abajo Izquierda)
// =========================================================================
function inicializarTema() {
  const temaGuardado = localStorage.getItem('gestor_gastos_tema') || 'dark';
  aplicarTema(temaGuardado);

  if (DOM.btnModoTema) {
    DOM.btnModoTema.addEventListener('click', () => {
      const temaActual = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
      aplicarTema(nuevoTema);
    });
  }
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-bs-theme', tema);
  localStorage.setItem('gestor_gastos_tema', tema);

  if (DOM.btnModoTema) {
    if (tema === 'dark') {
      DOM.btnModoTema.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
      DOM.btnModoTema.setAttribute('title', 'Cambiar a Modo Claro');
      DOM.btnModoTema.classList.remove('btn-dark');
      DOM.btnModoTema.classList.add('btn-outline-secondary');
    } else {
      DOM.btnModoTema.innerHTML = '<i class="fa-solid fa-moon text-dark"></i>';
      DOM.btnModoTema.setAttribute('title', 'Cambiar a Modo Oscuro');
      DOM.btnModoTema.classList.remove('btn-outline-secondary');
      DOM.btnModoTema.classList.add('btn-light');
    }
  }
}

// =========================================================================
// CONFIGURACIÓN DE EVENTOS DEL DOM
// =========================================================================
function configurarEventosUI() {
  // 1. EVENTO SUBMIT: Añadir Gasto (Uso de AXIOS)
  DOM.formGasto.addEventListener('submit', async (e) => {
    e.preventDefault();
    await manejarGuardarGasto();
  });

  // 2. EVENTO CLICK: Abrir modal para NUEVO gasto (completamente vacío con placeholders)
  DOM.btnNuevoGasto.addEventListener('click', () => {
    abrirModalGasto();
  });

  // 3. EVENTO CLICK: Abrir modal de PRESUPUESTO (Tocar la tarjeta "Ver más")
  if (DOM.cardPresupuesto) {
    DOM.cardPresupuesto.addEventListener('click', () => {
      abrirModalPresupuesto();
    });
    DOM.cardPresupuesto.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirModalPresupuesto();
      }
    });
  }

  // 4. EVENTOS SUBMIT: Gestión del presupuesto (Fijar, Sumar, Restar con confirmación)
  if (DOM.formFijarPresupuesto) {
    DOM.formFijarPresupuesto.addEventListener('submit', async (e) => {
      e.preventDefault();
      await manejarFijarPresupuesto();
    });
  }

  if (DOM.formSumarPresupuesto) {
    DOM.formSumarPresupuesto.addEventListener('submit', async (e) => {
      e.preventDefault();
      await manejarSumarPresupuesto();
    });
  }

  if (DOM.formRestarPresupuesto) {
    DOM.formRestarPresupuesto.addEventListener('submit', async (e) => {
      e.preventDefault();
      await manejarRestarPresupuesto();
    });
  }

  // Botones de incremento y decremento rápido
  document.querySelectorAll('.btn-quick-sumar').forEach(btn => {
    btn.addEventListener('click', () => {
      const monto = btn.getAttribute('data-monto');
      if (DOM.inputSumarPresupuesto) {
        DOM.inputSumarPresupuesto.value = monto;
        DOM.inputSumarPresupuesto.focus();
      }
    });
  });

  document.querySelectorAll('.btn-quick-restar').forEach(btn => {
    btn.addEventListener('click', () => {
      const monto = btn.getAttribute('data-monto');
      if (DOM.inputRestarPresupuesto) {
        DOM.inputRestarPresupuesto.value = monto;
        DOM.inputRestarPresupuesto.focus();
      }
    });
  });

  // 5. EVENTO INPUT: Búsqueda en vivo (filtra el Vector de Clases en tiempo real)
  DOM.inputBusqueda.addEventListener('input', () => {
    aplicarFiltrosYRenderizar();
  });

  // 6. EVENTO CHANGE: Filtro por Categoría
  DOM.filtroCategoria.addEventListener('change', () => {
    aplicarFiltrosYRenderizar();
  });

  // 7. EVENTO CHANGE: Ordenamiento del Vector
  DOM.filtroOrden.addEventListener('change', () => {
    aplicarFiltrosYRenderizar();
  });

  // 8. EVENTOS INPUT: Rango de Fechas con validación (hasta no puede ser inferior a desde)
  DOM.filtroDesde.addEventListener('input', () => {
    const valorDesde = DOM.filtroDesde.value;
    
    // Restringir el valor mínimo de la fecha 'Hasta'
    DOM.filtroHasta.min = valorDesde;

    // Si 'Hasta' ya tiene un valor inferior a 'Desde', ajustarlo automáticamente
    if (DOM.filtroHasta.value && DOM.filtroHasta.value < valorDesde) {
      DOM.filtroHasta.value = valorDesde;
    }

    aplicarFiltrosYRenderizar();
  });

  DOM.filtroHasta.addEventListener('input', () => {
    const valorDesde = DOM.filtroDesde.value;
    const valorHasta = DOM.filtroHasta.value;

    // Evitar que 'Hasta' sea inferior a 'Desde'
    if (valorDesde && valorHasta && valorHasta < valorDesde) {
      DOM.filtroHasta.value = valorDesde;
    }

    aplicarFiltrosYRenderizar();
  });

  // 9. EVENTO CLICK: Limpiar filtros
  DOM.btnLimpiarFiltros.addEventListener('click', () => {
    DOM.inputBusqueda.value = '';
    DOM.filtroCategoria.value = 'Todas';
    DOM.filtroOrden.value = 'fecha_desc';
    DOM.filtroDesde.value = '';
    DOM.filtroHasta.value = '';
    DOM.filtroHasta.removeAttribute('min');
    aplicarFiltrosYRenderizar();
    UI.mostrarToast({ tipo: 'info', titulo: 'Filtros Limpiados', mensaje: 'Se restableció la vista general de gastos.' });
  });

  // 10. EVENTO CLICK (Delegación): Al tocar cualquier tarjeta de gasto, se abre el POPUP DE DETALLE
  DOM.listaGastos.addEventListener('click', (e) => {
    const card = e.target.closest('.gasto-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    manejarAbrirDetalleGasto(id);
  });

  // 11. EVENTO CLICK DENTRO DEL POPUP DE DETALLE: Eliminar (con popup de confirmación)
  if (DOM.btnDetalleEliminar) {
    DOM.btnDetalleEliminar.addEventListener('click', async () => {
      if (!gastoSeleccionadoId) return;
      const idParaEliminar = gastoSeleccionadoId;
      const eliminado = await manejarEliminarGasto(idParaEliminar);
      if (eliminado && bsModalDetalle) {
        bsModalDetalle.hide();
      }
    });
  }

  // 12. EVENTO SCROLL y CLICK: Top Scrolling (Botón Flotante Abajo Derecha)
  if (DOM.btnScrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 160) {
        DOM.btnScrollTop.classList.add('visible');
      } else {
        DOM.btnScrollTop.classList.remove('visible');
      }
    });

    DOM.btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 13. EVENTO CLICK: Exportar gastos a archivo JSON descargable
  if (DOM.btnExportarJSON) {
    DOM.btnExportarJSON.addEventListener('click', () => {
      const dataJSON = JSON.stringify(vectorCliente.elementos.map(g => g.toJSON()), null, 2);
      const blob = new Blob([dataJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gastos_personales_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(a);
      UI.mostrarToast({ tipo: 'success', titulo: 'Exportación Exitosa', mensaje: 'Archivo JSON generado con el Vector de Clases.' });
    });
  }
}

// =========================================================================
// CONFIGURACIÓN DE EVENTOS PERSONALIZADOS (CustomEvent)
// =========================================================================
function configurarEventosPersonalizados() {
  document.addEventListener('gastoGuardado', (e) => {
    console.log('📣 [CustomEvent: gastoGuardado]', e.detail);
    cargarResumenYDivisas();
  });

  document.addEventListener('gastoEliminado', (e) => {
    console.log('📣 [CustomEvent: gastoEliminado]', e.detail);
    cargarResumenYDivisas();
  });

  document.addEventListener('presupuestoActualizado', (e) => {
    console.log('📣 [CustomEvent: presupuestoActualizado]', e.detail);
    cargarResumenYDivisas();
  });
}

// =========================================================================
// COMUNICACIÓN ASÍNCRONA: USO DE AXIOS Y FETCH
// =========================================================================

/**
 * Consulta la lista de gastos utilizando AXIOS (GET /api/gastos)
 * Carga los datos en el Vector de Clases
 */
async function cargarGastosDesdeServidor() {
  try {
    const respuesta = await axiosService.obtenerGastos();
    vectorCliente.cargarDesdeArray(respuesta.data || []);
    aplicarFiltrosYRenderizar();
  } catch (error) {
    console.error('Error al cargar gastos con Axios:', error);
    UI.mostrarToast({
      tipo: 'error',
      titulo: 'Error de Red',
      mensaje: error.message || 'No fue posible conectar con la API de gastos.'
    });
  }
}

/**
 * Consulta estadísticas y resumen del presupuesto utilizando FETCH (GET /api/resumen)
 * Consulta cotizaciones de divisas utilizando FETCH (GET /api/resumen/divisas)
 */
async function cargarResumenYDivisas() {
  try {
    const respResumen = await fetchService.obtenerResumen();
    if (respResumen.success && respResumen.data) {
      resumenServidor = respResumen.data;
      UI.actualizarResumen(respResumen.data.estadisticas);
      UI.renderizarDesgloseCategorias(respResumen.data.distribucionCategorias, DOM.desgloseCategorias);
    }

    const respDivisas = await fetchService.obtenerDivisas();
    if (respDivisas.success && respDivisas.data) {
      divisasServidor = respDivisas.data;
      const totalPesos = resumenServidor?.estadisticas?.total || vectorCliente.totalAcumulado;
      UI.renderizarDivisas(divisasServidor, totalPesos);
    }
  } catch (error) {
    console.error('Error al cargar resumen con Fetch:', error);
  }
}

// =========================================================================
// POPUP DE CONFIRMACIÓN Y OPERACIONES CRUD
// =========================================================================

/**
 * Muestra el popup modal de confirmación y retorna una Promesa (true si confirma, false si cancela)
 */
function confirmarAccion({ titulo, mensaje, textoConfirmar = 'Confirmar', tipo = 'danger' }) {
  return new Promise((resolve) => {
    const elModal = document.getElementById('modalConfirmacion');
    const elTitulo = document.getElementById('confirmaTitulo');
    const elMensaje = document.getElementById('confirmaMensaje');
    const elIcono = document.getElementById('confirmaIcono');
    const btnAceptar = document.getElementById('btnConfirmaAceptar');

    if (!elModal || !window.bootstrap) {
      resolve(confirm(mensaje));
      return;
    }

    elTitulo.textContent = titulo;
    elMensaje.textContent = mensaje;
    btnAceptar.textContent = textoConfirmar;

    if (tipo === 'danger') {
      btnAceptar.className = 'btn btn-sm btn-danger px-3 shadow-sm';
      elIcono.className = 'fa-solid fa-trash-can text-danger';
    } else {
      btnAceptar.className = 'btn btn-sm btn-primary px-3 shadow-sm';
      elIcono.className = 'fa-solid fa-circle-question text-primary';
    }

    const bsModal = window.bootstrap.Modal.getOrCreateInstance(elModal);
    let decision = false;

    // Ajustar z-index del backdrop en modales superpuestos
    const onShown = () => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      if (backdrops.length > 1) {
        backdrops[backdrops.length - 1].style.zIndex = '1080';
      }
    };

    const onAceptar = () => {
      decision = true;
      bsModal.hide();
    };

    const onHidden = () => {
      btnAceptar.removeEventListener('click', onAceptar);
      elModal.removeEventListener('shown.bs.modal', onShown);
      elModal.removeEventListener('hidden.bs.modal', onHidden);

      // Si aún hay otro modal abierto (ej: modalPresupuesto o modalDetalle), mantener modal-open
      if (document.querySelector('.modal.show')) {
        document.body.classList.add('modal-open');
      }
      resolve(decision);
    };

    elModal.addEventListener('shown.bs.modal', onShown, { once: true });
    btnAceptar.addEventListener('click', onAceptar, { once: true });
    elModal.addEventListener('hidden.bs.modal', onHidden, { once: true });

    bsModal.show();
  });
}

/**
 * Abre el Popup de Detalle de un gasto al tocarlo en la lista
 */
function manejarAbrirDetalleGasto(id) {
  const gasto = vectorCliente.buscarPorId(id);
  if (!gasto) return;

  gastoSeleccionadoId = id;
  UI.mostrarDetalleEnModal(gasto);

  if (bsModalDetalle) {
    bsModalDetalle.show();
  }
}

/**
 * Añade un nuevo gasto al servidor mediante AXIOS
 */
async function manejarGuardarGasto() {
  const titulo = DOM.campoTitulo.value.trim();
  const monto = parseFloat(DOM.campoMonto.value);
  const categoria = DOM.campoCategoria.value;
  const fecha = DOM.campoFecha.value;
  const metodoPago = DOM.campoMetodoPago.value;
  const descripcion = DOM.campoDescripcion.value.trim();

  // Validación de campos requeridos
  if (!titulo || titulo.length < 3) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Requerido', mensaje: 'Ingresa un título de al menos 3 caracteres.' });
    DOM.campoTitulo.focus();
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Requerido', mensaje: 'Ingresa un monto numérico mayor a 0.' });
    DOM.campoMonto.focus();
    return;
  }

  if (!categoria) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Requerido', mensaje: 'Selecciona una categoría.' });
    DOM.campoCategoria.focus();
    return;
  }

  if (!fecha) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Requerido', mensaje: 'Selecciona una fecha para el gasto.' });
    DOM.campoFecha.focus();
    return;
  }

  if (!metodoPago) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Requerido', mensaje: 'Selecciona un método de pago.' });
    DOM.campoMetodoPago.focus();
    return;
  }

  // Validación previa utilizando la Clase GastoModel local
  try {
    new GastoModel({ titulo, monto, categoria, fecha, metodoPago, descripcion });
  } catch (validacionError) {
    UI.mostrarToast({
      tipo: 'warning',
      titulo: 'Dato Inválido',
      mensaje: validacionError.message
    });
    return;
  }

  const payload = { titulo, monto, categoria, fecha, metodoPago, descripcion };

  try {
    DOM.btnGuardarGasto.disabled = true;
    DOM.btnGuardarGasto.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Guardando...';

    // CREAR CON AXIOS (POST)
    const respuestaServidor = await axiosService.crearGasto(payload);
    vectorCliente.agregar(new GastoModel(respuestaServidor.data));

    UI.mostrarToast({
      tipo: 'success',
      titulo: 'Gasto Añadido',
      mensaje: respuestaServidor.message || 'Gasto registrado correctamente.'
    });

    // DISPARAR EVENTO PERSONALIZADO
    document.dispatchEvent(new CustomEvent('gastoGuardado', {
      detail: { gasto: respuestaServidor.data, accion: 'creacion' }
    }));

    cerrarModalGasto();
    aplicarFiltrosYRenderizar();

  } catch (errorServidor) {
    console.error('Error devuelto por el servidor:', errorServidor);
    const mensaje = errorServidor.errors ? errorServidor.errors.join(' | ') : (errorServidor.message || 'Error en la petición.');
    UI.mostrarToast({
      tipo: 'error',
      titulo: `Error del Servidor (${errorServidor.statusCode || 400})`,
      mensaje: mensaje
    });
  } finally {
    DOM.btnGuardarGasto.disabled = false;
    DOM.btnGuardarGasto.innerHTML = '<i class="fa-solid fa-plus me-1"></i> Añadir Gasto';
  }
}

/**
 * Elimina un gasto del servidor mediante AXIOS (con popup de confirmación personalizado)
 * Retorna true si fue eliminado exitosamente
 */
async function manejarEliminarGasto(id) {
  const gasto = vectorCliente.buscarPorId(id);
  if (!gasto) return false;

  // POPUP DE CONFIRMACIÓN AL ELIMINAR
  const confirmado = await confirmarAccion({
    titulo: 'Confirmar Eliminación',
    mensaje: `¿Estás seguro de que deseas eliminar permanentemente el gasto "${gasto.titulo}" por ${gasto.montoFormateado}? Esta acción no se puede deshacer.`,
    textoConfirmar: 'Sí, eliminar',
    tipo: 'danger'
  });

  if (!confirmado) return false;

  try {
    const respuestaServidor = await axiosService.eliminarGasto(id);
    vectorCliente.eliminar(id);

    UI.mostrarToast({
      tipo: 'info',
      titulo: 'Eliminado',
      mensaje: respuestaServidor.message
    });

    document.dispatchEvent(new CustomEvent('gastoEliminado', { detail: { id } }));
    aplicarFiltrosYRenderizar();
    return true;

  } catch (errorServidor) {
    UI.mostrarToast({
      tipo: 'error',
      titulo: 'Error del Servidor',
      mensaje: errorServidor.message || 'No se pudo eliminar el gasto.'
    });
    return false;
  }
}

/**
 * Abre el Modal de Gestión de Presupuesto ("Ver más") y sincroniza métricas
 */
function abrirModalPresupuesto() {
  const stats = resumenServidor?.estadisticas || {
    presupuesto: 0,
    total: vectorCliente.totalAcumulado,
    saldoRestante: 0,
    porcentajeConsumido: 0
  };

  const presupuestoActual = stats.presupuesto || 0;
  const totalActual = stats.total !== undefined ? stats.total : (stats.totalGastos !== undefined ? stats.totalGastos : vectorCliente.totalAcumulado);
  const saldoActual = stats.saldoRestante !== undefined ? stats.saldoRestante : (presupuestoActual - totalActual);
  const porcentaje = stats.porcentajeConsumido !== undefined ? stats.porcentajeConsumido : (presupuestoActual > 0 ? (totalActual / presupuestoActual) * 100 : 0);

  if (DOM.inputFijarPresupuesto) {
    DOM.inputFijarPresupuesto.value = presupuestoActual;
  }
  if (DOM.inputSumarPresupuesto) {
    DOM.inputSumarPresupuesto.value = '';
  }
  if (DOM.inputRestarPresupuesto) {
    DOM.inputRestarPresupuesto.value = '';
  }

  // Sincronizar datos y barra en el popup
  UI.actualizarDatosModalPresupuesto({
    presupuesto: presupuestoActual,
    total: totalActual,
    saldoRestante: saldoActual,
    porcentajeConsumido: porcentaje
  });

  if (bsModalPresupuesto) {
    bsModalPresupuesto.show();
  }
}

/**
 * 1. Fijar/Editar nuevo límite de presupuesto (exige confirmación)
 */
async function manejarFijarPresupuesto() {
  const nuevoPresupuesto = parseFloat(DOM.inputFijarPresupuesto.value);

  if (isNaN(nuevoPresupuesto) || nuevoPresupuesto < 0) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Inválido', mensaje: 'Ingresa un monto de presupuesto válido (0 o superior).' });
    DOM.inputFijarPresupuesto.focus();
    return;
  }

  // POPUP DE CONFIRMACIÓN OBLIGATORIO
  const confirmado = await confirmarAccion({
    titulo: 'Fijar Nuevo Presupuesto',
    mensaje: `¿Deseas fijar el presupuesto mensual en ${UI.formatearMoneda(nuevoPresupuesto)}? Esta acción modificará el límite actual.`,
    textoConfirmar: 'Sí, fijar presupuesto',
    tipo: 'primary'
  });

  if (!confirmado) return;

  try {
    const respuestaServidor = await fetchService.actualizarPresupuesto(nuevoPresupuesto);

    UI.mostrarToast({
      tipo: 'success',
      titulo: 'Presupuesto Actualizado',
      mensaje: respuestaServidor.message || 'Presupuesto fijado exitosamente.'
    });

    if (bsModalPresupuesto) bsModalPresupuesto.hide();

    document.dispatchEvent(new CustomEvent('presupuestoActualizado', { detail: respuestaServidor.data }));

  } catch (error) {
    UI.mostrarToast({
      tipo: 'error',
      titulo: 'Error de Presupuesto',
      mensaje: error.message || 'No se pudo actualizar el presupuesto.'
    });
  }
}

/**
 * 2. Sumar monto al presupuesto (exige confirmación)
 */
async function manejarSumarPresupuesto() {
  const montoASumar = parseFloat(DOM.inputSumarPresupuesto.value);

  if (isNaN(montoASumar) || montoASumar <= 0) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Inválido', mensaje: 'Ingresa un monto mayor a 0 para sumar al presupuesto.' });
    DOM.inputSumarPresupuesto.focus();
    return;
  }

  const presupuestoActual = resumenServidor?.estadisticas?.presupuesto || 0;
  const nuevoPresupuesto = presupuestoActual + montoASumar;

  // POPUP DE CONFIRMACIÓN OBLIGATORIO
  const confirmado = await confirmarAccion({
    titulo: 'Sumar al Presupuesto',
    mensaje: `¿Deseas sumar ${UI.formatearMoneda(montoASumar)} al presupuesto? Pasará de ${UI.formatearMoneda(presupuestoActual)} a ${UI.formatearMoneda(nuevoPresupuesto)}.`,
    textoConfirmar: 'Sí, sumar',
    tipo: 'primary'
  });

  if (!confirmado) return;

  try {
    const respuestaServidor = await fetchService.actualizarPresupuesto(nuevoPresupuesto);

    UI.mostrarToast({
      tipo: 'success',
      titulo: 'Presupuesto Incrementado',
      mensaje: respuestaServidor.message || 'Se sumó el monto al presupuesto con éxito.'
    });

    if (bsModalPresupuesto) bsModalPresupuesto.hide();

    document.dispatchEvent(new CustomEvent('presupuestoActualizado', { detail: respuestaServidor.data }));

  } catch (error) {
    UI.mostrarToast({
      tipo: 'error',
      titulo: 'Error de Presupuesto',
      mensaje: error.message || 'No se pudo incrementar el presupuesto.'
    });
  }
}

/**
 * 3. Restar monto al presupuesto (exige confirmación)
 */
async function manejarRestarPresupuesto() {
  const montoARestar = parseFloat(DOM.inputRestarPresupuesto.value);

  if (isNaN(montoARestar) || montoARestar <= 0) {
    UI.mostrarToast({ tipo: 'warning', titulo: 'Dato Inválido', mensaje: 'Ingresa un monto mayor a 0 para restar del presupuesto.' });
    DOM.inputRestarPresupuesto.focus();
    return;
  }

  const presupuestoActual = resumenServidor?.estadisticas?.presupuesto || 0;

  if (montoARestar > presupuestoActual) {
    UI.mostrarToast({
      tipo: 'warning',
      titulo: 'Monto Excesivo',
      mensaje: `No puedes restar ${UI.formatearMoneda(montoARestar)} porque supera el presupuesto actual de ${UI.formatearMoneda(presupuestoActual)}.`
    });
    DOM.inputRestarPresupuesto.focus();
    return;
  }

  const nuevoPresupuesto = Math.max(0, presupuestoActual - montoARestar);

  // POPUP DE CONFIRMACIÓN OBLIGATORIO
  const confirmado = await confirmarAccion({
    titulo: 'Restar del Presupuesto',
    mensaje: `¿Deseas restar ${UI.formatearMoneda(montoARestar)} al presupuesto? Pasará de ${UI.formatearMoneda(presupuestoActual)} a ${UI.formatearMoneda(nuevoPresupuesto)}.`,
    textoConfirmar: 'Sí, restar',
    tipo: 'danger'
  });

  if (!confirmado) return;

  try {
    const respuestaServidor = await fetchService.actualizarPresupuesto(nuevoPresupuesto);

    UI.mostrarToast({
      tipo: 'success',
      titulo: 'Presupuesto Reducido',
      mensaje: respuestaServidor.message || 'Se restó el monto del presupuesto con éxito.'
    });

    if (bsModalPresupuesto) bsModalPresupuesto.hide();

    document.dispatchEvent(new CustomEvent('presupuestoActualizado', { detail: respuestaServidor.data }));

  } catch (error) {
    UI.mostrarToast({
      tipo: 'error',
      titulo: 'Error de Presupuesto',
      mensaje: error.message || 'No se pudo reducir el presupuesto.'
    });
  }
}

// =========================================================================
// FILTRADO Y RENDERIZADO DEL VECTOR DE CLASES
// =========================================================================
function aplicarFiltrosYRenderizar() {
  const filtros = {
    texto: DOM.inputBusqueda.value,
    categoria: DOM.filtroCategoria.value,
    orden: DOM.filtroOrden.value,
    desde: DOM.filtroDesde.value,
    hasta: DOM.filtroHasta.value
  };

  const gastosFiltrados = vectorCliente.filtrar(filtros);

  if (DOM.contadorResultados) {
    DOM.contadorResultados.textContent = `${gastosFiltrados.length} de ${vectorCliente.longitud} gastos`;
  }

  UI.renderizarListaGastos(gastosFiltrados, DOM.listaGastos);
}

// =========================================================================
// CONTROL DE MODALES BOOTSTRAP 5
// =========================================================================
function abrirModalGasto() {
  // Asegurar que el formulario esté 100% vacío con solo placeholders
  DOM.formGasto.reset();
  DOM.campoTitulo.value = '';
  DOM.campoMonto.value = '';
  DOM.campoCategoria.value = '';
  DOM.campoFecha.value = '';
  DOM.campoMetodoPago.value = '';
  DOM.campoDescripcion.value = '';

  if (bsModalGasto) {
    bsModalGasto.show();
  }
}

function cerrarModalGasto() {
  if (bsModalGasto) {
    bsModalGasto.hide();
  }
  DOM.formGasto.reset();
}
