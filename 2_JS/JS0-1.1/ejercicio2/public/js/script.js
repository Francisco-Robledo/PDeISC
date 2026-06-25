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

// --- FUNCIÓN PARA BORRAR UN ELEMENTO ESPECÍFICO (CORRECCIÓN) ---
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

// --- RENDERIZADO CON BOTÓN 'X' ---
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
        badge.textContent = item;

        // Le agregamos la cruz 'X' a todos los elementos para corregir tipeos
        const delBtn = document.createElement('i');
        delBtn.className = 'bi bi-x-circle-fill ms-1';
        delBtn.style.cursor = 'pointer';
        delBtn.title = "Corregir error";
        delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
        badge.appendChild(delBtn);

        container.appendChild(badge);
    });
};

const actualizarUI = (data) => {
    renderArray('arrayAnimales', data.animales, 'danger', 'animales');
    renderArray('arrayCompras', data.compras, 'info', 'compras');
    renderArray('arrayMagico', data.arrayMagico, 'success', 'magico');

    document.getElementById('btnPopAnimales').disabled = data.animales.length === 0;
    document.getElementById('btnPopCompras').disabled = data.compras.length === 0;
    document.getElementById('btnPopVaciar').disabled = data.arrayMagico.length === 0;
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
            } else {
                showNotification(data.error, false);
            }
        } catch (error) { showNotification('Error de red', false); }
        finally { btn.disabled = false; }
    });
};

configurarFormAdd('formAnimales', 'inputAnimales', '/api/animales');
configurarFormAdd('formCompras', 'inputCompras', '/api/compras');
configurarFormAdd('formMagico', 'inputMagico', '/api/magico');

const ejecutarPop = async (endpoint, callbackExito) => {
    try {
        const res = await fetch(endpoint, { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
            actualizarUI(data.estadoGlobal);
            if (callbackExito) callbackExito(data);
            else showNotification(data.mensaje, true);
        } else {
            showNotification(data.error, false);
        }
    } catch (error) { showNotification('Error de red', false); }
};

document.getElementById('btnPopAnimales').addEventListener('click', () => {
    ejecutarPop('/api/animales/pop');
});

document.getElementById('btnPopCompras').addEventListener('click', () => {
    ejecutarPop('/api/compras/pop', (data) => {
        const display = document.getElementById('displayEliminado');
        display.innerHTML = `<strong>Eliminado:</strong> <span class="badge bg-danger">${data.eliminado}</span>`;
        display.classList.remove('d-none');
        showNotification(data.mensaje, true);
    });
});

document.getElementById('btnPopVaciar').addEventListener('click', () => {
    ejecutarPop('/api/magico/vaciar', (data) => {
        const display = document.getElementById('displayVaciados');
        display.innerHTML = `<strong>Bucle while extrajo:</strong><br><small>${data.eliminados.join(' → ')}</small>`;
        display.classList.remove('d-none');
        showNotification(data.mensaje, true);
    });
});