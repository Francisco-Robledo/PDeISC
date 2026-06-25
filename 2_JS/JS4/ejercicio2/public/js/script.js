// URL base de la API pública
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Captura de nodos del DOM (Directorio GET)
const btnFetch = document.getElementById('btn-fetch');
const btnAxios = document.getElementById('btn-axios');
const usersContainer = document.getElementById('users-container');
const loader = document.getElementById('loader');
// DOM: Scroll to Top
const btnScrollTop = document.getElementById('btn-scroll-top');

// Captura de nodos del DOM (Formulario POST)
const userForm = document.getElementById('user-form');
const btnSubmit = document.getElementById('btn-submit');
const responseContainer = document.getElementById('response-container');

// Control del tema
const themeToggle = document.getElementById('theme-toggle');

// --- 1. MÓDULO DE PETICIONES HTTP (PROCESAMIENTO ASÍNCRONO) ---

// GET: Obtención de datos mediante Fetch nativo
const getUsersWithFetch = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP Fetch: ${response.status}`);
    return await response.json();
};

// GET: Obtención de datos mediante Axios
const getUsersWithAxios = async () => {
    const response = await axios.get(API_URL);
    if (!response.data) throw new Error('Axios no retornó datos.');
    return response.data;
};

// POST: Envío de datos de nuevo usuario mediante Axios
const postUserWithAxios = async (userData) => {
    // Se envía el objeto con nombre y email, la API simula la creación y retorna el objeto con un ID
    const response = await axios.post(API_URL, userData);
    if (!response.data || !response.data.id) {
        throw new Error('La API no retornó un ID válido de creación.');
    }
    return response.data.id;
};

// --- 2. MÓDULO DE INTERFAZ DE USUARIO (UI) Y VALIDACIONES ---

// Alternar estado del spinner de carga (Usabilidad)
const toggleLoader = (show) => {
    if (show) {
        usersContainer.innerHTML = '';
        loader.classList.remove('d-none');
    } else {
        loader.classList.add('d-none');
    }
};

// Mostrar errores globales en la sección del directorio
const showDirectoryError = (message) => {
    usersContainer.innerHTML = `
        <div class="col-12"><div class="alert alert-danger text-center shadow-sm" role="alert">${message}</div></div>
    `;
};

// Construcción atomizada de tarjetas de usuario individuales
const buildUserCard = (user) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6'; // Diseño responsivo interno de la rejilla
    col.innerHTML = `
        <div class="card user-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 p-3">
                <div class="fs-2 text-primary">👤</div>
                <div class="text-truncate">
                    <h5 class="card-title fw-bold mb-1 text-truncate fs-6">${user.name}</h5>
                    <a href="mailto:${user.email}" class="text-decoration-none small text-muted text-break">${user.email}</a>
                </div>
            </div>
        </div>
    `;
    return col;
};

// Inyección masiva y validación de completitud del directorio
const displayUsers = (users) => {
    usersContainer.innerHTML = '';
    if (!Array.isArray(users) || users.length === 0) {
        showDirectoryError('Datos corruptos o lista vacía.');
        return;
    }
    const fragment = document.createDocumentFragment();
    users.forEach(user => fragment.appendChild(buildUserCard(user)));
    usersContainer.appendChild(fragment);
};

// Renderizado de la respuesta exitosa del POST (Muestra el ID devuelto)
const displayPostResponse = (id) => {
    responseContainer.classList.remove('d-none');
    responseContainer.innerHTML = `
        <div class="alert alert-success text-center m-0 shadow-sm" role="alert">
            <div class="fw-bold text-success mb-1">¡Usuario Registrado!</div>
            <small class="text-muted">ID retornado por API:</small>
            <div class="fs-4 fw-black text-dark-emphasis">${id}</div>
        </div>
    `;
};

// --- 3. CONTROLADORES DE EVENTOS Y ORQUESTACIÓN ---

// Manejador centralizado para la carga de datos del directorio
const handleLoadDirectory = async (apiMethod) => {
    toggleLoader(true);
    try {
        const users = await apiMethod();
        displayUsers(users);
    } catch (error) {
        console.error(error);
        showDirectoryError('No se pudo establecer conexión con el servidor remoto.');
    } finally {
        toggleLoader(false);
    }
};

// Manejador del envío del formulario con validación e interactividad reactiva
const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    // Validación de campos del lado del cliente utilizando especificaciones HTML5
    if (!userForm.checkValidity()) {
        event.stopPropagation();
        userForm.classList.add('was-validated');
        return;
    }
    
    userForm.classList.add('was-validated');
    responseContainer.classList.add('d-none'); // Limpiar respuestas previas

    // Construcción limpia del payload de datos atomizados
    const userData = {
        name: document.getElementById('input-name').value.trim(),
        email: document.getElementById('input-email').value.trim()
    };

    try {
        // Bloqueo de botón para prevenir doble envío involuntario (Usabilidad)
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Procesando...';

        const newId = await postUserWithAxios(userData);
        displayPostResponse(newId);
        
        // Reinicio completo del estado del formulario
        userForm.reset();
        userForm.classList.remove('was-validated');
    } catch (error) {
        console.error(error);
        responseContainer.classList.remove('d-none');
        responseContainer.innerHTML = `
            <div class="alert alert-danger text-center small m-0" role="alert">Error al enviar los datos.</div>
        `;
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Enviar con POST';
    }
};
// --- 5. COMPORTAMIENTO DE SCROLL TO TOP (USABILIDAD) ---

// Valida la posición en el eje Y para mostrar u ocultar el botón
const handleWindowScroll = () => {
    // Si el usuario baja más de 300px, mostramos el botón
    if (window.scrollY > 300) {
        btnScrollTop.classList.add('show-scroll');
    } else {
        btnScrollTop.classList.remove('show-scroll');
    }
};

// Acción para volver al inicio de la página suavemente
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento nativo suave
    });
};

// --- (Añade esto a tu sección existente de LISTENERS) ---
window.addEventListener('scroll', handleWindowScroll);
btnScrollTop.addEventListener('click', scrollToTop);

// Manejador del cambio de tema Día / Noche acoplado a Bootstrap 5
const handleThemeToggle = () => {
    const htmlNode = document.documentElement;
    const isLight = htmlNode.getAttribute('data-bs-theme') === 'light';
    
    if (isLight) {
        htmlNode.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '☀️ Modo Día';
        themeToggle.classList.replace('btn-outline-secondary', 'btn-outline-light');
    } else {
        htmlNode.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '🌙 Modo Noche';
        themeToggle.classList.replace('btn-outline-light', 'btn-outline-secondary');
    }
};

// Asignación explícita de Event Listeners
btnFetch.addEventListener('click', () => handleLoadDirectory(getUsersWithFetch));
btnAxios.addEventListener('click', () => handleLoadDirectory(getUsersWithAxios));
userForm.addEventListener('submit', handleFormSubmit);
themeToggle.addEventListener('click', handleThemeToggle);