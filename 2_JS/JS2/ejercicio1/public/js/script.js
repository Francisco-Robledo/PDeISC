// --- CONFIGURACION UI (Tema y Toasts) ---
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

// =========================================================
// LOGICA CORE: ARRAYS Y LIMITES
// =========================================================

let arrayNumeros = [];
const MINIMO = 10;
const MAXIMO = 20;

// Referencias al DOM
const form = document.getElementById('formNumeros');
const inputNumero = document.getElementById('inputNumero');
const btnAgregar = document.getElementById('btnAgregar');
const btnExportarTXT = document.getElementById('btnExportarTXT');
const contenedorNumeros = document.getElementById('contenedorNumeros');
const emptyState = document.getElementById('emptyState');
const barraProgreso = document.getElementById('barraProgreso');
const textoContador = document.getElementById('textoContador');
const textoEstado = document.getElementById('textoEstado');
const btnCargarArchivo = document.getElementById('btnCargarArchivo');
const btnGuardarCambiosArchivo = document.getElementById('btnGuardarCambiosArchivo');
const btnDescargarServidor = document.getElementById('btnDescargarServidor');
const editorArchivoServidor = document.getElementById('editorArchivoServidor');
const estadoArchivoServidor = document.getElementById('estadoArchivoServidor');
const nombreArchivoServidor = document.getElementById('nombreArchivoServidor');

const setArchivoServidorUI = ({ nombre = '', contenido = '', estado = 'Sin archivo cargado.', editable = false } = {}) => {
    editorArchivoServidor.value = contenido;
    editorArchivoServidor.disabled = !editable;
    btnGuardarCambiosArchivo.disabled = !editable;
    btnDescargarServidor.classList.toggle('disabled', !editable);
    nombreArchivoServidor.textContent = nombre;
    estadoArchivoServidor.textContent = estado;
};

const descargarTxtUsuario = (nombre, contenido) => {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = downloadUrl;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
};

const leerJson = async (response) => {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch (error) {
        return {
            error: text || 'El servidor devolvio una respuesta no valida.'
        };
    }
};

const normalizarNumero = (valor) => {
    const numero = valor.trim();

    if (!/^-?\d+([,.]\d+)?$/.test(numero)) {
        return null;
    }

    return numero.replace('.', ',');
};

inputNumero.addEventListener('input', () => {
    inputNumero.setCustomValidity(normalizarNumero(inputNumero.value) ? '' : 'Ingresa un numero valido.');
});

const actualizarUI = () => {
    const cantidad = arrayNumeros.length;

    // 1. Renderizar los numeros en pantalla
    contenedorNumeros.innerHTML = '';
    if (cantidad === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
        arrayNumeros.forEach((num, index) => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 fade-in d-flex align-items-center gap-2';
            badge.innerHTML = `${num} <i class="bi bi-x-circle-fill text-danger opacity-50" style="cursor:pointer;" onclick="eliminarNumero(${index})"></i>`;
            contenedorNumeros.appendChild(badge);
        });
    }

    // 2. Logica de la Barra de Progreso y Estados
    const porcentaje = (cantidad / MAXIMO) * 100;
    barraProgreso.style.width = `${porcentaje}%`;
    textoContador.textContent = `${cantidad} / ${MAXIMO}`;

    // Validar colores y habilitaciones segun limites
    if (cantidad < MINIMO) {
        barraProgreso.className = 'progress-bar bg-danger progress-bar-striped progress-bar-animated';
        textoEstado.className = 'text-danger';
        textoEstado.textContent = `Faltan ${MINIMO - cantidad} para guardar`;
        btnExportarTXT.disabled = true;
        inputNumero.disabled = false;
        btnAgregar.disabled = false;
    } else if (cantidad >= MINIMO && cantidad < MAXIMO) {
        barraProgreso.className = 'progress-bar bg-success progress-bar-striped progress-bar-animated';
        textoEstado.className = 'text-success';
        textoEstado.textContent = 'Listo para exportar';
        btnExportarTXT.disabled = false;
        inputNumero.disabled = false;
        btnAgregar.disabled = false;
    } else if (cantidad === MAXIMO) {
        barraProgreso.className = 'progress-bar bg-warning progress-bar-striped';
        textoEstado.className = 'text-warning';
        textoEstado.textContent = 'Limite maximo alcanzado';
        btnExportarTXT.disabled = false;
        inputNumero.disabled = true;
        btnAgregar.disabled = true;
    }
};

