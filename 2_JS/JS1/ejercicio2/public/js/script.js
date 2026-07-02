// --- 1. CONFIGURACIÓN UI (Tema y Toasts) ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const updateThemeUI = (theme) => {
    html.setAttribute('data-bs-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars text-light';
    themeToggleBtn.className = theme === 'dark' 
        ? 'btn btn-light rounded-circle shadow position-fixed bottom-0 start-0 m-4 btn-flotante' 
        : 'btn btn-dark rounded-circle shadow position-fixed bottom-0 start-0 m-4 btn-flotante';
};

themeToggleBtn.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('pro-theme', nextTheme);
    updateThemeUI(nextTheme);
});
updateThemeUI(localStorage.getItem('pro-theme') || 'light');

// Setear fecha actual por defecto en el input de fecha
document.getElementById('inputFecha').valueAsDate = new Date();

const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};


// --- 2. RENDERIZADO DINÁMICO (SPA) ---
const renderInventario = (inventario) => {
    const contenedor = document.getElementById('contenedorInventario');
    const emptyState = document.getElementById('emptyState');
    document.getElementById('contadorItems').textContent = `${inventario.length} ítems`;
    
    contenedor.innerHTML = ''; // Limpiamos la grilla
    
    if (inventario.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    // Iteramos el array para construir visualmente cada uno de los 8 campos
    inventario.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 fade-in'; 
        
        // Formateo del precio a moneda
        const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.precio);

        col.innerHTML = `
            <div class="card card-pro h-100 position-relative border-start border-4 border-primary">
                <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow-sm" 
                        style="width:30px; height:30px; padding:0; line-height:0;"
                        onclick="borrarItem(${item.id})" title="Borrar">
                    <i class="bi bi-x"></i>
                </button>

                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle">${item.categoria}</span>
                        <small class="text-muted opacity-75">Índice: [${index}]</small>
                    </div>
                    
                    <h5 class="fw-bold text-truncate" title="${item.nombre}">${item.nombre}</h5>
                    <h6 class="text-success fw-bold mb-3">${precioFormateado}</h6>
                    
                    <ul class="list-unstyled small text-muted mb-0">
                        <li class="mb-1"><i class="bi bi-tag"></i> <strong>Marca:</strong> ${item.marca}</li>
                        <li class="mb-1"><i class="bi bi-upc-scan"></i> <strong>SKU:</strong> ${item.sku}</li>
                        <li class="mb-1"><i class="bi bi-box-seam"></i> <strong>Stock:</strong> ${item.stock} uds.</li>
                        <li class="mb-1"><i class="bi bi-star"></i> <strong>Estado:</strong> ${item.estado}</li>
                        <li><i class="bi bi-calendar-event"></i> <strong>Ingreso:</strong> ${item.fecha}</li>
                    </ul>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
};

// Función de borrado expuesta al scope global
window.borrarItem = async (id) => {
    try {
        const res = await fetch(`/api/inventario/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            renderInventario(data.inventario);
            showNotification(data.mensaje, true);
        }
    } catch (e) { showNotification('Error al borrar', false); }
};

// Carga Inicial
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/inventario');
        const data = await res.json();
        renderInventario(data.inventario);
    } catch (e) { console.error("Error conectando al servidor"); }
});


// --- 3. ENVÍO DEL FORMULARIO SIN RECARGAR (FormData) ---
const form = document.getElementById('formInventario');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Magia SPA: no recarga la página
    
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';

    // Usamos el Método Moderno (FormData) para extraer los 8 campos + 1 automáticamente
    const formData = new FormData(form);
    
    // Convertimos FormData a un objeto JSON simple para enviarlo al backend
    const datos = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/inventario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            renderInventario(data.inventario); // Actualiza la grilla de tarjetas
            form.reset();
            form.classList.remove('was-validated');
            document.getElementById('inputFecha').valueAsDate = new Date(); // Resetear fecha a hoy
            showNotification(data.mensaje, true);
        } else {
            showNotification(data.error, false);
        }
    } catch (error) {
        showNotification('Error de conexión', false);
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
    }
});