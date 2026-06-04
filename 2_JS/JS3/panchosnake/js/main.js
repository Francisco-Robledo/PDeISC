(function () {
    // main.js conecta la interfaz HTML con los servicios del juego.
    const screens = {
        menu: document.getElementById("menuScreen"),
        start: document.getElementById("startScreen"),
        game: document.getElementById("gameScreen"),
        history: document.getElementById("historyScreen"),
        credits: document.getElementById("creditsScreen")
    };

    const playMenuButton = document.getElementById("playMenuButton");
    const rankingMenuButton = document.getElementById("rankingMenuButton");
    const creditsMenuButton = document.getElementById("creditsMenuButton");
    const startForm = document.getElementById("startForm");
    const playerTwoField = document.getElementById("playerTwoField");
    const playerOneName = document.getElementById("playerOneName");
    const playerTwoName = document.getElementById("playerTwoName");
    const formError = document.getElementById("formError");
    const canvas = document.getElementById("gameCanvas");
    const boardWrapper = document.getElementById("boardWrapper");
    const scorePanel = document.getElementById("scorePanel");
    const matchSummary = document.getElementById("matchSummary");
    const recordPanel = document.getElementById("recordPanel");
    const directionControls = document.getElementById("directionControls");
    const pauseButton = document.getElementById("pauseButton");
    const pauseBadge = document.getElementById("pauseBadge");
    const restartButton = document.getElementById("restartButton");
    const menuButton = document.getElementById("menuButton");
    const historyList = document.getElementById("historyList");
    const rankingList = document.getElementById("rankingList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const backButton = document.getElementById("backButton");
    const backFromPlayButton = document.getElementById("backFromPlayButton");
    const backFromCreditsButton = document.getElementById("backFromCreditsButton");
    const endModal = document.getElementById("endModal");
    const endTitle = document.getElementById("endTitle");
    const endMessage = document.getElementById("endMessage");
    const playAgainButton = document.getElementById("playAgainButton");
    const endMenuButton = document.getElementById("endMenuButton");

    let currentGame = null;
    let lastGameConfig = null;
    let clearHistoryArmed = false;
    let clearHistoryTimeout = null;

    // Detecta celulares/tablets por tipo de puntero para decidir controles y fullscreen.
    function isTouchDevice() {
        return window.matchMedia("(hover: none), (pointer: coarse)").matches;
    }

    // Mantiene una clase en body para que CSS muestre controles solo en dispositivos tactiles.
    function updateDeviceClass() {
        document.body.classList.toggle("is-touch-device", isTouchDevice());
    }

    // En celular intenta entrar a pantalla completa al comenzar la partida.
    function enterFullscreenIfMobile() {
        if (!isTouchDevice() || document.fullscreenElement || !document.documentElement.requestFullscreen) {
            return;
        }

        document.documentElement.requestFullscreen().catch(function () {});
    }

    // Al salir de partida vuelve a pantalla normal si el navegador lo permite.
    function exitFullscreenIfNeeded() {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(function () {});
        }
    }

    function showScreen(screenName) {
        // Solo una pantalla queda activa; el hero se muestra solamente en el menu principal.
        Object.values(screens).forEach((screen) => screen.classList.remove("active"));
        screens[screenName].classList.add("active");
        document.body.classList.toggle("hide-hero", screenName !== "menu");
        document.body.classList.toggle("is-playing", screenName === "game");

        if (screenName === "game") {
            AudioService.playMusic("game");
        } else {
            exitFullscreenIfNeeded();
            AudioService.playMusic("menu");
        }
    }

    // Lee el modo elegido desde los radios del formulario.
    function getSelectedMode() {
        return Number(document.querySelector("input[name='gameMode']:checked").value);
    }

    // Muestra u oculta el campo del segundo jugador.
    function updateModeFields() {
        playerTwoField.classList.toggle("hidden", getSelectedMode() !== 2);
    }

    function startGame(config) {
        // Centraliza el inicio/reinicio para no duplicar configuracion de partida.
        lastGameConfig = config;

        if (currentGame) {
            currentGame.stop();
        }

        endModal.classList.add("hidden");
        pauseBadge.classList.add("hidden");
        pauseButton.textContent = "Pausar";
        showScreen("game");
        enterFullscreenIfMobile();
        renderDirectionControls(config);
        renderStoredRecord();

        currentGame = GameService.createGame({
            canvas,
            boardWrapper,
            scorePanel,
            matchSummary,
            recordPanel,
            record: StorageService.getRecord(),
            mode: config.mode,
            playerNames: config.playerNames,
            onWaitingChange: handleWaitingChange,
            onEnd: handleGameEnd
        });

        currentGame.start();
    }

    function handleGameEnd(summary) {
        // Al terminar se guarda historial, se revisa record y se arma el modal final.
        const recordResult = StorageService.updateRecord(summary);
        summary.isRecord = recordResult.isNewRecord;
        StorageService.saveMatch(summary);
        if (summary.isRecord) {
            AudioService.playEffect("record");
        }
        const totalText = summary.mode === 2 ? `<p class="result-total">Total combinado: <span class="score-value">${summary.totalScore}</span></p>` : "";
        const recordText = summary.isRecord ? `<p class="record-label">Nueva partida record</p>` : "";
        const finalLimitText = summary.endReason === "score-limit" ? `<p class="record-label">Final por limite de 1000 puntos</p>` : "";

        endTitle.textContent = "Fin de la partida";
        endMessage.innerHTML = `
            <p class="performance-message">${summary.performanceMessage}</p>
            <div class="result-players">
                ${renderPlayerRows(summary.players)}
            </div>
            ${totalText}
            <p>Duracion: ${summary.durationText}</p>
            ${finalLimitText}
            ${recordText}
        `;
        renderStoredRecord(recordResult.record, recordResult.isNewRecord);
        endModal.classList.remove("hidden");
    }

    // Cambia el cartel de pausa/espera segun el estado inicial de la partida.
    function handleWaitingChange(isWaiting) {
        pauseBadge.textContent = isWaiting ? "Presiona una tecla para empezar" : "Pausa";
        pauseBadge.classList.toggle("hidden", !isWaiting);
    }

    function renderHistory() {
        // Historial y ranking comparten las mismas partidas guardadas.
        resetClearHistoryButton();
        const matches = StorageService.getMatches();
        renderRanking(matches);

        if (matches.length === 0) {
            historyList.innerHTML = "<p>Todavia no hay partidas guardadas.</p>";
            return;
        }

        historyList.innerHTML = `
            <div class="history-list">
                ${matches.map((match) => {
                    const total = match.mode === 2 ? `<p>Total combinado: <span class="score-value">${match.totalScore || 0}</span></p>` : "";
                    const record = match.isRecord ? `<p class="record-label">Partida record</p>` : "";
                    const finalLimit = match.endReason === "score-limit" ? `<p class="record-label">Final por limite de 1000 puntos</p>` : "";
                    return `
                        <article class="history-item${match.isRecord ? " is-record" : ""}">
                            <strong>${match.date}</strong>
                            <p>Modo: ${match.mode} jugador${match.mode === 2 ? "es" : ""}</p>
                            <div class="result-players">
                                ${renderPlayerRows(match.players)}
                            </div>
                            ${total}
                            <p>Duracion: ${match.durationText || "0:00"}</p>
                            ${finalLimit}
                            ${record}
                        </article>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderRanking(matches = StorageService.getMatches()) {
        // Ranking simple: mejores 5 partidas por puntaje total.
        if (matches.length === 0) {
            rankingList.innerHTML = "<p>Todavia no hay ranking.</p>";
            return;
        }

        const bestMatches = [...matches]
            .sort((a, b) => getMatchTotal(b) - getMatchTotal(a))
            .slice(0, 5);

        rankingList.innerHTML = `
            <div class="ranking-list">
                ${bestMatches.map((match, index) => `
                    <article class="ranking-item${index === 0 ? " is-top" : ""}">
                        <span class="ranking-position">#${index + 1}</span>
                        <div>
                            <strong>${getMatchTotal(match)} puntos</strong>
                            <p>${match.players.map((player) => player.name).join(" + ")}</p>
                            <p>Modo: ${match.mode} jugador${match.mode === 2 ? "es" : ""}</p>
                            <p>Duracion: ${match.durationText || "0:00"}</p>
                            <p>${match.date || "Sin fecha"}</p>
                            ${match.isRecord ? `<p class="record-label">Partida record</p>` : ""}
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }

    // Obtiene puntaje total aunque la partida venga de una version anterior.
    function getMatchTotal(match) {
        if (typeof match.totalScore === "number") {
            return match.totalScore;
        }

        return match.players.reduce((total, player) => total + player.score, 0);
    }

    // Arma filas reutilizables para modal final, historial y ranking.
    function renderPlayerRows(players) {
        return players.map((player) => `
            <div class="player-result">
                <span class="pancho-mini" aria-hidden="true"></span>
                <span class="player-name">${player.name}</span>
                <span class="score-value">${player.score}</span>
            </div>
        `).join("");
    }

    // Dibuja el panel lateral de record.
    function renderStoredRecord(record = StorageService.getRecord(), isNewRecord = false) {
        recordPanel.classList.toggle("is-current-record", isNewRecord);

        if (!record) {
            recordPanel.innerHTML = `
                <h3>Record</h3>
                <p>Todavia no hay record.</p>
            `;
            return;
        }

        const players = record.players.map((player) => `${player.name}: ${player.score}`).join(" | ");
        const note = isNewRecord ? `<p class="record-note">Nuevo record</p>` : "";

        recordPanel.innerHTML = `
            <h3>Record</h3>
            <p><strong>${record.totalScore}</strong> puntos</p>
            <p>${players}</p>
            <p>Duracion: ${record.durationText || "0:00"}</p>
            ${note}
        `;
    }

    function renderDirectionControls(config) {
        // Los botones tactiles se generan segun la cantidad de jugadores.
        const controls = [
            { playerIndex: 0, title: config.playerNames[0], keys: config.mode === 1 ? "W A S D + flechas" : "W A S D" }
        ];

        if (config.mode === 2) {
            controls.push({ playerIndex: 1, title: config.playerNames[1], keys: "Flechas" });
        }

        directionControls.innerHTML = controls.map((control) => `
            <div class="control-pad" aria-label="Controles ${control.title}">
                <div class="control-pad-title">${control.title} (${control.keys})</div>
                <button type="button" data-touch-player="${control.playerIndex}" data-direction="up" aria-label="${control.title} arriba">&uarr;</button>
                <button type="button" data-touch-player="${control.playerIndex}" data-direction="left" aria-label="${control.title} izquierda">&larr;</button>
                <button type="button" data-touch-player="${control.playerIndex}" data-direction="down" aria-label="${control.title} abajo">&darr;</button>
                <button type="button" data-touch-player="${control.playerIndex}" data-direction="right" aria-label="${control.title} derecha">&rarr;</button>
            </div>
        `).join("");
    }

    // Devuelve el boton de borrar historial a su estado normal.
    function resetClearHistoryButton() {
        clearHistoryArmed = false;
        window.clearTimeout(clearHistoryTimeout);
        clearHistoryButton.textContent = "Limpiar historial";
        clearHistoryButton.classList.remove("is-danger-confirm");
    }

    // Eventos de formulario y navegacion principal.
    updateDeviceClass();
    window.addEventListener("resize", updateDeviceClass);

    document.querySelectorAll("input[name='gameMode']").forEach((input) => {
        input.addEventListener("change", updateModeFields);
    });

    document.addEventListener("click", (event) => {
        if (event.target.closest("button, label, input, a")) {
            AudioService.unlock();
            AudioService.playEffect("click");
        }
    });

    playMenuButton.addEventListener("click", () => {
        showScreen("start");
    });

    rankingMenuButton.addEventListener("click", () => {
        renderHistory();
        showScreen("history");
    });

    creditsMenuButton.addEventListener("click", () => {
        showScreen("credits");
    });

    startForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const mode = getSelectedMode();
        const result = ValidationService.validatePlayers(mode, playerOneName.value, playerTwoName.value);

        if (!result.valid) {
            formError.textContent = result.message;
            return;
        }

        formError.textContent = "";
        startGame({
            mode,
            playerNames: result.players
        });
    });

    // Botones internos de partida.
    pauseButton.addEventListener("click", () => {
        if (!currentGame) {
            return;
        }

        const paused = currentGame.togglePause();
        if (paused) {
            AudioService.pauseMusic();
        } else {
            AudioService.resumeMusic();
        }
        pauseBadge.classList.toggle("hidden", !paused);
        pauseButton.textContent = paused ? "Seguir" : "Pausar";
    });

    restartButton.addEventListener("click", () => {
        if (lastGameConfig) {
            startGame(lastGameConfig);
        }
    });

    menuButton.addEventListener("click", () => {
        if (currentGame) {
            currentGame.stop();
        }

        AudioService.playMusic("menu");
        showScreen("menu");
    });

    // Acciones de historial y navegacion secundaria.
    clearHistoryButton.addEventListener("click", () => {
        // Confirmacion sin alert: requiere dos clicks dentro de pocos segundos.
        if (!clearHistoryArmed) {
            clearHistoryArmed = true;
            clearHistoryButton.textContent = "Confirmar borrado";
            clearHistoryButton.classList.add("is-danger-confirm");
            clearHistoryTimeout = window.setTimeout(resetClearHistoryButton, 3200);
            return;
        }

        StorageService.clearMatches();
        StorageService.clearRecord();
        resetClearHistoryButton();
        renderHistory();
        renderStoredRecord();
    });

    backButton.addEventListener("click", () => {
        showScreen("menu");
    });

    backFromPlayButton.addEventListener("click", () => {
        showScreen("menu");
    });

    backFromCreditsButton.addEventListener("click", () => {
        showScreen("menu");
    });

    playAgainButton.addEventListener("click", () => {
        if (lastGameConfig) {
            startGame(lastGameConfig);
        }
    });

    endMenuButton.addEventListener("click", () => {
        endModal.classList.add("hidden");
        showScreen("menu");
    });

    // Controles tactiles: cada boton manda direccion al motor de juego.
    directionControls.addEventListener("click", (event) => {
        const button = event.target.closest("[data-touch-player]");

        if (!button || !currentGame) {
            return;
        }

        button.classList.add("is-pressed");
        window.setTimeout(() => {
            button.classList.remove("is-pressed");
        }, 180);
        currentGame.setDirection(Number(button.dataset.touchPlayer), button.dataset.direction);
    });

    updateModeFields();
})();
