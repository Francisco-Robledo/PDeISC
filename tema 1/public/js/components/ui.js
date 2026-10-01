/**
 * Módulo de Componentes de Interfaz de Usuario (UI con Bootstrap 5 Responsivo)
 * Encargado de manipular el DOM, renderizar el Vector de Gastos, métricas y notificaciones.
 */

// Mapeo de iconos y clases de Bootstrap por categoría
export const ICONOS_CATEGORIAS = {
  'Alimentación': { icono: 'fa-utensils', badgeClass: 'bg-success-subtle text-success border border-success-subtle', iconBg: 'bg-success-subtle text-success' },
  'Transporte': { icono: 'fa-car', badgeClass: 'bg-primary-subtle text-primary border border-primary-subtle', iconBg: 'bg-primary-subtle text-primary' },
  'Vivienda': { icono: 'fa-house', badgeClass: 'bg-indigo-subtle text-indigo border border-indigo-subtle', iconBg: 'bg-primary-subtle text-primary' },
  'Servicios': { icono: 'fa-bolt', badgeClass: 'bg-warning-subtle text-warning border border-warning-subtle', iconBg: 'bg-warning-subtle text-warning' },
  'Entretenimiento': { icono: 'fa-gamepad', badgeClass: 'bg-info-subtle text-info border border-info-subtle', iconBg: 'bg-info-subtle text-info' },
  'Salud': { icono: 'fa-heart-pulse', badgeClass: 'bg-danger-subtle text-danger border border-danger-subtle', iconBg: 'bg-danger-subtle text-danger' },
  'Educación': { icono: 'fa-graduation-cap', badgeClass: 'bg-secondary-subtle text-secondary border border-secondary-subtle', iconBg: 'bg-secondary-subtle text-secondary' },
  'Otros': { icono: 'fa-box', badgeClass: 'bg-light text-secondary border', iconBg: 'bg-body-secondary text-secondary' }
};

