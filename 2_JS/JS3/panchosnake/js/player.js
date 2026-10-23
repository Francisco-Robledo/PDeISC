(function () {
    // Servicio responsable de crear, reiniciar y revivir jugadores.
    const DIRECTION_VECTORS = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

    function createInitialTrail(position, direction) {
        // Todo pancho nace con 3 casillas: cabeza, cuerpo y cola.
        const vector = DIRECTION_VECTORS[direction];

        return [
            { ...position },
            { x: position.x - vector.x, y: position.y - vector.y },
            { x: position.x - vector.x * 2, y: position.y - vector.y * 2 }
        ];
    }

    function createPlayer(options) {
        return {
            id: options.id,
            name: options.name,
            color: options.color,
            bodyColor: options.bodyColor,
            headSprite: options.headSprite,
            bodySprite: options.bodySprite,
            startPosition: { ...options.startPosition },
            startDirection: options.startDirection,
            panchoTrail: [],
            direction: options.startDirection,
            nextDirection: options.startDirection,
            score: 0,
            toppingsCollected: 0,
            alive: true,
            hasExtraLife: false,
            revivedTimes: 0
        };
    }

    function resetPlayer(player) {
        // Reinicia estadisticas y devuelve al jugador a su salida original.
        player.panchoTrail = createInitialTrail(player.startPosition, player.startDirection);
        player.direction = player.startDirection;
        player.nextDirection = player.startDirection;
        player.score = 0;
        player.toppingsCollected = 0;
        player.alive = true;
        player.hasExtraLife = false;
        player.revivedTimes = 0;
    }

    function revivePlayer(player, position, direction) {
        // Al revivir tambien vuelve con 3 casillas para no quedar como un punto suelto.
        const reviveDirection = direction || player.startDirection;

        player.panchoTrail = createInitialTrail(position, reviveDirection);
        player.direction = reviveDirection;
        player.nextDirection = reviveDirection;
        player.alive = true;
        player.revivedTimes += 1;
    }

    window.PlayerService = {
        createPlayer,
        resetPlayer,
        revivePlayer
    };
})();
