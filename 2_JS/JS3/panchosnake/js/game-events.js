(function () {
    // Catalogo de eventos locos. Separado para poder agregar/quitar eventos sin tocar el motor.
    const BASE_EVENTS = [
        { type: "reverse-controls", title: "Controles al reves", detail: "Arriba es abajo, izquierda es derecha" },
        { type: "moving-toppings", title: "Aderezos movedizos", detail: "La comida se escapa" },
        { type: "invisible-chaos", title: "Modo invisible", detail: "Obstaculos y aderezos desaparecen" }
    ];

    // Devuelve la lista vigente de eventos disponibles para sortear.
    function getAvailableEvents(mode) {
        return [...BASE_EVENTS];
    }

    // Selecciona un evento al azar desde el catalogo.
    function pickRandomEvent(mode) {
        const events = getAvailableEvents(mode);
        return events[Math.floor(Math.random() * events.length)];
    }

    // Define si un evento debe mostrar cuenta regresiva antes de empezar.
    function needsWarning(event) {
        // El modo invisible avisa antes porque cambia informacion importante del mapa.
        return event.type === "invisible-chaos";
    }

    window.GameEvents = {
        pickRandomEvent,
        needsWarning
    };
})();
