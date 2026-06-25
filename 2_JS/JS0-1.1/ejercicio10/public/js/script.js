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

// RENDER ORIGINAL
const renderArrayOriginal = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
        
        // Si es precio, le ponemos el signo $
        const textItem = tipo === 'precios' ? `$${item}` : item;
        badge.innerHTML = `${textItem}`;

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-1 opacity-75';
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

// RENDER TRANSFORMADO (MAP) - Sin botón de borrar porque es el array resultante
const renderMapeado = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    arrayData.forEach((item) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass} text-white px-2 py-1 shadow-sm`;
        
        // Si es precio, le ponemos el signo $
        const textItem = tipo === 'precios' ? `$${item}` : item;
        badge.textContent = textItem;
        
        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArrayOriginal('arrayNumeros', data.numeros, 'danger', 'numeros');
    renderArrayOriginal('arrayNombres', data.nombres, 'primary', 'nombres');
    renderArrayOriginal('arrayPrecios', data.precios, 'success', 'precios');
    
    // Ocultamos los resultados si cambia el array original
    document.querySelectorAll('.bg-danger-subtle, .bg-primary-subtle, .bg-success-subtle').forEach(el => {
        if(el.id.includes('boxMap')) el.classList.add('d-none');
    });
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation(); form.classList.add('was-validated'); return;
        }
        const valor = document.getElementById(inputId).value;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
            const res = await fetch(endpoint, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valor })
            });
            const data = await res.json();
            if (res.ok) {
                actualizarUI(data.estadoGlobal);
                form.reset(); form.classList.remove('was-validated');
            } else { showNotification(data.error, false); }
        } catch (error) {} finally { btn.disabled = false; }
    });
};

configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');
configurarFormAdd('formNombres', 'inputNombres', '/api/nombres');
configurarFormAdd('formPrecios', 'inputPrecios', '/api/precios');

// --- EJECUTAR MAP (GET) ---
const configurarMap = (btnId, endpoint, boxResId, containerResId, colorClass, tipo) => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            if (res.ok) {
                document.getElementById(boxResId).classList.remove('d-none');
                renderMapeado(containerResId, data.resultado, colorClass, tipo);
                showNotification(data.mensaje, true);
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { showNotification('Error al ejecutar map()', false); }
    });
};

configurarMap('btnMapNumeros', '/api/numeros/map', 'boxMapNumeros', 'resNumeros', 'danger', 'numeros');
configurarMap('btnMapNombres', '/api/nombres/map', 'boxMapNombres', 'resNombres', 'primary', 'nombres');
configurarMap('btnMapPrecios', '/api/precios/map', 'boxMapPrecios', 'resPrecios', 'success', 'precios');