(function () {
    // Validaciones del formulario antes de crear una partida.
    function cleanName(name) {
        // Evita nombres con espacios dobles o espacios al inicio/final.
        return name.trim().replace(/\s+/g, " ");
    }

    function validatePlayers(mode, playerOneName, playerTwoName) {
        // Devuelve un objeto uniforme para que la UI sepa si puede iniciar o debe mostrar error.
        const playerOne = cleanName(playerOneName);
        const playerTwo = cleanName(playerTwoName);

        if (playerOne.length < 3) {
            return {
                valid: false,
                message: "El nombre del jugador 1 debe tener al menos 3 caracteres."
            };
        }

        if (mode === 2 && playerTwo.length < 3) {
            return {
                valid: false,
                message: "El nombre del jugador 2 debe tener al menos 3 caracteres."
            };
        }

        if (mode === 2 && playerOne.toLowerCase() === playerTwo.toLowerCase()) {
            return {
                valid: false,
                message: "Los jugadores deben tener nombres distintos."
            };
        }

        return {
            valid: true,
            players: mode === 2 ? [playerOne, playerTwo] : [playerOne]
        };
    }

    window.ValidationService = {
        validatePlayers
    };
})();
