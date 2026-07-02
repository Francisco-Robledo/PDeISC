// --- CONFIGURACIÓN UI (Toasts y Tema) ---
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

const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};


// --- RENDERIZADO DINÁMICO (SPA) ---
const renderTabla = (usuarios) => {
    const tbody = document.getElementById('tablaUsuarios');
    const emptyState = document.getElementById('emptyState');
    
    tbody.innerHTML = ''; // Limpiamos la tabla
    
    if (usuarios.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        // Animación suave al aparecer
        tr.className = 'fade-in'; 
        
        // Estética del badge según el método
        let badgeClass = 'bg-secondary';
        if(user.metodo.includes('getElementById')) badgeClass = 'bg-danger';
        if(user.metodo.includes('elements')) badgeClass = 'bg-primary';
        if(user.metodo.includes('FormData')) badgeClass = 'bg-success';

        tr.innerHTML = `
            <td class="text-muted fw-bold">#${user.id}</td>
            <td class="fw-bold">${user.nombre}</td>
            <td><span class="badge border border-secondary-subtle text-body bg-transparent">${user.rol}</span></td>
            <td><span class="badge ${badgeClass}">${user.metodo}</span></td>
            <td class="text-muted small">${user.fecha}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger border-0" onclick="borrarUsuario(${user.id})">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

// Exponer la función borrar al scope global para el onclick del HTML generado
window.borrarUsuario = async (id) => {
    try {
        const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            renderTabla(data.usuarios);
            showNotification(data.mensaje, true);
        }
    } catch (e) { showNotification('Error al borrar', false); }
};

// Carga inicial
window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    renderTabla(data.usuarios);
});

// --- FUNCIÓN CENTRAL DE ENVÍO FETCH ---
const enviarDatosAlBackend = async (form, btnSubmit, datosUsuario) => {
    const originalText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    try {
        const res = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        });
        const data = await res.json();
        
        if (res.ok) {
            renderTabla(data.usuarios); // Actualiza la UI sin recargar (SPA)
            form.reset();
            form.classList.remove('was-validated');
            showNotification(data.mensaje, true);
        } else {
            showNotification(data.error, false);
        }
    } catch (e) {
        showNotification('Error de conexión', false);
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
    }
};


// =========================================================================
// LAS 3 FORMAS DE LEER FORMULARIOS EN JAVASCRIPT
// =========================================================================

// MÉTOD 1: Uso directo del ID del elemento (document.getElementById)
// Pros: Fácil de entender. Contras: Mucho código si hay 20 inputs.
const form1 = document.getElementById('formMetodo1');
form1.addEventListener('submit', (e) => {
    e.preventDefault(); // EVITA RECARGAR LA PÁGINA
    if (!form1.checkValidity()) { form1.classList.add('was-validated'); return; }

    // Lectura:
    const valorNombre = document.getElementById('inputNombre1').value;
    const valorRol = document.getElementById('inputRol1').value;

    const datos = {
        nombre: valorNombre,
        rol: valorRol,
        metodoLectura: 'getElementById()'
    };

    const btn = form1.querySelector('button');
    enviarDatosAlBackend(form1, btn, datos);
});


// MÉTOD 2: Uso de la colección 'elements' del evento
// Pros: No dependemos de IDs globales, usamos los atributos 'name' del HTML.
const form2 = document.getElementById('formMetodo2');
form2.addEventListener('submit', (e) => {
    e.preventDefault(); // EVITA RECARGAR LA PÁGINA
    if (!form2.checkValidity()) { form2.classList.add('was-validated'); return; }

    // Lectura: e.target es el formulario. elements contiene todos los inputs por su 'name'
    const inputs = e.target.elements; 
    const valorNombre = inputs['nombreForm2'].value;
    const valorRol = inputs['rolForm2'].value;

    const datos = {
        nombre: valorNombre,
        rol: valorRol,
        metodoLectura: 'event.target.elements'
    };

    const btn = form2.querySelector('button');
    enviarDatosAlBackend(form2, btn, datos);
});


// MÉTOD 3: Uso de la API moderna FormData
// Pros: Automático, extrae todo al instante, ideal para enviar archivos o formularios inmensos.
const form3 = document.getElementById('formMetodo3');
form3.addEventListener('submit', (e) => {
    e.preventDefault(); // EVITA RECARGAR LA PÁGINA
    if (!form3.checkValidity()) { form3.classList.add('was-validated'); return; }

    // Lectura: Pasamos el formulario entero al constructor de FormData
    const datosDelFormulario = new FormData(form3);
    
    // Obtenemos valores usando el atributo 'name' del HTML
    const valorNombre = datosDelFormulario.get('nombre');
    const valorRol = datosDelFormulario.get('rol');

    const datos = {
        nombre: valorNombre,
        rol: valorRol,
        metodoLectura: 'new FormData()'
    };

    const btn = form3.querySelector('button');
    enviarDatosAlBackend(form3, btn, datos);
});