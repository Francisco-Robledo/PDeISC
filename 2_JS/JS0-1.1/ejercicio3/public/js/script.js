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

// --- 3. LÓGICA DE UNSHIFT() Y ARRAYS ---
const eliminarElemento = async (tipo, index) => {
    try {
        const response = await fetch(`/api/${tipo}/${index}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.mensaje, true);
            actualizarUI(result.estadoGlobal);
        } else {
            showNotification(result.error, false);
        }
    } catch (error) {
        showNotification('Error al eliminar', false);
    }
};

// Renderizado de Arrays (Adaptado para unshift)
const renderArray = (containerId, arrayData, colorClass, tipo, elementosBaseCont) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">[] Vacío</span>';
        return;
    }
    
    // Al usar unshift, los elementos nuevos (los que se pueden borrar) están AL PRINCIPIO
    // La cantidad de elementos que el usuario agregó es: total - base
    const agregados = arrayData.length - elementosBaseCont;

    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-flex align-items-center justify-content-between w-100 text-start`;
        
        // Estilo especial para la tarjeta 3 (Usuarios)
        if (tipo === 'usuarios') {
            badge.innerHTML = `<span class="text-truncate"><i class="bi bi-circle-fill text-success" style="font-size: 0.5rem; vertical-align: middle; margin-right: 5px;"></i> ${item}</span>`;
        } else {
            badge.textContent = item;
        }

        // Mostrar 'X' SOLO en los elementos agregados por el usuario
        // Como están al principio (unshift), sus índices son de 0 hasta (agregados - 1)
        if (index < agregados || tipo === 'colores') {
            const delBtn = document.createElement('i');
            delBtn.className = 'bi bi-x-circle-fill ms-2';
            delBtn.style.cursor = 'pointer';
            delBtn.title = "Borrar/Corregir";
            delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
            badge.appendChild(delBtn);
        }

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    // Colores (Vacío al inicio, así que elementosBase = 0)
    renderArray('arrayColores', data.colores, 'danger', 'colores', 0);
    document.getElementById('contadorColores').textContent = `(${data.colores.length}/3)`;
    const inputColores = document.getElementById('inputColores');
    const btnColores = document.getElementById('btnColores');
    if (data.colores.length >= 3) {
        inputColores.disabled = true;
        inputColores.placeholder = "Límite de colores alcanzado";
        btnColores.disabled = true;
    } else {
        inputColores.disabled = false;
        inputColores.placeholder = "Ej: Azul";
        btnColores.disabled = false;
    }

    // Tareas (2 base al inicio)
    renderArray('arrayTareas', data.tareas, 'warning', 'tareas', 2);

    // Usuarios (2 base al inicio)
    renderArray('arrayUsuarios', data.usuarios, 'success', 'usuarios', 2);
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) {
        console.error("Error servidor.");
    }
});

const configurarFormAdd = (formId, inputId, endpoint) => {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        const valor = document.getElementById(inputId).value;
        const btn = form.querySelector('button[type="submit"]');
        
        btn.disabled = true;
        
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor })
            });
            const data = await res.json();
            if (res.ok) {
                actualizarUI(data.estadoGlobal);
                form.reset();
                form.classList.remove('was-validated');
                showNotification(data.mensaje, true);
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { 
            showNotification('Error de red', false); 
        } finally { 
            btn.disabled = false; 
            document.getElementById(inputId).focus();
        }
    });
};

configurarFormAdd('formColores', 'inputColores', '/api/colores');
configurarFormAdd('formTareas', 'inputTareas', '/api/tareas');
configurarFormAdd('formUsuarios', 'inputUsuarios', '/api/usuarios');