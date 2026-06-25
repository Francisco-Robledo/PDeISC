export function ejercicio1(){
    // Separamos el "Hola mundo" y el "Fin" con un salto de línea HTML
    const resultado = `Hola mundo desde Node.js <br> <span class="text-muted small">Fin</span>`;
    
    // En la consola de la terminal se va a ver el string limpio sin etiquetas si preferís
    console.log("Hola mundo desde Node.js");
    console.log("Fin");
    
    return resultado;
}

ejercicio1();