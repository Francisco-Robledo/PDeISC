// Define el tamano base de cada casillero del mapa.
const TILE_SIZE = 20;

// Define cuantas filas tiene el laberinto.
const ROWS = 15;

// Define cuantas columnas tiene el laberinto.
const COLS = 28;

// Define el tamano visual de las copas normales.
const GHOST_SPRITE_SIZE = 30;

// Define el tamano visual de los enemigos especiales.
const DI_MARIA_SPRITE_SIZE = 34;

// Define el tamano visual del penal.
const ITEM_SPRITE_SIZE = 22;

// Define el tamano visual del arbitro.
const ARBITRO_SPRITE_SIZE = 24;

// Define el tamano visual de la pelota que vuelve al spawn.
const RETURN_BALL_SIZE = 24;

// Define el nivel maximo de la partida.
const MAX_LEVEL = 6;

// Define durante cuantos frames quedan debiles las copas.
const SCARED_TIME = 480;

// Define desde que momento empiezan a parpadear antes de volver a la normalidad.
const SCARED_BLINK_TIME = 150;

// Define con que frecuencia aparece el enemigo especial.
const SPECIAL_SPAWN_CHANCE = 0.00045;

// Define cuanto dura el aviso antes de que entre el enemigo especial.
const SPECIAL_WARNING_TIME = 150;

// Lista los enemigos especiales que se desbloquean por nivel.
const specialEnemies = [
    // Nivel 1: usa el sprite y cartel de Fideo.
    { label: 'FIDEO', imgKey: 'di_maria', message: 'FIDEO ACTIVO' },
    // Nivel 2: usa el sprite y cartel de Chiqui.
    { label: 'CHIQUI', imgKey: 'chiqui', message: 'CHIQUI ACTIVO' },
    // Nivel 3 en adelante: usa el sprite y cartel de Infantino.
    { label: 'INFANTINO', imgKey: 'infantino', message: 'INFANTINO ACTIVO' }
];
