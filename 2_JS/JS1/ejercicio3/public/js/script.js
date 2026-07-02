// --- CONFIGURACIÓN UI (Tema y Toasts) ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const updateThemeUI = (theme) => {
    html.setAttribute('data-bs-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars text-light';
    themeToggleBtn.className = theme === 'dark' 
        ? 'btn btn-light rounded-circle shadow position-fixed bottom-0 start-0 m-4 btn-flotante' 
        : 'btn btn-dark rounded-circle shadow position-fixed bottom-0 start-0 m-4 btn-flotante';
};

themeToggleBtn.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('pro-theme', nextTheme);
    updateThemeUI(nextTheme);
});
updateThemeUI(localStorage.getItem('pro-theme') || 'light');

// --- BOTÓN SCROLL TO TOP ---
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        // Aparece cuando bajás más de 100px
        if (window.scrollY > 100) {
            scrollTopBtn.classList.remove('d-none');
        } else {
            scrollTopBtn.classList.add('d-none');
        }
    });

    // Sube suavemente al principio
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};

// =========================================================
// LÓGICA DINÁMICA DEL FORMULARIO (HIJOS)
// =========================================================
const radioSi = document.getElementById('hijosSi');
const radioNo = document.getElementById('hijosNo');
const bloqueHijos = document.getElementById('bloqueCantidadHijos');
const inputHijos = document.getElementById('cantidadHijos');

// Evento para mostrar/ocultar dinámicamente y aplicar "required"
const toggleHijos = () => {
    if (radioSi.checked) {
        bloqueHijos.classList.remove('d-none');
        inputHijos.required = true;
    } else {
        bloqueHijos.classList.add('d-none');
        inputHijos.required = false;
        inputHijos.value = ''; // Limpiamos por si había escrito algo
    }
};

radioSi.addEventListener('change', toggleHijos);
radioNo.addEventListener('change', toggleHijos);


// =========================================================
// OPERACIONES CON LOCALSTORAGE Y RENDERIZADO
// =========================================================

const CLAVE_LOCALSTORAGE = 'directorioPersonas';

// Leer de LocalStorage
const obtenerPersonas = () => {
    const datos = localStorage.getItem(CLAVE_LOCALSTORAGE);
    return datos ? JSON.parse(datos) : [];
};

// Renderizar la lista de nombres en el DOM
const renderLista = () => {
    const personas = obtenerPersonas();
    const lista = document.getElementById('listaPersonas');
    const emptyState = document.getElementById('emptyState');

    lista.innerHTML = '';

    if (personas.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }
    emptyState.classList.add('d-none');

    // Muestra solo Nombre y Apellido (Nombres Completos) como pide la consigna
    personas.forEach((persona, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-transparent d-flex justify-content-between align-items-center fade-in px-0 py-3';
        
        // Formateo visual
        const badgeHijos = persona.tieneHijos === 'Si' 
            ? `<span class="badge bg-info-subtle text-info border ms-2"><i class="bi bi-emoji-smile"></i> ${persona.cantidadHijos} hijo/s</span>` 
            : '';

        li.innerHTML = `
            <div>
                <strong class="fs-5">${persona.apellido.toUpperCase()},</strong> <span class="fs-5 text-body-secondary">${persona.nombre}</span>
                ${badgeHijos}
            </div>
            <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" onclick="borrarPersona(${index})" title="Eliminar persona">
                <i class="bi bi-trash3-fill"></i>
            </button>
        `;
        lista.appendChild(li);
    });
};

// Eliminar individual (EXPUESTO A WINDOW PARA EL HTML GENERADO)
window.borrarPersona = (index) => {
    const personas = obtenerPersonas();
    personas.splice(index, 1); // Cortamos la persona del array
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(personas)); // Guardamos el array limpio
    renderLista();
    showNotification('Persona eliminada del registro.', true);
};

// Botón Limpiar Todo
document.getElementById('btnLimpiarTodo').addEventListener('click', () => {
    if(confirm('¿Estás seguro de que quieres borrar todos los datos del LocalStorage?')) {
        localStorage.removeItem(CLAVE_LOCALSTORAGE);
        renderLista();
        showNotification('Directorio vaciado completamente.', true);
    }
});

// Carga Inicial
window.addEventListener('DOMContentLoaded', renderLista);


// =========================================================
// VALIDACIÓN JS Y GUARDADO EN FORMULARIO
// =========================================================
const form = document.getElementById('formPersona');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos recarga de página (SPA)

    // 1. VALIDACIÓN JS: Verificamos que todos los campos HTML5 cumplan las reglas
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        showNotification('Guardado incorrecto: Revise los campos en rojo.', false); // Mensaje dinámico de error
        return;
    }

    // 2. EXTRAER DATOS (Usando FormData como en el ejercicio anterior)
    const formData = new FormData(form);
    const nuevaPersona = Object.fromEntries(formData.entries());

    try {
        // 3. OBTENER EL ARRAY VIEJO, PUSHEAR Y GUARDAR
        const personasActuales = obtenerPersonas();
        
        // Lo mandamos al principio para verlo arriba de la lista
        personasActuales.unshift(nuevaPersona);
        
        // Transformamos el array a String y lo mandamos al LocalStorage
        localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(personasActuales));

        // 4. FEEDBACK Y RESETEO
        renderLista(); // Refresca la UI
        form.reset(); // Limpia formulario
        form.classList.remove('was-validated');
        toggleHijos(); // Resetea el panel de hijos a su estado original (oculto)
        
        // Mensaje dinámico de guardado correcto
        showNotification(`¡${nuevaPersona.nombre} guardado/a correctamente!`, true); 

    } catch (error) {
        showNotification('Error interno al guardar en LocalStorage.', false);
    }
});