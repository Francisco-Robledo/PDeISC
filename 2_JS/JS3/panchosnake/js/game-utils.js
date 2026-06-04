(function () {
    // Funciones puras y reutilizables: no modifican el estado del juego por su cuenta.
    const { CELL_COUNT, DIRECTIONS } = window.GameConfig;

    // Carga una imagen y devuelve el objeto listo para dibujar cuando termine.
    function loadImage(src) {
        const image = new Image();
        image.src = src;
        return image;
    }

    // Compara dos casillas del tablero por coordenadas.
    function sameCell(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    // Busca una casilla aleatoria que no este dentro de las bloqueadas.
    function randomCell(blockedCells) {
        let cell;
        let attempts = 0;

        do {
            cell = {
                x: Math.floor(Math.random() * CELL_COUNT),
                y: Math.floor(Math.random() * CELL_COUNT)
            };
            attempts += 1;
        } while (blockedCells.some((blocked) => sameCell(blocked, cell)) && attempts < 600);

        return cell;
    }

    // Devuelve vecinos validos de una casilla sin salirse del tablero.
    function getNeighborCells(cell) {
        return Object.values(DIRECTIONS)
            .map((direction) => ({
                x: cell.x + direction.x,
                y: cell.y + direction.y
            }))
            .filter((neighbor) => neighbor.x >= 0 && neighbor.x < CELL_COUNT && neighbor.y >= 0 && neighbor.y < CELL_COUNT);
    }

    // Sirve para evitar que un item quede encerrado por obstaculos.
    function hasOpenNeighbor(cell, blockedCells) {
        return getNeighborCells(cell).some((neighbor) => {
            return !blockedCells.some((blocked) => sameCell(blocked, neighbor));
        });
    }

    // Copia el cuerpo del pancho para animar entre posicion anterior y actual.
    function cloneTrail(trail) {
        return trail.map((segment) => ({ ...segment }));
    }

    // Interpolacion lineal usada para suavizar movimiento en canvas.
    function lerp(start, end, amount) {
        return start + (end - start) * amount;
    }

    // Convierte segundos a formato minutos:segundos.
    function formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString();
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");

        return `${minutes}:${seconds}`;
    }

    window.GameUtils = {
        loadImage,
        sameCell,
        randomCell,
        getNeighborCells,
        hasOpenNeighbor,
        cloneTrail,
        lerp,
        formatDuration
    };
})();
