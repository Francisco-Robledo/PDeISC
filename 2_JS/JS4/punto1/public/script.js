// URL de la API pública de usuarios
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Selección de elementos del DOM
const btnFetch = document.getElementById('btn-fetch');
const btnAxios = document.getElementById('btn-axios');
const btnClear = document.getElementById('btn-clear');
const themeToggle = document.getElementById('theme-toggle');
const scrollTopBtn = document.getElementById('scroll-top');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const usersGrid = document.getElementById('users-grid');

// ==========================================
//  1. GESTIÓN DEL MODO DÍA / NOCHE
// ==========================================

// Inicializar tema según la preferencia guardada en localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButtonText(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
});

function updateThemeButtonText(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Modo Día' : '🌙 Modo Noche';
}

// ==========================================
//  2. CONTROLADORES DE INTERFAZ Y ESTADO
// ==========================================

// Cambiar visibilidad del spinner de carga
function toggleLoading(show) {
    if (show) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

// Mostrar mensajes de error en pantalla
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

// Limpiar mensajes de error previos
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// Cambiar el estado de los botones tras cargar datos con éxito
function setLoadedState(hasData) {
    // Si hay datos cargados, se desactivan los botones de carga y se activa el de borrar
    btnFetch.disabled = hasData;
    btnAxios.disabled = hasData;
    btnClear.disabled = !hasData;
}

// Renderizar la lista de usuarios en el documento
function renderUsers(users) {
    usersGrid.innerHTML = ''; // Limpiar el contenedor o placeholder

    users.forEach(user => {
        // Crear elemento de tarjeta por cada usuario
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>✉️ ${user.email}</p>
        `;
        usersGrid.appendChild(card);
    });
}

// Acción de borrar datos del DOM
btnClear.addEventListener('click', () => {
    usersGrid.innerHTML = '<p class="placeholder-text">No hay datos cargados. Presiona uno de los botones de carga para comenzar.</p>';
    clearError();
    setLoadedState(false); // Reactivar los botones de carga
});

// ==========================================
//  3. PETICIONES HTTP (FETCH Y AXIOS)
// ==========================================

// Petición utilizando Fetch API nativa
async function loadWithFetch() {
    clearError();
    toggleLoading(true);
    
    try {
        const response = await fetch(API_URL);
        
        // Validar si la respuesta de la red fue correcta
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor (Código: ${response.status})`);
        }
        
        const data = await response.json();
        renderUsers(data);
        setLoadedState(true);
    } catch (error) {
        showError(`Error al cargar con Fetch: ${error.message}. Por favor intente de nuevo.`);
    } finally {
        toggleLoading(false);
    }
}

// Petición utilizando Axios (Cargado previamente por CDN)
async function loadWithAxios() {
    clearError();
    toggleLoading(true);
    
    try {
        // Axios procesa la respuesta automáticamente a JSON y arroja error en códigos != 2xx
        const response = await axios.get(API_URL);
        renderUsers(response.data);
        setLoadedState(true);
    } catch (error) {
        const msg = error.response ? `Código ${error.response.status}` : error.message;
        showError(`Error al cargar con Axios: ${msg}. Compruebe su conexión.`);
    } finally {
        toggleLoading(false);
    }
}

// Asignar los eventos de click a los botones correspondientes
btnFetch.addEventListener('click', loadWithFetch);
btnAxios.addEventListener('click', loadWithAxios);

// ==========================================
//  4. BOTÓN FLOTANTE "SUBIR AL INICIO"
// ==========================================

window.addEventListener('scroll', () => {
    // Mostrar el botón si el usuario baja más de 300px
    if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
});

scrollTopBtn.addEventListener('click', () => {
    // Desplazamiento suave hacia la parte superior
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
