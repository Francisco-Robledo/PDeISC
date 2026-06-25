// Constantes y Estado
const REMOTE_API_URL = 'https://jsonplaceholder.typicode.com/users';
const LOCAL_API_URL = '/api/alumnos'; // Nuestro nuevo endpoint local
// DOM: Scroll to Top
const btnScrollTop = document.getElementById('btn-scroll-top');
let fetchedUsers = [];

// DOM: API Remota (Usuarios)
const btnFetch = document.getElementById('btn-fetch');
const btnAxios = document.getElementById('btn-axios');
const inputSearch = document.getElementById('input-search');
const usersContainer = document.getElementById('users-container');
const loader = document.getElementById('loader');

// DOM: Formulario POST
const userForm = document.getElementById('user-form');
const btnSubmit = document.getElementById('btn-submit');
const responseContainer = document.getElementById('response-container');

// DOM: API Local (Alumnos)
const btnAlumnos = document.getElementById('btn-alumnos');
const alumnosContainer = document.getElementById('alumnos-container');
const loaderAlumnos = document.getElementById('loader-alumnos');

// DOM: Tema
const themeToggle = document.getElementById('theme-toggle');

// --- 1. MÓDULO DE RED (HTTP) ---

const getRemoteUsersFetch = async () => {
    const response = await fetch(REMOTE_API_URL);
    if (!response.ok) throw new Error('Error Fetch Remoto');
    return await response.json();
};

const getRemoteUsersAxios = async () => {
    const response = await axios.get(REMOTE_API_URL);
    return response.data;
};

const postRemoteUser = async (userData) => {
    const response = await axios.post(REMOTE_API_URL, userData);
    return response.data.id;
};

// Nueva función atomizada para consumir nuestra API en /api/alumnos
const getLocalAlumnos = async () => {
    const response = await fetch(LOCAL_API_URL);
    if (!response.ok) throw new Error('Error en API Local');
    return await response.json();
};

// --- 2. MÓDULO DE INTERFAZ (UI) ---

const toggleVisibility = (element, show) => {
    show ? element.classList.remove('d-none') : element.classList.add('d-none');
};

const showMessage = (container, message, isError = true) => {
    const alertClass = isError ? 'alert-danger' : 'alert-warning';
    container.innerHTML = `<div class="col-12"><div class="alert ${alertClass} text-center shadow-sm">${message}</div></div>`;
};

// Renderizado de tarjeta de Usuario Remoto
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

// Renderizado de tarjeta de Alumno Local
const buildAlumnoCard = (alumno) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';
    col.innerHTML = `
        <div class="card user-card border-0 shadow-sm h-100">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="fs-3">🎓</div>
                    <span class="badge bg-success rounded-pill">Promedio: ${alumno.promedio}</span>
                </div>
                <h5 class="card-title fw-bold mb-1 fs-6">${alumno.nombre}</h5>
                <p class="text-muted small mb-0">Curso: ${alumno.curso}</p>
            </div>
        </div>
    `;
    return col;
};

const renderGrid = (data, container, buildFunction, emptyMsg) => {
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        showMessage(container, emptyMsg, false);
        return;
    }
    const fragment = document.createDocumentFragment();
    data.forEach(item => fragment.appendChild(buildFunction(item)));
    container.appendChild(fragment);
};

// --- 3. ORQUESTADORES DE FLUJO ---

// Cargar Usuarios (API Externa)
const handleLoadRemote = async (apiMethod) => {
    toggleVisibility(loader, true);
    usersContainer.innerHTML = '';
    inputSearch.disabled = true;
    try {
        fetchedUsers = await apiMethod();
        renderGrid(fetchedUsers, usersContainer, buildUserCard, 'No hay usuarios.');
        inputSearch.disabled = false;
        inputSearch.value = '';
    } catch (error) {
        showMessage(usersContainer, 'Fallo al conectar con la API remota.');
    } finally {
        toggleVisibility(loader, false);
    }
};

// Cargar Alumnos (API Local)
const handleLoadLocal = async () => {
    toggleVisibility(loaderAlumnos, true);
    alumnosContainer.innerHTML = '';
    try {
        const alumnos = await getLocalAlumnos();
        renderGrid(alumnos, alumnosContainer, buildAlumnoCard, 'La base de datos local está vacía.');
    } catch (error) {
        showMessage(alumnosContainer, 'No se pudo contactar al servidor Node.js local.');
    } finally {
        toggleVisibility(loaderAlumnos, false);
    }
};

// Búsqueda en memoria
const handleSearch = (event) => {
    const term = event.target.value.toLowerCase().trim();
    const filtered = fetchedUsers.filter(user => user.name.toLowerCase().includes(term));
    renderGrid(filtered, usersContainer, buildUserCard, 'No hay coincidencias 🕵️‍♂️');
};

// Formulario POST
const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userForm.checkValidity()) {
        event.stopPropagation();
        userForm.classList.add('was-validated');
        return;
    }
    userForm.classList.add('was-validated');
    toggleVisibility(responseContainer, false);
    
    const userData = {
        name: document.getElementById('input-name').value.trim(),
        email: document.getElementById('input-email').value.trim()
    };

    try {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Procesando...';
        const newId = await postRemoteUser(userData);
        
        toggleVisibility(responseContainer, true);
        responseContainer.innerHTML = `
            <div class="alert alert-success text-center m-0 shadow-sm">
                <div class="fw-bold mb-1">¡Usuario Registrado!</div>
                <small>ID: <span class="fs-5 fw-black text-dark-emphasis">${newId}</span></small>
            </div>
        `;
        userForm.reset();
        userForm.classList.remove('was-validated');
    } catch (error) {
        toggleVisibility(responseContainer, true);
        responseContainer.innerHTML = `<div class="alert alert-danger text-center small m-0">Error de envío.</div>`;
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

// Modo Oscuro
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

// --- 4. LISTENERS ---
btnFetch.addEventListener('click', () => handleLoadRemote(getRemoteUsersFetch));
btnAxios.addEventListener('click', () => handleLoadRemote(getRemoteUsersAxios));
btnAlumnos.addEventListener('click', handleLoadLocal);
inputSearch.addEventListener('input', handleSearch);
userForm.addEventListener('submit', handleFormSubmit);
themeToggle.addEventListener('click', handleThemeToggle);