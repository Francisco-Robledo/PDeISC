// --- CONFIGURACION UI (Tema, Scroll y Toasts) ---
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

const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) scrollTopBtn.classList.remove('d-none');
        else scrollTopBtn.classList.add('d-none');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const toastEl = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
const showNotification = (message, isSuccess = true) => {
    document.getElementById('toastMessage').textContent = message;
    toastEl.className = `toast align-items-center border-0 text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toastIcon').className = isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill';
    toastBootstrap.show();
};

const leerJson = async (response) => {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch (error) {
        return { error: text || 'El servidor devolvio una respuesta no valida.' };
    }
};

// =========================================================
// LOGICA DE HISTORIAL DEL SERVIDOR
// =========================================================
const cargarHistorial = async () => {
    try {
        const res = await fetch('/api/historial');
        const data = await leerJson(res);
        const tbody = document.getElementById('tablaHistorial');
        tbody.innerHTML = '';

        if (!res.ok) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3">${data.error || 'No se pudo cargar el historial.'}</td></tr>`;
            return;
        }

        if (data.archivos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay archivos en el servidor aun.</td></tr>`;
            return;
        }

        data.archivos.forEach(file => {
            const fechaFormateada = new Date(file.fecha).toLocaleString('es-AR');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold"><i class="bi bi-file-text text-primary"></i> ${file.nombre}</td>
                <td><span class="badge bg-secondary-subtle text-secondary border">${file.kb} KB</span></td>
                <td>${fechaFormateada}</td>
                <td class="text-end">
                    <a href="/api/descargar/${file.nombre}" class="btn btn-sm btn-outline-primary" download>
                        <i class="bi bi-cloud-download"></i> Descargar
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar historial.', error);
    }
};

document.getElementById('btnRefreshHistorial').addEventListener('click', cargarHistorial);
window.addEventListener('DOMContentLoaded', cargarHistorial);

// =========================================================
// LOGICA DEL PROCESADOR (SUBIDA DE ARCHIVO)
// =========================================================
const formUpload = document.getElementById('formUpload');
const btnProcesar = document.getElementById('btnProcesar');
let ultimoArchivoGenerado = null;

const renderBadges = (array, color) => {
    return array.map(n => `<span class="badge bg-${color}-subtle text-${color} border border-${color}-subtle m-1 fs-6 shadow-sm">${n}</span>`).join('');
};

formUpload.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formUpload.checkValidity()) {
        formUpload.classList.add('was-validated');
        return;
    }

    const fileInput = document.getElementById('inputFile');
    const formData = new FormData();
    formData.append('archivoTxt', fileInput.files[0]);

    const btnHtml = btnProcesar.innerHTML;
    btnProcesar.disabled = true;
    btnProcesar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Analizando...';

    try {
        const res = await fetch('/api/procesar-txt', {
            method: 'POST',
            body: formData
        });

        const data = await leerJson(res);

        if (!res.ok) {
            showNotification(data.error || 'No se pudo procesar el archivo.', false);
            return;
        }

        document.getElementById('statTotal').textContent = data.stats.total;
        document.getElementById('statUtiles').textContent = data.stats.utiles;
        document.getElementById('statDesc').textContent = data.stats.descartados;
        document.getElementById('statPorc').textContent = `${data.stats.porcentaje}%`;

        document.getElementById('cajaUtiles').innerHTML = data.arrays.utiles.length > 0
            ? renderBadges(data.arrays.utiles, 'success')
            : '<span class="text-muted small">No hubo coincidencias.</span>';

        document.getElementById('cajaFactoriales').innerHTML = data.arrays.factoriales.length > 0
            ? renderBadges(data.arrays.factoriales, 'warning')
            : '<span class="text-muted small">Ningun factorial encontrado.</span>';

        ultimoArchivoGenerado = data.archivoGenerado;
        document.getElementById('btnDescargaCliente').classList.remove('d-none');

        cargarHistorial();
        showNotification(data.mensaje, true);
    } catch (error) {
        showNotification('Error de red al procesar el archivo.', false);
    } finally {
        btnProcesar.disabled = false;
        btnProcesar.innerHTML = btnHtml;
    }
});

// =========================================================
// DESCARGA EN CLIENTE DEL ARCHIVO GENERADO
// =========================================================
document.getElementById('btnDescargaCliente').addEventListener('click', () => {
    if (!ultimoArchivoGenerado) return;

    const blob = new Blob([ultimoArchivoGenerado.contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = ultimoArchivoGenerado.nombre;
    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
});
