export function suma(numero1, numero2){
    return numero1 + numero2
}

export function resta(numero1, numero2){
    return numero1 - numero2
}

export function multiplicacion(numero1, numero2){
    return numero1 * numero2
}

export function division(numero1, numero2){
    return numero2 !== 0 ? numero1 / numero2 : "Error (división por 0)"
}