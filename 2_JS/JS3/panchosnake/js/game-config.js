(function () {
    // Configuracion central del juego: tablero, velocidad, puntajes y rutas de sprites.
    // Cantidad de casillas por lado del tablero.
    const CELL_COUNT = 24;

    // Cada 200 puntos aumenta el nivel.
    const LEVEL_POINTS = 200;

    // Mientras menor es el numero, mas rapido se mueve el pancho.
    const LEVEL_SPEEDS = [115, 95, 76, 58, 42, 30];

    window.GameConfig = {
        // Medidas y dificultad.
        CELL_COUNT,
        BASE_SPEED: LEVEL_SPEEDS[0],
        LEVEL_POINTS,
        LEVEL_SPEEDS,

        // Puntajes principales.
        TOPPING_POINTS: 10,
        GOLDEN_TOPPING_POINTS: 50,
        FINAL_SCORE_LIMIT: 1000,
        KEY_POINTS: 25,

        // Tiempos de items especiales medidos en ticks del juego.
        KEY_VISIBLE_TICKS: 70,
        KEY_INTERVAL_TICKS: 145,
        GOLDEN_VISIBLE_TICKS: 45,
        GOLDEN_INTERVAL_TICKS: 300,

        // Obstaculos y eventos aleatorios.
        OBSTACLE_INTERVAL_TICKS: 105,
        MAX_OBSTACLES: 5,
        EVENT_INTERVAL_SECONDS: 30,
        EVENT_DURATION_TICKS: 70,
        EVENT_WARNING_TICKS: 27,
        MOVING_TOPPING_INTERVAL_TICKS: 7,

        // Rutas de imagenes usadas por el canvas.
        ASSET_PATHS: {
            map: "assets/img/map-table.png",
            topping: "assets/img/sprites/topping-normal.png",
            goldenTopping: "assets/img/sprites/topping-golden.png",
            specialSauce: "assets/img/sprites/topping-revive.png",
            obstacle: "assets/img/sprites/obstacle-sauce.png",
            explosion: "assets/img/explosion.png",
            panchoHead: "assets/img/cola copy.png",
            panchoTip: "assets/img/cola.png",
            panchoBodyHorizontal: "assets/img/cuerpo1.png",
            panchoBodyVertical: "assets/img/cuerpo2.png",
            panchoTurnRightDown: "assets/img/cuerpo3.png",
            panchoTurnLeftDown: "assets/img/cuerpo4.png",
            panchoTurnRightUp: "assets/img/cuerpo5.png",
            panchoTurnLeftUp: "assets/img/cuerpo6.png"
        },

        // Vectores de movimiento en la grilla.
        DIRECTIONS: {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        },

        // Direcciones opuestas para impedir volver sobre el propio cuerpo.
        OPPOSITES: {
            up: "down",
            down: "up",
            left: "right",
            right: "left"
        },

        // Mapeo de teclado a jugador y direccion.
        KEY_MAP: {
            KeyW: { player: 0, direction: "up" },
            KeyS: { player: 0, direction: "down" },
            KeyA: { player: 0, direction: "left" },
            KeyD: { player: 0, direction: "right" },
            ArrowUp: { player: 1, direction: "up" },
            ArrowDown: { player: 1, direction: "down" },
            ArrowLeft: { player: 1, direction: "left" },
            ArrowRight: { player: 1, direction: "right" }
        }
    };
})();