// Funcion global para borrar
window.eliminarNumero = (index) => {
    arrayNumeros.splice(index, 1);
    actualizarUI();
};

// Agregar un numero al enviar formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const numeroNormalizado = normalizarNumero(inputNumero.value);
    inputNumero.setCustomValidity(numeroNormalizado ? '' : 'Ingresa un numero valido.');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    arrayNumeros.push(numeroNormalizado);

    form.reset();
    form.classList.remove('was-validated');
    inputNumero.focus();

    actualizarUI();
});

// Boton Reset
document.getElementById('btnReset').addEventListener('click', () => {
    if (confirm('Empezar de nuevo?')) {
        arrayNumeros = [];
        actualizarUI();
        inputNumero.focus();
    }
});

const cargarArchivoServidor = async ({ silencioso = false } = {}) => {
    try {
        const response = await fetch('/api/archivo-txt');
        const data = await leerJson(response);

        if (!response.ok) {
            setArchivoServidorUI({ estado: data.error || 'No se pudo cargar el archivo.' });
            if (!silencioso) showNotification(data.error || 'No se pudo cargar el archivo.', false);
            return;
        }

        setArchivoServidorUI({
            nombre: data.nombre,
            contenido: data.contenido,
            estado: 'Archivo cargado desde el servidor.',
            editable: true
        });

        if (!silencioso) showNotification('Archivo cargado desde el servidor.', true);
    } catch (error) {
        setArchivoServidorUI({ estado: 'Error al consultar el servidor.' });
        if (!silencioso) showNotification('Error al consultar el servidor.', false);
    }
};

btnCargarArchivo.addEventListener('click', () => cargarArchivoServidor());

btnGuardarCambiosArchivo.addEventListener('click', async () => {
    btnGuardarCambiosArchivo.disabled = true;

    try {
        const response = await fetch('/api/archivo-txt', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenido: editorArchivoServidor.value })
        });
        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'No se pudieron guardar los cambios.', false);
            return;
        }

        setArchivoServidorUI({
            nombre: data.nombre,
            contenido: data.contenido,
            estado: 'Cambios guardados en el servidor.',
            editable: true
        });
        showNotification('Cambios guardados en el servidor.', true);
    } catch (error) {
        showNotification('Error al guardar los cambios.', false);
    } finally {
        btnGuardarCambiosArchivo.disabled = false;
    }
});

// =========================================================
// GENERAR ARCHIVO TXT DESDE EL BACKEND Y USARLO EN EL HTML
// =========================================================
btnExportarTXT.addEventListener('click', async () => {
    const originalText = btnExportarTXT.innerHTML;
    btnExportarTXT.disabled = true;
    btnExportarTXT.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generando archivo...';

    try {
        const response = await fetch('/api/generar-txt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeros: arrayNumeros })
        });
        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error, false);
            return;
        }

        setArchivoServidorUI({
            nombre: data.nombre,
            contenido: data.contenido,
            estado: 'Archivo generado y guardado en el servidor.',
            editable: true
        });

        try {
            descargarTxtUsuario(data.nombre, data.contenido);
            showNotification('Archivo descargado y copia guardada en el servidor.', true);
        } catch (error) {
            showNotification('La copia se guardo en el servidor, pero no se pudo descargar en el navegador.', false);
        }
    } catch (error) {
        showNotification('Error al intentar generar el archivo.', false);
    } finally {
        btnExportarTXT.innerHTML = originalText;
        actualizarUI();
    }
});

actualizarUI();
cargarArchivoServidor({ silencioso: true });
