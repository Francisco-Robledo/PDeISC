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
        // Le agregamos un data-index para poder buscarlo fácilmente y resaltarlo después
        badge.setAttribute('data-index', index); 
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1 item-badge`;
        badge.innerHTML = `<small class="text-muted opacity-75 me-1">[${index}]</small> ${item}`;

        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-1';
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayPalabras', data.palabras, 'danger', 'palabras');
    renderArray('arrayNumeros', data.numeros, 'primary', 'numeros');
    renderArray('arrayCiudades', data.ciudades, 'success', 'ciudades');
    
    // Ocultar resultados anteriores
    document.querySelectorAll('.alert').forEach(el => el.classList.add('d-none'));
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        actualizarUI(await res.json());
    } catch (e) {}
});

// --- FORMULARIOS AGREGAR ---
const configurarFormAdd = (formId, inputId, endpoint) => {
    const form = document.getElementById(formId);
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
                actualizarUI(data.estadoGlobal);
                form.reset(); form.classList.remove('was-validated');
            } else { showNotification(data.error, false); }
        } catch (error) {} 
    });
};

configurarFormAdd('formPalabras', 'inputPalabras', '/api/palabras');
configurarFormAdd('formNumeros', 'inputNumeros', '/api/numeros');
configurarFormAdd('formCiudades', 'inputCiudades', '/api/ciudades');

// --- LÓGICA DE BÚSQUEDA (INDEXOF) Y RESALTADO ---
const resaltarElemento = (containerId, index) => {
    const container = document.getElementById(containerId);
    // Limpiar resaltados previos
    container.querySelectorAll('.item-badge').forEach(b => b.classList.remove('highlight-found'));
    
    // Si index es válido, resaltar el nuevo
    if (index !== -1) {
        const badgeEncontrado = container.querySelector(`[data-index="${index}"]`);
        if (badgeEncontrado) {
            badgeEncontrado.classList.add('highlight-found');
        }
    }
};

const configurarBusqueda = (btnId, endpoint, resultBoxId, containerArrayId) => {
    document.getElementById(btnId).addEventListener('click', async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            
            const resultBox = document.getElementById(resultBoxId);
            resultBox.classList.remove('d-none', 'alert-success', 'alert-danger');
            
            if (data.success) {
                resultBox.classList.add('alert-success');
                resultBox.innerHTML = `<i class="bi bi-check-circle"></i> ${data.mensaje}`;
                resaltarElemento(containerArrayId, data.index);
                showNotification(`Índice encontrado: [${data.index}]`, true);
            } else {
                resultBox.classList.add('alert-danger');
                resultBox.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${data.mensaje}`;
                resaltarElemento(containerArrayId, -1); // Limpia los resaltados
                showNotification('Elemento no encontrado (-1)', false);
            }
        } catch (error) { showNotification('Error de conexión', false); }
    });
};

configurarBusqueda('btnBuscarPerro', '/api/palabras/buscar', 'resPalabras', 'arrayPalabras');
configurarBusqueda('btnBuscar50', '/api/numeros/buscar', 'resNumeros', 'arrayNumeros');
configurarBusqueda('btnBuscarMadrid', '/api/ciudades/buscar', 'resCiudades', 'arrayCiudades');