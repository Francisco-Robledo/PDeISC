// --- MODO OSCURO Y SCROLL ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const updateThemeUI = (theme) => {
    html.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill text-warning';
        themeToggleBtn.className = 'btn btn-light rounded-circle shadow position-fixed bottom-0 start-0 m-4 d-flex align-items-center justify-content-center btn-flotante';
    } else {
        themeIcon.className = 'bi bi-moon-stars text-light';
        themeToggleBtn.className = 'btn btn-dark rounded-circle shadow position-fixed bottom-0 start-0 m-4 d-flex align-items-center justify-content-center btn-flotante';
    }
};

themeToggleBtn.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('pro-theme', nextTheme);
    updateThemeUI(nextTheme);
});
updateThemeUI(localStorage.getItem('pro-theme') || 'light');

const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) scrollTopBtn.classList.remove('d-none');
    else scrollTopBtn.classList.add('d-none');
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};

// --- ELIMINAR DEL ORIGINAL ---
const eliminarElemento = async (tipo, index) => {
    try {
        const response = await fetch(`/api/${tipo}/${index}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.mensaje, true);
            actualizarUI(result.estadoGlobal);
        }
    } catch (error) {}
};

// --- RENDER ORIGINAL ---
const renderArrayOriginal = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        
        if (tipo === 'productos') {
            badge.className = `badge bg-transparent border border-${colorClass} text-body p-2 d-flex justify-content-between align-items-center w-100`;
            badge.innerHTML = `<span class="text-start">{ nombre: '${item.nombre}', precio: <strong class="text-${colorClass}">$${item.precio}</strong> }</span>`;
        } else {
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
            badge.textContent = item;
        }

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-2 opacity-50';
        if(tipo !== 'productos') delBtn.classList.add('text-danger');
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArrayOriginal('arraySuma', data.numSuma, 'primary', 'suma');
    renderArrayOriginal('arrayMulti', data.numMulti, 'danger', 'multi');
    renderArrayOriginal('arrayProductos', data.productos, 'success', 'productos');
    
    // Ocultar resultados de reduce() si modifican los arrays
    document.querySelectorAll('.box-reduce').forEach(el => el.classList.add('d-none'));
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) {}
});

// --- POST (AGREGAR AL ORIGINAL) ---
const configurarFormAdd = (formId, inputId, endpoint) => {
    const form = document.getElementById(formId);
    if(!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation(); form.classList.add('was-validated'); return;
        }
        const valor = document.getElementById(inputId).value;
        try {
            const res = await fetch(endpoint, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valor })
            });
            const data = await res.json();
            if (res.ok) { actualizarUI(data.estadoGlobal); form.reset(); form.classList.remove('was-validated'); }
        } catch (error) {}
    });
};

configurarFormAdd('formSuma', 'inputSuma', '/api/suma');
configurarFormAdd('formMulti', 'inputMulti', '/api/multi');

document.getElementById('formProductos').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation(); form.classList.add('was-validated'); return;
    }
    const nombre = document.getElementById('inputProdNombre').value;
    const precio = document.getElementById('inputProdPrecio').value;
    try {
        const res = await fetch('/api/productos', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, precio })
        });
        const data = await res.json();
        if (res.ok) { actualizarUI(data.estadoGlobal); form.reset(); form.classList.remove('was-validated'); }
    } catch (error) {}
});

// --- EJECUTAR REDUCE (GET) ---
const configurarReduce = (btnId, endpoint, boxResId, containerResId, prefix = '') => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            if (res.ok) {
                document.getElementById(boxResId).classList.remove('d-none');
                
                // Formateamos el resultado numérico para que se vea bien (con comas, etc)
                const valorFinal = Number(data.resultado).toLocaleString('es-AR');
                document.getElementById(containerResId).textContent = `${prefix}${valorFinal}`;
                
                showNotification(data.mensaje, true);
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { showNotification('Error al ejecutar reduce', false); }
    });
};

configurarReduce('btnReduceSuma', '/api/suma/reduce', 'boxResSuma', 'resSuma');
configurarReduce('btnReduceMulti', '/api/multi/reduce', 'boxResMulti', 'resMulti');
configurarReduce('btnReduceProductos', '/api/productos/reduce', 'boxResProductos', 'resProductos', '$ ');