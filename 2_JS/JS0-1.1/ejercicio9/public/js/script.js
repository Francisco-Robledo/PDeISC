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

// --- ELIMINAR ---
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

// --- RENDERIZADO VISUAL ---
const renderArray = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        
        // Render especial si es un OBJETO (Tarjeta 3)
        if (tipo === 'personas') {
            badge.className = `badge bg-transparent border border-${colorClass} text-body p-2 d-flex justify-content-between align-items-center w-100`;
            // Accedemos a las propiedades del objeto con item.nombre e item.edad
            badge.innerHTML = `<span class="text-start">{ nombre: '<strong class="text-${colorClass}">${item.nombre}</strong>', edad: <strong class="text-${colorClass}">${item.edad}</strong> }</span>`;
        } else {
            // Render normal para strings y números (Tarjetas 1 y 2)
            badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
            badge.textContent = item;
        }

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-2 opacity-50 text-danger';
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayNombres', data.nombres, 'danger', 'nombres');
    renderArray('arrayNumeros', data.numeros, 'primary', 'numeros');
    renderArray('arrayPersonas', data.personas, 'success', 'personas');
    
    // Ocultar resultados previos si agregamos/borramos algo
    document.querySelectorAll('.alert').forEach(el => el.classList.add('d-none'));
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) {}
});

// --- FORMULARIOS (POST) ---
const configurarFormAdd = (formId, inputId, endpoint) => {
    const form = document.getElementById(formId);
    if (!form) return; // Validación por si es el form de objetos
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
            if (res.ok) {
                actualizarUI(data.estadoGlobal); form.reset(); form.classList.remove('was-validated');
            } else { showNotification(data.error, false); }
        } catch (error) {}
    });
};

configurarFormAdd('formNombres', 'inputNombres', '/api/nombres');
configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');

// Formulario especial para Objetos (Manda 2 valores en el JSON)
document.getElementById('formPersonas').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation(); form.classList.add('was-validated'); return;
    }
    const nombre = document.getElementById('inputPersonaNombre').value;
    const edad = document.getElementById('inputPersonaEdad').value;
    try {
        const res = await fetch('/api/personas', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, edad })
        });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal); form.reset(); form.classList.remove('was-validated');
        } else { showNotification(data.error, false); }
    } catch (error) {}
});

// --- LÓGICA FOREACH (GET RESULTADOS) ---
const configurarForEach = (btnId, endpoint, resultBoxId) => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            
            const resultBox = document.getElementById(resultBoxId);
            resultBox.classList.remove('d-none');
            
            if (data.success) {
                // Convertimos el array de resultados en una lista HTML
                const listaHTML = data.resultados.map(linea => `<div><i class="bi bi-arrow-return-right"></i> ${linea}</div>`).join('');
                resultBox.innerHTML = `<strong>Resultado forEach:</strong><div class="mt-2 font-monospace opacity-75">${listaHTML}</div>`;
                showNotification(data.mensaje, true);
            }
        } catch (error) { showNotification('Error de conexión', false); }
    });
};

configurarForEach('btnForEachNombres', '/api/nombres/saludar', 'resNombres');
configurarForEach('btnForEachNumeros', '/api/numeros/doble', 'resNumeros');
configurarForEach('btnForEachPersonas', '/api/personas/mostrar', 'resPersonas');