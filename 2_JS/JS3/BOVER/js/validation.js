const Validation = {
    /**
     * Valida los nombres de los jugadores según el modo de juego.
     * @param {string} mode - "1" o "2"
     * @param {string} p1Name - Nombre del jugador 1
     * @param {string} p2Name - Nombre del jugador 2 (puede ser nulo en modo 1)
     * @returns {Object} { valid: boolean, message: string }
     */
    validateNames: (mode, p1Name, p2Name) => {
        // Validar Jugador 1
        if (!p1Name || p1Name.trim() === '') {
            return { valid: false, message: 'El Jugador 1 debe ingresar un nombre.' };
        }
        if (p1Name.length > 15) {
            return { valid: false, message: 'El nombre del Jugador 1 es muy largo (máximo 15 caracteres).' };
        }

        // Validar Jugador 2 (solo si es modo 2 jugadores)
        if (mode === "2") {
            if (!p2Name || p2Name.trim() === '') {
                return { valid: false, message: 'El Jugador 2 debe ingresar un nombre.' };
            }
            if (p2Name.length > 15) {
                return { valid: false, message: 'El nombre del Jugador 2 es muy largo (máximo 15 caracteres).' };
            }
            if (p1Name.trim().toLowerCase() === p2Name.trim().toLowerCase()) {
                return { valid: false, message: 'Los nombres de los jugadores deben ser distintos.' };
            }
        }

        return { valid: true, message: 'OK' };
    }
};