export class UI {
  /**
   * Formatea un número como moneda
   */
  static formatearMoneda(monto, moneda = 'ARS') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(monto || 0);
  }

  /**
   * Renderiza el listado de gastos como tarjetas interactivas (clickeables para ver popup)
   * @param {Array} vectorGastos 
   * @param {HTMLElement} contenedor 
   */
  static renderizarListaGastos(vectorGastos, contenedor) {
    if (!contenedor) return;

    if (vectorGastos.length === 0) {
      contenedor.innerHTML = `
        <div class="card border shadow-sm text-center py-4 py-sm-5">
          <div class="card-body">
            <div class="d-inline-flex p-3 rounded-circle bg-body-secondary text-secondary mb-2 fs-4">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <h6 class="fw-bold mb-1">No se encontraron gastos</h6>
            <p class="text-secondary small mb-0" style="font-size: 0.78rem;">No hay registros coincidentes con los filtros aplicados.</p>
          </div>
        </div>
      `;
      return;
    }

    // Cada tarjeta es clickeable para abrir el popup de detalles
    contenedor.innerHTML = vectorGastos.map(gasto => {
      const configCat = ICONOS_CATEGORIAS[gasto.categoria] || ICONOS_CATEGORIAS['Otros'];

      return `
        <div class="card gasto-card border shadow-sm mb-2 cursor-pointer" data-id="${gasto.id}" role="button" tabindex="0" title="Toca para ver detalles de este gasto">
          <div class="card-body p-2.5 p-sm-3">
            <div class="d-flex align-items-center gap-2.5 gap-sm-3">
              
              <!-- Icono de Categoría -->
              <div class="cat-icon-wrapper ${configCat.iconBg}">
                <i class="fa-solid ${configCat.icono}"></i>
              </div>

              <!-- Contenido Central: Título, Categoría y Fecha -->
              <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-items-center gap-1.5 flex-wrap">
                  <span class="fw-bold text-truncate text-body" style="font-size: 0.92rem;">
                    ${UI.escaparHTML(gasto.titulo)}
                  </span>
                  <span class="badge ${configCat.badgeClass} rounded-pill" style="font-size: 0.65rem;">
                    ${gasto.categoria}
                  </span>
                </div>
                <div class="d-flex align-items-center gap-2 text-secondary" style="font-size: 0.72rem;">
                  <span><i class="fa-regular fa-calendar me-1"></i>${gasto.fechaLegible || gasto.fecha}</span>
                  <span>•</span>
                  <span><i class="fa-regular fa-credit-card me-1"></i>${gasto.metodoPago || 'Efectivo'}</span>
                </div>
              </div>

              <!-- Extremo Derecho: Monto e Indicador de apertura -->
              <div class="d-flex align-items-center gap-2 text-end flex-shrink-0">
                <div>
                  <div class="fw-bold text-body" style="font-size: 0.95rem; white-space: nowrap;">
                    ${UI.formatearMoneda(gasto.monto)}
                  </div>
                  <small class="text-secondary d-none d-sm-block" style="font-size: 0.65rem;">Ver detalle</small>
                </div>
                <div class="text-secondary ps-1">
                  <i class="fa-solid fa-chevron-right" style="font-size: 0.72rem;"></i>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Rellena y muestra los datos en el Modal / Popup de Detalle de Gasto
   * @param {Object} gasto 
   */
  static mostrarDetalleEnModal(gasto) {
    if (!gasto) return;

    const configCat = ICONOS_CATEGORIAS[gasto.categoria] || ICONOS_CATEGORIAS['Otros'];

    const elBadge = document.getElementById('detalleCategoriaBadge');
    const elId = document.getElementById('detalleIdGasto');
    const elMonto = document.getElementById('detalleMonto');
    const elTitulo = document.getElementById('detalleTitulo');
    const elFecha = document.getElementById('detalleFecha');
    const elMetodoPago = document.getElementById('detalleMetodoPago');
    const elDescripcion = document.getElementById('detalleDescripcion');

    if (elBadge) {
      elBadge.className = `badge rounded-pill ${configCat.badgeClass} px-2.5 py-1`;
      elBadge.innerHTML = `<i class="fa-solid ${configCat.icono} me-1.5"></i>${gasto.categoria}`;
    }

    if (elId) elId.textContent = `#${gasto.id}`;
    if (elMonto) elMonto.textContent = UI.formatearMoneda(gasto.monto);
    if (elTitulo) elTitulo.textContent = gasto.titulo;
    if (elFecha) elFecha.textContent = gasto.fechaLegible || gasto.fecha;
    if (elMetodoPago) elMetodoPago.textContent = gasto.metodoPago || 'Efectivo';

    if (elDescripcion) {
      if (gasto.descripcion && gasto.descripcion.trim() !== '') {
        elDescripcion.textContent = gasto.descripcion;
        elDescripcion.className = 'p-2.5 rounded-3 bg-body-tertiary border text-body';
      } else {
        elDescripcion.textContent = 'Sin observaciones adicionales registradas para este gasto.';
        elDescripcion.className = 'p-2.5 rounded-3 bg-body-tertiary border text-secondary fst-italic';
      }
    }
  }

  /**
   * Actualiza el resumen de métricas en la cabecera
   */
  static actualizarResumen({ presupuesto, total, totalGastos, saldoRestante, porcentajeConsumido, promedio, cantidad } = {}) {
    const elPresupuesto = document.getElementById('resumenPresupuesto');
    const elTotal = document.getElementById('resumenTotal');
    const elSaldo = document.getElementById('resumenSaldo');
    const elPromedio = document.getElementById('resumenPromedio');
    const elPorcentaje = document.getElementById('resumenPorcentaje');
    const elBarra = document.getElementById('barraProgresoPresupuesto');
    const elCantidad = document.getElementById('resumenCantidad');
    const elBadgeAlerta = document.getElementById('badgeAlertaPresupuesto');

    // Manejo correcto de total (puede venir como 'total' o 'totalGastos')
    const totalReal = total !== undefined ? total : (totalGastos !== undefined ? totalGastos : 0);

    if (elPresupuesto) elPresupuesto.textContent = UI.formatearMoneda(presupuesto);
    if (elTotal) elTotal.textContent = UI.formatearMoneda(totalReal);
    if (elSaldo) elSaldo.textContent = UI.formatearMoneda(saldoRestante);
    if (elPromedio) elPromedio.textContent = UI.formatearMoneda(promedio);
    if (elCantidad) elCantidad.textContent = `${cantidad || 0} gastos`;

    // Porcentaje y barra de progreso Bootstrap
    const pct = Math.min(porcentajeConsumido || 0, 100);
    if (elPorcentaje) elPorcentaje.textContent = `${(porcentajeConsumido || 0).toFixed(1)}%`;
    if (elBarra) {
      elBarra.style.width = `${pct}%`;
      elBarra.setAttribute('aria-valuenow', pct);
      
      elBarra.className = 'progress-bar progress-bar-striped progress-bar-animated';
      if ((porcentajeConsumido || 0) >= 100) {
        elBarra.classList.add('bg-danger');
      } else if ((porcentajeConsumido || 0) >= 80) {
        elBarra.classList.add('bg-warning');
      } else {
        elBarra.classList.add('bg-success');
      }
    }

    // Alerta de presupuesto
    if (elBadgeAlerta) {
      if ((porcentajeConsumido || 0) >= 100) {
        elBadgeAlerta.classList.remove('d-none');
        elBadgeAlerta.className = 'alert alert-danger d-flex align-items-center shadow-sm py-2 px-3 mb-3 small';
        elBadgeAlerta.innerHTML = `<i class="fa-solid fa-triangle-exclamation fs-6 me-2"></i><div><strong>¡Atención!</strong> Presupuesto superado en <strong>${UI.formatearMoneda(Math.abs(saldoRestante))}</strong>.</div>`;
      } else if ((porcentajeConsumido || 0) >= 80) {
        elBadgeAlerta.classList.remove('d-none');
        elBadgeAlerta.className = 'alert alert-warning d-flex align-items-center shadow-sm py-2 px-3 mb-3 small';
        elBadgeAlerta.innerHTML = `<i class="fa-solid fa-circle-exclamation fs-6 me-2"></i><div>Consumido el <strong>${(porcentajeConsumido || 0).toFixed(1)}%</strong> del presupuesto.</div>`;
      } else {
        elBadgeAlerta.classList.add('d-none');
      }
    }

    // Actualizar también los datos visibles en el modal de gestión de presupuesto
    UI.actualizarDatosModalPresupuesto({ presupuesto, total: totalReal, saldoRestante, porcentajeConsumido: porcentajeConsumido || 0 });
  }

  /**
   * Sincroniza los valores informativos dentro del popup de gestión de presupuesto
   */
  static actualizarDatosModalPresupuesto({ presupuesto, total, saldoRestante, porcentajeConsumido }) {
    const elModalPresupuesto = document.getElementById('modalPresupuestoActual');
    const elModalTotal = document.getElementById('modalPresupuestoTotal');
    const elModalSaldo = document.getElementById('modalPresupuestoSaldo');
    const elModalPct = document.getElementById('modalPresupuestoPorcentaje');
    const elModalBarra = document.getElementById('modalPresupuestoBarra');

    if (elModalPresupuesto) elModalPresupuesto.textContent = UI.formatearMoneda(presupuesto);
    if (elModalTotal) elModalTotal.textContent = UI.formatearMoneda(total);
    if (elModalSaldo) elModalSaldo.textContent = UI.formatearMoneda(saldoRestante);
    if (elModalPct) elModalPct.textContent = `${porcentajeConsumido.toFixed(1)}%`;
    if (elModalBarra) {
      const pct = Math.min(porcentajeConsumido, 100);
      elModalBarra.style.width = `${pct}%`;
      elModalBarra.className = 'progress-bar progress-bar-striped progress-bar-animated ' + 
        (porcentajeConsumido >= 100 ? 'bg-danger' : porcentajeConsumido >= 80 ? 'bg-warning' : 'bg-success');
    }
  }

  /**
   * Renderiza el desglose de categorías en la barra lateral usando reduce/map
   */
  static renderizarDesgloseCategorias(distribucion, contenedor) {
    if (!contenedor) return;

    if (!distribucion || distribucion.length === 0) {
      contenedor.innerHTML = '<p class="text-secondary small text-center py-2 mb-0" style="font-size: 0.75rem;">Sin datos de categorías</p>';
      return;
    }

    contenedor.innerHTML = distribucion.map(item => {
      const configCat = ICONOS_CATEGORIAS[item.categoria] || ICONOS_CATEGORIAS['Otros'];
      return `
        <div class="mb-2.5">
          <div class="d-flex align-items-center justify-content-between small mb-1" style="font-size: 0.75rem;">
            <span class="fw-semibold text-body text-truncate pe-1">
              <i class="fa-solid ${configCat.icono} text-primary me-1.5"></i>
              ${item.categoria}
              <small class="text-secondary">(${item.cantidad})</small>
            </span>
            <span class="fw-bold text-nowrap">${UI.formatearMoneda(item.total)}</span>
          </div>
          <div class="progress" style="height: 5px;">
            <div class="progress-bar bg-primary" role="progressbar" style="width: ${item.porcentaje}%;" aria-valuenow="${item.porcentaje}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div class="text-end mt-0.5">
            <small class="text-secondary" style="font-size: 0.65rem;">${item.porcentaje}% del total</small>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Actualiza el widget de divisas
   */
  static renderizarDivisas(divisasData, totalPesos) {
    const contenedor = document.getElementById('widgetDivisas');
    if (!contenedor || !divisasData) return;

    const usdRate = divisasData.USD || 0.00087;
    const eurRate = divisasData.EUR || 0.00080;
    const totalUSD = (totalPesos * usdRate).toFixed(2);
    const totalEUR = (totalPesos * eurRate).toFixed(2);
    const cotizDolar = divisasData.valoresDirectos?.dolarOficial || Math.round(1 / usdRate);

    contenedor.innerHTML = `
      <div class="row g-2">
        <div class="col-6">
          <div class="p-2 rounded-3 bg-body-secondary border">
            <div class="small text-secondary" style="font-size: 0.7rem;">Dólares (USD)</div>
            <div class="fw-bold my-0.5 text-success" style="font-size: 0.95rem;">$${totalUSD}</div>
            <small class="text-secondary d-block" style="font-size: 0.65rem;">1 USD ≈ $${cotizDolar}</small>
          </div>
        </div>
        <div class="col-6">
          <div class="p-2 rounded-3 bg-body-secondary border">
            <div class="small text-secondary" style="font-size: 0.7rem;">Euros (EUR)</div>
            <div class="fw-bold my-0.5 text-primary" style="font-size: 0.95rem;">€${totalEUR}</div>
            <small class="text-secondary d-block" style="font-size: 0.65rem;">Oficial</small>
          </div>
        </div>
      </div>
      <div class="mt-1.5 text-end">
        <small class="text-secondary" style="font-size: 0.65rem;">Fuente: ${divisasData.fuente || 'Servidor Node.js con Axios'}</small>
      </div>
    `;
  }

  /**
   * Muestra notificación Toast interactiva con respuesta del servidor (Bootstrap Toast)
   */
  static mostrarToast({ tipo = 'success', titulo = 'Respuesta del Servidor', mensaje = '', tiempo = 3500 }) {
    const contenedor = document.getElementById('toastContainer');
    if (!contenedor) return;

    const toastId = 'toast_' + Date.now();
    const bgHeader = tipo === 'success' ? 'bg-success text-white' : tipo === 'error' ? 'bg-danger text-white' : tipo === 'warning' ? 'bg-warning text-dark' : 'bg-primary text-white';
    const icono = tipo === 'success' ? 'fa-circle-check' : tipo === 'error' ? 'fa-circle-xmark' : tipo === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';

    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center shadow-lg border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header ${bgHeader} py-1.5 px-2.5">
          <i class="fa-solid ${icono} me-1.5" style="font-size: 0.85rem;"></i>
          <strong class="me-auto small">${UI.escaparHTML(titulo)}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close" style="font-size: 0.65rem;"></button>
        </div>
        <div class="toast-body py-2 px-2.5 small" style="font-size: 0.78rem;">
          ${UI.escaparHTML(mensaje)}
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', toastHTML);
    const toastEl = document.getElementById(toastId);
    if (window.bootstrap && window.bootstrap.Toast) {
      const bsToast = new window.bootstrap.Toast(toastEl, { delay: tiempo });
      bsToast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
      setTimeout(() => toastEl.remove(), tiempo);
    }
  }

  /**
   * Sanitiza strings para prevenir XSS
   */
  static escaparHTML(cadena) {
    if (!cadena) return '';
    return cadena
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
