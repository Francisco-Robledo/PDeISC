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

// --- 3. LÓGICA DE SHIFT() Y ARRAYS ---
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
    } catch (error) { showNotification('Error de conexión', false); }
};

// Renderizado con diferentes diseños visuales dependiendo del tipo
const renderArray = (containerId, arrayData, colorClass, tipo, elementosBaseCount) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">[] Vacío</span>';
        return;
    }

    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        
        // Estilos específicos según el tipo de array
        if (tipo === 'mensajes') {
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle p-2 text-start d-flex justify-content-between align-items-center text-wrap lh-sm`;
            badge.style.borderRadius = "10px 10px 10px 0px"; // Efecto globo de chat
            badge.textContent = item;
        } else if (tipo === 'clientes') {
            badge.className = `badge bg-transparent border border-${colorClass} text-body p-2 d-flex justify-content-between align-items-center`;
            badge.innerHTML = `<span><strong class="text-${colorClass}">Turno ${index + 1}:</strong> ${item}</span>`;
        } else {
            // Numeros
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-flex align-items-center`;
            badge.textContent = item;
        }

        // Mostrar 'X' (borrado individual) en elementos nuevos
        if (index >= elementosBaseCount) {
            const delBtn = document.createElement('i');
            delBtn.className = 'bi bi-x-circle-fill ms-2 text-danger opacity-75';
            delBtn.style.cursor = 'pointer';
            delBtn.title = "Corregir/Borrar manual";
            delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
            badge.appendChild(delBtn);
        }

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayNumeros', data.numeros, 'primary', 'numeros', 5);
    renderArray('arrayMensajes', data.mensajes, 'info', 'mensajes', 3);
    renderArray('arrayClientes', data.clientes, 'success', 'clientes', 4);

    // Deshabilitar botones principales si no hay elementos
    document.getElementById('btnShiftNumeros').disabled = data.numeros.length === 0;
    document.getElementById('btnShiftMensajes').disabled = data.mensajes.length === 0;
    document.getElementById('btnShiftClientes').disabled = data.clientes.length === 0;
};

// Carga Inicial
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) { console.error("Error servidor."); }
});

// Formularios para agregar (POST)
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
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { showNotification('Error de red', false); } 
        finally { btn.disabled = false; }
    });
};

configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');
configurarFormAdd('formMensajes', 'inputMensajes', '/api/mensajes');
configurarFormAdd('formClientes', 'inputClientes', '/api/clientes');

// Ejecución de SHIFT (Botones principales)
const ejecutarShift = async (endpoint, callbackPersonalizado) => {
    try {
        const res = await fetch(endpoint, { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal);
            if (callbackPersonalizado) callbackPersonalizado(data);
            else showNotification(data.mensaje, true);
        } else {
            showNotification(data.error, false);
        }
    } catch (error) { showNotification('Error al ejecutar shift', false); }
};

document.getElementById('btnShiftNumeros').addEventListener('click', () => {
    ejecutarShift('/api/numeros/shift');
});

document.getElementById('btnShiftMensajes').addEventListener('click', () => {
    ejecutarShift('/api/mensajes/shift');
});

document.getElementById('btnShiftClientes').addEventListener('click', () => {
    ejecutarShift('/api/clientes/shift', (data) => {
        // En la cola de clientes, mostramos a quién estamos atendiendo arriba de la lista
        const display = document.getElementById('displayAtendiendo');
        display.innerHTML = `<i class="bi bi-person-check-fill"></i> ¡Llamando al cliente: <span class="text-uppercase border-bottom border-success border-2">${data.extraido}</span>!`;
        display.classList.remove('d-none');
        
        // Lo ocultamos después de 4 segundos
        setTimeout(() => { display.classList.add('d-none'); }, 4000);
        showNotification(data.mensaje, true);
    });
});