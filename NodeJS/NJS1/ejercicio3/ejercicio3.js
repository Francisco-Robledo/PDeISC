export function ejercicio3(){

    function suma(numero1, numero2){
        return numero1 + numero2
    }

    function resta(numero1, numero2){
        return numero1 - numero2
    }

    function multiplicacion(numero1, numero2){
        return numero1 * numero2
    }

    function division(numero1, numero2){
        return numero2 !== 0 ? numero1 / numero2 : "Error"
    }

    const resultado = `
    Suma entre 4 y 5: ${suma(4, 5)} <br>
    Resta entre 3 y 6: ${resta(3, 6)} <br>
    Multiplicación 2 y 7: ${multiplicacion(2, 7)} <br>
    División entre 20 y 4: ${division(20, 4)}
    `
    return resultado
}

console.log(ejercicio3());