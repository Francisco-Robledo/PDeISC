// Referencias a los elementos del DOM
const btnCargar = document.getElementById('btn-cargar');
const btnBorrar = document.getElementById('btn-borrar');
const btnTema = document.getElementById('btn-tema');
const btnSubir = document.getElementById('btn-subir');
const contenedorAlumnos = document.getElementById('contenedor-alumnos');

// Evento para obtener los datos de la API y renderizarlos
btnCargar.addEventListener('click', async () => {
    try {
        // Consumo de la ruta usando fetch
        const respuesta = await fetch('/api/alumnos');
        
        if (!respuesta.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        
        const alumnos = await respuesta.json();

        // Limpiamos la pantalla por si había algo antes
        contenedorAlumnos.innerHTML = '';

        // Recorremos el JSON y creamos el HTML
        alumnos.forEach(alumno => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-alumno';
            
            tarjeta.innerHTML = `
                <h3>${alumno.nombre}</h3>
                <p><strong>Curso:</strong> ${alumno.curso}</p>
                <p><strong>Email:</strong> ${alumno.email}</p>
            `;
            
            contenedorAlumnos.appendChild(tarjeta);
        });

        // Modificamos el estado de los botones
        btnCargar.disabled = true;
        btnBorrar.disabled = false;

    } catch (error) {
        console.error('Hubo un problema con la petición fetch:', error);
        alert('No se pudieron cargar los alumnos.');
    }
});

// Evento para limpiar la pantalla y reiniciar botones
btnBorrar.addEventListener('click', () => {
    contenedorAlumnos.innerHTML = ''; // Limpiamos el HTML interior
    
    // Restauramos el estado de los botones
    btnCargar.disabled = false;
    btnBorrar.disabled = true;
});

// Evento para alternar entre el Modo Día y Modo Noche
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-noche');
    
    // Cambiamos el texto del botón dependiendo del estado actual
    if (document.body.classList.contains('modo-noche')) {
        btnTema.textContent = '☀️ Modo Día';
    } else {
        btnTema.textContent = '🌙 Modo Noche';
    }
});

// Lógica para mostrar/ocultar el botón flotante según el scroll
window.addEventListener('scroll', () => {
    // Si se scrollea más de 200px hacia abajo, se muestra
    if (window.scrollY > 200) {
        btnSubir.classList.add('mostrar');
    } else {
        btnSubir.classList.remove('mostrar');
    }
});

// Evento para regresar al inicio de la página suavemente
btnSubir.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});