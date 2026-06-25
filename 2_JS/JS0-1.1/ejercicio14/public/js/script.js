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

// --- 2. NOTIFICACIONES (TOASTS) ---
const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};

// --- 3. LÓGICA DE RENDERIZADO Y ELIMINACIÓN ---
const eliminarElemento = async (tipo, index) => {
    try {
        const response = await fetch(`/api/${tipo}/${index}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.mensaje, true);
            actualizarUI(result.estadoGlobal);
        }
    } catch (error) { showNotification('Error de conexión', false); }
};

const renderArray = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        
        // Renderizado especial para textos (tarjeta 3) para que se lean bien
        if (tipo === 'textos') {
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle p-2 d-flex justify-content-between align-items-center text-wrap lh-sm`;
            badge.textContent = item;
        } else {
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
            badge.innerHTML = `<small class="text-muted opacity-50 me-1">[${index}]</small> ${item}`;
        }

        // Botón de eliminar
        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-2 opacity-75';
        if(tipo !== 'textos') delBtn.classList.add('text-danger');
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayLetras', data.letras, 'danger', 'letras');
    renderArray('arrayNumeros', data.numeros, 'primary', 'numeros');
    renderArray('arrayTextos', data.textos, 'success', 'textos');
};

// Carga Inicial
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) { console.error('Error al conectar con el servidor.'); }
});

// --- 4. FORMULARIOS (AGREGAR ELEMENTOS) ---
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
        } catch (error) { showNotification('Error de red', false); } 
        finally { btn.disabled = false; }
    });
};

configurarFormAdd('formLetras', 'inputLetras', '/api/letras');
configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');
configurarFormAdd('formTextos', 'inputTextos', '/api/textos');

// --- 5. EJECUCIÓN DE REVERSE (MUTACIÓN) ---
const configurarReverse = (btnId, endpoint) => {
    document.getElementById(btnId).addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        
        // UX: Spinner mientras el servidor procesa la mutación
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
        
        try {
            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                // El array mutado vuelve en el estadoGlobal
                actualizarUI(data.estadoGlobal);
                showNotification(data.mensaje, true);
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { 
            showNotification('Error al invertir el array', false); 
        } finally { 
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
};

configurarReverse('btnRevLetras', '/api/letras/reverse');
configurarReverse('btnRevNumeros', '/api/numeros/reverse');
configurarReverse('btnRevTextos', '/api/textos/reverse');