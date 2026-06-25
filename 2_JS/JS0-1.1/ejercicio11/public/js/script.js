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

// --- RENDERIZADO ORIGINAL (BASE) ---
const renderArrayOriginal = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        
        if (tipo === 'usuarios') {
            // Render de objetos
            badge.className = `badge bg-transparent border border-${colorClass} text-body p-2 d-flex justify-content-between align-items-center w-100`;
            const icono = item.activo ? '🟢' : '🔴';
            badge.innerHTML = `<span class="text-start">${icono} { nombre: '${item.nombre}', activo: ${item.activo} }</span>`;
        } else {
            // Render normal
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
            badge.textContent = item;
        }

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-2 opacity-75';
        if(tipo !== 'usuarios') delBtn.classList.add('text-danger');
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

// --- RENDERIZADO FILTRADO (SOLO LECTURA) ---
const renderFiltrado = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-white fst-italic small">Ninguno cumple la condición.</span>';
        return;
    }
    arrayData.forEach((item) => {
        const badge = document.createElement('span');
        
        if (tipo === 'usuarios') {
            badge.className = `badge bg-${colorClass} text-white p-2 d-block text-start shadow-sm`;
            badge.innerHTML = `🟢 ${item.nombre}`; // Ya sabemos que son los activos
        } else {
            badge.className = `badge bg-${colorClass} text-white px-2 py-1 shadow-sm`;
            badge.textContent = item;
        }
        
        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArrayOriginal('arrayNumeros', data.numeros, 'danger', 'numeros');
    renderArrayOriginal('arrayPalabras', data.palabras, 'primary', 'palabras');
    renderArrayOriginal('arrayUsuarios', data.usuarios, 'success', 'usuarios');
    
    // Ocultar resultados si se modifica el array original
    document.querySelectorAll('.box-filter').forEach(el => el.classList.add('d-none'));
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
    if (!form) return;
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

configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');
configurarFormAdd('formPalabras', 'inputPalabras', '/api/palabras');

// Form especial para Objetos (Usuarios)
document.getElementById('formUsuarios').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation(); form.classList.add('was-validated'); return;
    }
    const nombre = document.getElementById('inputUsuarioNombre').value;
    const activo = document.getElementById('inputUsuarioEstado').value; // 'true' o 'false' (string)
    
    try {
        const res = await fetch('/api/usuarios', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, activo })
        });
        const data = await res.json();
        if (res.ok) { actualizarUI(data.estadoGlobal); form.reset(); form.classList.remove('was-validated'); }
    } catch (error) {}
});

// --- EJECUTAR FILTER (GET) ---
const configurarFilter = (btnId, endpoint, boxResId, containerResId, colorClass, tipo) => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            if (res.ok) {
                document.getElementById(boxResId).classList.remove('d-none');
                renderFiltrado(containerResId, data.resultado, colorClass, tipo);
                showNotification(data.mensaje, true);
            }
        } catch (error) { showNotification('Error al filtrar', false); }
    });
};

configurarFilter('btnFilterNumeros', '/api/numeros/filter', 'boxFilterNumeros', 'resNumeros', 'danger', 'numeros');
configurarFilter('btnFilterPalabras', '/api/palabras/filter', 'boxFilterPalabras', 'resPalabras', 'primary', 'palabras');
configurarFilter('btnFilterUsuarios', '/api/usuarios/filter', 'boxFilterUsuarios', 'resUsuarios', 'success', 'usuarios');