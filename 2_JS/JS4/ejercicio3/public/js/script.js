// Constantes globales
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Estado global en memoria para el buscador (Punto 3)
let fetchedUsers = [];

// Captura de Nodos (Directorio y Búsqueda)
const btnFetch = document.getElementById('btn-fetch');
const btnAxios = document.getElementById('btn-axios');
const inputSearch = document.getElementById('input-search');
const usersContainer = document.getElementById('users-container');
const loader = document.getElementById('loader');
// DOM: Scroll to Top
const btnScrollTop = document.getElementById('btn-scroll-top');

// Captura de Nodos (Formulario POST)
const userForm = document.getElementById('user-form');
const btnSubmit = document.getElementById('btn-submit');
const responseContainer = document.getElementById('response-container');

// Captura de Nodos (Tema)
const themeToggle = document.getElementById('theme-toggle');

// --- 1. MÓDULO DE RED (API FETCH/AXIOS) ---

const getUsersWithFetch = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error en Fetch');
    return await response.json();
};

const getUsersWithAxios = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const postUserWithAxios = async (userData) => {
    const response = await axios.post(API_URL, userData);
    if (!response.data.id) throw new Error('Sin ID retornado');
    return response.data.id;
};

// --- 2. MÓDULO DE UI Y RENDERIZADO ---

const toggleLoader = (show) => {
    if (show) {
        usersContainer.innerHTML = '';
        loader.classList.remove('d-none');
    } else {
        loader.classList.add('d-none');
    }
};

const showDirectoryMessage = (message, isError = true) => {
    const alertClass = isError ? 'alert-danger' : 'alert-warning';
    usersContainer.innerHTML = `
        <div class="col-12"><div class="alert ${alertClass} text-center shadow-sm">${message}</div></div>
    `;
};

const buildUserCard = (user) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6'; 
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

// Función principal de renderizado (Reutilizable para carga inicial y búsqueda)
const displayUsers = (users, emptyMessage = 'Datos corruptos o lista vacía.') => {
    usersContainer.innerHTML = '';
    
    // Si el array resultante está vacío (ej. al buscar un nombre que no existe)
    if (!Array.isArray(users) || users.length === 0) {
        showDirectoryMessage(emptyMessage, false);
        return;
    }
    
    const fragment = document.createDocumentFragment();
    users.forEach(user => fragment.appendChild(buildUserCard(user)));
    usersContainer.appendChild(fragment);
};

// --- 3. ORQUESTADORES DE FLUJO ---

// Orquestador de carga del directorio (Punto 1)
const handleLoadDirectory = async (apiMethod) => {
    toggleLoader(true);
    inputSearch.disabled = true; // Desactivar buscador mientras carga
    
    try {
        fetchedUsers = await apiMethod(); // Almacenamos en memoria
        displayUsers(fetchedUsers);
        
        // Habilitar y limpiar el buscador (Usabilidad)
        inputSearch.disabled = false;
        inputSearch.value = '';
    } catch (error) {
        console.error(error);
        showDirectoryMessage('Fallo al conectar con la API.');
    } finally {
        toggleLoader(false);
    }
};

// Orquestador del motor de búsqueda (Punto 3)
const handleSearch = (event) => {
    // Convertimos la búsqueda a minúsculas y limpiamos espacios
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Filtramos el array en memoria
    const filteredUsers = fetchedUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    // Renderizamos los resultados con un mensaje personalizado si no hay coincidencias
    displayUsers(filteredUsers, 'No hay usuarios que coincidan con tu búsqueda 🕵️‍♂️');
};

// Orquestador de validación y envío (Punto 2)
const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userForm.checkValidity()) {
        event.stopPropagation();
        userForm.classList.add('was-validated');
        return;
    }
    
    userForm.classList.add('was-validated');
    responseContainer.classList.add('d-none');
    
    const userData = {
        name: document.getElementById('input-name').value.trim(),
        email: document.getElementById('input-email').value.trim()
    };

    try {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Procesando...';
        
        const newId = await postUserWithAxios(userData);
        
        responseContainer.classList.remove('d-none');
        responseContainer.innerHTML = `
            <div class="alert alert-success text-center m-0 shadow-sm">
                <div class="fw-bold mb-1">¡Usuario Registrado!</div>
                <small>ID en API: <span class="fs-5 fw-black text-dark-emphasis">${newId}</span></small>
            </div>
        `;
        
        userForm.reset();
        userForm.classList.remove('was-validated');
    } catch (error) {
        responseContainer.classList.remove('d-none');
        responseContainer.innerHTML = `<div class="alert alert-danger text-center small m-0">Error de envío.</div>`;
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Enviar con POST';
    }
};

// Orquestador visual (Modo Día/Noche)
const handleThemeToggle = () => {
    const htmlNode = document.documentElement;
    if (htmlNode.getAttribute('data-bs-theme') === 'light') {
        htmlNode.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '☀️ Modo Día';
        themeToggle.className = 'btn btn-outline-light';
    } else {
        htmlNode.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '🌙 Modo Noche';
        themeToggle.className = 'btn btn-outline-secondary';
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

// --- 4. DELEGACIÓN DE EVENTOS (LISTENERS) ---
btnFetch.addEventListener('click', () => handleLoadDirectory(getUsersWithFetch));
btnAxios.addEventListener('click', () => handleLoadDirectory(getUsersWithAxios));

// Evento 'input' detecta pulsaciones, pegado de texto o borrado instantáneamente
inputSearch.addEventListener('input', handleSearch);

userForm.addEventListener('submit', handleFormSubmit);
themeToggle.addEventListener('click', handleThemeToggle);