document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Definimos los arrays iniciales
    const frutas = [];
    const amigos = ["Lucas", "Martín"];
    const numeros = [5, 10, 15];

    // 2. Funciones para actualizar la pantalla (renderizar)
    const mostrarFrutas = () => {
        document.getElementById("frutas").textContent = frutas.length === 0 ? "El array está vacío" : frutas.join(" - ");
    };
    
    const mostrarAmigos = () => {
        document.getElementById("amigos").textContent = amigos.join(" - ");
    };
    
    const mostrarNumeros = () => {
        document.getElementById("numeros").textContent = numeros.join(" - ");
    };

    // Mostramos los valores iniciales al cargar la página
    mostrarFrutas();
    mostrarAmigos();
    mostrarNumeros();

    // 3. EVENTOS: Lógica para el botón de Frutas
    document.getElementById("btn-fruta").addEventListener("click", () => {
        const inputFruta = document.getElementById("input-fruta");
        const nuevaFruta = inputFruta.value.trim(); // .trim() quita espacios vacíos al inicio y final

        if (nuevaFruta !== "") {
            frutas.push(nuevaFruta); // Agregamos al array
            mostrarFrutas();         // Actualizamos el HTML
            inputFruta.value = "";   // Limpiamos el input
        }
    });

    // 4. EVENTOS: Lógica para el botón de Amigos
    document.getElementById("btn-amigo").addEventListener("click", () => {
        const inputAmigo = document.getElementById("input-amigo");
        const nuevoAmigo = inputAmigo.value.trim();

        if (nuevoAmigo !== "") {
            amigos.push(nuevoAmigo);
            mostrarAmigos();
            inputAmigo.value = "";
        }
    });

    // 5. EVENTOS: Lógica para el botón de Números
    document.getElementById("btn-numero").addEventListener("click", () => {
        const inputNumero = document.getElementById("input-numero");
        const nuevoNumero = parseInt(inputNumero.value); // Convertimos texto a número
        const elMensaje = document.getElementById("mensaje");

        // Verificamos que el usuario haya ingresado un número válido
        if (!isNaN(nuevoNumero)) {
            const ultimoNumero = numeros[numeros.length - 1];

            // Hacemos visible el mensaje quitando la clase d-none de Bootstrap
            elMensaje.classList.remove("d-none", "text-bg-success", "text-bg-danger");

            if (nuevoNumero > ultimoNumero) {
                numeros.push(nuevoNumero);
                elMensaje.textContent = "¡Número agregado!";
                elMensaje.classList.add("text-bg-success"); // Mensaje verde
                mostrarNumeros();
            } else {
                elMensaje.textContent = `Error: Debe ser mayor que ${ultimoNumero}`;
                elMensaje.classList.add("text-bg-danger"); // Mensaje rojo
            }
            
            inputNumero.value = "";
        }
    });
});