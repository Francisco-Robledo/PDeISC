// --- 1. MODO OSCURO Y SCROLL ---
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

// --- 2. TOASTS ---
const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};

// --- 3. LÓGICA DE SPLICE() ---
const eliminarElemento = async (tipo, index) => {
    try {
        const response = await fetch(`/api/${tipo}/${index}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.mensaje, true);
            actualizarUI(result.estadoGlobal);
        } else { showNotification(result.error, false); }
    } catch (error) { showNotification('Error de conexión', false); }
};

// Renderizado con ÍNDICES VISIBLES (Clave para aprender splice)
const renderArray = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">[] Vacío</span>';
        return;
    }

    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
        
        // UX: Mostramos el índice en gris clarito antes del valor
        badge.innerHTML = `<small class="text-muted opacity-75 me-1">[${index}]</small> ${item}`;

        // Botón individual de borrado
        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-1';
        delBtn.style.cursor = 'pointer';
        delBtn.title = "Corregir";
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayLetras', data.letras, 'danger', 'letras');
    renderArray('arrayNombres', data.nombres, 'info', 'nombres');
    renderArray('arrayColores', data.colores, 'success', 'colores');

    // Validación dinámica para la tarjeta 3 (No podés elegir un índice mayor al array)
    const inputPos = document.getElementById('inputPos');
    inputPos.max = data.colores.length > 0 ? data.colores.length - 1 : 0;
};

// Carga Inicial
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) { console.error("Error servidor."); }
});

// Tarjeta 1: Splice Eliminar
document.getElementById('btnSpliceLetras').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/letras/splice', { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal);
            showNotification(data.mensaje, true);
        } else { showNotification(data.error, false); }
    } catch (e) { showNotification('Error de red', false); }
});

// Agregar letra base (Formulario Tarjeta 1)
const formLetras = document.getElementById('formLetras');
formLetras.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formLetras.checkValidity()) {
        e.stopPropagation(); formLetras.classList.add('was-validated'); return;
    }
    const valor = document.getElementById('inputLetras').value;
    try {
        const res = await fetch('/api/letras', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valor })
        });
        const data = await res.json();
        if (res.ok) { actualizarUI(data.estadoGlobal); formLetras.reset(); formLetras.classList.remove('was-validated'); }
    } catch (error) {}
});

// Tarjeta 2: Splice Insertar
const formNombres = document.getElementById('formNombres');
formNombres.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formNombres.checkValidity()) {
        e.stopPropagation(); formNombres.classList.add('was-validated'); return;
    }
    const btn = formNombres.querySelector('button[type="submit"]');
    btn.disabled = true;
    const valor = document.getElementById('inputNombres').value;
    
    try {
        const res = await fetch('/api/nombres/splice', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valor })
        });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal);
            showNotification(data.mensaje, true);
            formNombres.reset(); formNombres.classList.remove('was-validated');
        } else { showNotification(data.error, false); }
    } catch (error) { showNotification('Error', false); } finally { btn.disabled = false; }
});

// Tarjeta 3: Splice Reemplazar
const formColores = document.getElementById('formColores');
formColores.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formColores.checkValidity()) {
        e.stopPropagation(); formColores.classList.add('was-validated'); return;
    }
    const btn = formColores.querySelector('button[type="submit"]');
    btn.disabled = true;
    
    const posicion = document.getElementById('inputPos').value;
    const nuevo1 = document.getElementById('inputV1').value;
    const nuevo2 = document.getElementById('inputV2').value;
    
    try {
        const res = await fetch('/api/colores/splice', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ posicion, nuevo1, nuevo2 })
        });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal);
            showNotification(data.mensaje, true);
            formColores.reset(); formColores.classList.remove('was-validated');
        } else { showNotification(data.error, false); }
    } catch (error) { showNotification('Error', false); } finally { btn.disabled = false; }
});