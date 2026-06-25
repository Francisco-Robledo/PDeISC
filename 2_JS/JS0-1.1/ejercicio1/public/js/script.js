// --- 1. BOTONES FLOTANTES: MODO OSCURO Y SCROLL ---
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

// --- 3. LÓGICA ESTRICTA HTML5 + JS DE ARRAYS ---
let ultimoNumeroRegistrado = 0;
const frutasValidas = ['manzana', 'naranja', 'frutilla', 'banana', 'pera', 'uva', 'kiwi', 'sandia', 'melon', 'durazno', 'ciruela', 'mango', 'papaya', 'limon', 'cereza', 'anana', 'pomelo', 'mandarina', 'pitahaya', 'maracuya', 'arandano', 'frambuesa', 'mora'];
// Validación cruzada para frutas en tiempo real
document.getElementById('inputFrutas').addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val !== "" && !frutasValidas.includes(val)) {
        e.target.setCustomValidity('Debe ser una fruta válida (ej: pera, manzana).');
    } else {
        e.target.setCustomValidity(''); // Resetea error
    }
});

// Petición DELETE para borrar elementos
const eliminarElemento = async (tipo, index) => {
    try {
        const response = await fetch(`/api/${tipo}/${index}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            showNotification(result.mensaje, true);
            verificarLimitesYReglas(result.estadoGlobal);
        } else {
            showNotification(result.error, false);
        }
    } catch (error) {
        showNotification('Error al eliminar', false);
    }
};

// Renderizado de Arrays (con botón de borrar para elementos que no son base)
const renderArray = (containerId, arrayData, colorClass, baseLength, tipo) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (arrayData.length === 0) {
        container.innerHTML = '<span class="text-muted fst-italic small">[]</span>';
        return;
    }
    arrayData.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = `badge bg-${colorClass}-subtle text-${colorClass} border border-${colorClass}-subtle px-2 py-1 d-inline-flex align-items-center gap-1`;
        badge.textContent = item;

        // Mostrar botón de la 'X' solo en los elementos agregados por el usuario
        if (index >= baseLength) {
            const delBtn = document.createElement('i');
            delBtn.className = 'bi bi-x-circle-fill ms-1';
            delBtn.style.cursor = 'pointer';
            delBtn.title = "Eliminar";
            delBtn.addEventListener('click', () => eliminarElemento(tipo, index));
            badge.appendChild(delBtn);
        }
        container.appendChild(badge);
    });
};

const verificarLimitesYReglas = (data) => {
    // Frutas (Límite 3)
    renderArray('arrayFrutas', data.frutas, 'danger', 0, 'frutas');
    document.getElementById('contadorFrutas').textContent = `(${data.frutas.length}/3)`;
    const inputFrutas = document.getElementById('inputFrutas');
    const btnFrutas = document.getElementById('btnFrutas');
    if (data.frutas.length >= 3) {
        inputFrutas.disabled = true;
        inputFrutas.placeholder = "Límite alcanzado";
        btnFrutas.disabled = true;
    } else {
        inputFrutas.disabled = false;
        inputFrutas.placeholder = "Ej: Manzana";
        btnFrutas.disabled = false;
    }

    // Amigos (Base 1, máximo 4)
    const agregados = data.amigos.length - 1;
    renderArray('arrayAmigos', data.amigos, 'info', 1, 'amigos');
    document.getElementById('contadorAmigos').textContent = `(+${agregados}/3)`;
    const inputAmigos = document.getElementById('inputAmigos');
    const btnAmigos = document.getElementById('btnAmigos');
    if (agregados >= 3) {
        inputAmigos.disabled = true;
        inputAmigos.placeholder = "Ya agregaste 3 amigos";
        btnAmigos.disabled = true;
    } else {
        inputAmigos.disabled = false;
        inputAmigos.placeholder = "Ej: Lucas";
        btnAmigos.disabled = false;
    }

    // Números (Base 4)
    renderArray('arrayNumeros', data.numeros, 'success', 4, 'numeros');
    ultimoNumeroRegistrado = data.numeros[data.numeros.length - 1];
    document.getElementById('indicadorUltimo').textContent = `mayor a ${ultimoNumeroRegistrado}`;
    
    const inputNum = document.getElementById('inputNumeros');
    inputNum.min = ultimoNumeroRegistrado + 1; 
    document.getElementById('feedbackNumeros').textContent = `El número debe ser mayor a ${ultimoNumeroRegistrado}.`;
};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/estado');
        const data = await res.json();
        verificarLimitesYReglas(data);
    } catch (e) {
        console.error("Error servidor.");
    }
});

document.getElementById('inputNumeros').addEventListener('input', (e) => {
    const valor = Number(e.target.value);
    if (valor <= ultimoNumeroRegistrado && e.target.value !== "") {
        e.target.setCustomValidity(`Debe ser mayor a ${ultimoNumeroRegistrado}`);
    } else {
        e.target.setCustomValidity(""); 
    }
});

const configurarFormulario = (formId, inputId, endpoint) => {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        const input = document.getElementById(inputId);
        const submitBtn = form.querySelector('button[type="submit"]');
        const valor = input.value;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor })
            });
            const result = await response.json();
            
            if (response.ok) {
                showNotification(result.mensaje, true);
                verificarLimitesYReglas(result.estadoGlobal); 
                form.reset();
                form.classList.remove('was-validated');
            } else {
                showNotification(result.error, false);
            }
        } catch (error) {
            showNotification('Error de red', false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
            if(!input.disabled) input.focus();
        }
    });
};

configurarFormulario('formFrutas', 'inputFrutas', '/api/frutas');
configurarFormulario('formAmigos', 'inputAmigos', '/api/amigos');
configurarFormulario('formNumeros', 'inputNumeros', '/api/numeros');