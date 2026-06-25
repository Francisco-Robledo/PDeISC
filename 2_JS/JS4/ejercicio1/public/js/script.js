// URL centralizada para facilidad de mantenimiento
const API_URL = 'https://jsonplaceholder.typicode.com/users';
// DOM: Scroll to Top
const btnScrollTop = document.getElementById('btn-scroll-top');

// Función para solicitar datos mediante Fetch (ES Modules)
export const fetchUsersWithFetch = async () => {
    try {
        const response = await fetch(API_URL);
        // Validación básica de respuesta HTTP
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.error("Fallo la petición con Fetch:", error);
        throw error;
    }
};

// Función para solicitar datos mediante Axios
export const fetchUsersWithAxios = async () => {
    try {
        // Axios procesa el JSON automáticamente por debajo
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Fallo la petición con Axios:", error);
        throw error;
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