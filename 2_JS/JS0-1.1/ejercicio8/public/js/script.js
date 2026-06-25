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

// --- RENDER Y ELIMINACIÓN ---
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

const renderArray = (containerId, arrayData, colorClass, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">Vacío</span>';
        return;
    }
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1 item-badge`;
        badge.textContent = item;

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-1 opacity-50';
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayRoles', data.roles, 'danger', 'roles');
    renderArray('arrayColores', data.colores, 'success', 'colores');
    renderArray('arrayNumeros', data.numeros, 'primary', 'numeros');
    
    // Ocultar resultados previos
    document.querySelectorAll('.alert-result').forEach(el => el.classList.add('d-none'));
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) {}
});

// --- LÓGICA DE COMPROBACIÓN BOLEANA (INCLUDES) ---
const configurarCheckIncludes = (btnId, endpoint, resultBoxId) => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            
            const resultBox = document.getElementById(resultBoxId);
            resultBox.classList.remove('d-none', 'alert-success', 'alert-danger');
            resultBox.classList.add('alert-result'); // Clase auxiliar
            
            // Evaluamos el Booleano que devuelve includes()
            if (data.existe) {
                resultBox.classList.add('alert-success');
                resultBox.innerHTML = `<i class="bi bi-check-circle"></i> ${data.mensaje}`;
                showNotification('Devolvió: TRUE', true);
            } else {
                resultBox.classList.add('alert-danger');
                resultBox.innerHTML = `<i class="bi bi-x-circle"></i> ${data.mensaje}`;
                showNotification('Devolvió: FALSE', false);
            }
        } catch (error) { showNotification('Error de conexión', false); }
    });
};

configurarCheckIncludes('btnCheckAdmin', '/api/roles/includes', 'resRoles');
configurarCheckIncludes('btnCheckVerde', '/api/colores/includes', 'resColores');

// --- FORMULARIOS PARA AGREGAR ELEMENTOS ---
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
                showNotification(data.mensaje, true);
            } else { 
                // En la tarjeta 3, si includes() detecta el número, el backend manda error acá
                showNotification(data.error, false); 
            }
        } catch (error) {} finally { btn.disabled = false; }
    });
};

configurarFormAdd('formRoles', 'inputRoles', '/api/roles');
configurarFormAdd('formColores', 'inputColores', '/api/colores');
configurarFormAdd('formNumerosAgregar', 'inputNumeros', '/api/numeros/agregar'); // Tarjeta 3