// Elementos del DOM
const btnLoad = document.getElementById('btn-load');
const btnClear = document.getElementById('btn-clear');
const inputSearch = document.getElementById('input-search');
const usersList = document.getElementById('users-list');
const btnTheme = document.getElementById('btn-theme');
const btnTop = document.getElementById('btn-top');

// Inicializamos el array donde se guardarán los usuarios
let usersArray = [];

// Evento: Al tocar el botón "Cargar usuarios"
btnLoad.addEventListener('click', async () => {
    try {
        // Obtener todos los usuarios de la API usando fetch
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();

        // Guardar los usuarios en el array global
        usersArray = data;

        // Desactivar "Cargar usuarios" y activar input y botón de borrar
        btnLoad.disabled = true;
        btnClear.disabled = false;
        inputSearch.disabled = false;

        // Mostrar los usuarios en la pantalla por primera vez
        renderUsers(usersArray);
    } catch (error) {
        // Manejo de error si falla el fetch
        console.error("Hubo un error al obtener los usuarios:", error);
    }
});

// Evento: Al escribir en el campo de texto (filtro)
inputSearch.addEventListener('input', (e) => {
    // Usar trim() y toLowerCase() sobre el texto del input
    const searchTerm = e.target.value.trim().toLowerCase();

    // Filtrar el array usando filter() e includes()
    const filteredUsers = usersArray.filter(user => {
        return user.name.toLowerCase().includes(searchTerm);
    });

    // Mostrar solo los usuarios que coinciden
    renderUsers(filteredUsers);
});

// Evento: Al tocar el botón "Borrar datos"
btnClear.addEventListener('click', () => {
    // Vaciar el array
    usersArray = [];
    
    // Limpiar el input
    inputSearch.value = '';
    
    // Limpiar el HTML (la pantalla)
    usersList.innerHTML = '';

    // Reactivar botón "Cargar usuarios" y desactivar los demás
    btnLoad.disabled = false;
    btnClear.disabled = true;
    inputSearch.disabled = true;
});

// Función para pintar el arreglo de usuarios en el HTML
function renderUsers(users) {
    // Limpiamos el contenedor antes de inyectar nuevos datos
    usersList.innerHTML = '';

    // Recorremos el array
    users.forEach(user => {
        // Creamos la tarjeta
        const card = document.createElement('div');
        card.className = 'user-card';

        // Mostramos el nombre y el email
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
        `;

        // Agregamos la tarjeta al contenedor principal
        usersList.appendChild(card);
    });
}

// Evento: Modo Día/Noche
btnTheme.addEventListener('click', () => {
    // Alterna la clase dark-mode en el body
    document.body.classList.toggle('dark-mode');
});

// Evento: Mostrar/Ocultar botón flotante de scroll
window.addEventListener('scroll', () => {
    // Si bajamos más de 300px mostramos el botón
    if (window.scrollY > 300) {
        btnTop.style.display = 'block';
    } else {
        btnTop.style.display = 'none';
    }
});

// Evento: Subir al inicio al clickear el botón flotante
btnTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});