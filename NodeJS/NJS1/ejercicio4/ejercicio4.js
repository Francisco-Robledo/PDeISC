import { suma, resta, multiplicacion, division } from "./calculo.js"

export function ejercicio4(){

    const resultado = `
    Suma entre 5 y 3: ${suma(5, 3)} <br>
    Resta entre 8 y 6: ${resta(8, 6)} <br>
    Multiplicación entre 3 y 11: ${multiplicacion(3, 11)} <br>
    División entre 30 y 5: ${division(30, 5)}
    `

    console.log(resultado)
    return resultado
}

ejercicio4();