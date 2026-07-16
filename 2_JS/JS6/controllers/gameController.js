import diccionarioGlobal from '../config/diccionario.js';

export const obtenerPalabra = (_request, response) => {
    const palabra = diccionarioGlobal.obtenerPalabraAleatoria();

    response.status(200).json({
        ok: true,
        palabra
    });
};

export const listarPalabras = (_request, response) => {
    const palabras = diccionarioGlobal.obtenerPalabras();

    response.status(200).json({
        ok: true,
        total: palabras.length,
        palabras
    });
};

export const agregarPalabra = (request, response) => {
    try {
        const palabra = diccionarioGlobal.agregarPalabra(request.body?.palabra);
        return response.status(201).json({
            ok: true,
            mensaje: `La palabra ${palabra} fue agregada al diccionario.`,
            palabra,
            total: diccionarioGlobal.obtenerPalabras().length
        });
    } catch (error) {
        return response.status(400).json({ ok: false, mensaje: error.message });
    }
};
