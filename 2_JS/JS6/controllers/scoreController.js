import { crearScore, obtenerTopScores } from '../models/scoreModel.js';

const NOMBRE_VALIDO = /^[\p{L}][\p{L}\s'-]{1,29}$/u;
const MAX_PUNTOS = 1000000;
const MAX_TIEMPO = 86400;

const normalizarNombre = (nombre) => String(nombre ?? '')
    .trim()
    .replace(/\s+/g, ' ');

const esEnteroEnRango = (valor, maximo) => Number.isInteger(valor)
    && valor >= 0
    && valor <= maximo;

export const guardarScore = async (request, response, next) => {
    try {
        const nombre = normalizarNombre(request.body?.nombre);
        const puntos = request.body?.puntos;
        const tiempo = request.body?.tiempo;

        if (!NOMBRE_VALIDO.test(nombre)) {
            return response.status(422).json({
                ok: false,
                mensaje: 'Ingresá un nombre válido de 2 a 30 caracteres.'
            });
        }

        if (!esEnteroEnRango(puntos, MAX_PUNTOS) || !esEnteroEnRango(tiempo, MAX_TIEMPO)) {
            return response.status(422).json({
                ok: false,
                mensaje: 'Los puntos y el tiempo deben ser números enteros válidos.'
            });
        }

        const id = await crearScore({ nombre, puntos, tiempo });
        return response.status(201).json({ ok: true, id });
    } catch (error) {
        return next(error);
    }
};

export const listarTopScores = async (_request, response, next) => {
    try {
        const scores = await obtenerTopScores();
        return response.status(200).json({ ok: true, scores });
    } catch (error) {
        return next(error);
    }
};
